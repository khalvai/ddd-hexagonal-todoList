import Entity from 'src/Common/Domain/Entity';
import ValueObject from 'src/Common/Domain/ValueObject';
import { Description } from 'src/TodoList/Domain/Item/Description';
import { ItemId } from 'src/TodoList/Domain/Item/ItemId';
import { Priority } from 'src/TodoList/Domain/Item/Priority';
import { Title } from 'src/TodoList/Domain/TodoList/ValueObjects/Title';

interface UpdatePayload {
  title?: Title;
  description?: Description;
  priority?: Priority;
}
export class Item extends Entity {
  public id: ItemId;
  public title: Title;
  public description: Description;
  public priority: Priority;
  public createdAt: Date;
  public updatedAt: Date;

  static create(title: Title, description: Description, priority: Priority): Item {
    const item = new Item();
    item.id = ItemId.create();
    item.title = title;
    item.description = description;
    item.priority = priority;
    item.createdAt = new Date();
    item.updatedAt = new Date();
    return item;
  }

  update(payload: UpdatePayload): void {
    this.title = payload.title ?? this.title;
    this.description = payload.description ?? this.description;
    this.priority = payload.priority ?? this.priority;
    this.updatedAt = new Date();
  }
}
