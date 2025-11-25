import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#004146] text-white py-10 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Left Column - Logo and Text */}
          <div className="space-y-4 md:col-span-2">
            <div className=" p-2 inline-block rounded">
              <Image src="/only-cnc.svg" alt="Only CNCs Logo" width={150} height={50} className="h-auto" />
            </div>
            <div>
            <p className="text-sm max-w-lg mb-4">
            By makers, for makers. 
An easy to use, free 
platform giving you the 
feeds and speeds to help 
complete your projects 
sucessfully. Brought 
to you for free by our 
sponsors.  </p>
            </div>
            <Link href="/auth/sign-up" className="mt-4 inline-block">
              <button className="bg-white text-[#004851] text-md font-bold py-2 font-bold px-8 rounded-[20px] hover:bg-gray-100 transition-colors">
              Sign up now
              </button>
            </Link>
          </div>

          {/* Middle Column - Links */}
          <div className="space-y-4 md:col-span-1">
            <h3 className="text-2xl font-semibold mb-6">Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/main/about" className="hover:underline">
                About
              </Link>
              <Link href="/main/contact" className="hover:underline">
                Contact
              </Link>
              <Link href="/main/faq" className="hover:underline">
                FAQ
              </Link>
              <Link href="/main/reviews" className="hover:underline">
                Reviews
              </Link>
              <Link href="/auth/sign-in" className="hover:underline">
                Sign in
              </Link>
            
              <Link href="/auth/sign-up" className="hover:underline">
                Create Account
              </Link>
              <Link href="/main/privacy" className="hover:underline">
                Privacy Policy
              </Link>
              <Link href="/main/terms" className="hover:underline">
                Terms and Conditions
              </Link>
            </nav>
          </div>

          {/* Right Column - Social Media */}
          <div className="space-y-4 md:col-span-1">
            <h3 className="text-2xl font-semibold mb-6">Social Media</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="https://www.instagram.com/only_cncs/" target="_blank" className="hover:underline flex items-center gap-2">
                <Instagram size={18} />
                Instagram
              </Link>
              <Link href="https://www.youtube.com/@OnlyCNCs" target="_blank" className="hover:underline flex items-center gap-2">
                <Youtube size={18} />
                Youtube
              </Link>
              <Link href="https://www.facebook.com/profile.php?id=61573609491739" target="_blank" className="hover:underline flex items-center gap-2">
                <Facebook size={18} />
                Facebook
              </Link>
            
            </nav>
          </div>
        </div>

        {/* Bottom Divider and Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-600">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0">Only CNCs - Making CNC easy</p>
            <p className="text-sm">Copyright © 2025. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
