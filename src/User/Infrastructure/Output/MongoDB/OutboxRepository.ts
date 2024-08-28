import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import DomainEvent from 'src/Common/Domain/DomainEvent';
import { OutboxRepository } from 'src/User/Application/Ports/OutboxRepository';
import { OutboxModel } from 'src/User/Infrastructure/Output/Mapper/OutboxMapper';
import { EventDocument } from 'src/User/Infrastructure/Output/MongoDB/OutboxSchema';
import { UserDocument } from 'src/User/Infrastructure/Output/MongoDB/UserSchema';

export class MongoOutboxRepository implements OutboxRepository {
  constructor(@InjectModel(UserDocument.name) private userModel: Model<UserDocument>) {}

  async save(events: DomainEvent<any>[], connection: any): Promise<void> {
    // const outboxEvents = events.map(event => new this.outboxModel(event));
    // await this.outboxModel.insertMany(outboxEvents, { session: connection });
  }
  async getUnDispatched(): Promise<OutboxModel[]> {
    const a = await this.userModel
      .aggregate([
        { $unwind: '$events' }, // Unwind events array to process each event individually
        { $match: { 'events.dispatched': false } }, // Match events where dispatched is false
      ])
      .exec();

    return a.map(d => d.events);
  }

  async dispatched(eventId: string): Promise<void> {
    await this.userModel.updateOne({ 'events.id': eventId }, { $set: { 'events.$.dispatched': true } }).exec();
  }
}
