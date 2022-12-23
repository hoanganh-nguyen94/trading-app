import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';
import configuration from './config/configuration';
import {ChatModule} from "./features/chat/chat.module";
import {EventsModule} from "./features/events/events.module";

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
        // GraphQLModule.forRoot<ApolloDriverConfig>({
        //     driver: ApolloDriver,
        //     debug: true,
        //     playground: true,
        //     autoSchemaFile: 'schema.gql',
        // }),
        // QuoteModule,
        ChatModule,
        EventsModule
    ],
})
export class AppModule {
}
