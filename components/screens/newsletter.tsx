"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Newsletter() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        setName("")
        setEmail("")
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to subscribe to newsletter")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // if (isSuccess) {
  //   return (
  //     <div className="py-28 bg-[#004146] flex items-center justify-center p-4">
  //       <Card className="w-full py-5 gap-2 m-3 max-w-3xl mx-auto bg-white rounded-2xl shadow-lg">
  //         <CardHeader className="pb-6">
  //           <CardTitle className="text-2xl md:text-4xl font-semibold">
  //             <span className="text-teal-500">Sign up</span> <span className="text-gray-900">for newsletter</span>
  //           </CardTitle>
  //           <CardDescription className="text-sm text-black font-semibold mt-2">
  //             Learn about the latest happenings in our community
  //           </CardDescription>
  //         </CardHeader>
  //         <CardContent className="space-y-6">
  //           <form onSubmit={handleSubmit} className="space-y-6">
  //             {error && (
  //               <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
  //                 {error}
  //               </div>
  //             )}
  //             <div className="space-y-2">
  //               <Label htmlFor="name" className="text-sm text-black font-semibold">
  //                 Your Name:
  //               </Label>
  //               <Input
  //                 id="name"
  //                 type="text"
  //                 placeholder="Type your name here."
  //                 value={name}
  //                 onChange={(e) => setName(e.target.value)}
  //                 className="w-full px-4 py-3 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
  //                 required
  //                 disabled={isLoading}
  //               />
  //             </div>
  //             <div className="space-y-2">
  //               <Label htmlFor="email" className="text-sm text-black font-semibold">
  //                 Your Email:
  //               </Label>
  //               <Input
  //                 id="email"
  //                 type="email"
  //                 placeholder="Type your Email here."
  //                 value={email}
  //                 onChange={(e) => setEmail(e.target.value)}
  //                 className="w-full px-4 py-3 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
  //                 required
  //                 disabled={isLoading}
  //               />
  //             </div>
  //             <div className="flex justify-end pt-4">
  //               <Button
  //                 type="submit"
  //                 disabled={isLoading}
  //                 className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  //               >
  //                 {isLoading ? "Sending..." : "Send"}
  //               </Button>
  //             </div>
  //           </form>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   )
  // }

  return (
    <div className="py-10 bg-[#004146] flex items-center justify-center p-4">
      <Card className="w-full py-5 gap-2 m-3 max-w-3xl mx-auto bg-white rounded-2xl shadow-lg">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl md:text-4xl font-semibold">
            <span className="text-teal-500">Sign up</span> <span className="text-gray-900">for newsletter</span>
          </CardTitle>
          <CardDescription className="text-sm text-black font-semibold mt-2">
            Learn about the latest happenings in our community
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-black font-semibold">
                Your Name:
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Type your name here."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-black font-semibold">
                Your Email:
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Type your Email here."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>
            <div className="flex justify-between items-center pt-4">
              <p className="text-xs sm:text-sm text-gray-600">
                By signing up to our newsletter, you are accepting our{" "}
                <Link 
                  href="/main/terms" 
                  className="underline font-semibold transition-colors duration-200"
                >
                  terms and conditions
                </Link>
              </p>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-teal-500 hover:bg-teal-600 text-white px-10 py-2 rounded-[20px] font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
              {isLoading ? "Sending..." : isSuccess ? "Sent" : "Send"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
