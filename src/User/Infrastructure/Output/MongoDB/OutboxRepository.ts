import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import DomainEvent from 'src/Common/Domain/DomainEvent';
import { OutboxRepository } from 'src/User/Application/Ports/Output/OutboxRepository';
import { OutboxModel } from 'src/User/Infrastructure/Output/Mapper/OutboxMapper';
import { OutboxDocument } from 'src/User/Infrastructure/Output/MongoDB/OutboxSchema';

export class MongoOutboxRepository implements OutboxRepository {
  constructor(@InjectModel(OutboxDocument.name) private outboxModel: Model<OutboxDocument>) {}

  async save(events: DomainEvent<any>[], connection: any): Promise<void> {
    const outboxEvents = events.map(event => new this.outboxModel(event));
    await this.outboxModel.insertMany(outboxEvents);
  }
  async getUnDispatched(): Promise<OutboxModel[]> {
    return await this.outboxModel.find({ dispatched: false });
  }

  async dispatched(eventId: string): Promise<void> {
    await this.outboxModel.updateOne({ id: eventId }, { dispatched: true });
  }
}
