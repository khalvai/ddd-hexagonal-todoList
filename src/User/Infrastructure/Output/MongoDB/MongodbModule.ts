import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventDocument, EventSchema } from 'src/User/Infrastructure/Output/MongoDB/OutboxSchema';
import { UserDocument, UserSchema } from 'src/User/Infrastructure/Output/MongoDB/UserSchema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
      { name: EventDocument.name, schema: EventSchema },
    ]),
  ],
  exports: [
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
      { name: EventDocument.name, schema: EventSchema },
    ]),
  ],
})
export class UserMongoModule {}
