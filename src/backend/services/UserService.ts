import { PrismaClient } from "@prisma/client";

export default class UserService {
    static async createOrGetUser(prisma: PrismaClient, uid: string, email: string) {
        // TODO - send welcome email on new user creation
        // EmailService.sendWelcome()

        return await prisma.user.upsert({
            where: { firebaseId: uid },
            update: { firebaseId: uid, email: email },
            create: { firebaseId: uid, email: email }
        });
    }
}
