import {CacheModule, Module} from '@nestjs/common';
import {AppController} from './app.controller';
import * as redisStore from 'cache-manager-redis-store';
import {AppService} from './app.service';
import {ConfigModule} from "@nestjs/config";
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [
        HttpModule,
        ConfigModule.forRoot(),
        CacheModule.register(
            {
                isGlobal: true,
                store: redisStore,
                host: 'localhost',
                port: 6379,
                username: 'default',
                password: 'mypass',
                // },
            }
        ),
    ],
    controllers: [AppController,],
    providers: [AppService,],
})
export class AppModule {
}
