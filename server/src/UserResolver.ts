import {Arg, Field, Mutation, ObjectType, Query, Resolver} from 'type-graphql';
import {hash, compare} from 'bcryptjs';
import { User } from './entity/User';
import {sign} from 'jsonwebtoken';
import {config} from '../config/config'

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

    @Query(() => [User])
    users() {
        return User.find();
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg('username', () => String) username: string,
        @Arg('password', () => String) password: string
    ): Promise<LoginResponse> {
        const user = await User.findOne({where: {username}})
        if (!user) {
            throw new Error (`Could not find user ${username}`)
        }

        const valid = await compare(password, user.password)
        if (!valid) {
            throw new Error ("Incorrect password please try again")
        }

        return {
            accessToken: sign({userId: user.id, username}, config.jwtSecret, {expiresIn: '10m'})
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