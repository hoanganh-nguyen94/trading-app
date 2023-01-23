import {Module} from '@nestjs/common';
import {EventsModule} from './events/events.module';
import {ConfigModule} from "@nestjs/config";
import {AppService} from "./app/app.service";
import {AppController} from "./app/app.controller";

@Module({
    controllers: [AppController],
    providers: [AppService],
    imports: [ConfigModule.forRoot(), EventsModule],
})
export class AppModule {
}
