"use client"

import { useState, useEffect } from "react"
import { Settings, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navLinks = [
  { name: "To the Start", href: "/dashboard"  },
  { name: "How to use", href: "/dashboard/how-to-use" },
  { name: "Contact us", href: "/dashboard/contact-us" },
  { name: "More CNC resources", href: "/dashboard/resources" },
]

interface TopBarProps {
  settingsOpen: boolean
  setSettingsOpen: (open: boolean) => void
}

export default function TopBar({ settingsOpen, setSettingsOpen }: TopBarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed bg-[#004146] top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}
    >
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center">
          <div className="p-2">
            <Image src="/only-cnc.svg" alt="Logo" width={100} height={100} />
          </div>
        </Link>

        <nav className="flex items-center space-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-3 py-1 rounded-md text-lg transition-colors ${
                pathname === link.href
                  ? "bg-[#D1D1D1] font-bold text-[#004851]"
                  : "text-white hover:bg-white/10 font-normal"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <button
          className="p-2 rounded-full hover:bg-white/10"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings className="h-6 w-6 text-white" />
          <span className="sr-only">Settings</span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center justify-between px-4 py-2">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-white">
          <Menu className="h-8 w-8" />
          <span className="sr-only">Open menu</span>
        </button>

        <Link href="/dashboard" className="flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="relative w-[180px] h-[80px]">
              <Image src="/only-cnc.svg" alt="Logo" fill className="object-contain" />
            </div>
            
          </div>
        </Link>

        <button 
          className="p-2 text-white"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings className="h-8 w-8" />
          <span className="sr-only">Settings</span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 md:hidden">
          <div className="flex flex-col h-full bg-[#004851] w-4/5 max-w-sm p-5">
            <div className="flex justify-between items-center mb-8">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Image src="/only-cnc.svg" alt="Logo" width={120} height={50} />
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white">
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-md text-lg ${
                    pathname === link.href ? "bg-white font-bold text-[#004851]" : "text-white hover:bg-white/10"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
