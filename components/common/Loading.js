import { Audio, Rings } from 'react-loader-spinner'
import React from 'react'

function Loading(props) {
    const { size, color, style, type } = props
    if (type === 'Rings') {
        return <div className={style}>
            <Rings
                color={color}
                height={size}
                width={size}
            />
        </div>
    } else if (type === 'Audio') {
        return <div className={style}>
            <Audio
                color={color}
                height={size}
                width={size}
            />
        </div>
    }



}

export default Loading
