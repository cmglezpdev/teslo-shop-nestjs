

export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    if( !file ) return callback( new Error('No file found'), false );

    const fileExtention = file.originalname.split('/')[1];
    const validExtentions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];

    if( !validExtentions.includes(fileExtention) ) {
        return callback( new Error('Invalid file type'), false );
    }

    callback(null, true);
}