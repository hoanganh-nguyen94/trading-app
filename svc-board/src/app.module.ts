import { EventsModule } from './events/events.module';
import {CacheModule, Module} from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import {AppService} from "./app.service";

@Module({
  imports: [EventsModule,
    CacheModule.register(
        {
          isGlobal: true,
          store: redisStore,
          url: "redis://localhost:6379",
          // host: 'localhost',
          // port: 6379,
          username: 'default',
          password: 'mypass',
          // },
        }
    ),],
  providers: [AppService],

})
export class AppModule {}
