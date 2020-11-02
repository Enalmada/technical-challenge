import { format } from "date-fns";
import React, { FC, useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";

import { TASKS } from "../../apollo/queries-mutations";
import { TaskInput, TaskStatus, useUpsertTaskMutation } from "../../apollo/types/graphql";
import { formatRelativeDate } from "../../utils/date";
interface Props {
    task: any;
}

// NOTE: ReactTooltip doesn't seem to be SSR friendly.  Doing some state shenagains
// https://stackoverflow.com/questions/64079321/react-tooltip-and-next-js-ssr-issue
// https://haodong.io/render-client-side-only-component-in-next-js
const Task: FC<Props> = (props) => {
    const { id, title, description, dueDate, status } = props.task;

    const [clientSide, setClientSide] = useState(false);

    const [upsertTask] = useUpsertTaskMutation({
        refetchQueries: [{ query: TASKS }]
    });

    useEffect(() => {
        // update some client side state to say it is now safe to render the client-side only component
        setClientSide(true);
    }, []);

    return (
        <div className="flex bg-white shadow-lg rounded-lg md:mx-auto mb-3 max-w-md md:max-w-2xl ">
            <div className="flex items-start px-4 py-6 w-full">
                <div>
                    <label className="inline-flex">
                        <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-purple-600 cursor-pointer"
                            defaultChecked={status === "COMPLETED"}
                            onClick={async (e) => {
                                const input: TaskInput = {
                                    id: id,
                                    title: title,
                                    description: description,
                                    dueDate: dueDate,
                                    status: status === "NEW" ? TaskStatus.Completed : TaskStatus.New
                                };

                                try {
                                    e.stopPropagation();
                                    await upsertTask({ variables: { input } });
                                } catch (e) {
                                    //
                                }
                            }}
                        />
                    </label>
                </div>
                <div className="ml-5 w-full">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900 -mt-1">{title}</h2>
                        {dueDate && (
                            <>
                                <small
                                    data-tip={format(new Date(dueDate), "MM/dd/yyyy")}
                                    className="text-sm text-gray-700 text-right">
                                    {formatRelativeDate(dueDate)}
                                </small>
                            </>
                        )}
                    </div>

                    {clientSide && <ReactTooltip effect="solid" />}

                    <p className="mt-3 text-gray-700 text-sm">{description}</p>
                </div>
            </div>
        </div>
    );
};

export default Task;
