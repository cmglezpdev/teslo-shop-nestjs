import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, ParseFilePipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { fileFilter } from './helpers';
import { FileTypeValidator, MaxFileSizeValidator } from './helpers/file-validations.helper';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService
  ) {}

  @Post('product')
  // @UseInterceptors( FileInterceptor('file', { fileFilter }) )  // filter using fileFilter
  @UseInterceptors( FileInterceptor('file') )
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
