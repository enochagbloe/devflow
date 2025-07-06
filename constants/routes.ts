const ROUTES = {
    HOME: '/',
    SIGN_IN: '/sign-in',
    SIGN_UP: '/sign-up',
    ASK_QUESTION: '/ask-question',
    PROFILE :  (id: string)=> `/profile/${id}`,
    QUESTION :  (id: string)=> `/questions/${id}`,
    TAGS: (id: string)=> `/tags/${id}`,
    SIGN_IN_WITH_OAUTH: (id: string)=> `/sign-in-with-oauth/${id}`,
}
export default ROUTES