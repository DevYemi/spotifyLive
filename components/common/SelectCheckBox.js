import React, { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useRecoilValue } from 'recoil';
import { userPlaylistsState } from '../../globalState/playlistsAtom';
import { useSession } from 'next-auth/react';
import { FormHelperText } from '@mui/material';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};



export default function MultipleSelectCheckmarks({ addTracksToPlaylist, addTrackLoading }) {
    const { data: session } = useSession(); // get the current logged in user session
    const [selectedPlaylist, setSelectedPlaylist] = useState(''); // keeps state of the selected playlists
    const playlists = useRecoilValue(userPlaylistsState); // Atom global state
    const [userPersonalPlaylists, setUserPersonalPlaylists] = useState([])


    const handleChange = (event) => {
        const { target: { value } } = event;
        console.log(value);
        setSelectedPlaylist(value);
    };

    const handleButtonClick = () => {
        if (selectedPlaylist === 'none') return
        const info = userPersonalPlaylists.filter(p => p?.id === selectedPlaylist)
        if (info.length < 1) return
        addTracksToPlaylist(info[0])
    }

    useEffect(() => {
        if (!playlists) return
        const matchedItems = playlists.filter(item => item?.owner?.id === session?.user?.username); // get playlist that belong to logged in user
        setUserPersonalPlaylists(matchedItems);
    }, [playlists, session])
    return (
        <div className='flex items-center'>
            <FormControl fullWidth sx={{ maxWidth: '60%', '& .MuiList-root': { maxHeight: '300px' } }}>
                <InputLabel id="demo-simple-select-label" className='!text-white'>Playlists</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedPlaylist}
                    label="Playlists"
                    onChange={handleChange}
                    sx={{
                        '& .MuiSvgIcon-root': {
                            color: 'white'
                        },
                        '& .MuiSelect-select': {
                            color: 'white'
                        },
                        '& fieldset': {
                            borderColor: 'white',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1ED45F',
                        },
                    }}
                >
                    <MenuItem value='none'>
                        <em>None</em>
                    </MenuItem>
                    {userPersonalPlaylists.map((playlist, i) => (
                        <MenuItem key={`${playlist?.id} ${i}`} value={playlist?.id}>
                            {playlist?.name}
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText className='!text-[#cecdcd] !text-[8px]'>Select a playlist you will like to add song to</FormHelperText>
            </FormControl>
            {
                addTrackLoading ? <LoadingButton className='!bg-[#1ED45F] !text-white !text-[10px] !ml-4 !mb-[2em] h-[40px]' loading variant="outlined" />
                    :
                    <Button onClick={handleButtonClick} className='!bg-[#1ED45F] !text-white !text-[10px] !ml-4 !mb-[2em]'>Add Songs</Button>
            }

        </div>

    );
}