import EmailService from "../services/EmailService";
import TaskService from "../services/TaskService";

const Query = {
    async tasks(_parent, args, context) {
        return TaskService.fetchTasks(args, context);
    },
    async emailTemplate(_parent, args, _context) {
        return EmailService.emailHtml(args.template);
    }
};

export { Query as default };
