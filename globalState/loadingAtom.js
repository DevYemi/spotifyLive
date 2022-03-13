import { atom } from "recoil";

export const routingPageLoadingState = atom({
    // Global loading state if a user is currently routing through pages 
    key: 'routingPageLoadingState',
    default: false,
})

export const preventRoutingPageLoadingState = atom({
    // Global state to prevent routing loading page
    key: 'preventRoutingPageLoadingState',
    default: false,
})