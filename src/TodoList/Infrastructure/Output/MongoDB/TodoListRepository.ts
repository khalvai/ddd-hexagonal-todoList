import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TodoListRepository } from 'src/TodoList/Application/Ports/TodoListRepository';
import { Item } from 'src/TodoList/Domain/Item/Item';
import { ItemRemoved } from 'src/TodoList/Domain/TodoList/Events/ItemRemoved';
import { NewItemAdded } from 'src/TodoList/Domain/TodoList/Events/NewItemAdded';
import { TodoListCreated } from 'src/TodoList/Domain/TodoList/Events/TodoListCreated';
import { TodoListDeleted } from 'src/TodoList/Domain/TodoList/Events/TodoListDeleted';
import { TodoList } from 'src/TodoList/Domain/TodoList/TodoList';
import { TodoListId } from 'src/TodoList/Domain/TodoList/ValueObjects/TodoListId';
import { UserId } from 'src/TodoList/Domain/TodoList/ValueObjects/UseId';
import { TodoListMapper } from 'src/TodoList/Infrastructure/Output/Mappers/TodoListMapper';
import { ItemDocument, TodoListDocument } from 'src/TodoList/Infrastructure/Output/MongoDB/TodoListSchema';

export class MongodbTodoListRepository implements TodoListRepository {
  constructor(@InjectModel(TodoListDocument.name) private todoListDocument: Model<TodoListDocument>) {}

  async load(todoListId: TodoListId, userId: UserId): Promise<TodoList | null> {
    const data = await this.todoListDocument.findOne({ id: todoListId.value, userId: userId.value });

    if (!data) {
      return null;
    }

    return TodoListMapper.toDomain(data);
  }
  async save(todoList: TodoList): Promise<void> {
    const events = todoList.getEvents();

    for (const event of events) {
      if (event instanceof TodoListCreated) {
        await this.create(todoList);
      }

      if (event instanceof TodoListDeleted) {
        await this.delete(todoList);
      }
      if (event instanceof NewItemAdded) {
        await this.addItem(todoList.id, todoList.items.find(i => i.id.value === event._payload.itemId)!);
      }

      if (event instanceof ItemRemoved) {
        await this.removeItem(todoList.id, todoList.items.find(i => i.id.value === event._payload.itemId)!);
      }
    }
  }
  async loadAll(userId: UserId): Promise<TodoList[]> {
    const models = await this.todoListDocument.find({ userId: userId.value });
    const todoLists: TodoList[] = [];

    for (const model of models) {
      todoLists.push(TodoListMapper.toDomain(model));
    }

    return todoLists;
  }

  private async create(todoList: TodoList): Promise<void> {
    const todoListDocument = new this.todoListDocument({
      id: todoList.id.value,
      userId: todoList.userId.value,
      title: todoList.title.value,
      concurrencySafeVersion: 1,
    });

    await todoListDocument.save();
  }
  private async delete(todoList: TodoList): Promise<void> {
    await this.todoListDocument.deleteOne({ id: todoList.id.value });
  }

  private async addItem(todoListId: TodoListId, item: Item): Promise<void> {
    const newItem = {
      id: item.id.value,
      title: item.title.value,
      priority: item.priority.value,
      description: item.description.value,
      concurrencySafeVersion: 1,
    };

    await this.todoListDocument.findOneAndUpdate(
      { id: todoListId.value },
      {
        $push: { items: newItem },
        $inc: { concurrencySafeVersion: 1 },
      },
      { new: true },
    );
  }

  private async removeItem(todoListId: TodoListId, item: Item): Promise<void> {
    await this.todoListDocument.updateOne(
      { id: todoListId.value },
      {
        $pull: { items: { id: item.id.value } },
        $inc: { concurrencySafeVersion: 1 },
      },
    );
  }

  private async updateItem(todoListId: TodoListId, item: Item): Promise<void> {
    await this.todoListDocument.findOneAndUpdate({ 'id': todoListId.value, 'items.id': item.id.value }, { $set: { 'items.$': item } });
  }
}
