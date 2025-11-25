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

type Bit = {
  id: number
  name: string
  bit_dia_for_calc: number
  stepover_ratio: number
}

export default function AdminBitsPage() {
  // const router = useRouter()
  const [bits, setBits] = useState<Bit[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [viewOpen, setViewOpen] = useState<boolean>(false)
  const [selectedBit, setSelectedBit] = useState<Bit | null>(null)
  const [formOpen, setFormOpen] = useState<boolean>(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [formId, setFormId] = useState<number | null>(null)
  const [formName, setFormName] = useState<string>("")
  const [formDia, setFormDia] = useState<string>("")
  const [formStepover, setFormStepover] = useState<string>("")
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const baseUrl = useMemo(() => process.env.NEXT_PUBLIC_BASE_URL_ADMIN || "", [])
  const sortedBits = useMemo(() => {
    return [...bits].sort((a, b) => b.id - a.id)
  }, [bits])

  useEffect(() => {
    const fetchBits = async () => {
      try {
        const token = typeof window !== "undefined" ? sessionStorage.getItem("Authorization") : null
        const response = await fetch(`${baseUrl}/admin/cnc/bits`, {
          headers: {
            Authorization: token || "",
          },
          cache: "no-store",
        })
        if (!response.ok) {
          throw new Error(`Failed to load bits (${response.status})`)
        }
        const data: Bit[] = await response.json()
        setBits(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load bits")
      } finally {
        setIsLoading(false)
      }
    }
    fetchBits()
  }, [baseUrl])

  const handleView = async (id: number) => {
    try {
      const token = typeof window !== "undefined" ? sessionStorage.getItem("Authorization") : null
      const response = await fetch(`${baseUrl}/admin/cnc/bits/${id}`, {
        headers: {
          Authorization: token || "",
        },
        cache: "no-store",
      })
      if (!response.ok) {
        throw new Error(`Failed to load bit (${response.status})`)
      }
      const data: Bit = await response.json()
      setSelectedBit(data)
      setViewOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bit")
    }
  }

  const openCreate = () => {
    setFormMode("create")
    setFormId(null)
    setFormName("")
    setFormDia("")
    setFormStepover("")
    setFormOpen(true)
  }

  const handleEdit = (id: number) => {
    const b = bits.find((x) => x.id === id)
    if (!b) return
    setFormMode("edit")
    setFormId(b.id)
    setFormName(b.name)
    setFormDia(String(b.bit_dia_for_calc))
    setFormStepover(String(b.stepover_ratio))
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
        bit_dia_for_calc: Number(formDia),
        stepover_ratio: Number(formStepover),
      }
      const isEdit = formMode === "edit" && formId !== null
      const url = isEdit ? `${baseUrl}/admin/cnc/bits/${formId}` : `${baseUrl}/admin/cnc/bits`
      const method = isEdit ? "PUT" : "POST"
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error(`Failed to ${isEdit ? "update" : "create"} bit`)
      setFormOpen(false)
      // refresh list
      const listRes = await fetch(`${baseUrl}/admin/cnc/bits`, {
        headers: { Authorization: token || "" },
        cache: "no-store",
      })
      if (listRes.ok) setBits(await listRes.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed")
    }
  }

  const confirmDelete = async () => {
    if (deleteId == null) return
    try {
      const token = typeof window !== "undefined" ? sessionStorage.getItem("Authorization") : null
      const response = await fetch(`${baseUrl}/admin/cnc/bits/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: token || "" },
      })
      if (!response.ok) throw new Error("Failed to delete bit")
      setDeleteOpen(false)
      setDeleteId(null)
      // refresh list
      const listRes = await fetch(`${baseUrl}/admin/cnc/bits`, {
        headers: { Authorization: token || "" },
        cache: "no-store",
      })
      if (listRes.ok) setBits(await listRes.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    }
  }

  const goToSetting = (bit: Bit) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("bit_id", String(bit.id))
      sessionStorage.setItem("bit_name", bit.name)
    }
    // router.push("/admin/setting")
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Heading color="white" heading1="Admin" heading2="Bits" subheading="Manage your CNC bits" />
      </div>
      <div className="flex justify-between mb-4">
        <div>
            {/* <div className="flex text-white items-center gap-2">
          <span className="font-bold">Spindle:</span> {sessionStorage.getItem("spindle_name")}
        </div>
        <div className="flex text-white items-center gap-2">
          <span className="font-bold">Material:</span> {sessionStorage.getItem("material_name")}
        </div> */}
        </div>
        
        <Button onClick={openCreate} className="bg-teal-600 hover:bg-teal-700 text-white">Add Bit</Button>
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
                <th className="text-left px-4 py-3 font-medium">Bit Dia (mm)</th>
                <th className="text-left px-4 py-3 font-medium">Stepover Ratio</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedBits.map((b, idx) => (
                <tr key={b.id} className="border-t">
                  <td className="px-4 py-3" onClick={() => goToSetting(b)}>{idx + 1}</td>
                  <td className="px-4 py-3 font-bold " >{b.name}</td>
                  <td className="px-4 py-3">{b.id}</td>
                  <td className="px-4 py-3" onClick={() => goToSetting(b)}>{b.bit_dia_for_calc}</td>
                  <td className="px-4 py-3" onClick={() => goToSetting(b)}>{b.stepover_ratio}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4 justify-end">
                      <button aria-label="View" className="hover:opacity-80" onClick={() => handleView(b.id)}>
                        <Eye className="w-5 h-5" />
                      </button>
                      <button aria-label="Edit" className="hover:opacity-80" onClick={() => handleEdit(b.id)}>
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button aria-label="Trash" className="text-red-500 hover:opacity-80" onClick={() => handleTrash(b.id)}>
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
            <DialogTitle className="text-[#03BFB5]">Bit Details</DialogTitle>
          </DialogHeader>
          {selectedBit ? (
            <div className="space-y-2">
              <div><span className="font-medium">ID:</span> {selectedBit.id}</div>
              <div><span className="font-medium">Name:</span> {selectedBit.name}</div>
              <div><span className="font-medium">Bit Dia (mm):</span> {selectedBit.bit_dia_for_calc}</div>
              <div><span className="font-medium">Stepover Ratio:</span> {selectedBit.stepover_ratio}</div>
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
            <DialogTitle className="text-[#03BFB5]">{formMode === "edit" ? "Edit Bit" : "Add Bit"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input id="name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Bit name" className="bg-white text-black" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dia" className="text-white">Bit Dia (mm)</Label>
              <Input id="dia" type="number" step="0.01" value={formDia} onChange={(e) => setFormDia(e.target.value)} placeholder="6.35" className="bg-white text-black" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stepover" className="text-white">Stepover Ratio</Label>
              <Input id="stepover" type="number" step="0.01" value={formStepover} onChange={(e) => setFormStepover(e.target.value)} placeholder="0.4" className="bg-white text-black" />
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
        message={`Are you sure you want to delete this bit: "${bits.find((x) => x.id === deleteId)?.name ?? ""}"?`}
      />
    </div>
  )
}


