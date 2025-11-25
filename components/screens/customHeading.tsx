interface TextComponentProps {
  color: "black" | "white"
  heading1: string
  heading2: string
  heading3?: string
  subheading: string
}

export default function Heading({ color, heading1, heading2, subheading }: TextComponentProps) {
  const textColorClass = color === "white" ? "text-white" : "text-black"

  return (
    <div className="text-center w-full items-center justify-center space-y-2">
      <h1 className={`text-xl sm:text-4xl mb-2 font-bold ${textColorClass}`}>
        <span className="text-[#03BFB5]">{heading1}</span> <span>{heading2}</span>
      </h1>
      <p className={`text-sm px-6 sm:text-lg mt-2 font-bold md:text-mg max-w-7xl mx-auto ${textColorClass}`}>{subheading}</p>
    </div>
  )
}
export  function HeadingReverse({ color, heading1, heading2, heading3, subheading }: TextComponentProps) {
  const textColorClass = color === "white" ? "text-white" : "text-black"

  return (
    <div className="text-center w-full items-center justify-center space-y-2">
      <h1 className={`text-xl sm:text-4xl mb-2 font-bold ${textColorClass}`}>
        <span >{heading1}</span> <span className="text-[#03BFB5]" >{heading2}</span><span >{heading3}</span> 
      </h1>
      <p className={`text-sm sm:text-lg mt-2 font-bold px-6 md:text-mg max-w-7xl mx-auto ${textColorClass}`}>{subheading}</p>
    </div>
  )
}


