import {CACHE_MANAGER, Inject, Injectable} from '@nestjs/common';
import {Cache} from 'cache-manager';

@Injectable()
export class AppService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    }

    async publishData(data) {
        await this.cacheManager.get("BOARD_DATA");

        return 'Hello World!';
    }
}
