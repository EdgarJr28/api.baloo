import { request, response, Router } from 'express';
import { resetPassword, indexWelcome, removeSMS, smsResender, validateSMS, setDebug, createDBAnimalsTypes } from '../controllers/index.controllers';
import { body, validationResult } from 'express-validator';
import { mediaReturn } from '../libs/MediaReturn';

export var DEBUG: any = true;

const router = Router();

router.get('/api', indexWelcome);
router.post('/resendSMS', smsResender);
router.post('/deletesms/', removeSMS);
router.get("/api/debug/", setDebug);
router.get("/api/createanimals", createDBAnimalsTypes);
router.post("/timeout/return", mediaReturn);

export default router;