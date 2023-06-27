import { Injectable } from '@nestjs/common';

import { CoursesService } from '../courses/courses.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ImageKit = require('imagekit');

@Injectable()
export class UploadService {
  constructor(private coursesService: CoursesService) {}

  async uploadToImagekit(file: Express.Multer.File, courseId: string) {
    const course = await this.coursesService.findOne(courseId);

    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC,
      privateKey: process.env.IMAGEKIT_PRIVATE,
      urlEndpoint: process.env.IMAGEKIT_URL,
    });

    const image = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      extensions: [
        {
          name: 'google-auto-tagging',
          maxTags: 5,
          minConfidence: 95,
        },
      ],
    });

    course.cover = image.url;
    await course.save();

    return image.url;
  }
}
