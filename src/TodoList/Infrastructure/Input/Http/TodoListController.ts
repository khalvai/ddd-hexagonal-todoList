import { Body, Controller, Delete, Get, Param, Post, Query, UseFilters, UseGuards } from '@nestjs/common';
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
import { GetTodoListsQuery } from 'src/TodoList/Application/UseCases/Queries/GetAll/GetTodoListsQuery';
import { GetTodoListQuery } from 'src/TodoList/Application/UseCases/Queries/GetOne/GetTodoListQuery';
import { TodoListReadModel } from 'src/TodoList/Application/UseCases/Queries/TodoListReadModel';
import { TodoListId } from 'src/TodoList/Domain/TodoList/ValueObjects/TodoListId';
import { AddItemDTO } from 'src/TodoList/Infrastructure/Input/Http/Dto/AddItem.dto';
import { CreateTodoListDTO } from 'src/TodoList/Infrastructure/Input/Http/Dto/CreateTodoList.dto';

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
    const result = await this.commandBus.execute<CreateTodoListCommand, Result<TodoListId>>(new CreateTodoListCommand(userId, data.title));

    if (!result.ok) {
      throw result.error;
    }

    return {
      todoListId: result.value.value,
    };
  }

  @UseGuards(AuthGuard)
  @Post('item')
  async addItem(@Body() data: AddItemDTO, @GetUserId() userId: string) {
    const result = await this.commandBus.execute<CreateTodoListCommand, Result<void>>(
      new AddItemCommand(userId, data.todoListId, data.title, data.description, data.priority),
    );

    if (!result.ok) {
      throw result.error;
    }

    return {
      message: 'ITEM_ADDED',
    };
  }

  @UseGuards(AuthGuard)
  @Get(':todoListId')
  async getTodoList(@Param('todoListId') todoListId: string, @GetUserId() userId: string) {
    const result = await this.queryBus.execute<GetTodoListQuery, Result<TodoListReadModel>>(new GetTodoListQuery(userId, todoListId));

    if (!result.ok) {
      throw result.error;
    }

    return {
      data: result.value,
    };
  }

  @UseGuards(AuthGuard)
  @Get('')
  async getTodoLists(@GetUserId() userId: string) {
    const result = await this.queryBus.execute<GetTodoListsQuery, Result<TodoListReadModel[]>>(new GetTodoListsQuery(userId));

    if (!result.ok) {
      throw result.error;
    }

    return {
      data: result.value,
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':todoList')
  async deleteTodoList(@Param('todoList') todoListId: string, @GetUserId() userId: string) {
    const result = await this.commandBus.execute<DeleteTodoListCommand, Result<void>>(new DeleteTodoListCommand(userId, todoListId));
    if (!result.ok) {
      throw result.error;
    }

    return {
      data: 'Todo list is Deleted',
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':todoListId/items/:itemId')
  async deleteItem(@Param('todoListId') todoListId: string, @Param('itemId') itemId: string, @GetUserId() userId: string) {
    const result = await this.commandBus.execute<RemoveItemCommand, Result<void>>(new RemoveItemCommand(userId, todoListId, itemId));
    if (!result.ok) {
      throw result.error;
    }

    return {
      data: 'Item from Todo list is removed',
    };
  }
}
