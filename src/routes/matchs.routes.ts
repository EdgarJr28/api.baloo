import { request, response, Router } from 'express';
import { getMatchProfiles, sendMatch } from '../controllers/matchs.controller';

const router = Router();

router.post('/match/new', sendMatch);
router.post('/match/findMatch/', getMatchProfiles);

export default router;