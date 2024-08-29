import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseFilters, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import Result from 'src/Common/Application/Result';
import { AuthGuard } from 'src/Common/Infrastructure/Input/AuthGuard';
import { GetUserId } from 'src/Common/Infrastructure/Input/GetUserId';
import { HttpExceptionFilter } from 'src/Common/Infrastructure/Output/HttpExceptionFilter';
import { AddItemCommand } from 'src/TodoList/Application/UseCases/Commands/AddItem/AddItemCommand';
import { CreateTodoListCommand } from 'src/TodoList/Application/UseCases/Commands/CreateTodoList/CrateTodoListCommand';
import { DeleteTodoListCommand } from 'src/TodoList/Application/UseCases/Commands/DeleteTodoList/DeleteTodoListCommand';
import { RemoveItemCommand } from 'src/TodoList/Application/UseCases/Commands/RemoveItem/RemovItemCommand';
import { UpdateItemCommand } from 'src/TodoList/Application/UseCases/Commands/UpdateItem/UpdateItemCommand';
import { GetTodoListsQuery } from 'src/TodoList/Application/UseCases/Queries/GetAll/GetTodoListsQuery';
import { GetTodoListQuery } from 'src/TodoList/Application/UseCases/Queries/GetOne/GetTodoListQuery';
import { TodoListReadModel } from 'src/TodoList/Application/UseCases/Queries/TodoListReadModel';
import { TodoListId } from 'src/TodoList/Domain/TodoList/ValueObjects/TodoListId';
import { AddItemDTO } from 'src/TodoList/Infrastructure/Input/Http/Dto/AddItem.dto';
import { CreateTodoListDTO } from 'src/TodoList/Infrastructure/Input/Http/Dto/CreateTodoList.dto';
import { UpdateItemDto } from 'src/TodoList/Infrastructure/Input/Http/Dto/UpdateItem.dto';

@ApiBearerAuth()
@ApiTags('Todo List')
@UseFilters(HttpExceptionFilter)
@Controller('todo-list')
export class TodoListController {
  public constructor(
    private commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(AuthGuard)
  @Post('')
  async create(@Body() data: CreateTodoListDTO, @GetUserId() userId: string) {
    const response = await this.commandBus.execute<CreateTodoListCommand, TodoListId>(new CreateTodoListCommand(userId, data.title));

    return {
      todoListId: response,
    };
  }

  @UseGuards(AuthGuard)
  @Post(':todoListId/items')
  async addItem(
    @Body()
    data: AddItemDTO,
    @Param('todoListId') todoListId: string,

    @GetUserId() userId: string,
  ) {
    await this.commandBus.execute<CreateTodoListCommand, void>(
      new AddItemCommand(userId, todoListId, data.title, data.description, data.priority),
    );

    return {
      message: 'ITEM_ADDED',
    };
  }

  @UseGuards(AuthGuard)
  @Get(':todoListId')
  async getTodoList(@Param('todoListId') todoListId: string, @GetUserId() userId: string) {
    const response = await this.queryBus.execute<GetTodoListQuery, TodoListReadModel>(new GetTodoListQuery(userId, todoListId));

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Get('')
  async getTodoLists(@GetUserId() userId: string) {
    const response = await this.queryBus.execute<GetTodoListsQuery, TodoListReadModel[]>(new GetTodoListsQuery(userId));

    return {
      data: response,
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':todoList')
  async deleteTodoList(@Param('todoList') todoListId: string, @GetUserId() userId: string) {
    await this.commandBus.execute<DeleteTodoListCommand, void>(new DeleteTodoListCommand(userId, todoListId));

    return {
      data: 'Todo list is Deleted',
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':todoListId/items/:itemId')
  async deleteItem(@Param('todoListId') todoListId: string, @Param('itemId') itemId: string, @GetUserId() userId: string) {
    await this.commandBus.execute<RemoveItemCommand, void>(new RemoveItemCommand(userId, todoListId, itemId));

    return {
      data: 'Item from Todo list is removed',
    };
  }

  @UseGuards(AuthGuard)
  @Patch(':todoListId/items/:itemId')
  async updateItem(
    @Param('todoListId') todoListId: string,
    @Param('itemId') itemId: string,
    @Body() data: UpdateItemDto,
    @GetUserId() userId: string,
  ) {
    await this.commandBus.execute<UpdateItemCommand, void>(new UpdateItemCommand(userId, todoListId, itemId, data));
    return {
      data: 'Item updated',
    };
  }
}
