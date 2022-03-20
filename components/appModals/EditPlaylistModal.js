/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isModalOpenState } from '../../globalState/displayModalAtom';
import { PencilIcon, XCircleIcon } from '@heroicons/react/outline';
import { DotsHorizontalIcon, MusicNoteIcon } from '@heroicons/react/solid';
import { playlistState } from '../../globalState/playlistsAtom';
import useSpotify from '../../customHooks/useSpotify';
import { useRouter } from 'next/router';

const style = {
    position: 'absolute',
    top: '50%',
    outline: 'none',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    maxWidth: 550,
    bgcolor: '#282828',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const EditPlaylistTextField = styled(TextField)({
    '& label': {
        color: 'white'
    },
    '& label.Mui-focused': {
        color: 'white',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#535353',
    },
    '& .MuiOutlinedInput-root': {
        color: 'white',
        fontSize: 14,
        backgroundColor: '#535353',
        '& fieldset': {
            borderColor: 'white',
        },
        '&:hover fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#535353',
        },
    },
})


function EditPlaylistModal({ handleModalClose }) {
    const [isModalOpen, setIsModalOpen] = useRecoilState(isModalOpenState); // Atom global state
    const spotifyApi = useSpotify();
    const playlist = useRecoilValue(playlistState) // Atom global state
    const [nameInput, setNameInput] = useState(playlist ? playlist?.name : '') // keeps state of the typed name by the user
    const [desInput, setDesInput] = useState(playlist ? playlist?.description : '') // keeps state of the typed description by the user
    const ulElement = useRef(null); // reference to the ul tag element thats aprent to the image modification 
    const router = useRouter()
    const [customImgPicked, setCustomImgPicked] = useState(); // keeps state of the new picked spotify cover image

    const openDotsHorizontalClick = (e) => {
        const currentView = window?.getComputedStyle(ulElement.current).display;
        if (currentView === 'none') return ulElement.current.style.display = 'block'
        if (currentView === 'block') return ulElement.current.style.display = 'none'
    }
    const changePlaylistDetails = () => {
        spotifyApi.changePlaylistDetails(playlist?.id,
            {
                name: nameInput ? nameInput : playlist?.name,
                description: desInput ? desInput : playlist?.description,
                'public': false
            }).then(function () {
                handleModalClose()
                router.push(router.asPath)
            }).catch(err => {
                console.log(err);
                setIsModalOpen({ type: 'ERROR', open: true, reason: err?.body?.error?.reason, message: err?.body?.error?.message });
            })
    }
    const uploadCoverIMageToSpotify = async (e) => {
        try {
            const longbase64uri = await getBase64(e.target.files[0]);
            if (!longbase64uri || !playlist?.id) return
            spotifyApi.uploadCustomPlaylistCoverImage(playlist?.id, longbase64uri)
                .then(function (data) {
                    console.log('Playlsit cover image uploaded!');
                }).catch(err => {
                    console.log(err?.body);
                    setIsModalOpen({ type: 'ERROR', open: true, reason: err?.body?.error?.reason, message: err?.body?.error?.message });
                })
        } catch (err) {
            console.log(err)
        }

        function getBase64(file) {
            return new Promise((resolve, reject) => {
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (err) => reject(reader.error)
            })

        }
    }
    useEffect(() => {
        // add eventlistener for toggling DotsHorizonIcon
        const closeDotsHorizontalClick = (e) => {
            const dotsHorizonIcon = document.querySelector('.EPM-DHICON');
            if (dotsHorizonIcon === e.target.parentNode || dotsHorizonIcon === e.target) return // return if the icon was clicked ans let the openDotsHorizontalClick Func hnadle it
            if (ulElement.current) ulElement.current.style.display = 'none' // else if you clicked somewhere else on the screen close it
        }
        window.addEventListener('click', closeDotsHorizontalClick);
        return () => window.removeEventListener('click', closeDotsHorizontalClick)
    }, [])
    return (
        <Modal
            open={isModalOpen.open}
            onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div className='text-white flex flex-col'>
                    <div className='flex  justify-between items-center'>
                        <h1>Edit Details</h1>
                        <XCircleIcon onClick={handleModalClose} className='h-10 w-10 cursor-pointer' />
                    </div>
                    <div className='flex flex-col items-center mt-6 md:flex-row'>
                        <div className=' group relative shadow-2xl flex justify-center mr-4 items-center h-52 w-44 bg-[#282828] cursor-pointer min-w-[190px] '>
                            <img
                                className='h-full object-cover'
                                src={playlist?.images[0]?.url}
                                alt='' />
                            <input
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={uploadCoverIMageToSpotify}
                                className='absolute w-full h-full opacity-0 z-[1]' />
                            <div className='absolute hidden z-[2] text-sm top-3 p-2 bg-[#202020] rounded-full right-5 group-hover:block'>
                                <DotsHorizontalIcon onClick={openDotsHorizontalClick} className='EPM-DHICON h-5 w-5' />
                                <ul
                                    ref={ulElement}
                                    className='list-none absolute hidden py-1 w-max  z-[2] top-9 font-light rounded-lg bg-[#1d1b1b]'>
                                    <li className='py-2 pl-[1em] pr-[3em] hover:bg-[#3b3b3b] rounded-sm'>Change Photo</li>
                                    <li className='py-2 pl-[1em] pr-[3em] hover:bg-[#3b3b3b] rounded-sm'>Remove Photo</li>
                                </ul>
                            </div>

                            <div className='absolute group-hover:bg-[#28282859] w-full h-full flex justify-center items-center'>
                                {
                                    !playlist?.images[0]?.url && <MusicNoteIcon className='h-12 w-12 text-[#7F7F7F] group-hover:hidden' />
                                }

                                <PencilIcon className='h-12 w-12 hidden text-[#7F7F7F] group-hover:block' />
                            </div>

                        </div>
                        <div className='text-center mt-4'>
                            <EditPlaylistTextField
                                id="outlined-basic"
                                label="Name"
                                value={nameInput}
                                onChange={e => setNameInput(e.target.value)}
                                className='!mb-4'
                                color="warning"
                                variant="outlined" />

                            <EditPlaylistTextField
                                id="outlined-multiline-static"
                                multiline
                                value={desInput}
                                onChange={e => setDesInput(e.target.value)}
                                rows={4}
                                label="Description"
                                variant="outlined" />
                        </div>
                    </div>
                    <button onClick={changePlaylistDetails} className='py-[.2em] px-[2em] mt-[2em] text-black rounded-[30px] font-semibold bg-white w-fit self-end'>Save</button>
                    <p className='text-[.6rem] mt-6'>By proceeding, you agree to give Spotify access to the image you choose to upload. Please make sure you have the right to upload the image.</p>
                </div>


            </Box>
        </Modal>
    )

}

export default EditPlaylistModal