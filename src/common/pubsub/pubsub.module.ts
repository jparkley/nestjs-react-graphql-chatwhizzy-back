import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { TOKEN_PUB_SUB } from '../../constants';
import { ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { reviver } from './reviver';

@Global()
@Module({
  providers: [
    {
      provide: TOKEN_PUB_SUB,
      useFactory: (configService: ConfigService) => {
        if (configService.get('NODE_ENV') === 'production') {
          const options = {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          };
          return new RedisPubSub({
            publisher: new Redis(options),
            subscriber: new Redis(options),
            reviver: reviver,
          });
        }
        return new PubSub();
      },
      inject: [ConfigService],
    },
  ],
  exports: [TOKEN_PUB_SUB],
})
export class PubSubModule {}
