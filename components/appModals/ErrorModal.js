import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { isModalOpenState } from '../../globalState/displayModalAtom';
import { useRecoilValue } from 'recoil';
import Link from 'next/link';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    maxWidth: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function ErrorModal({ handleModalClose }) {
    const isModalOpen = useRecoilValue(isModalOpenState); // Atom global state
    console.log(isModalOpen)
    if (isModalOpen?.reason === 'NO_ACTIVE_DEVICE') {
        return (
            <div>
                <Modal
                    open={isModalOpen.open}
                    onClose={handleModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box className="text-gray-500 bg-[url('/img/disconnect.png')] bg-[length:150px] bg-repeat-x bg-bottom" sx={style}>
                        <div >
                            <p>Spotify Said: {isModalOpen?.reason}</p>
                            <p className='my-5'>Developer Said: You need to either have your spotify app playling a song or open a spotify web player and start playling a song to be able to control music playback from this third party app</p>
                            <Button onClick={handleModalClose} className='bg-primary block m-auto text-white hover:bg-primary'>
                                <Link href='https://www.spotify.com/'>
                                    <a target="_blank">Okay</a>
                                </Link>
                            </Button>
                        </div>

                    </Box>
                </Modal>
            </div>
        );
    } else if (isModalOpen?.reason || isModalOpen?.message) {
        return (
            <div>
                <Modal
                    open={isModalOpen.open}
                    onClose={handleModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <div >
                            An Error occurred while trying to process your request to spotify server
                            <p>ERROR-REASON: {isModalOpen?.reason}</p>
                            <p>ERROR-MESSAGE: {isModalOpen?.message}</p>
                        </div>

                    </Box>
                </Modal>
            </div>
        );
    }
    else {
        return (
            <div>
                <Modal
                    open={isModalOpen.open}
                    onClose={handleModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box className='text-gray-500' sx={style}>
                        <div>
                            <p>An Error occurred while trying to connect with the spotify server, please check your internet connection as this might be a connectivity issue</p>
                            <Button onClick={handleModalClose} className='bg-primary block m-auto text-white hover:bg-primary'>
                                Okay
                            </Button>
                        </div>
                    </Box>
                </Modal>
            </div>
        );
    }

}