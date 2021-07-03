import {Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware} from 'type-graphql';
import {hash, compare} from 'bcryptjs';
import { User } from './entity/User';
import { MyContext } from '../utils/MyContext';
import { createAccessToken, createRefreshToken } from '../utils/auth';
import {isAuthorized} from "../Middleware/isAuthorized"

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string
}
@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return 'guten tag!'
    }

    @Query(() => String)
    @UseMiddleware(isAuthorized)
    authTest(@Ctx() {payload}: MyContext) {
        return `Your username is ${payload!.username}`
    }


    @Query(() => [User])
    users() {
        return User.find();
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

        res.cookie('ogedahsned', 
            createRefreshToken(user),
            {
                httpOnly: true
            }
        );

        return {
            accessToken: createAccessToken(user)
        }
    }

    @Mutation(() => Boolean)
    async register(
        @Arg('username', () => String) username: string,
        @Arg('email', () => String) email: string,
        @Arg('password', () => String) password: string
    ) {

        const hashedPass = await hash(password, 16);

        try {
            await User.insert({
                username,
                email,
                password: hashedPass
            });
        } catch (err) {
            console.log(err);
            return false
        }
        return true
    }
}