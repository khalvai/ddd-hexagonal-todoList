import Result from 'src/Common/Application/Result';
import ValueObject from 'src/Common/Domain/ValueObject';
import Notification from 'src/Common/Application/Notification';

export class Title extends ValueObject<string> {
  static fromInput(value: string): Result<Title, Notification> {
    // logic for title goes here ...
    return {
      ok: true,
      value: new Title(value),
    };
  }

  static fromValid(value: string): Title {
    return new Title(value);
  }
}
