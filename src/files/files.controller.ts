import { Controller, Post, UploadedFile, UseInterceptors, ParseFilePipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { FilesService } from './files.service';
import { fileFilter, fileNamer, FileTypeValidator, MaxFileSizeValidator } from './helpers';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService
  ) {}

  @Post('product')
  // @UseInterceptors( FileInterceptor('file', { fileFilter }) )  // filter using fileFilter
  @UseInterceptors( FileInterceptor('file', {
    storage: diskStorage({ 
      destination: './static/products',
      filename: fileNamer 
    }),
  }) )
  uploadFile( 
    // @UploadedFile() file: Express.Multer.File, // filter using fileFilter
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }), // 1 MB
          new FileTypeValidator({ allowedFileTypes: ["image/jpeg", "image/png"] }), // only images
        ],
      })
    ) file: Express.Multer.File
  ) {
    return file;
  }
}
