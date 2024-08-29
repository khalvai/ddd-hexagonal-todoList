import { ItemReadModel, TodoListReadModel } from 'src/TodoList/Application/UseCases/Queries/TodoListReadModel';
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
    todoList.id = TodoListId.fromValid(model.id);
    todoList.title = Title.fromValid(model.title);
    todoList.concurrencySafeVersion = model.concurrencySafeVersion;
    todoList.createdAt = model.createdAt;
    todoList.updatedAt = model.updatedAt;
    todoList.items = [];
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

  static toReadModel(todoList: TodoList): TodoListReadModel {
    const model: TodoListReadModel = {
      id: todoList.id.value,
      title: todoList.title.value,
      createdAt: todoList.createdAt,
      updatedAt: todoList.updatedAt,
      items: [],
    };

    const uItem: ItemReadModel[] = [];
    const hItem: ItemReadModel[] = [];
    const mItem: ItemReadModel[] = [];
    const lItem: ItemReadModel[] = [];

    for (const item of todoList.items) {
      const itemReadModel: ItemReadModel = {
        id: item.id.value,
        title: item.title.value,
        description: item.description.value,
        priority: item.priority.value,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };

      if (item.priority.value === Priority.Urgent) uItem.push(itemReadModel);
      if (item.priority.value === Priority.High) hItem.push(itemReadModel);
      if (item.priority.value === Priority.Medium) mItem.push(itemReadModel);
      if (item.priority.value === Priority.Low) lItem.push(itemReadModel);
    }

    model.items.push(...uItem);
    model.items.push(...hItem);
    model.items.push(...mItem);
    model.items.push(...lItem);

    return model;
  }
}
