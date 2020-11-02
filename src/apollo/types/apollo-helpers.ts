import { FieldPolicy, FieldReadFunction, TypePolicies } from '@apollo/client/cache';
export type UserKeySpecifier = ('id' | 'email' | UserKeySpecifier)[];
export type UserFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaskKeySpecifier = ('id' | 'title' | 'description' | 'dueDate' | 'status' | 'createdAt' | 'updatedAt' | TaskKeySpecifier)[];
export type TaskFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	dueDate?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TemplateKeySpecifier = ('html' | TemplateKeySpecifier)[];
export type TemplateFieldPolicy = {
	html?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('users' | 'tasks' | 'emailTemplate' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	users?: FieldPolicy<any> | FieldReadFunction<any>,
	tasks?: FieldPolicy<any> | FieldReadFunction<any>,
	emailTemplate?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('upsertTask' | 'deleteTask' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	upsertTask?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteTask?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TypedTypePolicies = TypePolicies & {
	User?: {
		keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier),
		queryType?: true,
		mutationType?: true,
		subscriptionType?: true,
		fields?: UserFieldPolicy,
	},
	Task?: {
		keyFields?: false | TaskKeySpecifier | (() => undefined | TaskKeySpecifier),
		queryType?: true,
		mutationType?: true,
		subscriptionType?: true,
		fields?: TaskFieldPolicy,
	},
	Template?: {
		keyFields?: false | TemplateKeySpecifier | (() => undefined | TemplateKeySpecifier),
		queryType?: true,
		mutationType?: true,
		subscriptionType?: true,
		fields?: TemplateFieldPolicy,
	},
	Query?: {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		queryType?: true,
		mutationType?: true,
		subscriptionType?: true,
		fields?: QueryFieldPolicy,
	},
	Mutation?: {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		queryType?: true,
		mutationType?: true,
		subscriptionType?: true,
		fields?: MutationFieldPolicy,
	}
};