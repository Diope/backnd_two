import {Arg, Mutation, Query, Resolver} from 'type-graphql';
import {hash} from 'bcryptjs'
import { User } from './entity/User';

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