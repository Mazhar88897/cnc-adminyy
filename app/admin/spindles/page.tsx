"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import Heading from "@/components/screens/customHeading"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ConfirmationModal from "@/components/dashboardItems/confirmationModal"

type Spindle = {
  id: number
  name: string
}

export default function AdminSpindlesPage() {
  const router = useRouter()
  const [spindles, setSpindles] = useState<Spindle[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [viewOpen, setViewOpen] = useState<boolean>(false)
  const [selectedSpindle, setSelectedSpindle] = useState<Spindle | null>(null)
  const [formOpen, setFormOpen] = useState<boolean>(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [formId, setFormId] = useState<number | null>(null)
  const [formName, setFormName] = useState<string>("")
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const baseUrl = useMemo(() => process.env.NEXT_PUBLIC_BASE_URL_ADMIN || "", [])
  const sortedSpindles = useMemo(() => {
    return [...spindles].sort((a, b) => b.id - a.id)
  }, [spindles])

  useEffect(() => {
    const fetchSpindles = async () => {
      try {
        const token = typeof window !== "undefined" ? sessionStorage.getItem("Authorization") : null
        const response = await fetch(`${baseUrl}/admin/cnc/spindles`, {
          headers: {
            Authorization: token || "",
          },
          cache: "no-store",
        })
        if (!response.ok) {
          throw new Error(`Failed to load spindles (${response.status})`)
        }
        const data: Spindle[] = await response.json()
        setSpindles(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load spindles")
      } finally {
        setIsLoading(false)
      }
    }
    fetchSpindles()
  }, [baseUrl])

  const handleView = async (id: number) => {
    try {
      const token = typeof window !== "undefined" ? sessionStorage.getItem("Authorization") : null
      const response = await fetch(`${baseUrl}/admin/cnc/spindles/${id}`, {
        headers: {
          Authorization: token || "",
        },
        cache: "no-store",
      })
      if (!response.ok) {
        throw new Error(`Failed to load spindle (${response.status})`)
      }
      const data: Spindle = await response.json()
      setSelectedSpindle(data)
      setViewOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load spindle")
    }
  }

  const openCreate = () => {
    setFormMode("create")
    setFormId(null)
    setFormName("")
    setFormOpen(true)
  }

  const handleEdit = (id: number) => {
    const s = spindles.find((x) => x.id === id)
    if (!s) return
    setFormMode("edit")
    setFormId(s.id)
    setFormName(s.name)
    setFormOpen(true)
  }

  const handleTrash = (id: number) => {
    setDeleteId(id)
    setDeleteOpen(true)
  }

  const submitForm = async () => {
    try {
      const token = typeof window !== "undefined" ? sessionStorage.getItem("Authorization") : null
      const payload = { name: formName }
      const isEdit = formMode === "edit" && formId !== null
      const url = isEdit ? `${baseUrl}/admin/cnc/spindles/${formId}` : `${baseUrl}/admin/cnc/spindles`
      const method = isEdit ? "PUT" : "POST"
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error(`Failed to ${isEdit ? "update" : "create"} spindle`)
      setFormOpen(false)
      // refresh list
      const listRes = await fetch(`${baseUrl}/admin/cnc/spindles`, {
        headers: { Authorization: token || "" },
        cache: "no-store",
      })
      if (listRes.ok) setSpindles(await listRes.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed")
    }
  }

  const confirmDelete = async () => {
    if (deleteId == null) return
    try {
      const token = typeof window !== "undefined" ? sessionStorage.getItem("Authorization") : null
      const response = await fetch(`${baseUrl}/admin/cnc/spindles/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: token || "" },
      })
      if (!response.ok) throw new Error("Failed to delete spindle")
      setDeleteOpen(false)
      setDeleteId(null)
      // refresh list
      const listRes = await fetch(`${baseUrl}/admin/cnc/spindles`, {
        headers: { Authorization: token || "" },
        cache: "no-store",
      })
      if (listRes.ok) setSpindles(await listRes.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    }
  }

  const goToMaterial = (spindle: Spindle) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("spindle_id", String(spindle.id))
      sessionStorage.setItem("spindle_name", spindle.name)
    }
    router.push("/admin/CSV")
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Heading color="white" heading1="Admin" heading2="Spindles" subheading="Manage your CNC spindles" />
      </div>
      <div className="flex justify-between mb-4">
        <div className="text-white text-lg font-bold">Click On Spindle Name to view Hard Settings</div>
        <Button onClick={openCreate} className="bg-teal-600 hover:bg-teal-700 text-white">Add Spindle</Button>
      </div>

      {isLoading && <div>Loading...</div>}
      {!isLoading && error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}

      {!isLoading && !error && (
        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full text-sm text-white">
            <thead className="bg-muted/40 text-white">
              <tr>
                <th className="text-left px-4 py-3 font-medium">S/N</th>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedSpindles.map((s, idx) => (
                <tr key={s.id} className="border-t">
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3 font-bold cursor-pointer hover:underline" onClick={() => goToMaterial(s)}>{s.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4 justify-end">
                      <button aria-label="View" className="hover:opacity-80" onClick={() => handleView(s.id)}>
                        <Eye className="w-5 h-5" />
                      </button>
                      <button aria-label="Edit" className="hover:opacity-80" onClick={() => handleEdit(s.id)}>
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button aria-label="Trash" className="text-red-500 hover:opacity-80" onClick={() => handleTrash(s.id)}>
                        <Trash2 className="w-5 h-5" />
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
            <DialogTitle className="text-[#03BFB5]">Spindle Details</DialogTitle>
          </DialogHeader>
          {selectedSpindle ? (
            <div className="space-y-2">
              <div><span className="font-medium">ID:</span> {selectedSpindle.id}</div>
              <div><span className="font-medium">Name:</span> {selectedSpindle.name}</div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Modal */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-[#004851] border-4 border-[#03BFB5] text-white">
          <DialogHeader>
            <DialogTitle className="text-[#03BFB5]">{formMode === "edit" ? "Edit Spindle" : "Add Spindle"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input id="name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Spindle name" className="bg-white text-black" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={submitForm} className="bg-[#03BFB5] hover:bg-[#03BFB5]/80 text-white font-bold">{formMode === "edit" ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmationModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Warning"
        message={`Are you sure you want to delete this spindle: "${spindles.find((x) => x.id === deleteId)?.name ?? ""}"?`}
      />
    </div>
  )
}


