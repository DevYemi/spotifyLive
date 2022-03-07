import { atom } from "recoil";


export const isSidebarOpenState = atom({
    // Global state if the sidebar is opened or not
    key: "isSidebarOpenState",
    default: false
})
