import { atom } from "recoil";

export const isModalOpenState = atom({
    // Global state of the current modal state and the type
    key: 'isModalOpenState',
    default: { type: '', open: false },
})