import { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Result = () => {

const navigate = useNavigate();
const [image, setImage] = useState(assets.sample_img_1);
const [isImageLoaded, setIsImageLoading] = useState(false);
const [loading, setLoading] = useState(false);
const [input, setInput] = useState('');

const {generateImage, token, credit} = useContext(AppContext);

const onSubmitHandler = async (e) => {
  e.preventDefault();

  if (!token) {
            toast.error('Please login first');
            return;
        }

        if (!input.trim()) {
            toast.error('Please enter a prompt');
            return;
        }

        if (credit < 1) {
            toast.error('Insufficient credits');
            navigate('/buy');
            return;
        }

        try {
            setLoading(true);
            const result = await generateImage(input);

            if (!result) {
              toast.error('Image generation failed. Please try again.');
              return;
            }

            let imageUrl = null;
      if (typeof result === 'string') {
        imageUrl = result;
      } else if (result.success) {
        imageUrl = result.imageUrl || result.resultImage || result.imageurl || null;
      } else {
        if (result.creditBalance === 0) {
          toast.error(result.message || 'Insufficient credits');
          navigate('/buy-credits');
          return;
        }
        toast.error(result.message || 'Image generation failed');
        return;
      }

      if (imageUrl) {
        setImage(imageUrl);
        setIsImageLoading(true);
      } else {
        toast.error('No image returned from server');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }


  return (
    <form
    onSubmit={onSubmitHandler}
    className='flex flex-col min-h-[90vh] justify-center items-center'>
    <div>
      <div className='relative'>
        <img src={image} alt='Generated Sample' className='max-w-sm rounded'/>

        <span className={`absolute bottom-0 left-0 h-1 bg-blue-500 
          ${loading ? 'w-full transition-all duration-[10s]' : 'w-0'}`}></span>
      </div>
      <p className={!loading ? 'hidden' : ''}>Loading...</p>
    </div>

{!isImageLoaded && 
    <div className='flex w-full max-w-xl bg-neutral-500 text-white
    text-sm p-0.5 mt-10 rounded-full'>

      <input 
      onChange={e => setInput(e.target.value)} value={input}
      type="text" placeholder='Describe what you want to generate'
      className='flex-1 bg-transparent outline-none ml-8
      max-sm:w-20  placeholder-color' />

      <button type='submit'
        disabled={loading}
        className='bg-zinc-900 px-10 sm:px-16 py-3 rounded-full disabled:opacity-50'>
        {loading ? 'Generating...' : 'Generate'}
      </button>
    </div>
    }

{isImageLoaded &&
    <div className='flex gap-2 flex-wrap justify-center text-white
    text-sm p-0.5 mt-10 rounded-full'>
      <p onClick={() => { setIsImageLoading(false); setImage(assets.sample_img_1); }}
      className='bg-transparent border border-zinc-900
      text-black px-8 py-3 rounded-full cursor-pointer'>Generate Another</p>
      <a href={image || '#'} download="generated-image.png" className='bg-zinc-900 px-10 py-3
      rounded-full cursor-pointer'>Download</a>
    </div>
}

    </form>

  )
}

export default Result
