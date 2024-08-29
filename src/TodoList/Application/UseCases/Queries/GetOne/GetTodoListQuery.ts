export class GetTodoListQuery {
  constructor(
    public userId: string,
    public todoListId: string,
  ) {}
}
