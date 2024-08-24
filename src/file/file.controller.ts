import { Controller, PayloadTooLargeException, Post, UnsupportedMediaTypeException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid'

const MAX_SIZE = 10000

@Controller('file')
export class FileController {
   constructor(private readonly fileService : FileService){}

   @UseInterceptors(FileInterceptor('image', {
    fileFilter: (_, file, callback) => {
        if(!file.mimetype.match(/image\/(jpeg|png|jpg|gif)/)){
            callback(new UnsupportedMediaTypeException(''), false)
        }
        if(file.size > MAX_SIZE){
            callback(new PayloadTooLargeException(''), false)
        }
        callback(null, true)
    },
    storage: diskStorage({
        destination: './profile/',
        filename: (req, file, callback)=>{
            const id = uuid()
            const hwakjang = file.mimetype.split('/').pop();
            callback(null, `${id}.${hwakjang}`);
        }
    })
   }))
   @Post('upload')
   uploadFile(@UploadedFile() file: Express.Multer.File){
    const url = file.filename
    return {url : `/profile/${url}`}
   }
}