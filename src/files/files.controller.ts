import { Response } from 'express';
import { Controller, Post, UploadedFile, UseInterceptors, ParseFilePipe, Get, Param, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags, ApiCreatedResponse, ApiParam, ApiBody } from '@nestjs/swagger';

import { FilesService } from './files.service';
import { fileFilter, fileNamer, FileTypeValidator, MaxFileSizeValidator } from './helpers';
import { FileUploadDto } from './dto/file-upload.dto';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOkResponse({ description: 'Product Image founded', type: String })
  @ApiBadRequestResponse({ description: 'Product Image not found' })
  @ApiParam({ name: 'imageName', description: 'Image name', type: String })
  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
  }

  @ApiCreatedResponse({ description: 'Add Image to the product', type: String })
  @ApiBadRequestResponse({ description: 'Bad Request. You need to send a image.' })
  @ApiBadRequestResponse({ description: 'Bad Request. The file is not an image.' })
  @ApiBody({ type: FileUploadDto, description: 'Image to upload' })
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

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`

    return { secureUrl };
  }
}
