import React from 'react'
import { assets, testimonialsData } from '../assets/assets'

const Testimonials = () => {
  return (
    <div className='flex flex-col items-center justify-center
    my-20 py-12 md:px-28'>
        <h1 className='text-3xl sm:text-4xl font-semibold mb-6'>Customer Testimonials   </h1>
        <p className='text-gray-500 mb-8'>What our users are saying</p>

        <div className='flex flex-wrap gap-6'>
            {testimonialsData.map((testimonial, index) => (
                <div key={index} className='bg-white shadow-md rounded-lg p-6 w-80'>
                    <img src={testimonial.image} alt={testimonial.name} className='rounded-full w-14'/>
                    <h2 className='text-xl font-semibold mt-3'>{testimonial.name}</h2>
                    <p className='text-gray-500 mb-4'>{testimonial.role}</p>
                    <div className='flex mb-4'>
                        {Array(testimonial.stars).fill().map((items, index) => (
                            <img key={index} src={assets.rating_star} alt='star'/>
                        ))}
                    </div>
                    <p className='text-center text-sm'>{testimonial.text}</p>

                </div>
            ))}
        </div>
    </div>
  )
}

export default Testimonials
