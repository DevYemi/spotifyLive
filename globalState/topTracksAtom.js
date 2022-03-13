import { atom } from "recoil";


export const topTracksState = atom({
    // Global state of the current Top Tracks displayed
    key: " topTracksState",
    default: null
})
export const topTrackSelectedState = atom({
    // Global state of the current Top Tracks displayed
    key: "topTrackSelectedState",
    default: []
})
export const topTrackIsCreatePlaylistState = atom({
    // Global state of the current Top Tracks displayed
    key: "topTrackIsCreatePlaylistState",
    default: []
})