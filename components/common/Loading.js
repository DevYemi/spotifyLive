import Loader from 'react-loader-spinner'
import React from 'react'

function Loading(props) {
    const { size, color, style, type } = props
    if (type === 'Rings') {
        return <div className={style}>
            <Loader
                color={color}
                type={'Rings'}
                height={size}
                width={size}
            />
        </div>
    } else if (type === 'Audio') {
        return <div className={style}>
            <Loader
                color={color}
                type={'Audio'}
                height={size}
                width={size}
            />
        </div>
    }



}

export default Loading
