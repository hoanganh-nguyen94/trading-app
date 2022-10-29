import {CacheModule, Module} from '@nestjs/common';
import {EventsGateway} from './events.gateway';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register<any>(
        {
          store: redisStore,
          host: "redis://localhost:6379",
          port: 6379,
        }
    )
  ],
  providers: [EventsGateway],
})
export class EventsModule {}
