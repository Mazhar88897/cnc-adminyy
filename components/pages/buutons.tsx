// import Link from "next/link"
// import { ArrowRightToLine } from "lucide-react"

// export default function Buttons() {
//   return (
//     <div className="flex flex-row flex-wrap sm:flex-nowrap w-full items-center justify-center gap-2 sm:gap-4 max-w-3xl mx-auto p-2 sm:p-4">
//       <Link
//         href="#"
//         className="flex items-center justify-center h-10 sm:h-12 px-4 sm:px-6 rounded-[20px] bg-[#00BFB3] text-xs sm:text-base text-white font-medium hover:bg-[#00ABA0] transition-colors"
//       >
//         Get Started
//       </Link>

//       <Link
//         href="#"
//         className="flex items-center border border-white justify-center h-10 sm:h-12 px-4 sm:px-6 rounded-[20px] bg-[#004851] text-xs sm:text-base text-white font-medium hover:bg-[#003840] transition-colors"
//       >
//         Buy now
//       </Link>

//       <Link
//         href="#"
//         className="flex items-center justify-center h-10 sm:h-12 px-4 sm:px-6 rounded-[20px] border-2 border-black bg-white text-xs sm:text-base text-black font-medium hover:bg-gray-50 transition-colors"
//       >
//         Sign Up <ArrowRightToLine className="ml-2 h-3.5 sm:h-4 w-3.5 sm:w-4" />
//       </Link>
//     </div>
//   )
// }
import Link from "next/link"
import { ArrowRightToLine } from "lucide-react"

export default function Buttons() {
  return (
    <div className="flex flex-row flex-wrap sm:flex-nowrap w-full items-center justify-center gap-2 sm:gap-4 max-w-3xl mx-auto p-2 sm:p-4">
      <Link
        href="/auth/sign-in"
        className="flex items-center justify-center  px-6 font-bold sm:px-6 rounded-[20px] bg-[#00BFB3] text-xs sm:text-base text-white  hover:bg-[#00ABA0] transition-colors"
      >
        Get Started
      </Link>

      <Link
        href="/auth/sign-in"
        className="flex items-center border border-white justify-center h-10 sm:h-12 px-4 sm:px-6 rounded-[20px] bg-[#004851] text-xs sm:text-base text-white font-medium hover:bg-[#003840] transition-colors"
      >
        Buy now
      </Link>

      <Link
        href="#"
        className="flex items-center justify-center h-10 sm:h-[3.25rem] px-6 sm:px-6 rounded-[20px] border-2 border-black bg-white text-xs sm:text-lg text-black font-bold hover:bg-gray-50 transition-colors"
      >
        Sign Up <ArrowRightToLine className="ml-2 h-3.5 sm:h-4 w-3.5 sm:w-4" />
      </Link>
    </div>
  )
}




export function ButtonsFAQ() {
  return (
    <div className="flex flex-row flex-wrap sm:flex-nowrap w-full items-center justify-center gap-2 max-w-3xl mx-auto p-2 ">
      {/* <Link
        href="#"
        className="flex items-center justify-center h-10 sm:h-[3.25rem] px-6 font-bold sm:px-6 rounded-[20px] bg-[#00BFB3] text-xs sm:text-base text-white  hover:bg-[#00ABA0] transition-colors"
      >
        Sign Up
      </Link> */}

      <Link
        href="/main/faq"
        className="flex items-center border border-white justify-center h-10 sm:h-[2.5rem] px-4 sm:px-6 rounded-[20px] bg-[#004851] text-xs sm:text-base text-white font-medium hover:bg-[#003840] transition-colors"
      >
        More FAQs
      </Link>

      <Link
        href="/auth/sign-up"
        className="flex items-center justify-center h-10 sm:h-[2.5rem] px-6 sm:px-6 rounded-[20px] border-2 border-[#004851] bg-white text-xs sm:text-lg text-[#004851] font-bold hover:bg-gray-50 transition-colors"
      >
        Sign Up 
      </Link>
    </div>
  )
}

export function ButtonsTable() {
  return (
    <div className="flex flex-row flex-wrap sm:flex-nowrap w-full items-center justify-center gap-2 sm:gap-4 max-w-3xl mx-auto p-2 sm:p-4">
      {/* <Link
        href="#"
        className="flex items-center justify-center h-10 sm:h-[3.25rem] px-6 font-bold sm:px-6 rounded-[20px] bg-[#00BFB3] text-xs sm:text-base text-white  hover:bg-[#00ABA0] transition-colors"
      >
        Sign Up
      </Link> */}

      <Link
        href="/main/faq"
        className="flex items-center border border-white justify-center h-10 sm:h-[2.5rem] px-4 sm:px-6 rounded-[20px] bg-[#004851] text-xs sm:text-base text-white font-medium hover:bg-[#003840] transition-colors"
      >
        Learn More
      </Link>

      <Link
        href="/auth/sign-up"
        className="flex items-center justify-center h-10 sm:h-[2.5rem] px-6 sm:px-6 rounded-[20px] border-2 border-[#004851] bg-white text-xs sm:text-lg text-[#004851] font-bold hover:bg-gray-50 transition-colors"
        >
          Sign Up 
        </Link>
    </div>
  )
}

export function ButtonsContent() {
  return (
    <div className="flex flex-row flex-wrap sm:flex-nowrap w-full items-center justify-center gap-2 sm:gap-4 max-w-3xl mx-auto p-2 sm:p-4">
      <Link
        href="/auth/sign-in"
        className="flex items-center justify-center h-10 sm:h-[2.5rem] px-6 font-bold sm:px-6 rounded-[20px] bg-[#00BFB3] text-xs sm:text-base text-white  hover:bg-[#00ABA0] transition-colors"
      >
       Get Started
      </Link>

      {/* <Link
        href="/main/faq"
        className="flex items-center border border-white justify-center h-10 sm:h-12 px-4 sm:px-6 rounded-[20px] bg-[#004851] text-xs sm:text-base text-white font-medium hover:bg-[#003840] transition-colors"
      >
        More FAQs
      </Link> */}

      <Link
        href="/main/about"
        className="flex items-center justify-center h-10 sm:h-[2.5rem] px-6 sm:px-6 rounded-[20px] border-2 border-black bg-white text-xs sm:text-lg text-black font-bold hover:bg-gray-50 transition-colors"
      >
       Find Out More
      </Link>
    </div>
  )
}

