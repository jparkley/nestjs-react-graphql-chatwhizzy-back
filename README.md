# Description

ChatWhizzy Backend in Nest.js, GraphQL, MongoDB

## Features

- Generic repository pattern for database transactions for encapsulation and maintainability
- Validation Pipe (built-in class-validator)
- Development logger: Pino
- Authentication & Authorization: Passport, Guard, JWT
- AWS S3 (storage for user files), AWS SDK
- MongoDB

## Deployment

- Deployed on AWS Elastic Beanstalk with CodePipeline CICD
- Production Pub/Sub implementation on AWS Redis

[ChatWhizzy Frontend](https://github.com/jparkley/nestjs-react-graphql-chatwhizzy-front)

#### Notes

(mongoose: @Schema, @Prop)
(graphql: @Objectype, @Field)
