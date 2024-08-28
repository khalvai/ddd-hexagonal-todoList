import DomainEvent from 'src/Common/Domain/DomainEvent';
import { Item } from 'src/TodoList/Domain/Item/Item';
import { ItemId } from 'src/TodoList/Domain/Item/ItemId';

interface Payload {
  itemId: string;
}
export class NewItemAdded extends DomainEvent<Payload> {
  static of(item: Item): NewItemAdded {
    return new NewItemAdded({ itemId: item.id.value });
  }
}
