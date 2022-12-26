import {Module} from '@nestjs/common';
import {EventsModule} from './events/events.module';
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [ConfigModule.forRoot(), EventsModule],
})
export class AppModule {
}
