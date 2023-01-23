import { v4 as uuid } from 'uuid';



export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    if( !file ) return callback( new Error('No file found'), false );
    const fileExtention = file.mimetype.split('/')[1];
    const fileName = `${uuid()}.${fileExtention}`;
    
    callback(null, fileName);
}