import DomainEvent from 'src/Common/Domain/DomainEvent';
import { Item } from 'src/TodoList/Domain/Item/Item';

interface Payload {
  itemId: string;
}
export class ItemUpdated extends DomainEvent<Payload> {
  static of(item: Item): ItemUpdated {
    return new ItemUpdated({ itemId: item.id.value });
  }
}
