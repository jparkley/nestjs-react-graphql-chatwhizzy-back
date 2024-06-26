import { Logger, Module, UnauthorizedException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { PubSubModule } from './common/pubsub/pubsub.module';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (authService: AuthService) => ({
        autoSchemaFile: true,
        cors: true,
        subscriptions: {
          'graphql-ws': {
            onConnect: (context: any) => {
              // With execution context, extract jwt manually from incoming request for verification
              try {
                const request = context.extra.request;
                const user = authService.verifyWsJWT(
                  request,
                  context.connectionParams,
                );
                context.user = user;
              } catch (error) {
                new Logger().error(error);
                throw new UnauthorizedException();
              }
            },
          },
        },
      }),
      imports: [AuthModule],
      inject: [AuthService],
    }),
    UsersModule,
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const isProd = configService.get('NODE_ENV') === 'production';

        return {
          pinoHttp: {
            transport: isProd
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                  },
                },
            level: isProd ? 'info' : 'debug',
          },
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    ChatsModule,
    PubSubModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
