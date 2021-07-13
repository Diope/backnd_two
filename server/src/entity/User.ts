import { IsEmail, IsNotEmpty, Length, MinLength } from "class-validator";
import { Field, ObjectType} from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Generated} from "typeorm";

@ObjectType()
@Entity('users')
export class User extends BaseEntity {

    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Field()
    @Column({type: 'varchar', unique: true })
    @Length(3,20)
    @IsNotEmpty()
    username!: string;

    @Field()
    @Column({ unique: true })
    @IsEmail()
    email!: string;

    @Column()
    @MinLength(8)
    password!: string;

    @Column("int", {default: 0})
    tokenVersion: number

    @CreateDateColumn()
    createdAt: Date
    
    @UpdateDateColumn()
    updatedAt: Date

    @Generated('uuid')
    @Column()
    uuid: string
}
