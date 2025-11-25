"use client"

import { useEffect, useMemo, useState } from "react"
// import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import Heading from "@/components/screens/customHeading"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ConfirmationModal from "@/components/dashboardItems/confirmationModal"

type Material = {
  id: number
  name: string
}

export default function AdminMaterialsPage() {
  // const router = useRouter()
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [viewOpen, setViewOpen] = useState<boolean>(false)
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [formOpen, setFormOpen] = useState<boolean>(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [formId, setFormId] = useState<number | null>(null)
  const [formName, setFormName] = useState<string>("")
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const baseUrl = useMemo(() => process.env.NEXT_PUBLIC_BASE_URL_ADMIN || "", [])
  const sortedMaterials = useMemo(() => {
    return [...materials].sort((a, b) => b.id - a.id)
  }, [materials])

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const token = typeof window !== "undefined" ? sessionStorage.getItem("Authorization") : null
        const response = await fetch(`${baseUrl}/admin/cnc/materials`, {
          headers: {
            Authorization: token || "",
          },
          cache: "no-store",
        })
        if (!response.ok) {
          throw new Error(`Failed to load materials (${response.status})`)
        }
        const data: Material[] = await response.json()
        setMaterials(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load materials")
      } finally {
        setIsLoading(false)
      }
    }
    fetchMaterials()
  }, [baseUrl])

  const handleView = async (id: number) => {
    try {
      const token = typeof window !== "undefined" ? sessionStorage.getItem("Authorization") : null
      const response = await fetch(`${baseUrl}/admin/cnc/materials/${id}`, {
        headers: {
          Authorization: token || "",
        },
        cache: "no-store",
      })
      if (!response.ok) {
        throw new Error(`Failed to load material (${response.status})`)
      }
      const data: Material = await response.json()
      setSelectedMaterial(data)
      setViewOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load material")
    }
  }

  const openCreate = () => {
    setFormMode("create")
    setFormId(null)
    setFormName("")
    setFormOpen(true)
  }

  const handleEdit = (id: number) => {
    const m = materials.find((x) => x.id === id)
    if (!m) return
    setFormMode("edit")
    setFormId(m.id)
    setFormName(m.name)
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
      const url = isEdit ? `${baseUrl}/admin/cnc/materials/${formId}` : `${baseUrl}/admin/cnc/materials`
      const method = isEdit ? "PUT" : "POST"
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error(`Failed to ${isEdit ? "update" : "create"} material`)
      setFormOpen(false)
      // refresh list
      const listRes = await fetch(`${baseUrl}/admin/cnc/materials`, {
        headers: { Authorization: token || "" },
        cache: "no-store",
      })
      if (listRes.ok) setMaterials(await listRes.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed")
    }
  }

  const confirmDelete = async () => {
    if (deleteId == null) return
    try {
      const token = typeof window !== "undefined" ? sessionStorage.getItem("Authorization") : null
      const response = await fetch(`${baseUrl}/admin/cnc/materials/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: token || "" },
      })
      if (!response.ok) throw new Error("Failed to delete material")
      setDeleteOpen(false)
      setDeleteId(null)
      // refresh list
      const listRes = await fetch(`${baseUrl}/admin/cnc/materials`, {
        headers: { Authorization: token || "" },
        cache: "no-store",
      })
      if (listRes.ok) setMaterials(await listRes.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    }
  }

  const goToBits = (material: Material) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("material_id", String(material.id))
      sessionStorage.setItem("material_name", material.name)
    }
    // router.push("/admin/bits")
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Heading color="white" heading1="Admin" heading2="Materials" subheading="Manage your CNC materials" />
      </div>
      <div className="flex justify-between mb-4">
        <div className="flex text-white items-center gap-2">
          {/* <span className="font-bold">Spindle:</span> {sessionStorage.getItem("spindle_name")} */}
        </div>
        <Button onClick={openCreate} className="bg-teal-600 hover:bg-teal-700 text-white">Add Material</Button>
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
                <th className="text-left px-4 py-3 font-medium">ID</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedMaterials.map((m, idx) => (
                <tr key={m.id} className="border-t">
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3 font-bold" >{m.name}</td>
                  <td className="px-4 py-3">{m.id}</td>
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
            <DialogTitle className="text-[#03BFB5]">Material Details</DialogTitle>
          </DialogHeader>
          {selectedMaterial ? (
            <div className="space-y-2">
              <div><span className="font-medium">ID:</span> {selectedMaterial.id}</div>
              <div><span className="font-medium">Name:</span> {selectedMaterial.name}</div>
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
            <DialogTitle className="text-[#03BFB5]">{formMode === "edit" ? "Edit Material" : "Add Material"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input id="name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Material name" className="bg-white text-black" />
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
        message={`Are you sure you want to delete this material: "${materials.find((x) => x.id === deleteId)?.name ?? ""}"?`}
      />
    </div>
  )
}


