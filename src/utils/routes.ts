import find from "lodash/find";
import { NextPageContext } from "next";

export interface NextPageContextExtended extends NextPageContext {
    isRedirecting: boolean;
}

export interface Route {
    id: string;
    path: string;
    name: string;
}

export const marketingRoutes = [
    {
        id: "Index",
        path: "/",
        name: "Home"
    },
    {
        id: "About",
        path: "/about",
        name: "About Us"
    },
    {
        id: "Blog",
        path: "/blog",
        name: "Blog"
    },
    {
        id: "Contact",
        path: "/contact",
        name: "Contact Us"
    },
    {
        id: "FAQ",
        path: "/faq",
        name: "FAQ"
    },
    {
        id: "Privacy",
        path: "/privacy",
        name: "Privacy Policy"
    },
    {
        id: "Terms",
        path: "/terms",
        name: "Terms of Service"
    }
];

export const appRoutes = [
    {
        id: "Home",
        path: "/app",
        name: "Home"
    },
    {
        id: "Task",
        path: "/app/task/[id]",
        name: "Task"
    },
    {
        id: "NewTask",
        path: "/app/task/new",
        name: "New Task"
    },
    {
        id: "Account",
        path: "/app/account",
        name: "Account"
    },
    {
        id: "Contact",
        path: "/app/contact-us",
        name: "Contact Us"
    },
    {
        id: "ForgotPassword",
        path: "/forgotPassword",
        name: "Forgot Password"
    },
    {
        id: "ForgotPasswordCompleted",
        path: "/forgotPasswordCompleted",
        name: "Forgot Password Completed"
    },
    {
        id: "Login",
        path: "/login",
        name: "Login"
    },
    {
        id: "Logout",
        path: "/logout",
        name: "Logout"
    },
    {
        id: "MaintenanceMode",
        path: "/maintenance-mode",
        name: "Maintenance Mode"
    }
];

const routes = [...marketingRoutes, ...appRoutes];

export function replaceVariables(string: string, query: any): string {
    return string.replace("[id]", query.id);
}

export function getRoute(path: string): Route | any {
    return find(routes, ["path", path]) || {};
}

export function getRouteById(routeId: string): Route | any {
    return find(routes, ["id", routeId]) || {};
}

export function getUrl(routeId: string, variables: any): any {
    const route = getRouteById(routeId);
    if (route) {
        return { pathname: route.path, query: { ...variables } };
    }
    return {};
}

export function getNamedUrl(
    routeId: string,
    variables: any
): { pathname: string; query: any } | undefined {
    const route = getRouteById(routeId);
    if (route) {
        let href = route.path;
        if (variables && Object.keys(variables).length) {
            for (const key in variables) {
                href = href.replace(`[${key}]`, variables[key]);
            }
        }

        const publicVariables = {
            ...variables
        };
        delete publicVariables.org;
        delete publicVariables.id;

        return { pathname: href, query: { ...publicVariables } };
    }
}
