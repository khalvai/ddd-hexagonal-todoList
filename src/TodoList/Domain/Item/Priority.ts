import Result from 'src/Common/Application/Result';
import ValueObject from 'src/Common/Domain/ValueObject';
import Notification from 'src/Common/Application/Notification';
import { TodoResponseMessages } from 'ResponseMessages/todo.response.messages';

export class Priority extends ValueObject<string> {
  public static Urgent = 'Urgent';
  public static High = 'High';
  public static Medium = 'Medium';
  public static Low = 'Low';

  static fromInput(value: string): Result<Priority, Notification> {
    if (value === Priority.Urgent || value === Priority.High || value === Priority.Medium || value === Priority.Low) {
      return {
        ok: true,
        value: new Priority(value),
      };
    }
    return { ok: false, error: Notification.make(TodoResponseMessages.PRIORITY_IS_NOT_VALID) };
  }

  static fromValid(value: string): Priority {
    return new Priority(value);
  }
}
