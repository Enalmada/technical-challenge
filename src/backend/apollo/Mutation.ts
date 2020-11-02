import TaskService from "../services/TaskService";

const Mutation = {
    async upsertTask(_parent, args, context) {
        return TaskService.upsertTask(args, context);
    },
    async deleteTask(_parent, args, context) {
        return TaskService.deleteTask(args, context);
    }
};

export { Mutation as default };
