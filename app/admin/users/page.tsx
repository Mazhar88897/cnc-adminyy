"use client"

import { useEffect, useMemo, useState } from "react"
import Heading from "@/components/screens/customHeading"
import { Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type User = {
  id: number
  name: string
  email: string
  is_admin: boolean
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const baseUrl = useMemo(() => process.env.NEXT_PUBLIC_BASE_URL_ADMIN || "", [])
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => b.id - a.id)
  }, [users])

  useEffect(() => {
    const fetchUsers = async () => {
      if (!baseUrl) {
        setError("Missing NEXT_PUBLIC_BASE_URL_ADMIN in env")
        setIsLoading(false)
        return
      }

      try {
        const token = typeof window !== "undefined" ? sessionStorage.getItem("Authorization") : null
        const response = await fetch(`${baseUrl}/api/users`, {
          headers: {
            Authorization: token || "",
            "Content-Type": "application/json",
          },
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error(`Failed to load users (${response.status})`)
        }

        const data: User[] = await response.json()
        setUsers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [baseUrl])

  const handleView = (user: User) => {
    setSelectedUser(user)
    setViewOpen(true)
  }

  const handleDownloadCSV = () => {
    // Create CSV headers
    const headers = ["S/N", "ID", "Name", "Email", "Role", "Created"]
    
    // Convert users data to CSV rows
    const csvRows = [
      headers.join(","),
      ...sortedUsers.map((user, idx) => {
        const row = [
          idx + 1,
          user.id,
          `"${user.name.replace(/"/g, '""')}"`, // Escape quotes in name
          `"${user.email.replace(/"/g, '""')}"`, // Escape quotes in email
          user.is_admin ? "Admin" : "User",
          `"${new Date(user.created_at).toLocaleString()}"`
        ]
        return row.join(",")
      })
    ]
    
    // Create CSV content
    const csvContent = csvRows.join("\n")
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    
    link.setAttribute("href", url)
    link.setAttribute("download", `users_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const memoizedUsers = useMemo(() => {
    return sortedUsers.map((user) => ({
      ...user,
      formattedCreatedAt: new Date(user.created_at).toLocaleString(),
      roleLabel: user.is_admin ? "Admin" : "User",
    }))
  }, [sortedUsers])

  return (
    <div className="p-6">
      <div className="mb-6">
        <Heading color="white" heading1="Admin" heading2="Users" subheading="Review all OnlyCNCs user accounts" />
      </div>
      <div className="text-white mb-4 flex justify-between font-lg">
        <div>
        <span className="font-medium">Total Number of users:</span><span className="ml-2 font-bold font-xl">{users.length}</span>
        </div>
        <div>
            <Button onClick={handleDownloadCSV} className="bg-teal-600 hover:bg-teal-700 text-white">Download CSV</Button>
        </div>
      </div>

      {isLoading && <div className="text-white">Loading...</div>}
      {!isLoading && error && <div className="text-red-500 mb-4">{error}</div>}

      {!isLoading && !error && (
        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full text-sm text-white">
            <thead className="bg-muted/40 text-white">
              <tr>
                <th className="text-left px-4 py-3 font-medium">S/N</th>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="text-left px-4 py-3 font-medium">Created</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {memoizedUsers.map((user, idx) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3 font-semibold">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.roleLabel}</td>
                  <td className="px-4 py-3">{user.formattedCreatedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <button
                        aria-label="View"
                        className="hover:opacity-80 flex items-center gap-2"
                        onClick={() => handleView(user)}
                      >
                        <Eye className="w-5 h-5" />
                        <span className="text-xs uppercase tracking-wide">View</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="bg-[#004851] border-4 border-[#03BFB5] text-white">
          <DialogHeader>
            <DialogTitle className="text-[#03BFB5]">User Details</DialogTitle>
          </DialogHeader>
          {selectedUser ? (
            <div className="space-y-2">
              <div>
                <span className="font-medium">ID:</span> {selectedUser.id}
              </div>
              <div>
                <span className="font-medium">Name:</span> {selectedUser.name}
              </div>
              <div>
                <span className="font-medium">Email:</span> {selectedUser.email}
              </div>
              <div>
                <span className="font-medium">Role:</span> {selectedUser.is_admin ? "Admin" : "User"}
              </div>
              <div>
                <span className="font-medium">Created:</span>{" "}
                {memoizedUsers.find((user) => user.id === selectedUser.id)?.formattedCreatedAt ??
                  new Date(selectedUser.created_at).toLocaleString()}
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


