import Result from 'src/Common/Application/Result';
import UUID4 from 'src/Common/Domain/UUID4';
import ValueObject from 'src/Common/Domain/ValueObject';
import Notification from 'src/Common/Application/Notification';
export class ItemId extends ValueObject<string> {
  public static fromInput(uuid: string): Result<ItemId, Notification> {
    const trimUUID = String(uuid).trim();

    if (!UUID4.isValid(trimUUID)) {
      const notification = new Notification();

      notification.addError('INVALID_ID');

      return {
        ok: false,
        error: notification,
      };
    }
    return { ok: true, value: new ItemId(trimUUID) };
  }

  public static fromValid(uuid4: string): ItemId {
    return new ItemId(uuid4);
  }

  static create(): ItemId {
    const uuid = UUID4.create();
    return new ItemId(uuid.value);
  }
}
