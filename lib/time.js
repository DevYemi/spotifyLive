export function convertMsToTime(milliseconds, isTrack) {
    // Takes in time in milliseconds and return either Hours or min:sec
    if (milliseconds) {
        let sec = Math.floor(milliseconds / 1000);
        let min = Math.floor(sec / 60);
        let hr = Math.floor(min / 60);

        sec = sec % 60;
        min = min % 60;
        if (isTrack) {
            // return if you are calculating for a single track
            return `${padTo2Digits(min)}:${padTo2Digits(sec)}`;
        } else {
            // return if you are calculating for a complied work (album, playlists)
            return hr === 0 ? `${min} min ${sec} sec` : `${hr} hr`
        }
    }
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

export function calBodyOfWorkDuration(bod, from) {
    // calculate the duration of a playlist

    let items = bod?.tracks?.items
    if (from === 'album') items = items?.map(track => ({ track: track })) // structure like a playlist data structure
    if (items) {
        let totalDurationInMilliseconds = 0;
        items.forEach(({ track }) => {
            totalDurationInMilliseconds += track?.duration_ms ? track?.duration_ms : 0
        })
        const duration = convertMsToTime(totalDurationInMilliseconds, false);
        return duration
    }
}

export function getCorrectDate(trackAddedDate) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const todayDate = new Date();
    const date = new Date(trackAddedDate);
    // To calculate the time difference of two dates
    const differenceInTime = todayDate.getTime() - date.getTime();

    // To calculate the no. of days between two dates
    const differenceInDays = Number((differenceInTime / (1000 * 3600 * 24)).toFixed())

    if (differenceInDays > 30) {
        const day = date.getDate();
        const month = months[date.getMonth()]
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`
    } else if (differenceInDays === 0) {
        return 'Today'
    } else if (differenceInDays === 1) {
        return 'Yesterday'
    }
    else {
        return `${differenceInDays} days ago`
    }
}