import React from 'react'
import HeaderNav from './HeaderNav'
import Loading from './Loading'

function PageLoading() {
    return (
        <div className='PAGE-LOADING-WR w-full  text-white'>
            <div className='PAGE-LOADING h-full'>
                <HeaderNav color={'red'} gsapTrigger={'.PAGE-LOADING'} gsapScroller={'.PAGE-LOADING-WR'} />
                <Loading
                    size={100}
                    type={'Audio'}
                    color={"#333333"}
                    style={" h-full flex justify-center items-center"}
                />
            </div>
        </div>
    )
}

export default PageLoading