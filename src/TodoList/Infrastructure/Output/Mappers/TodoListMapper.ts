import { Description } from 'src/TodoList/Domain/Item/Description';
import { Item } from 'src/TodoList/Domain/Item/Item';
import { ItemId } from 'src/TodoList/Domain/Item/ItemId';
import { Priority } from 'src/TodoList/Domain/Item/Priority';
import { TodoList } from 'src/TodoList/Domain/TodoList/TodoList';
import { Title } from 'src/TodoList/Domain/TodoList/ValueObjects/Title';
import { TodoListId } from 'src/TodoList/Domain/TodoList/ValueObjects/TodoListId';
import { TodoListPersistenceModel } from 'src/TodoList/Infrastructure/Output/Model/TodoListPersistenceModel';

export class TodoListMapper {
  static toDomain(model: TodoListPersistenceModel): TodoList {
    const todoList = new TodoList();
    todoList.id = TodoListId.fromValid(model.title);
    todoList.title = Title.fromValid(model.title);
    todoList.concurrencySafeVersion = model.concurrencySafeVersion;
    todoList.createdAt = model.createdAt;
    todoList.updatedAt = model.updatedAt;

    for (const itemModel of model.items) {
      const item = new Item();
      item.id = ItemId.fromValid(itemModel.id);
      item.title = Title.fromValid(itemModel.title);
      item.description = Description.fromValid(itemModel.description);
      item.priority = Priority.fromValid(itemModel.priority);
      item.concurrencySafeVersion = itemModel.concurrencySafeVersion;
      item.createdAt = itemModel.createdAt;
      item.updatedAt = itemModel.updatedAt;

      todoList.items.push(item);
    }

    return todoList;
  }
}
