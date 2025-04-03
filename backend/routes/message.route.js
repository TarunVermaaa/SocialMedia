import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import { getMessages , sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.route('/send/:userId').post(isAuthenticated , sendMessage)

router.route('/all/:userId').get(isAuthenticated , getMessages)

export default router;