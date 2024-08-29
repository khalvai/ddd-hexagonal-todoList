import { ApiProperty } from '@nestjs/swagger';

export class UpdateItemDto {
  @ApiProperty({
    required: false,
  })
  title?: string;

  @ApiProperty({
    required: false,
  })
  description: string;

  @ApiProperty({
    required: false,
    example: 'Low',
  })
  priority?: string;
}
