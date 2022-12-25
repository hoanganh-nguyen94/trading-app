import {Logger, Module} from '@nestjs/common';
import { TempGateway } from './temp.gateway';

@Module({
  providers: [TempGateway , Logger],
})
export class TempModule {}
