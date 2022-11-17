import {request, response, Router} from 'express';
import multer from 'multer';
import { createPosts, deletePosts, editPosts, getListPost, getPostByID, globalPost, likePost, mixedPost, posttest } from '../controllers/posts/posts.controller';
import { getProfileDataData } from '../libs/functions';
import { storageFiles } from '../libs/uploadsImgs';

const router = Router();
const upload = multer({storage:storageFiles}) 

//news routes
router.post('/post',mixedPost);
router.post('/post/list',getListPost);
router.post('/post/new', upload.any(), createPosts);
router.post("/post/like",likePost);
router.post('/post/get', getPostByID);
router.post("/post/edit",upload.any(),editPosts);
router.post("/post/delete",deletePosts);
router.post("/profile",getProfileDataData);


export default router;