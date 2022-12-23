import {Injectable, Logger} from '@nestjs/common';
import {QuoteService} from "../features/quote/quote.service";
import {Quote} from 'src/features/quote/entities/quote.entity';

@Injectable()
export class SeederService {
    constructor(
        private readonly logger: Logger,
        private readonly svc: QuoteService,
    ) {}
    async seed() {
        await this.languages()
            .then(completed => {
                this.logger.debug('Successfuly completed seeding users...');
                Promise.resolve(completed);
            })
            .catch(error => {
                this.logger.error('Failed seeding users...');
                Promise.reject(error);
            });
    }

    create(): Array<Promise<Quote>> {
        return ["AAA" ,"AA2"].map(async (language: string) => {
            return await this.svc
                .findOne(language)
                .then(async dbLangauge => {
                    // We check if a language already exists.
                    // If it does don't create a new one.
                    if (dbLangauge) {
                        return Promise.resolve(null);
                    }
                    return Promise.resolve(
                        // or create(language).then(() => { ... });
                        await this.svc.create({name: language}),
                    );
                })
                .catch(error => Promise.reject(error));
        });
    }

    async languages() {
        return await Promise.all(this.create())
            .then(createdLanguages => {
                // Can also use this.logger.verbose('...');
                this.logger.debug(
                    'No. of languages created : ' +
                    // Remove all null values and return only created languages.
                    createdLanguages.filter(
                        nullValueOrCreatedLanguage => nullValueOrCreatedLanguage,
                    ).length,
                );
                return Promise.resolve(true);
            })
            .catch(error => Promise.reject(error));
    }
}