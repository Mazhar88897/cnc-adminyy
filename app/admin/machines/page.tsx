"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import Heading from "@/components/screens/customHeading"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ConfirmationModal from "@/components/dashboardItems/confirmationModal"

type Machine = {
  id: number
  name: string
  multiplier: number
}

export default function AdminMachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [viewOpen, setViewOpen] = useState<boolean>(false)
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)
  const [formOpen, setFormOpen] = useState<boolean>(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [formId, setFormId] = useState<number | null>(null)
  const [formName, setFormName] = useState<string>("")
  const [formMultiplier, setFormMultiplier] = useState<string>("")
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const baseUrl = useMemo(() => process.env.NEXT_PUBLIC_BASE_URL_ADMIN || "", [])
  const sortedMachines = useMemo(() => {
    return [...machines].sort((a, b) => b.id - a.id)
  }, [machines])

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const token = typeof window !== "undefined" ? sessionStorage.getItem("Authorization") : null
        const response = await fetch(`${baseUrl}/admin/cnc/machines`, {
          headers: {
            Authorization: token || "",
          },
          cache: "no-store",
        })
        if (!response.ok) {
          throw new Error(`Failed to load machines (${response.status})`)
        }
        const data: Machine[] = await response.json()
        setMachines(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load machines")
      } finally {
        setIsLoading(false)
      }
    }
    fetchMachines()
  }, [baseUrl])

  const handleView = async (id: number) => {
    try {
      const token = typeof window !== "undefined" ? sessionStorage.getItem("Authorization") : null
      const response = await fetch(`${baseUrl}/admin/cnc/machines/${id}`, {
        headers: {
          Authorization: token || "",
        },
        cache: "no-store",
      })
      if (!response.ok) {
        throw new Error(`Failed to load machine (${response.status})`)
      }
      const data: Machine = await response.json()
      setSelectedMachine(data)
      setViewOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load machine")
    }
  }

  const openCreate = () => {
    setFormMode("create")
    setFormId(null)
    setFormName("")
    setFormMultiplier("")
    setFormOpen(true)
  }

  const handleEdit = (id: number) => {
    const m = machines.find((x) => x.id === id)
    if (!m) return
    setFormMode("edit")
    setFormId(m.id)
    setFormName(m.name)
    setFormMultiplier(String(m.multiplier))
    setFormOpen(true)
  }

  const handleTrash = (id: number) => {
    setDeleteId(id)
    setDeleteOpen(true)
  }

  const submitForm = async () => {
    try {
      const token = typeof window !== "undefined" ? sessionStorage.getItem("Authorization") : null
      const payload = {
        name: formName,
        multiplier: Number(formMultiplier),
      }
      const isEdit = formMode === "edit" && formId !== null
      const url = isEdit ? `${baseUrl}/admin/cnc/machines/${formId}` : `${baseUrl}/admin/cnc/machines`
      const method = isEdit ? "PUT" : "POST"
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error(`Failed to ${isEdit ? "update" : "create"} machine`)
      setFormOpen(false)
      // refresh list
      const listRes = await fetch(`${baseUrl}/admin/cnc/machines`, {
        headers: { Authorization: token || "" },
        cache: "no-store",
      })
      if (listRes.ok) setMachines(await listRes.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed")
    }
  }

  const confirmDelete = async () => {
    if (deleteId == null) return
    try {
      const token = typeof window !== "undefined" ? sessionStorage.getItem("Authorization") : null
      const response = await fetch(`${baseUrl}/admin/cnc/machines/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: token || "" },
      })
      if (!response.ok) throw new Error("Failed to delete machine")
      setDeleteOpen(false)
      setDeleteId(null)
      // refresh list
      const listRes = await fetch(`${baseUrl}/admin/cnc/machines`, {
        headers: { Authorization: token || "" },
        cache: "no-store",
      })
      if (listRes.ok) setMachines(await listRes.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Heading color="white" heading1="Admin" heading2="Machines" subheading="Manage your CNC machines" />
      </div>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreate} className="bg-teal-600 hover:bg-teal-700 text-white">Add Machine</Button>
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
                <th className="text-left px-4 py-3 font-medium">Multiplier</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedMachines.map((m, idx) => (
                <tr key={m.id} className="border-t">
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3 font-bold">{m.name}</td>
                  <td className="px-4 py-3">{m.multiplier}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4 justify-end">
                      <button aria-label="View" className="hover:opacity-80" onClick={() => handleView(m.id)}>
                        <Eye className="w-5 h-5" />
                      </button>
                      <button aria-label="Edit" className="hover:opacity-80" onClick={() => handleEdit(m.id)}>
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button aria-label="Trash" className="text-red-500 hover:opacity-80" onClick={() => handleTrash(m.id)}>
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
            <DialogTitle className="text-[#03BFB5]">Machine Details</DialogTitle>
          </DialogHeader>
          {selectedMachine ? (
            <div className="space-y-2">
              <div><span className="font-medium">ID:</span> {selectedMachine.id}</div>
              <div><span className="font-medium">Name:</span> {selectedMachine.name}</div>
              <div><span className="font-medium">Multiplier:</span> {selectedMachine.multiplier}</div>
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
            <DialogTitle className="text-[#03BFB5]">{formMode === "edit" ? "Edit Machine" : "Add Machine"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input id="name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Machine name" className="bg-white text-black" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="multiplier" className="text-white">Multiplier</Label>
              <Input id="multiplier" type="number" step="0.01" value={formMultiplier} onChange={(e) => setFormMultiplier(e.target.value)} placeholder="1.0" className="bg-white text-black" />
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
        message={`Are you sure you want to delete this machine: "${machines.find((x) => x.id === deleteId)?.name ?? ""}"?`}
      />
    </div>
  )
}


