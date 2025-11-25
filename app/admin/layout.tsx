import { type ReactNode } from 'react'
import AdminTopbar from '@/components/dashboardItems/adminTopbar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#004146]">
      <AdminTopbar />
      <main className="">
        {children}
      </main>
    </div>
  )
}



