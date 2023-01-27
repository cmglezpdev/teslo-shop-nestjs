import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';


export class LoginUserDto {

    @ApiProperty({
        description: 'User email',
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'User password',
        minLength: 6,
        maxLength: 50,
        pattern: '(?:(?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*'
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;
}