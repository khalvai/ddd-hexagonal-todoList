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
import { TodoListMapper } from 'src/TodoList/Infrastructure/Output/Mappers/TodoListMapper';
import { TodoListDocument } from 'src/TodoList/Infrastructure/Output/MongoDB/TodoListSchema';

export class MongodbTodoListRepository implements TodoListRepository {
  constructor(@InjectModel(TodoListDocument.name) private todoListDocument: Model<TodoListDocument>) {}
  async load(todoListId: TodoListId): Promise<TodoList | null> {
    const data = await this.todoListDocument.findOne({ id: todoListId.value });

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

  private async create(todoList: TodoList): Promise<void> {
    const todoListDocument = new this.todoListDocument({
      userId: todoList.id.value,
      title: todoList.title.value,
      concurrencySafeVersion: 1,
    });

    await todoListDocument.save();
  }
  private async delete(todoList: TodoList): Promise<void> {
    await this.todoListDocument.deleteOne({ id: todoList.id.value });
  }

  private async addItem(todoListId: TodoListId, item: Item): Promise<void> {
    await this.todoListDocument.updateOne(
      { id: todoListId.value },
      {
        $push: {
          items: item,
        },
        $inc: { concurrencySafeVersion: 1 },
      },
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
