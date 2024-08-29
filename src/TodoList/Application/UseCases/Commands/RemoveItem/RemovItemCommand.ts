export class RemoveItemCommand {
  constructor(
    public readonly userId: string,
    public readonly todoListId: string,
    public readonly itemId: string,
  ) {}
}
