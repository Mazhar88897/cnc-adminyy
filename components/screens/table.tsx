import { X } from "lucide-react"
import Image from "next/image"

export default function Table() {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center text-center gap-8 mx-auto py-2">
      {/* Left Card: Other platforms */}
      <div className="bg-white border-2 border-black rounded-xl p-6 flex-1 min-w-[260px] max-w-[350px] shadow-md">
        <div className="text-2xl font-bold mb-6 text-center">Other platforms</div>
        <ul className="space-y-5 font-semibold text-black">
          <li className="flex items-center gap-3">
            <X className="text-[#03BFB5]"  width={22} height={22} strokeWidth={3}/>
            Paid For
           
          </li>
          <li className="flex items-center gap-3">
          <X className="text-[#03BFB5]"  width={22} height={22} strokeWidth={3}/>
            For advanced users
          </li>
          <li className="flex items-center gap-3">
          <X className="text-[#03BFB5]"  width={22} height={22} strokeWidth={3}/>
            Not for desktop machines
          </li>
          <li className="flex items-center gap-3">
          <X className="text-[#03BFB5]"  width={22} height={22} strokeWidth={3}/>
            Over complicated
          </li>
          <li className="flex items-center gap-3">
          <X className="text-[#03BFB5]"  width={22} height={22} strokeWidth={3}/>
            Doesn&apos;t consider your setup
          </li>
        </ul>
      </div>

      {/* Right Card: ONLYCNC'S */}
      <div className="bg-[#003C3C] rounded-xl p-6 flex-1 min-w-[260px] max-w-[350px] shadow-md text-white flex flex-col">
        <div className="text-2xl font-bold mb-6 text-center">
          <span className="text-white">ONLY</span>
          <span className="text-[#03BFB5]">CNC&apos;S</span>
           {/* <div className=" p-2 inline-block rounded">
              <Image src="/only-cnc.svg" alt="Only CNCs Logo" width={150} height={50} className="h-auto" />
            </div> */}
        </div>
        <ul className="space-y-5 font-semibold">
          <li className="flex items-center gap-3">
            <Image src="/square-check-big.svg" alt="Check" width={22} height={22} />
            Free
          </li>
          <li className="flex items-center gap-3">
            <Image src="/square-check-big.svg" alt="Check" width={22} height={22} />
            For beginners
          </li>
          <li className="flex items-center gap-3">
            <Image src="/square-check-big.svg" alt="Check" width={22} height={22} />
            For desktop CNC machines
          </li>
          <li className="flex items-center gap-3">
            <Image src="/square-check-big.svg" alt="Check" width={22} height={22} />
            Only 3 steps
          </li>
          <li className="flex items-center gap-3">
            <Image src="/square-check-big.svg" alt="Check" width={22} height={22} />
            For your machine and spindle
          </li>
        </ul>
      </div>
    </div>
  )
}
