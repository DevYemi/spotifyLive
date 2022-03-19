import React from 'react'
import { useRecoilValue } from 'recoil'
import { popMssgTypeState } from '../../globalState/popMessageAtom'

function PopUpMessage() {
    const popMssgType = useRecoilValue(popMssgTypeState) // Atom global state
    return (
        <div
            className='POPUP-MESSG hidden overflow-hidden truncate max-w-[300px] absolute text-[10px] text-white px-5 bottom-[12px] left-[50%] translate-x-[-50%] py-3 opacity-0 rounded-md bg-[#0075FF] h-fit md:text-sm'>
            <span>{
                (popMssgType?.operation === 'SAVE' && popMssgType?.type === 'library') ? 'Saved to your library'
                    : (popMssgType?.operation === 'REMOVE' && popMssgType?.type === 'library') ? 'Removed from your library'
                        : popMssgType?.operation === 'SAVE' && popMssgType?.type !== 'library' ? `Added to ${popMssgType?.type}`
                            : ``
            }</span>
        </div>
    )
}

export default PopUpMessage