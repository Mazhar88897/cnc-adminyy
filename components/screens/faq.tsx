"use client"

import { useState } from "react"
import { ArrowRight, ArrowUpRight, ArrowDownRight } from "lucide-react"

export default function ProgrammingCourse() {
  // State to track which accordions are open
  const [openAccordions, setOpenAccordions] = useState<number[]>([0]) // First one open by default
  const [openAccordions2, setOpenAccordions2] = useState<number[]>([0])
  // Topics data with descriptions
  const topics1 = [
    {
      title: "How do I use the app?",
      description:
        "We've made it really simple - select your machine model and spindle/router, material, and bit. We'll instantly calculate optimal feed rates, spindle speeds, and depth of cut.",
    },
    {
      title: "What machines do you support?",
      description:
        "We specialize in desktop CNCs, including popular models from Sainsmart, FoxAlien, and similar desktop machines. More are being added regularly.",
    },
    {
      title: "Is this for beginners or advanced users?",
      description:
        "Both. Beginners get reliable default values, while experienced users can fine-tune settings to match their workflow.",
    },
    {
      title: "What materials are supported?",
      description:
        "Wood (hard and soft), MDF, plywood (hard and soft), acrylic and aluminium. We hope to support more materials soon.",
    },
    {
      title: "What if I find the settings to fast or too slow?",
      description:
        "We've got you covered. You can tune the settings to your machine by adjusting the multiplier. You can also feedback your new settings to us to help improve the accuracy.",
    },
  ]

  const topics2 = [
    {
      title: "What if my machine is not listed?",
      description:
        "We're regularly adding new machines but if yours is not available, select one that is similar and this will give you close data.",
    },
    {
      title: "What if my Bit is not listed?",
      description:
        "We've tried to cover the most common bits but are adding more. Try selecting the closest bit type.",
    },
    {
      title: "Does this work with aftermarket spindles or upgrades?",
      description:
        "Yes! You can select your spindle or router to get accurate recommendations, whether you're using the stock motor or an upgraded VFD spindle.",
    },
    {
      title: "How accurate are the recommendations?",
      description:
        "Our settings are based on real-world testing and user feedback — optimized specifically for desktop CNCs. They are conservative but users can increase the speed as their confidence grows.",
    },
    {
      title: "What if I change my machine or spindle?",
      description:
        "That's OK, we all like to test new equipment! Simply update your machine and spindle selection in the app to get new recommendations tailored to your setup.",
    },
  ]

  // Toggle accordion open/close
  const toggleAccordion = (index: number) => {
    setOpenAccordions((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }
  const toggleAccordion2 = (index: number) => {
    setOpenAccordions2((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="flex justify-center mx-auto  py-12 pb-18 items-center px-8 ">
  <div className="max-w-6xl w-full flex flex-wrap gap-8">
    {/* Left Column - Video Section */}
    <div className="flex-1 min-w-[300px] space-y-4">
      

      <div className="space-y-6">
        {/* Accordion Topics */}
        {topics1.map((topic, index) => (
          <div key={index}>
            <div
              className="flex items-center justify-between pb-3 border-b border-black cursor-pointer"
              onClick={() => toggleAccordion(index)}
            >
              <h3 className="text-sm font-semibold text-gray-800">{topic.title}</h3>
              {openAccordions.includes(index) ? (
                <ArrowDownRight className="h-5 w-5 text-[#03BFB5] transition-transform duration-200 scale-x-[-1]" />
              ) : (
                <ArrowUpRight className="h-5 w-5 text-gray-600 transition-transform duration-200" />
              )}
            </div>
            <div
              className={`my-2 text-gray-500 overflow-hidden transition-all duration-300 ${
                openAccordions.includes(index) ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-xs py-2">{topic.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* Right Column - Topics List */}
    <div className="flex-1 min-w-[300px] space-y-4">
      

      <div className="space-y-6">
        {/* Accordion Topics */}
        {topics2.map((topic, index) => (
          <div key={index}>
            <div
              className="flex items-center justify-between pb-3 border-b border-black cursor-pointer"
              onClick={() => toggleAccordion2(index)}
            >
              <h3 className="text-sm font-semibold text-gray-800">{topic.title}</h3>
              {openAccordions2.includes(index) ? (
                <ArrowDownRight className="h-5 w-5 text-[#03BFB5] transition-transform duration-200 scale-x-[-1]" />
              ) : (
                <ArrowUpRight className="h-5 w-5 text-gray-600 transition-transform duration-200" />
              )}
            </div>
            <div
              className={`my-2 text-gray-500 overflow-hidden transition-all duration-300 ${
                openAccordions2.includes(index) ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-xs py-2">{topic.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

  )
}

