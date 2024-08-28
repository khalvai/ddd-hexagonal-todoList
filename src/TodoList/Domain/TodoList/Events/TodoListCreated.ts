import DomainEvent from 'src/Common/Domain/DomainEvent';
import { TodoList } from 'src/TodoList/Domain/TodoList/TodoList';
interface Payload {
  todoListId: string;
  userId: string;
}
export class TodoListCreated extends DomainEvent<Payload> {
  static of(todoList: TodoList): TodoListCreated {
    return new TodoListCreated({ todoListId: todoList.id.value, userId: todoList.userId.value });
  }
}
