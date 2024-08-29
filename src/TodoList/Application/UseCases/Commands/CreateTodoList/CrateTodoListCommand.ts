export class CreateTodoListCommand {
  constructor(
    public readonly userId: string,
    public readonly title: string,
  ) {}
}
