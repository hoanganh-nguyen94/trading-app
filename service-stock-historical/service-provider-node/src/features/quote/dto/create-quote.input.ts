import { InputType, Int, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateQuoteInput {
  @Field({ description: 'Example field (placeholder)' })
  name: string;
}
