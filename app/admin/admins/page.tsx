"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Heading from "@/components/screens/customHeading"
import { Eye, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type AdminUser = {
  id: number
  name: string
  email: string
  created_at: string
}

export default function AdminAdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null)
  const [makeAdminOpen, setMakeAdminOpen] = useState(false)
  const [emailInput, setEmailInput] = useState("")
  const [makeAdminMessage, setMakeAdminMessage] = useState("")
  const [makeAdminLoading, setMakeAdminLoading] = useState(false)
  const [removeAdminOpen, setRemoveAdminOpen] = useState(false)
  const [adminToRemove, setAdminToRemove] = useState<AdminUser | null>(null)
  const [removeAdminLoading, setRemoveAdminLoading] = useState(false)
  const [removeAdminMessage, setRemoveAdminMessage] = useState("")

  const baseUrl = useMemo(() => process.env.NEXT_PUBLIC_BASE_URL_ADMIN || "", [])
  const sortedAdmins = useMemo(() => {
    return [...admins].sort((a, b) => b.id - a.id)
  }, [admins])

  const fetchAdmins = useCallback(async () => {
    if (!baseUrl) {
      setError("Missing NEXT_PUBLIC_BASE_URL_ADMIN in env")
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const token = typeof window !== "undefined" ? sessionStorage.getItem("Authorization") : null
      const response = await fetch(`${baseUrl}/admin/admins`, {
        headers: {
          Authorization: token || "",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Failed to load admins (${response.status})`)
      }

      const data: AdminUser[] = await response.json()
      setAdmins(data)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admins")
    } finally {
      setIsLoading(false)
    }
  }, [baseUrl])

  useEffect(() => {
    fetchAdmins()
  }, [fetchAdmins])

  const handleView = (admin: AdminUser) => {
    setSelectedAdmin(admin)
    setViewOpen(true)
  }

  const handleMakeAdmin = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!emailInput.trim()) {
      setMakeAdminMessage("Please enter an email.")
      return
    }

    try {
      setMakeAdminLoading(true)
      setMakeAdminMessage("")
      const token = typeof window !== "undefined" ? sessionStorage.getItem("Authorization") : null
      const response = await fetch(`${baseUrl}/admin/set-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify({
          email: emailInput.trim(),
          isAdmin: true,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data?.message || "Failed to update admin status")
      }

      setMakeAdminMessage("Success! User is now an admin.")
      setEmailInput("")
      await fetchAdmins()
    } catch (err) {
      setMakeAdminMessage(err instanceof Error ? err.message : "Failed to make user admin")
    } finally {
      setMakeAdminLoading(false)
    }
  }


  const handleRemoveAdmin = (adminId: number) => {
    const admin = admins.find((a) => a.id === adminId)
    if (!admin) {
      setError("Admin not found")
      return
    }
    setAdminToRemove(admin)
    setRemoveAdminMessage("")
    setRemoveAdminOpen(true)
  }

  const handleConfirmRemove = async () => {
    if (!adminToRemove) return

    try {
      setRemoveAdminLoading(true)
      setRemoveAdminMessage("")
      const token = typeof window !== "undefined" ? sessionStorage.getItem("Authorization") : null
      const response = await fetch(`${baseUrl}/admin/remove-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify({
          email: adminToRemove.email,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data?.message || "Failed to remove admin access")
      }

      setRemoveAdminOpen(false)
      setAdminToRemove(null)
      await fetchAdmins()
    } catch (err) {
      setRemoveAdminMessage(err instanceof Error ? err.message : "Failed to remove admin access")
    } finally {
      setRemoveAdminLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Heading color="white" heading1="Admin" heading2="Admins" subheading="Manage admin access for OnlyCNCs" />
      </div>
      <div className="text-white mb-4 font-lg  flex justify-between">
        <div>
          <span className="font-medium">Total Number of admins:</span>
          <span className="ml-2 font-bold font-xl">{admins.length}</span>
        </div>
        <div>
          <Button
            onClick={() => {
              setMakeAdminMessage("")
              setMakeAdminOpen(true)
            }}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            Make An Admin
          </Button>
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
                <th className="text-left px-4 py-3 font-medium">Created</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAdmins.map((admin, idx) => (
                <tr key={admin.id} className="border-t">
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3 font-semibold">{admin.name}</td>
                  <td className="px-4 py-3">{admin.email}</td>
                  <td className="px-4 py-3">{new Date(admin.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <button
                        aria-label="View"
                        className="hover:opacity-80 flex items-center gap-2"
                        onClick={() => handleView(admin)}
                      >
                        <Eye className="w-5 h-5" />
                      
                      </button>
                      <div className="mx-2 text-red-500 hover:opacity-80" onClick={() => handleRemoveAdmin(admin.id)}>
                        <Trash2  className="w-5 h-5" />
                      </div>
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
            <DialogTitle className="text-[#03BFB5]">Admin Details</DialogTitle>
          </DialogHeader>
          {selectedAdmin ? (
            <div className="space-y-2">
              <div>
                <span className="font-medium">ID:</span> {selectedAdmin.id}
              </div>
              <div>
                <span className="font-medium">Name:</span> {selectedAdmin.name}
              </div>
              <div>
                <span className="font-medium">Email:</span> {selectedAdmin.email}
              </div>
              <div>
                <span className="font-medium">Created:</span>{" "}
                {new Date(selectedAdmin.created_at).toLocaleString()}
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={makeAdminOpen} onOpenChange={setMakeAdminOpen}>
        <DialogContent className="bg-[#004851] border-4 border-[#03BFB5] text-white">
          <DialogHeader>
            <DialogTitle className="text-[#03BFB5]">Grant Admin Access</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleMakeAdmin} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium mb-1">
                User Email
              </label>
              <Input
                id="admin-email"
                type="email"
                placeholder="user@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="bg-white text-black"
                required
              />
            </div>
            {makeAdminMessage && (
              <div className={makeAdminMessage.startsWith("Success") ? "text-green-400 text-sm" : "text-red-400 text-sm"}>
                {makeAdminMessage}
              </div>
            )}
            <Button type="submit" className="bg-[#03BFB5] hover:bg-[#03BFB5]/80 text-white font-bold" disabled={makeAdminLoading}>
              {makeAdminLoading ? "Updating..." : "Make Admin"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={removeAdminOpen} onOpenChange={setRemoveAdminOpen}>
        <DialogContent className="bg-[#004851] border-4 border-[#03BFB5] text-white">
          <DialogHeader>
            <DialogTitle className="text-[#03BFB5]">Remove Admin Access</DialogTitle>
          </DialogHeader>
          {adminToRemove && (
            <div className="space-y-4">
              <p className="text-sm">
                Are you sure you want to remove admin access for <span className="font-semibold">{adminToRemove.email}</span>?
              </p>
              {removeAdminMessage && (
                <div className="text-red-400 text-sm">{removeAdminMessage}</div>
              )}
              <div className="flex gap-3 justify-end">
                <Button
                  onClick={() => {
                    setRemoveAdminOpen(false)
                    setAdminToRemove(null)
                    setRemoveAdminMessage("")
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                  disabled={removeAdminLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmRemove}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={removeAdminLoading}
                >
                  {removeAdminLoading ? "Removing..." : "Remove Admin"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


