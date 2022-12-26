import { Test, TestingModule } from '@nestjs/testing';
import { QuoteResolver } from './quote.resolver';
import { QuoteService } from './quote.service';

describe('QuoteResolver', () => {
  let resolver: QuoteResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteResolver, QuoteService],
    }).compile();

    resolver = module.get<QuoteResolver>(QuoteResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
