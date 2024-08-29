interface Payload {
  readonly title?: string;
  readonly description?: string;
  readonly priority?: string;
}
export class UpdateItemCommand {
  constructor(
    public readonly userId: string,
    public readonly todoListId: string,
    public readonly itemId: string,
    public payload: Payload,
  ) {}
}
