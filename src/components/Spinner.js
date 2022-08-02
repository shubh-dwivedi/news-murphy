import loading from './loading-waiting.gif'
import React from 'react'

export default function Spinner(){
    return (
      <div className='text-center py-5'><img src={loading} alt="loading news" /></div>
    )
}
