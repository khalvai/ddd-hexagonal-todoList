import { TodoList } from 'src/TodoList/Domain/TodoList/TodoList';
import { TodoListId } from 'src/TodoList/Domain/TodoList/ValueObjects/TodoListId';
import { UserId } from 'src/TodoList/Domain/TodoList/ValueObjects/UseId';

export const TodoListRepository = Symbol('TodoListRepository').valueOf();
export interface TodoListRepository {
  load(todoListId: TodoListId, userId: UserId): Promise<TodoList | null>;
  save(todoList: TodoList): Promise<void>;
  loadAll(userId: UserId): Promise<TodoList[]>;
}
