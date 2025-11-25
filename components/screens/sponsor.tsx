import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Sponsor() {
  return (
    <div className="relative w-full min-h-[400px] flex flex-col items-center justify-center px-4 py-8">
      {/* Background Image */}
      <Image src="/cnc-background.jpeg" alt="CNC Machine Background" fill className="object-cover" priority />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8 max-w-4xl mx-auto">
        {/* Header Text */}
        <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold">
          OnlyCNC&apos;s is brought to you for <span className="text-[#03BFB5] ">FREE</span> thanks to our sponsors
        </h1>

        {/* Logo Grid */}
        <div className="flex flex-col items-center space-y-4">
          {/* Top Row - 2 larger logos */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-48 h-20 md:w-56 md:h-24 relative overflow-hidden">
              <Image src="/only-cnc.svg" alt="Sponsor Logo 1" fill className="p-1 object-contain" />
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-48 h-20 md:w-56 md:h-24 relative overflow-hidden">
              <Image src="/only-cnc.svg" alt="Sponsor Logo 2" fill className="p-1 object-contain" />
            </div>
          </div>

          {/* Bottom Row - 4 smaller logos */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-6">
            <div className="bg-white/10  backdrop-blur-sm rounded-lg p-3 w-28 h-16 md:w-32 md:h-18 relative overflow-hidden">
              <Image src="/only-cnc.svg" alt="Sponsor Logo 3" fill className="p-1 object-contain" />
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 w-28 h-16 md:w-32 md:h-18 relative overflow-hidden">
              <Image src="/only-cnc.svg" alt="Sponsor Logo 4" fill className="p-1 object-contain" />
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 w-28 h-16 md:w-32 md:h-18 relative overflow-hidden">
              <Image src="/only-cnc.svg" alt="Sponsor Logo 5" fill className="p-1 object-contain" />
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 w-28 h-16 md:w-32 md:h-18 relative overflow-hidden">
              <Image src="/only-cnc.svg" alt="Sponsor Logo 6" fill className="p-1 object-contain" />
            </div>
          </div>
        </div>

        {/* Learn More Button */}
        <Link href="/main/terms" className="bg-[#03BFB5] hover:bg-[#03BFB5]/80 text-black  font-bold px-8 py-1 rounded text-lg transition-colors duration-200">
          Learn More
        </Link>
      </div>
    </div>
  )
}
