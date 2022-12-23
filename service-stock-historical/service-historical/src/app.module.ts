import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';
import configuration from './config/configuration';
import {DataSource} from 'typeorm';
import {QuoteModule} from "./features/quote/quote.module";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {GraphQLModule} from "@nestjs/graphql";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (cfg: ConfigService) => {
                const database = cfg.get("database");
                return ({
                    ...database,
                    autoLoadEntities: true,
                    synchronize: true,
                })
            },
            inject: [ConfigService],
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            debug: true,
            playground: true,
            autoSchemaFile: 'schema.gql',
        }),
        QuoteModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    constructor(private dataSource: DataSource) {
    }
}
