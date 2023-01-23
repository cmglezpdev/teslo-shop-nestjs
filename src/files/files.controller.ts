import { Response } from 'express';
import { Controller, Post, UploadedFile, UseInterceptors, ParseFilePipe, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { FilesService } from './files.service';
import { fileFilter, fileNamer, FileTypeValidator, MaxFileSizeValidator } from './helpers';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
  }

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

    const secureUrl = `${file.filename}`

    return { secureUrl };
  }
}
