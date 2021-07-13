import {Arg, Ctx, Field, InputType, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware} from 'type-graphql';
import {hash, compare} from 'bcryptjs';
import { User } from '../../entity/User';
import { MyContext } from '../../utils/MyContext';
import { createAccessToken, createRefreshToken } from '../../utils/auth';
import {isAuthorized} from "../../Middleware/isAuthorized"
import { sendRefreshToken } from '../../utils/sendRefreshToken';
import { getConnection } from 'typeorm';

// -------------- RESPONSES ----------------//
@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => User, {nullable: true})
    user?: User;
}

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;

    @Field()
    email: string;

    @Field()
    password: string
}


@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;
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

    @Mutation(() => LoginResponse)
    async login(
        @Arg('username', () => String) username: string,
        @Arg('password', () => String) password: string,
        @Ctx() {res}: MyContext
    ): Promise<LoginResponse> {
        const user = await User.findOne({where: {username}})
        if (!user) {
            throw new Error (`Could not find user ${username}`)
        }

        const valid = await compare(password, user.password)
        if (!valid) {
            throw new Error ("Incorrect password please try again")
        }

        // Log in was successful
        sendRefreshToken(res, createRefreshToken(user));

        return {
            accessToken: createAccessToken(user)
        }
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        // @Ctx() {em}: MyContext
    ): Promise<UserResponse> {
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
                        field: "Username",
                        message: `The username '${options.username}' is already in use. Please choose another username.`
                    }]
                }
            }
        }
        console.log(user)

        return {user}
    }
}