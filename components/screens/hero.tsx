import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Hero = () => {
  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Header.webp"
          alt="CNC Machine cutting wood"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for better text readability */}
       
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Main Content - Top */}
        <div className="flex-1 flex items-center">
          <div className="w-full justify-center items-center">
            <div className='max-w-7xl py-6 px-4 sm:px-6 lg:px-24'>
               {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight break-words">
              DIAL IN YOUR DESKTOP CNC
            </h1>
            
            {/* Subtitle */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-white mb-8 font-medium">
              Easier cutting begins here
            </h2>

            {/* Call to Action Button */}
            <div className="mb-12">
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  className="bg-[#03BFB5] hover:bg-[#03BFB5]/90 text-white font-bold px-8 py-4 text-lg rounded-[20px] transition-colors duration-200 shadow-lg"
                >
                  Get Started
                </Button>
              </Link>
            </div>
            </div>
          </div>
        </div>

        {/* Sponsor Section - Bottom */}
        <div className="px-4 w-full relative sm:px-6 lg:px-24 pb-8">
        <div className="absolute inset-0 bg-black/80"></div>
          <div className="relative">
            <div className="relative z-10 p-4 ">
              <div>
              <p className="text-white text-md sm:text-md mb-4 opacity-90 text-center">
                Brought to you for FREE thanks our sponsors:
              </p>
              <div className="flex flex-wrap gap-4 sm:gap-6 justify-center ">
              <div className="bg-white/10 backdrop-blur-sm px-2 py-2 rounded-xl text-gray-400 font-bold text-3xl ">
                  SPONSOR 1
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-2 py-2 rounded-xl text-gray-400 font-bold text-3xl ">
                  SPONSOR 2
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-2 py-2 rounded-xl text-gray-400 font-bold text-3xl ">
                  SPONSOR 3
                </div>
              </div>
              </div>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero

// import React from 'react'

// import {ButtonsContent} from '@/components/pages/buutons'
// const hero = () => {
//   return (
//     <div  className="w-full sm:h-full lg:h-[90vh] justify-center  p-8 sm:bg-white lg:bg-[#FDFBFB]">
//       <div className=" h-full  lg:pt-3 sm:pt-3 max-w-7xl  mx-auto flex flex-col-reverse md:flex-row gap-8 items-center">

//   <div className=' w-full mx-0 md:mx-10'>
//   <div className="flex flex-col mt-8 items-start sm:items-center sm:justify-center ">
//       <h1 className="text-2xl sm:text-4xl md:text-[2.6rem] mb-2 sm:mb-4  font-bold ">
//      <span className='text-[#03BFB5]'>Dial in your desktop CNC </span> 
//       </h1>
//       <h1 className="text-2xl sm:text-4xl mb-6 md:text-[2.6rem]   font-bold ">
//       Easier cutting starts here
//       </h1>
//         <h1 className='text-xl sm:text-2xl    mt-6 sm:mt-12 md:text-2xl lg:text-4xl  font-bold text-black'>Optimized feeds and speeds for your hobby CNC machines.</h1> 
//         <h1 className='text-xl sm:text-2xl    mt-4 sm:mt-4 md:text-2xl lg:text-4xl  font-bold text-[#03BFB5]'>Just select and cut.</h1> 

     
//       </div>

//  <div className='my-16'> <ButtonsContent/></div>
   
//     <h1 className='text-xl sm:text-3xl mt-20 sm:mt-26  text-black font-bold'>
//     Take the guesswork out of CNC. Whether you&apos;re carving hard
// wood or cutting acrylic on your machine, our feeds and speeds 
// app gives you machine-specific recommendations in seconds. 
// Confident cuts every time. </h1>
    
   
    
//   </div>
// </div></div>
//   )
// }

// export default hero

