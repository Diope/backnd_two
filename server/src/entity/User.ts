import { Field, ObjectType, Int } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@ObjectType()
@Entity('users')
export class User extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Field()
    @Column()
    username: string;

    @Field()
    @Column()
    email: string;

    @Column()
    password: string;

    @Column("int", {default: 0})
    tokenVersion: number

}
