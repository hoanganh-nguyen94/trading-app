import {Factory, Seeder} from "typeorm-seeding";
import {Connection} from "typeorm";
import { Quote } from "src/features/quote/entities/quote.entity";

export default class CreateProducts implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        await connection
            .createQueryBuilder()
            .insert()
            .into(Quote)
            .values([
                {
                    name: 'Berries',
                }
            ])
            .execute();
    }
}