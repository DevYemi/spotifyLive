/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { useRecoilState } from 'recoil';
import { isModalOpenState } from '../../globalState/displayModalAtom';
import EditPlaylistModal from './EditPlaylistModal'
import ErrorModal from './ErrorModal'


function DisplayModal() {
    const [isModalOpen, setIsModalOpen] = useRecoilState(isModalOpenState); // Atom global state

    const handleModalClose = () => {
        setIsModalOpen({ type: '', open: false })
    }
    if (isModalOpen.open && isModalOpen.type === 'EDIT-PLAYLIST') {
        return (
            <EditPlaylistModal handleModalClose={handleModalClose} />
        )
    } else if (isModalOpen.open && isModalOpen.type === 'ERROR') {
        return <ErrorModal handleModalClose={handleModalClose} />
    }
    else return <></>

}

export default DisplayModal