import { atom } from "recoil";

export const isModalOpenState = atom({
    // Global state of user total playlists
    key: 'isModalOpenState',
    default: { type: '', open: false },
})