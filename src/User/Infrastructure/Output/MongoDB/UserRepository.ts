// src/cats/cats.service.ts

import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { OutboxRepository } from 'src/User/Application/Ports/OutboxRepository';
import { UserRepository } from 'src/User/Application/Ports/UserRepository';
import Email from 'src/User/Domain/Email';
import User from 'src/User/Domain/User';
import UserId from 'src/User/Domain/UserId';
import { OutboxMapper } from 'src/User/Infrastructure/Output/Mapper/OutboxMapper';
import UserMapper from 'src/User/Infrastructure/Output/Mapper/UserMapper';
import { EventDocument } from 'src/User/Infrastructure/Output/MongoDB/OutboxSchema';
import { UserDocument } from 'src/User/Infrastructure/Output/MongoDB/UserSchema';

@Injectable()
export class MongoUserRepository implements UserRepository {
  constructor(
    @InjectModel(UserDocument.name) private userModel: Model<UserDocument>,
    @InjectModel(EventDocument.name) private eventModel: Model<EventDocument>,
    @Inject(OutboxRepository) private readonly outboxRepository: OutboxRepository,
    @InjectConnection()
    private connection: Connection,
  ) {}
  async save(user: User): Promise<void> {
    const userPersistenceModel = UserMapper.toPersistence(user);
    const userDocument = new this.userModel(userPersistenceModel);
    const events = user.getEvents();

    if (!userDocument.events) {
      userDocument.events = [];
    }

    for (const event of events) {
      const eventDocument = new this.eventModel(OutboxMapper.toPersistence(event));
      userDocument.events.push(eventDocument);
    }
    await userDocument.save();
  }

  async load(userId: UserId): Promise<User | null> {
    const userDocument = await this.userModel.findOne({ id: userId.value });

    if (!userDocument) {
      return null;
    }
    return UserMapper.toDomain(userDocument);
  }
  async loadByEmail(email: Email): Promise<User | null> {
    const userDocument = await this.userModel.findOne({ email: email.value });

    if (!userDocument) {
      return null;
    }
    return UserMapper.toDomain(userDocument);
  }
}
