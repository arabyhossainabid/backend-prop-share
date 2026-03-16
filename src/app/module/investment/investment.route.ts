import { Router } from 'express';
import { InvestmentController } from './investment.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '@prisma/client';
import validateRequest from '../../middleware/validateRequest';
import { InvestmentValidation } from './investment.validation';

const router = Router();

router.post(
    '/purchase',
    checkAuth(Role.USER, Role.ADMIN),
    validateRequest(InvestmentValidation.purchase),
    InvestmentController.purchaseShares
);

router.get(
    '/me',
    checkAuth(Role.USER, Role.ADMIN),
    InvestmentController.getMyInvestments
);

export const InvestmentRoutes = router;
