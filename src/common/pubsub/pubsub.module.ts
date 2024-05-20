import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { TOKEN_PUB_SUB } from '../../constants';

@Global()
@Module({
  providers: [
    {
      provide: TOKEN_PUB_SUB,
      useValue: new PubSub(),
    },
  ],
  exports: [TOKEN_PUB_SUB],
})
export class PubSubModule {}
