import { atom } from "recoil";


export const playlistState = atom({
    // Global state of the current playlist, Album, Top-Track lists that is currently on the viewport
    key: " playlistState",
    default: null
})
export const playlistsIdState = atom({
    // keeps state of the id of the play that is currently on the viewport
    key: "playlistsIdState",
    default: null
})

