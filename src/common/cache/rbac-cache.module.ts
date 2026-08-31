import { Module } from '@nestjs/common';
import { RbacCacheService } from './rbac-cache.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [RbacCacheService],
  exports: [RbacCacheService],
})
export class RbacCacheModule {}
