import { atom } from "recoil";

export const userPlaylistsState = atom({
    // Global state of user total playlists
    key: 'userPlaylistsState',
    default: null,
})
export const playlistState = atom({
    // Global state of the current playlist that is currently on the viewport
    key: "playlistState",
    default: null
})
export const playlistsIdState = atom({
    // keeps state of the id of the play that is currently on the viewport
    key: "playlistsIdState",
    default: null
})
export const isNewPlaylistCreatedState = atom({
    // keeps state if a new playlist has been created
    key: "isNewPlaylistCreatedState",
    default: false
})

