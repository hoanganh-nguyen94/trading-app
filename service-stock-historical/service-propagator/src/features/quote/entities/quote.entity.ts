import {Field, ObjectType} from '@nestjs/graphql';
import {Column, Entity} from 'typeorm';
import {BaseEntity} from "../../../core/base.entity";

@ObjectType()
@Entity()
export class Quote extends BaseEntity {

    @Column()
    @Field()
    name: string;
}
