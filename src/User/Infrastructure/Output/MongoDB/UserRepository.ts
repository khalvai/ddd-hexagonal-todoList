// src/cats/cats.service.ts

import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { OutboxRepository } from 'src/User/Application/Ports/Output/OutboxRepository';
import { UserRepository } from 'src/User/Application/Ports/Output/UserRepository';
import Email from 'src/User/Domain/Email';
import User from 'src/User/Domain/User';
import UserId from 'src/User/Domain/UserId';
import UserMapper from 'src/User/Infrastructure/Output/Mapper/UserMapper';
import { UserDocument } from 'src/User/Infrastructure/Output/MongoDB/UserSchema';

@Injectable()
export class MongoUserRepository implements UserRepository {
  constructor(
    @InjectModel(UserDocument.name) private userCollection: Model<UserDocument>,
    @Inject(OutboxRepository) private readonly outboxRepository: OutboxRepository,
    @InjectConnection()
    private connection: Connection,
  ) {}
  async save(user: User): Promise<void> {
    const userPersistenceModel = UserMapper.toPersistence(user);
    const userDocument = new this.userCollection(userPersistenceModel);

    const session = await this.connection.startSession();

    try {
      await session.withTransaction(async () => {
        await userDocument.save({ session });
        const events = user.getEvents();

        await this.outboxRepository.save([...events], {});

        session.commitTransaction();
      });
    } catch (error) {
      // Abort the transaction in case of error
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
  async load(userId: UserId): Promise<User | null> {
    const userDocument = await this.userCollection.findOne({ id: userId.value });

    if (!userDocument) {
      return null;
    }
    return UserMapper.toDomain(userDocument);
  }
  async loadByEmail(email: Email): Promise<User | null> {
    const userDocument = await this.userCollection.findOne({ email: email.value });

    if (!userDocument) {
      return null;
    }
    return UserMapper.toDomain(userDocument);
  }
}
