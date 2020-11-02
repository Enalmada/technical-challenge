import { PrismaClient } from "@prisma/client";
import { UserInputError } from "apollo-server-errors";
import * as yup from "yup";

export default class TaskService {
    static async upsertTask(args: any, { prisma, user }: { prisma: PrismaClient; user: any }) {
        const rawInput = args.input;

        const input = {
            title: rawInput.title,
            description: rawInput.description,
            dueDate: rawInput.dueDate,
            status: rawInput.status
        };

        // TODO: validate dueDate as a date
        // TODO: validate status as an enum
        const schema = yup.object().shape({
            id: yup.number(),
            title: yup.string().required(),
            description: yup.string(),
            dueDate: yup.string().nullable(),
            status: yup.string().required()
        });

        await schema.validate(input).catch(function (err) {
            throw new UserInputError(err.errors.join(","), {
                invalidArgs: err.params.path
            });
        });

        if (rawInput.id) {
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

    static async fetchTasks(args: any, { prisma, user }: { prisma: PrismaClient; user: any }) {
        return await prisma.task.findMany({
            where: {
                userId: user.id
            }
        });
    }

    static async deleteTask(args: any, { prisma, user }: { prisma: PrismaClient; user: any }) {
        const task = await prisma.task.findOne({
            where: {
                id: args.id
            }
        });

        const input = {
            id: args.id,
            userId: user.id
        };

        const schema = yup.object().shape({
            id: yup.number().required(),
            userId: yup
                .number()
                .test(task.userId, "Task does not belong to user", (value) => value === user.id)
        });

        await schema.validate(input).catch(function (err) {
            throw new UserInputError(err.errors.join(","), {
                invalidArgs: err.params.path
            });
        });

        return await prisma.task.delete({
            where: {
                id: input.id
            }
        });
    }
}
