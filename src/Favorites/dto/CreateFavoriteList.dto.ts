import { IsArray, IsNotEmpty, IsString, ArrayNotEmpty, IsInt, ArrayMinSize } from 'class-validator';

export class CreateFavoriteListDTO {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsInt({ each: true })
    filmIds: number[];
}