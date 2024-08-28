import DomainEvent from 'src/Common/Domain/DomainEvent';
import { TodoList } from 'src/TodoList/Domain/TodoList/TodoList';
import { TodoListId } from 'src/TodoList/Domain/TodoList/ValueObjects/TodoListId';

interface Payload {
  todoListId: string;
}
export class TodoListDeleted extends DomainEvent<Payload> {
  static of(todoList: TodoList): TodoListDeleted {
    return new TodoListDeleted({ todoListId: todoList.id.value });
  }
}
