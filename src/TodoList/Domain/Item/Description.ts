import Result from 'src/Common/Application/Result';
import ValueObject from 'src/Common/Domain/ValueObject';
import Notification from 'src/Common/Application/Notification';

export class Description extends ValueObject<string> {
  static fromInput(value: string): Result<Description, Notification> {
    // business logic for creating Description goes here

    return {
      ok: true,
      value: new Description(value),
    };
  }

  static fromValid(value: string): Description {
    return new Description(value);
  }
}
