import {Logger, Module} from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [EventsGateway , Logger],
})
export class EventsModule {}
