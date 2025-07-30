import  ROUTES  from "./routes";

export const DEFAULT_EMPTY = {
    title: "No Data Found",
    message: "Looks like the database is taking a nap. Wake it up by adding some data!",
    button: {
        text: "Go Add some Data",
        href: ROUTES.HOME,
    }
}

export const DEFAULT_ERROR = {
    title: "Something went wrong",
    message: "We encountered an error while processing your request. Please try again later.",
    button: {
        text: "Go Back",
        href: ROUTES.HOME,
    }
}

export const EMPTY_QUESTIONS = {
    title: "No Questions Found",
    message: "Questions are the heart of our community. Be the first to ask a question!",
    button: {
        text: "Go Add some Data",
        href: ROUTES.ASK_QUESTION,
    }
}

export const EMPTY_TAGS = {
    title: "No Tags Found",
    message: "Tags help categorize questions. Be the first to create a tag!",
    button: {
        text: "Go Add some Data",
        href: ROUTES.ASK_QUESTION,
    }
}

export const EMPTY_COLLECTIONS = {
    title: "No Collections Found",
    message: "Collections help organize content. Be the first to create a collection!",
    button: {
        text: "Save to collection",
        href: ROUTES.ASK_QUESTION,
    }
}