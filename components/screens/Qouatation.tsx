import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"


export default function Component() {
  return (
    <div className=" p-5 pt-5 pb-24 sm:pt-14 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative">
          {/* Left Card - Hidden on mobile */}
          <Card className="hidden md:block bg-[#BEBEBE]  border-0">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-between items-start mb-4">
                {/* <h2 className="text-xl font-bold">
                  <span className="text-teal-400">Other</span> Platform
                </h2> */}
                <div className="bg-teal-700 p-5 hover:bg-teal-700 rounded-full font-semibold text-white px-3 py-1 text-sm">Limited Time Offer</div>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-8">
                <span className="text-5xl font-bold">99$</span>
                <span className="text-[#0099DD]  font-bold text-lg">/month</span>
              </div>

              <div className="pace-y-3 mb-12 text-left h-60 mb-4 border-b">
                <div className="flex items-start gap-2">
                  <span className="font-medium">1.</span>
                  <span>limited Access</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className=" font-medium">2.</span>
                  <span>Access ofonly application</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className=" font-medium">3.</span>
                  <span>Limited Access</span>
                </div>
              </div>
             

              <Button className="w-full bg-teal-700 rounded-mid hover:bg-teal-800 text-white py-3 mb-4">Buy Offer Now</Button>

              <p className="text-xs text-gray-800">* Tax & other services included.</p>
            </CardContent>
          </Card>

          {/* Vertical Divider - Hidden on mobile */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 transform -translate-x-1/2"></div>

          {/* Right Card - Always visible */}
          <Card className="bg-white border border-gray-200 ">
          <CardHeader className="text-center pb-4">
              <div className="flex justify-between items-start mb-4">
                {/* <h2 className="text-xl font-bold">
                  <span className="text-teal-400">Other</span> Platform
                </h2> */}
                <div className="bg-teal-700 p-5 hover:bg-teal-700 rounded-full font-semibold text-white px-3 py-1 text-sm">Limited Time Offer</div>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-8">
                <span className="text-5xl font-bold text-gray-900">49$</span>
                <span className="text-[#0099DD] font-bold text-lg">/month</span>
              </div>

              <div className="space-y-3 mb-12 text-left h-60 mb-4 border-b">
                <div className="flex items-start gap-2">
                  <span className="text-gray-900 font-medium">1.</span>
                  <span className="text-gray-700">Unlimited Access</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-900 font-medium">2.</span>
                  <span className="text-gray-700">Access of both web and application</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-900 font-medium">3.</span>
                  <span className="text-gray-700">Access of seamlessly</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-900 font-medium">4.</span>
                  <span className="text-gray-700">Access of both web and application</span>
                </div>
              </div>
             

              <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3 mb-4">Buy Offer Now</Button>

              <p className="text-xs text-gray-500">* Tax & other services included.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
