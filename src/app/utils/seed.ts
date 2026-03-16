import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { envVars } from '../config/env';

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await prisma.user.findFirst({
            where: {
                role: Role.ADMIN,
                email: envVars.ADMIN_EMAIL || 'admin@propshare.com',
            },
        });

        if (isSuperAdminExist) {
            console.log('Admin already exists. Skipping seeding.');
            return;
        }

        const hashedPassword = await bcrypt.hash(envVars.ADMIN_PASSWORD || 'admin123456', 12);

        const superAdmin = await prisma.user.create({
            data: {
                name: envVars.ADMIN_NAME || 'PropShare Admin',
                email: envVars.ADMIN_EMAIL || 'admin@propshare.com',
                password: hashedPassword,
                role: Role.ADMIN,
            },
        });

        console.log('Super Admin Created:', {
            id: superAdmin.id,
            name: superAdmin.name,
            email: superAdmin.email,
        });
    } catch (error) {
        console.error('Error seeding admin:', error);
    }
};
