import {Module} from '@nestjs/common';
import {EventsModule} from './events/events.module';
import {ConfigModule} from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        EventsModule,
    ],
    // controllers: [AppController],
    providers: [],
})
export class AppModule {
}
