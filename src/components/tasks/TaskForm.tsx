import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { TASKS } from "../../apollo/queries-mutations";
import { Task, useDeleteTaskMutation, useUpsertTaskMutation } from "../../apollo/types/graphql";
import { getRouteById } from "../../utils/routes";
import DatePicker from "../DatePicker";

interface Props {
    task?: Pick<Task, "id" | "title" | "description" | "dueDate" | "status">;
}

const TaskForm: FC<Props> = (props) => {
    const router = useRouter();

    const [upsertTask, { error: mutationError }] = useUpsertTaskMutation({
        refetchQueries: [{ query: TASKS }]
    });

    // TODO: dueDate should be Date (form not submitting)
    type FormData = {
        title: string;
        description?: string;
        status: string;
        dueDate?: string;
    };

    // TODO: dueDate should be date()  (form not submitting)
    const schema = yup.object().shape({
        title: yup.string().required("Title is a required field"),
        description: yup.string(),
        status: yup.string().required("Status is a required field"),
        dueDate: yup.string()
    });

    const { register, handleSubmit, errors, control } = useForm<FormData>({
        resolver: yupResolver(schema)
    });

    const onSubmit = async ({ title, description, status, dueDate }) => {
        const input = {
            id: props.task?.id,
            title: title,
            description: description,
            dueDate: dueDate,
            status: status
        };

        try {
            await upsertTask({
                variables: { input }
            });
            await router.push(getRouteById("Home").path);
        } catch (e) {
            // mutation error will render errors but not handle them
            // https://stackoverflow.com/questions/59465864/handling-errors-with-react-apollo-usemutation-hook
        }
    };

    // @ts-ignore for some reason networkError isn't in the types
    const mutationErrorMessage = mutationError?.networkError?.graphQLErrors[0].message;
    const { id, title, description, dueDate, status } = props.task || {};

    return (
        <div className="max-w-sm sm:max-w-md md:max-w-lg">
            {mutationError && (
                <div className="alert flex flex-row items-center bg-red-200 p-5 rounded border-b-2 border-red-300 mb-5">
                    <div className="alert-icon flex items-center bg-red-100 border-2 border-red-500 justify-center h-10 w-10 flex-shrink-0 rounded-full">
                        <span className="text-red-500">
                            <svg fill="currentColor" viewBox="0 0 20 20" className="h-6 w-6">
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"></path>
                            </svg>
                        </span>
                    </div>
                    <div className="alert-content ml-4">
                        <div className="alert-title font-semibold text-lg text-red-800">Error</div>
                        <div className="alert-description text-sm text-red-600">
                            {mutationErrorMessage}
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={"mb-5"}>
                    <label className="block">
                        <span className="text-gray-700">Title</span>
                        <input
                            className="form-input mt-1 block w-full"
                            name="title"
                            defaultValue={title}
                            ref={register}
                        />
                    </label>
                    {errors.title?.message && (
                        <span className={"text-red-600"}>{errors.title?.message}</span>
                    )}
                </div>

                <div className={"mb-5"}>
                    <label className="block">
                        <span className="text-gray-700">Description</span>
                        <textarea
                            className="form-textarea mt-1 block w-full"
                            defaultValue={description}
                            rows={3}
                            name="description"
                            ref={register}></textarea>
                    </label>
                    {errors.description?.message && (
                        <span className={"text-red-600"}>{errors.description?.message}</span>
                    )}
                </div>

                <div className="mb-5">
                    <label className="block" htmlFor={"dueDate"}>
                        <span className="text-gray-700">Due Date</span>

                        <div>
                            <Controller
                                control={control}
                                name="dueDate"
                                defaultValue={dueDate ? new Date(dueDate) : ""}
                                render={({ onChange, onBlur, value }) => (
                                    <DatePicker
                                        id={"dueDate"}
                                        onChange={(value) => {
                                            /* TODO form won't submit null for unknown reason */
                                            if (!value) {
                                                onChange("");
                                            } else {
                                                onChange(value);
                                            }
                                        }}
                                        onBlur={onBlur}
                                        selected={value}
                                    />
                                )}
                            />
                        </div>
                    </label>

                    {errors.dueDate?.message && (
                        <span className={"text-red-600"}>{errors.title?.message}</span>
                    )}
                </div>

                <div className="mb-5">
                    <span className="text-gray-700">Status</span>
                    <div className="mt-2">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio"
                                name="status"
                                value="NEW"
                                ref={register}
                                defaultChecked={!status || status === "NEW"}
                            />
                            <span className="ml-2">New</span>
                        </label>
                        <label className="inline-flex items-center ml-6">
                            <input
                                type="radio"
                                className="form-radio"
                                name="status"
                                value="COMPLETED"
                                ref={register}
                                defaultChecked={status === "COMPLETED"}
                            />
                            <span className="ml-2">Completed</span>
                        </label>
                    </div>
                    {errors.status?.message && (
                        <span className={"text-red-600"}>{errors.status?.message}</span>
                    )}
                </div>

                <div className={"flex justify-between mt-10"}>
                    <div>
                        <button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 p-5 mr-3">
                            {id ? "Save" : "Create"}
                        </button>

                        <Link href={getRouteById("Home").path}>
                            <button className="bg-white hover:bg-gray-200 text-gray-700 font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 p-5">
                                Cancel
                            </button>
                        </Link>
                    </div>

                    <DeleteTaskButton id={id} />
                </div>
            </form>
        </div>
    );
};

const DeleteTaskButton: FC<{ id?: number }> = (props) => {
    const router = useRouter();

    const [deleteTask] = useDeleteTaskMutation({
        refetchQueries: [{ query: TASKS }]
    });

    return (
        <>
            {props.id && (
                <button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 p-5"
                    onClick={async () => {
                        try {
                            await deleteTask({ variables: { id: props.id } });
                            await router.push(getRouteById("Home").path);
                        } catch (e) {
                            // mutation error will render errors but not handle them
                            // https://stackoverflow.com/questions/59465864/handling-errors-with-react-apollo-usemutation-hook
                            // TODO: send error to error page
                        }
                    }}>
                    Delete
                </button>
            )}
        </>
    );
};

export default TaskForm;
