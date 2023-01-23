import { FileValidator } from "@nestjs/common";

// export abstract class FileValidator<TValidationOptions = Record<string, any>> {
//     constructor(protected readonly validationOptions: TValidationOptions) {}
  
//     /**
//      * Indicates if this file should be considered valid, according to the options passed in the constructor.
//      * @param file the file from the request object
//      */
//     abstract isValid(file?: any): boolean | Promise<boolean>;
  
//     /**
//      * Builds an error message in case the validation fails.
//      * @param file the file from the request object
//      */
//     abstract buildErrorMessage(file?: any): string;
// }



export class MaxFileSizeValidator extends FileValidator<{ maxSize: number }> {
    isValid(file?: any): boolean | Promise<boolean> {
        if( !file )
            this.buildErrorMessage(null);
        
        if( file.size <= this.validationOptions.maxSize )
            return true;
        
        throw new Error( this.buildErrorMessage(file) );
    }

    buildErrorMessage(file: any): string {
        if( !file ) return "File is required.";	
        if( file.size > this.validationOptions.maxSize )
            return `File size should be less than ${this.validationOptions.maxSize/1024} MB.`;
        
        return "File size is invalid.";
    }
}


export class FileTypeValidator extends FileValidator<{ allowedFileTypes: string[] }> {
    isValid(file?: any): boolean | Promise<boolean> {
        if( !file )
            this.buildErrorMessage(null);
        
        if( this.validationOptions.allowedFileTypes.includes(file.mimetype) )
            return true;
        
        throw new Error( this.buildErrorMessage(file) );
    }

    buildErrorMessage(file: any): string {
        if( !file ) return "File is required.";
        if( !this.validationOptions.allowedFileTypes.includes(file.mimetype) )
            return `File type should be one of: ${this.validationOptions.allowedFileTypes.join(", ")}`;
        
        return "File type is invalid.";
    }
}