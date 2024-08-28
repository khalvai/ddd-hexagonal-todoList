import Result from 'src/Common/Application/Result';

export default class Notification {
  public errors: string[] = [];

  public addError(message: string): void {
    this.errors.push(message);
  }

  public hasErrors(): boolean {
    return this.errors.length > 0;
  }

  public combine(notification: Notification): void {
    this.errors.push(...notification.errors);
  }

  public combineWithResult(...results: Result<unknown, Notification>[]): void {
    for (const res of results) {
      if (!res.ok) {
        this.combine(res.error);
      }
    }
  }

  static make(message: string): Notification {
    const notification = new Notification();
    notification.addError(message);
    return notification;
  }

  static combineValidation<T>(result: Result<T, Notification>, notification: Notification): T | undefined {
    if (!result.ok) {
      notification.combine(result.error);
      return undefined;
    }

    return result.value;
  }
}
