import { BadRequestException, PipeTransform } from '@nestjs/common';
import { isMongoId } from 'class-validator';

export class IsMongoIdPipe implements PipeTransform {
  transform(value: string): any {
    if (isMongoId(value)) {
      return value;
    }

    throw new BadRequestException('Provided ID is invalid');
  }
}
