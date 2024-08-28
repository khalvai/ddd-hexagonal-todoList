import Result from 'src/Common/Application/Result';
import UUID4 from 'src/Common/Domain/UUID4';
import ValueObject from 'src/Common/Domain/ValueObject';
import Notification from 'src/Common/Application/Notification';

export class TodoListId extends ValueObject<string> {
  public static fromInput(uuid: string): Result<TodoListId, Notification> {
    const trimUUID = String(uuid).trim();

    if (!UUID4.isValid(trimUUID)) {
      const notification = new Notification();

      notification.addError('INVALID_ID');

      return {
        ok: false,
        error: notification,
      };
    }
    return { ok: true, value: new TodoListId(trimUUID) };
  }

  public static fromValid(uuid4: string): TodoListId {
    return new TodoListId(uuid4);
  }

  static create(): TodoListId {
    const uuid = UUID4.create();
    return new TodoListId(uuid.value);
  }
}
