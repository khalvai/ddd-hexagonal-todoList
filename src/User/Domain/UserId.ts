import Result from 'src/Common/Application/Result';
import UUID4 from 'src/Common/Domain/UUID4';
import Notification from 'src/Common/Application/Notification';
import ValueObject from 'src/Common/Domain/ValueObject';

export default class UserId extends ValueObject<string> {
  public static fromInput(uuid: string): Result<UserId, Notification> {
    const trimUUID = String(uuid).trim();

    if (!UUID4.isValid(trimUUID)) {
      const notification = new Notification();

      notification.addError('INVALID_ID');

      return {
        ok: false,
        error: notification,
      };
    }
    return { ok: true, value: new UserId(trimUUID) };
  }

  public static fromValid(uuid4: string): UserId {
    return new UserId(uuid4);
  }

  static create(): UserId {
    const uuid = UUID4.create();
    return new UserId(uuid.value);
  }
}
