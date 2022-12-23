import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Quote {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
