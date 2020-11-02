import Link from "next/link";
import React, { FC } from "react";

import { useTasksQuery } from "../../apollo/types/graphql";
import { getUrl } from "../../utils/routes";
import Task from "./Task";

const TaskList: FC = () => {
    const { data, error } = useTasksQuery();

    if (!data) return null;
    if (error) return <div>{`Error! ${error.message}`}</div>;

    const tasks = [...data.tasks].sort((a, b) => {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    return (
        <div>
            {tasks.map((task) => {
                return (
                    <Link href={getUrl("Task", { id: task.id })} key={task.id}>
                        <a>
                            <Task task={task} />
                        </a>
                    </Link>
                );
            })}
        </div>
    );
};

export default TaskList;
