import { Role } from '@prisma/client';
import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth';
import { VoteController } from './vote.controller';

const router = Router();

router.post(
  '/:propertyId',
  checkAuth(Role.USER, Role.ADMIN),
  VoteController.vote
);

router.get('/:propertyId', VoteController.getPropertyVotes);

router.get(
  '/:propertyId/my-vote',
  checkAuth(Role.USER, Role.ADMIN),
  VoteController.getUserVote
);

export const VoteRoutes: Router = router;
