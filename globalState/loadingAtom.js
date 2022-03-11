import { atom } from "recoil";

export const searchLoadingState = atom({
    // Global state of user total playlists
    key: 'searchLoadingState',
    default: false,
})