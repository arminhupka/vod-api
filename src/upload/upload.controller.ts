import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { UploadService } from './upload.service';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiCookieAuth('token')
  @ApiOperation({ summary: 'Uploading image' })
  @ApiOkResponse({ type: String })
  @ApiException(() => [UnauthorizedException, BadRequestException])
  @Post('/')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
    }),
  )
  upload(
    @Body('courseId') courseId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadService.uploadToImagekit(file, courseId);
  }
}
