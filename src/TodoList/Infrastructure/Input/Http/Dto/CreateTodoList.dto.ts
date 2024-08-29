import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoListDTO {
  @ApiProperty({
    required: true,
  })
  title: string;
}
