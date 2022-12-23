import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { QuoteService } from './quote.service';
import { Quote } from './entities/quote.entity';
import { CreateQuoteInput } from './dto/create-quote.input';
import { UpdateQuoteInput } from './dto/update-quote.input';

@Resolver(() => Quote)
export class QuoteResolver {
  constructor(private readonly quoteService: QuoteService) {}

  @Mutation(() => Quote)
  createQuote(@Args('createQuoteInput') createQuoteInput: CreateQuoteInput) {
    return this.quoteService.create(createQuoteInput);
  }

  @Query(() => [Quote], { name: 'quotes' })
  findAll() {
    return this.quoteService.findAll();
  }

  @Query(() => Quote, { name: 'quote' })
  findOne(@Args('id') id: string) {
    return this.quoteService.findOne(id);
  }

  @Mutation(() => Quote)
  updateQuote(@Args('updateQuoteInput') updateQuoteInput: UpdateQuoteInput) {
    return this.quoteService.update(updateQuoteInput.id, updateQuoteInput);
  }

  @Mutation(() => Quote)
  removeQuote(@Args('id', { type: () => Int }) id: string) {
    return this.quoteService.remove(id);
  }
}
