'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function AdminTopbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Machines', href: '/admin/machines' },
    { name: 'Spindles', href: '/admin/spindles' },
    { name: 'Materials', href: '/admin/material' },
    { name: 'Bits', href: '/admin/bits' },
    { name: 'Settings', href: '/admin/setting' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Admins', href: '/admin/admins' },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="w-full bg-[#004146] border-b border-[#005a61]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <img src="/only-cnc.svg" alt="OnlyCNCs" className="h-8 w-auto" />
            <span className="text-white font-semibold text-sm sm:text-base hidden sm:block">
              Admin Panel
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                  isActive(item.href)
                    ? 'bg-[#005a61] text-white'
                    : 'text-gray-300 hover:bg-[#005a61] hover:text-white'
                }`}
              >
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-[#004146] border-t border-[#005a61]">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center gap-3 ${
                    isActive(item.href)
                      ? 'bg-[#005a61] text-white'
                      : 'text-gray-300 hover:bg-[#005a61] hover:text-white'
                  }`}
                >
               
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
