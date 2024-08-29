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
}
