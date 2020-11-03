import { PrismaClient } from "@prisma/client";
import * as yup from "yup";

import { validateInput } from "../utils/helpers";

interface Context {
    prisma: PrismaClient;
    user: any;
}

export default class TaskService {
    static async upsertTask(args: any, { prisma, user }: Context) {
        const rawInput = args.input;

        // Filter args to update (ie: may not want consumer to update createdAt)
        const input = {
            title: rawInput.title,
            description: rawInput.description,
            dueDate: rawInput.dueDate,
            status: rawInput.status
        };

        // Validate general inputs
        // TODO: validate dueDate as a date
        // TODO: validate status as an enum
        const schema = yup.object().shape({
            id: yup.number(),
            title: yup.string().required(),
            description: yup.string(),
            dueDate: yup.string().nullable(),
            status: yup.string().required()
        });

        await validateInput(schema, input);

        // If task exists
        if (rawInput.id) {
            // Don't let someone update tasks they don't own
            const task = await prisma.task.findOne({
                where: {
                    id: rawInput.id
                }
            });

            const schema = yup.object().shape({
                userId: yup
                    .number()
                    .test("userId", "Task does not belong to user", (value) => value === user.id)
            });

            await validateInput(schema, { userId: task.userId });

            return await prisma.task.update({
                where: {
                    id: rawInput.id
                },
                data: {
                    ...input,
                    updatedAt: new Date()
                }
            });
        } else {
            return await prisma.task.create({
                data: {
                    ...input,
                    users: {
                        connect: { id: user.id }
                    }
                }
            });
        }
    }

    static async fetchTasks(args: any, { prisma, user }: Context) {
        return await prisma.task.findMany({
            where: {
                userId: user.id
            }
        });
    }

    static async deleteTask(args: any, { prisma, user }: Context) {
        const task = await prisma.task.findOne({
            where: {
                id: args.id
            }
        });

        const input = {
            id: args.id,
            userId: task.userId
        };

        const schema = yup.object().shape({
            id: yup.number().required(),
            userId: yup
                .number()
                .test("userId", "Task does not belong to user", (value) => value === user.id)
        });

        await validateInput(schema, input);

        return await prisma.task.delete({
            where: {
                id: input.id
            }
        });
    }
}
