import React from 'react'
import { assets } from '../assets/assets'

const Description = () => {
  return (
    <div className='flex flex-col items-center justify-center
    my-24 p-6 md:px-28'>
        <h1 className='text-3xl sm:text-4xl font-semibold mb-2'>Create AI Images</h1>
        <p className='text-gray-500 mb-8'>Turn your imagination into visuals</p>

        <div className='flex flex-col gap-5 md:gap-14 md:flex-row items-center'>
            <img src={assets.sample_img_1} alt='Description of image 1' className='w-80 xl:w-96 rounded-lg shadow-md'/>
            <div>
              <h2 className='text-3xl font-medium max-w-lg mb-4'>Introducing the AI-powered Image to Text Generator</h2>
              <p className='text-gray-600 mb-4'>Transform your ideas into stunning visuals with our advanced AI technology.</p>
              <p className='text-gray-600'>Experience the future of creativity with our cutting-edge tool.</p>
            </div>
        </div>
    </div>  )
}

export default Description
