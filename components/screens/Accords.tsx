"use client"

import { useState, useEffect } from "react"
import { ArrowRight, ArrowUpRight, ArrowDownRight } from "lucide-react"

export default function ProgrammingCourse() {
  // State to track which accordions are open
  const [openAccordions, setOpenAccordions] = useState<number[]>([0]) // First one open by default

  // Topics data with descriptions
  const topics = [
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

  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Topics2 data with additional FAQ content
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
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
 
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/videos/faq`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setVideoData(data)
      } catch (err) {
        console.error('Error fetching video data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch video data')
      } finally {
      
      }
    }

    fetchVideoData()
  }, [])
  interface VideoData {
    type: string
    url: string
    updated_at: string
  }
  
  // Function to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  }
   const embedUrl = videoData ? getYouTubeEmbedUrl(videoData.url) : ''
  return (
    <div className="flex justify-center mx-auto  py-6 pb-4 items-center px-8 ">
  <div className="max-w-6xl w-full flex flex-wrap gap-2">
    {/* Left Column - Video Section */}
    <div className="flex-1 min-w-[300px] space-y-2 pt-4">
      <div className="justify-center ">
        {/* Large YouTube Embed - Visible only on large screens */}
        <iframe
          // src={embedUrl}
          src="https://www.youtube.com/embed/9PdPAza1zEg"
          title="OnlyCNCs Getting started"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="w-[450px] h-[330px] aspect-video hidden lg:block"
        ></iframe>

        {/* Small YouTube Embed - Visible only on small screens */}
        <iframe
          // src={embedUrl}
          src="https://www.youtube.com/embed/9PdPAza1zEg"
          title="OnlyCNCs Getting started"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="w-[330px] h-[200px] aspect-video justify-self-center lg:hidden sm:block"
        ></iframe>
      </div>

      <div className="flex gap-2 text-[#004146]">
        <span className="text-xs font-bold">#OnlyCNCs</span>
    
      </div>

     

  
    </div>

    {/* Right Column - Topics List */}
    <div className="flex-1 min-w-[300px] space-y-4 pt-4">
      

      <div className="space-y-6 ">
        {/* Accordion Topics */}
        {topics.map((topic, index) => (
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
  </div>
</div>

  )
}

