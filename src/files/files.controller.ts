import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { fileFilter } from './helpers';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService
  ) {}

  @Post('product')
  @UseInterceptors( FileInterceptor('file', { fileFilter }) )  // filter using fileFilter
  // @UseInterceptors( FileInterceptor('file') )
  uploadFile( 
    @UploadedFile() file: Express.Multer.File,
  ) {

    if( !file )
      throw new BadRequestException("Make sure you have selected a file.")
    return file;
  }
}
