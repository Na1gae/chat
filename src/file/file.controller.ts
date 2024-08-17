import { Controller, PayloadTooLargeException, Post, UnsupportedMediaTypeException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

const MAX_SIZE = 10000

@Controller('file')
export class FileController {
   constructor(private readonly fileService : FileService){}

   @UseInterceptors(FileInterceptor('image', {
    fileFilter: (_, file, callback) => {
        if(!file.mimetype.match(/image\/(jpeg|png|jpg|heif|gif)/)){
            callback(new UnsupportedMediaTypeException(''), false)
        }
        if(file.size > MAX_SIZE){
            callback(new PayloadTooLargeException(''), false)
        }
        callback(null, true)
    },
    storage: diskStorage({
        destination: './',
        filename: (req, file, callback)=>{
            const id = req.user
            const hwakjang = file.mimetype.split('/')
            callback(null, `${id}-profile.${hwakjang[hwakjang.length-1]}`)
        }
    })
   }))
   @Post('upload')
   uploadFile(@UploadedFile() file: Express.Multer.File){
    return {url : `${file.filename}`}
   }
}