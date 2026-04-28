import multer from "multer";
import path from 'path';

const storageCofig = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, path.join('src', 'public', 'imageFiles'));
    },
    filename : function (req, file, cb) {
        const fileName = new Date().toISOString().replace(/:/g, '_') + '-' + file.originalname;
        cb(null, fileName);  
                 
    },
});

const fileUpload = multer({ storage: storageCofig });

export default fileUpload;