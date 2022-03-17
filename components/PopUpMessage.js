import React from 'react'
import { useRecoilValue } from 'recoil'
import { popMssgTypeState } from '../globalState/popMessageAtom'

function PopUpMessage() {
    const popMssgType = useRecoilValue(popMssgTypeState) // Atom global state
    return (
        <div className='POPUP-MESSG hidden absolute text-[10px] text-white px-5 bottom-[12px] left-[50%] translate-x-[-50%] py-3 opacity-0 rounded-md bg-[#0075FF] h-fit md:text-sm'>
            <span>{popMssgType === 'SAVE' ? 'Saved to your library' : 'Removed from your library'}</span>
        </div>
    )
}

export default PopUpMessage