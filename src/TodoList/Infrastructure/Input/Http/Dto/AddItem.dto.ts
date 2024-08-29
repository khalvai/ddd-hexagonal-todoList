import { ApiProperty } from '@nestjs/swagger';

export class AddItemDTO {
  @ApiProperty({
    required: true,
  })
  title: string;

  @ApiProperty({
    required: true,
  })
  description: string;

  @ApiProperty({
    required: true,
    example: 'Low',
  })
  priority: string;

  @ApiProperty({
    required: true,
    example: '0b2fd1ee-bd3d-470e-92e6-86e9dd1a645e',
  })
  todoListId: string;
}
