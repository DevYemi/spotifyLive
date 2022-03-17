import { atom } from "recoil";


export const topTracksState = atom({
    // Global state of the current Top Tracks displayed
    key: " topTracksState",
    default: null
})
export const topTrackSelectedState = atom({
    // Global state of selected tracks for playlist in top tracks
    key: "topTrackSelectedState",
    default: []
})
export const topTrackIsCreatePlaylistState = atom({
    // Global state if a user is currently creating a plsylist from the top tracks
    key: "topTrackIsCreatePlaylistState",
    default: false
})