"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🌱 Seeding admin user...');
        // Update the admin user if they exist, or create them if they don't
        const adminEmail = 'swe.robertkibet@gmail.com';
        try {
            // First, try to find the user
            const existingUser = yield prisma.user.findUnique({
                where: { email: adminEmail }
            });
            if (existingUser) {
                // Update existing user to be admin
                const updatedUser = yield prisma.user.update({
                    where: { email: adminEmail },
                    data: { isAdmin: true }
                });
                console.log(`✅ Updated existing user ${adminEmail} to admin status`);
                console.log(`   User ID: ${updatedUser.id}`);
                console.log(`   Name: ${updatedUser.name || 'Not set'}`);
                console.log(`   Admin: ${updatedUser.isAdmin}`);
            }
            else {
                console.log(`⚠️  User ${adminEmail} not found in database`);
                console.log('   The admin user will be created automatically when they first log in via Google OAuth');
                console.log('   After first login, you can run this seed script again to grant admin privileges');
            }
        }
        catch (error) {
            console.error('❌ Error seeding admin user:', error);
            throw error;
        }
        console.log('🌱 Seeding completed');
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
