import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getMessages , sendMessage } from '../controllers/message.controller.js';
import multer from 'multer';

const router = express.Router();

const upload = multer({ 
  storage : multer.memoryStorage(),
  limits : {
    fileSize : 1024 * 1024 * 10, // 10MB
  } ,
  fileFilter : (req , file , cb) => {
    if(file.mimetype.startsWith('image/')){
      cb(null , true)
    } else {
      cb(new Error('invalid file type') , false)
    }
  }
})



router.route('/send/:userId').post(isAuthenticated , upload.single('image') , sendMessage)

router.route('/all/:userId').get(isAuthenticated , getMessages)

export default router;