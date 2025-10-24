import React from 'react'
import { assets } from '../assets/assets'
const Footer = () => {
  return (
    <div className='flex items-center justify-between gap-4 py-3 mt-20'>

      <img src={assets.logo} alt='Imagify Logo' className='h-8 md:h-10'/>

      <p className='flex-1 border-l border-gray-400pl-4 text-sm
      text-gray-500 max-sm:hidden'>Copyright @Shlok.dev | All rights reserved.</p>

      <div>
        <img src={assets.facebook_icon} alt='Facebook Icon' width={35} />
        <img src={assets.twitter_icon} alt='Twitter Icon' width={35} />
        <img src={assets.instagram_icon} alt='Instagram Icon' width={35} />
      </div>
    </div>
  )
}

export default Footer
