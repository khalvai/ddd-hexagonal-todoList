import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OutboxDocument, OutboxSchema } from 'src/User/Infrastructure/Output/MongoDB/OutboxSchema';
import { UserDocument, UserSchema } from 'src/User/Infrastructure/Output/MongoDB/UserSchema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
      { name: OutboxDocument.name, schema: OutboxSchema },
    ]),
  ],
})
export class UserMongoModule {}
