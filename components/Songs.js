import React from 'react'
import { useRecoilValue } from 'recoil'
import { playlistState } from '../globalState/playlistsAtom'

function Songs() {
    const playlist = useRecoilValue(playlistState)
    return (
        <div>
            {
                playlist?.tracks.items.map(track => (
                    <div>{track?.track?.name}</div>
                ))
            }
        </div>
    )
}

export default Songs