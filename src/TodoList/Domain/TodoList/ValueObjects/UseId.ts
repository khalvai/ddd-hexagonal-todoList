import ValueObject from 'src/Common/Domain/ValueObject';

export class UserId extends ValueObject<string> {
  static fromValid(value: string): UserId {
    return new UserId(value);
  }
}
