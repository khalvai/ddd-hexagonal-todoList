import DomainEvent from 'src/Common/Domain/DomainEvent';
import { ItemId } from 'src/TodoList/Domain/Item/ItemId';

interface Payload {
  itemId: string;
}
export class ItemRemoved extends DomainEvent<Payload> {
  static of(itemId: ItemId): ItemRemoved {
    return new ItemRemoved({ itemId: itemId.value });
  }
}
