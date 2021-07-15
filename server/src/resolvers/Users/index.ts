import {Arg, Ctx, Field, InputType, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware} from 'type-graphql';
import {hash, compare} from 'bcryptjs';
import { User } from '../../entity/User';
import { MyContext } from '../../utils/MyContext';
import { createAccessToken, createRefreshToken } from '../../utils/auth';
import {isAuthorized} from "../../Middleware/isAuthorized"
import { sendRefreshToken } from '../../utils/sendRefreshToken';
import { getConnection } from 'typeorm';

// -------------- RESPONSES ----------------//
// @ObjectType()
// class LoginResponse {
//     @Field()
//     accessToken: string
// }

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => User, {nullable: true})
    user?: User;

    @Field(() => String, {nullable: true}) 
    accessToken?: string
}

@InputType()
class UsernamePasswordInput {

    @Field()
    username: string;

    @Field(() => String, {nullable: true})
    email: string;

    @Field()
    password: string;
}

// @InputType()
// class LoginInput {

//     @Field()
//     username: string;

//     @Field()
//     password: string;
// }


@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;

    @Field()
    statusCode?: number;
}

// -------------- RESOLVERS ----------------//

@Resolver()
export class UserResolver {
    
    @Query(() => String)
    @UseMiddleware(isAuthorized)
    

    @Query(() => [User])
    users() {
        return User.find();
    }

    // MUTATIONS

    @Mutation(() => String)
    async refreshTokenRevoke(
        @Arg('userId', () => Int) userId: number
    ){
        await getConnection().getRepository(User).increment({id: userId}, 'tokenVersion', 1);
        return "Refresh tokens have been revoked";
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        // @Ctx() {em}: MyContext
    ): Promise<UserResponse> {
        const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

        if (options.username.length < 3 || options.username.length > 20) {
            return {
                errors: [{
                    field: 'username',
                    message: "Username must be 3-20 character. Please try anothe username."
                }]
            }
        }
        if (options.password.length < 8) {
            return {
                errors: [{
                    field: 'password',
                    message: "Your password must have a minimum length of 8 characters"
                }]
            }
        }
        if (!regex.test(options.email)) {
            return {
                errors: [{
                    field: 'email',
                    message: "Please provide a valid email address",
                    statusCode: 422
                }]
            }
        }

        const hashedPass = await hash(options.password, 16);

        const user = new User();
        user.username = options.username
        user.password = hashedPass
        user.email = options.email

        try {
            await user.save()
        } catch (error) {
            if (error.code === '23505') {
                return {
                    errors: [{
                        statusCode: 422,
                        field: "Username",
                        message: `The username '${options.username}' is already in use. Please choose another username.`
                    }]
                }
            }
        }

        return {user}
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {res}: MyContext
    ): Promise<UserResponse> {
        const user = await User.findOne({where: {username: options.username} })
        if (!user) {
            return {
                errors: [{
                    statusCode: 422,
                    field: 'username',
                    message: `The user ${options.username} cannot be found, please check the spelling and try again.`
                }]
            }
        }

        const valid = await compare(options.password, user.password)
        if (!valid) {
            return {
                errors: [{
                    statusCode: 422,
                    field: "password",
                    message: "The provided password is incorrect, please try again."
                }]
            }
        }
        sendRefreshToken(res, createRefreshToken(user));

        return {accessToken: createAccessToken(user)};
        
    }
}