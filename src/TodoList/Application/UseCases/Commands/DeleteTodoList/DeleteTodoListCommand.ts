export class DeleteTodoListCommand {
  constructor(
    public readonly userId: string,
    public readonly todoListId: string,
  ) {}
}
