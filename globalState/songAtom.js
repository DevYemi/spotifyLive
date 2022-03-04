import { atom } from "recoil"


export const currentTrackIdState = atom({
    // keeps state of the id of the current song thats being played at the momemnt
    key: "currentTrackIdState",
    default: { currentTrackId: null, parentId: null }
});


export const isPlayingState = atom({
    // keeps state if there is a song currently playing on the app
    key: "isPlayingState",
    default: false
})