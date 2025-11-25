"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="w-full  p-3 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex flex-col">
          <div className="relative w-[60px] sm:w-[120px] h-[60px]">
            
              <Image src="/logo-b.svg" alt="Logo" fill className="object-contain" />
            </div>
               </Link>
               
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 md:flex">
          <Link href="/main/about" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            About
          </Link>
          <Link href="/main/contact" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Contact
          </Link>
          <Link href="/main/faq" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            FAQ
          </Link>
          <Link href="/main/reviews" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Reviews
          </Link>
          <Link href="/auth/sign-in" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Login
          </Link>
           <Link        href="/auth/sign-up" className="bg-gray-900 p-1 px-3 text-white font-semibold rounded-mid hover:bg-gray-800 " onClick={() => setIsOpen(false)}>
                Create an Account
              </Link>  </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] md:w-[300px] max-w-[80vw]">
            <div>
             
            
              <Image src="/logo-b.svg" height={60} width={60} alt="Logo" />
           
            </div>
            <nav className="flex flex-col space-y-4 pt-10">
              <Link
                href="/main/about"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/main/contact"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/main/faq"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                FAQ
              </Link>
              <Link
                href="/main/reviews"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                Reviews
              </Link>
              <Link
                href="/auth/sign-in"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              
             <Link        href="/auth/sign-up" className="bg-gray-900 text-center p-1 px-3 text-white font-semibold rounded-mid hover:bg-gray-800 " onClick={() => setIsOpen(false)}>
                Create an Account
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
