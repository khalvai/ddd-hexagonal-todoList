export class AddItemCommand {
  constructor(
    public readonly userId: string,
    public readonly todoListId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly priority: string,
  ) {}
}
