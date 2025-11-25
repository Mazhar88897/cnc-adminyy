import React from 'react'

import  {ButtonsContent} from '@/components/pages/buutons'
const content = () => {
  return (
    <div  className="w-full  sm:h-full lg:h-[70vh] flex flex-col justify-center items-center p-8 sm:bg-white lg:bg-[#FDFBFB]">
      <div className=" h-full  lg:pt-3 sm:pt-3 max-w-7xl  mx-auto flex flex-col-reverse md:flex-row gap-8 items-center">

  <div className=' w-full mx-0 md:mx-10'>
    <h1 className="text-lg   sm:mt-20 md:text-2xl lg:text-4xl  font-bold ">
   <span className='text-[#03BFB5]'>Dial in your desktop CNC router</span> - Easier cutting starts here
    </h1>
    <h1 className="text-lg  mt-5 sm:mt-5 md:text-2xl lg:text-3xl  font-bold ">
    <span>Optimized feeds and speeds for desktop CNC machines.</span> <span  className='text-[#03BFB5]'>Just
    select and cut.</span> 
    </h1>
 <div className='my-16'> <ButtonsContent/></div>
   
    <h1 className='text-2xl mt-20 sm:mt-26 font-bold text-black '>
    Take the guesswork out of CNC. Whether you&apos;re woodworker
carving hardwood with a FoxAlien or cutting acrylic on your
Sainsmart Genmitsu, our feeds and speeds app gives you
machine-specific, material-aware, bit-smart recommendations in
seconds. Minimising broken bits, burnt wood, or wasted stock
— just clean, confident cuts every time.    </h1>
    
   
    
  </div>
</div></div>
  )
}

export default content