import { CreateQuoteInput } from './create-quote.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateQuoteInput extends PartialType(CreateQuoteInput) {
  @Field()
  id: string;
  @Field()
  name: string;
}
