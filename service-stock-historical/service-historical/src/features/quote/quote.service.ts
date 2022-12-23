import {Injectable, Logger} from '@nestjs/common';
import {CreateQuoteInput} from './dto/create-quote.input';
import {UpdateQuoteInput} from './dto/update-quote.input';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Quote} from "./entities/quote.entity";

@Injectable()
export class QuoteService {
    constructor(
        @InjectRepository(Quote)
        private repository: Repository<Quote>,
        private readonly logger: Logger,
    ) {
    }

    create(createQuoteInput: CreateQuoteInput):Promise<Quote> {
        this.logger.debug(createQuoteInput);
        const newUser = this.repository.create(createQuoteInput);
        this.logger.debug({newUser});
        return this.repository.save(newUser);
    }

    findAll() {
        return this.repository.find()
    }

    findOne(id: string) {
        this.logger.debug(`This action returns a #${id} quote`);
        return this.repository.findOneBy({id: id});
    }

    update(id: string, updateQuoteInput: UpdateQuoteInput) {
        return `This action updates a #${id} quote`;
    }

    async remove(id: string) {
        this.logger.debug(`This action removes a #${id} quote`);
        const entity = await this.repository.findOneBy({id})
        this.logger.debug(entity)
        return this.repository.remove(entity);
    }
}
