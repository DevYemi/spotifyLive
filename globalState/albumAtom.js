import { atom } from "recoil";

export const albumDetailsState = atom({
    // Global state for the current displayed album
    key: 'albumDetailsState',
    default: null,
})