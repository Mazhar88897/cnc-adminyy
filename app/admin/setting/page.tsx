"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import Heading from "@/components/screens/customHeading"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ConfirmationModal from "@/components/dashboardItems/confirmationModal"

type Setting = {
  setting_id: number
  spindle_id: number
  spindle_name: string
  bit_id: number
  bit_name: string
  material_id: number
  material_name: string
  rpm: number
  feed: number
  doc: number
  stepover: number
  plunge: number
  warning: string | null
}

type Spindle = {
  id: number
  name: string
}

type Bit = {
  id: number
  name: string
  bit_dia_for_calc: number
  stepover_ratio: number
}

type Material = {
  id: number
  name: string
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [spindles, setSpindles] = useState<Spindle[]>([])
  const [bits, setBits] = useState<Bit[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [viewOpen, setViewOpen] = useState<boolean>(false)
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null)
  const [formOpen, setFormOpen] = useState<boolean>(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [formId, setFormId] = useState<number | null>(null)

  // dropdown selections
  const [selectedSpindleId, setSelectedSpindleId] = useState<string>("")
  const [selectedBitId, setSelectedBitId] = useState<string>("")
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("")

  // numeric fields
  const [rpm, setRpm] = useState<string>("")
  const [feed, setFeed] = useState<string>("")
  const [doc, setDoc] = useState<string>("")
  const [stepover, setStepover] = useState<string>("")
  const [plunge, setPlunge] = useState<string>("")
  const [warning, setWarning] = useState<string>("")

  const baseUrl = useMemo(() => process.env.NEXT_PUBLIC_BASE_URL_ADMIN || "", [])
  const sortedSettings = useMemo(() => {
    return [...settings].sort((a, b) => b.setting_id - a.setting_id)
  }, [settings])

  const getToken = () => (typeof window !== "undefined" ? sessionStorage.getItem("Authorization") : null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken()
        
        // Fetch all data in parallel
        const [settingsRes, spindlesRes, bitsRes, materialsRes] = await Promise.all([
          fetch(`${baseUrl}/admin/cnc/settings`, {
            headers: { Authorization: token || "" },
            cache: "no-store",
          }),
          fetch(`${baseUrl}/admin/cnc/spindles`, {
            headers: { Authorization: token || "" },
            cache: "no-store",
          }),
          fetch(`${baseUrl}/admin/cnc/bits`, {
            headers: { Authorization: token || "" },
            cache: "no-store",
          }),
          fetch(`${baseUrl}/admin/cnc/materials`, {
            headers: { Authorization: token || "" },
            cache: "no-store",
          })
        ])

        if (!settingsRes.ok) throw new Error(`Failed to load settings (${settingsRes.status})`)
        if (!spindlesRes.ok) throw new Error(`Failed to load spindles (${spindlesRes.status})`)
        if (!bitsRes.ok) throw new Error(`Failed to load bits (${bitsRes.status})`)
        if (!materialsRes.ok) throw new Error(`Failed to load materials (${materialsRes.status})`)

        const [settingsData, spindlesData, bitsData, materialsData] = await Promise.all([
          settingsRes.json(),
          spindlesRes.json(),
          bitsRes.json(),
          materialsRes.json()
        ])

        setSettings(settingsData)
        setSpindles(spindlesData)
        setBits(bitsData)
        setMaterials(materialsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [baseUrl])

  const handleView = async (id: number) => {
    try {
      const token = getToken()
      const response = await fetch(`${baseUrl}/admin/cnc/settings/${id}`, {
        headers: { Authorization: token || "" },
        cache: "no-store",
      })
      if (!response.ok) throw new Error(`Failed to load setting (${response.status})`)
      const data: Setting = await response.json()
      setSelectedSetting(data)
      setViewOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load setting")
    }
  }

  const openCreate = () => {
    setFormMode("create")
    setFormId(null)
    setSelectedSpindleId("")
    setSelectedBitId("")
    setSelectedMaterialId("")
    setRpm("")
    setFeed("")
    setDoc("")
    setStepover("")
    setPlunge("")
    setWarning("")
    setFormOpen(true)
  }

  const handleEdit = (id: number) => {
    const s = settings.find((x) => x.setting_id === id)
    if (!s) return
    setFormMode("edit")
    setFormId(s.setting_id)
    setRpm(String(s.rpm))
    setFeed(String(s.feed))
    setDoc(String(s.doc))
    setStepover(String(s.stepover))
    setPlunge(String(s.plunge))
    setWarning(s.warning || "")
    setFormOpen(true)
  }

  const handleTrash = (id: number) => {
    setDeleteId(id)
    setDeleteOpen(true)
  }

  const submitForm = async () => {
    try {
      const token = getToken()
      const isEdit = formMode === "edit" && formId !== null

      // Validate dropdown selections for create mode
      if (!isEdit) {
        if (!selectedSpindleId || !selectedMaterialId || !selectedBitId) {
          setError("Please select Spindle, Material, and Bit before creating a setting")
          return
        }
      }

      // Use original IDs when editing; use dropdown selection when creating
      let spindleId: number
      let materialId: number
      let bitId: number

      if (isEdit) {
        const original = settings.find((x) => x.setting_id === formId)
        spindleId = original ? original.spindle_id : 0
        materialId = original ? original.material_id : 0
        bitId = original ? original.bit_id : 0
      } else {
        spindleId = Number(selectedSpindleId)
        materialId = Number(selectedMaterialId)
        bitId = Number(selectedBitId)
      }
      const payload = {
        spindle_id: spindleId,
        bit_id: bitId,
        material_id: materialId,
        rpm: Number(rpm),
        feed: Number(feed),
        doc: Number(doc),
        stepover: Number(stepover),
        plunge: Number(plunge),
        warning: warning || null,
      }
      const url = isEdit ? `${baseUrl}/admin/cnc/settings/${formId}` : `${baseUrl}/admin/cnc/settings`
      const method = isEdit ? "PUT" : "POST"
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error(`Failed to ${isEdit ? "update" : "create"} setting`)
      setFormOpen(false)
      // refresh list
      const listRes = await fetch(`${baseUrl}/admin/cnc/settings`, {
        headers: { Authorization: token || "" },
        cache: "no-store",
      })
      if (listRes.ok) setSettings(await listRes.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed")
    }
  }

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const confirmDelete = async () => {
    if (deleteId == null) return
    try {
      const token = getToken()
      const response = await fetch(`${baseUrl}/admin/cnc/settings/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: token || "" },
      })
      if (!response.ok) throw new Error("Failed to delete setting")
      setDeleteOpen(false)
      setDeleteId(null)
      // refresh list
      const listRes = await fetch(`${baseUrl}/admin/cnc/settings`, {
        headers: { Authorization: token || "" },
        cache: "no-store",
      })
      if (listRes.ok) setSettings(await listRes.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    }
  }

  const spindleName = typeof window !== "undefined" ? sessionStorage.getItem("spindle_name") : ""
  const materialName = typeof window !== "undefined" ? sessionStorage.getItem("material_name") : ""
  const bitName = typeof window !== "undefined" ? sessionStorage.getItem("bit_name") : ""

  return (
    <div className="p-6">
      <div className="mb-6">
        <Heading color="white" heading1="Admin" heading2="Settings" subheading="Manage your CNC cut settings" />
      </div>
      <div className="flex justify-between mb-4">
        <div>
          {/* <div className="flex text-white items-center gap-2"><span className="font-bold">Spindle:</span> {spindleName}</div>
          <div className="flex text-white items-center gap-2"><span className="font-bold">Material:</span> {materialName}</div>
          <div className="flex text-white items-center gap-2"><span className="font-bold">Bit:</span> {bitName}</div> */}
        </div>
        <Button onClick={openCreate} className="bg-teal-600 hover:bg-teal-700 text-white">Add Setting</Button>
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
                <th className="text-left px-4 py-3 font-medium">Spindle</th>
                <th className="text-left px-4 py-3 font-medium">Material</th>
                <th className="text-left px-4 py-3 font-medium">Bit</th>
                <th className="text-left px-4 py-3 font-medium">RPM</th>
                <th className="text-left px-4 py-3 font-medium">Feed</th>
                <th className="text-left px-4 py-3 font-medium">DOC</th>
                <th className="text-left px-4 py-3 font-medium">Stepover</th>
                <th className="text-left px-4 py-3 font-medium">Plunge</th>
                <th className="text-left px-4 py-3 font-medium">Warning</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedSettings.map((s, idx) => (
                <tr key={s.setting_id} className="border-t">
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3 font-semibold">{s.spindle_name}</td>
                  <td className="px-4 py-3 font-semibold">{s.material_name}</td>
                  <td className="px-4 py-3 font-semibold">{s.bit_name}</td>
                  <td className="px-4 py-3">{s.rpm}</td>
                  <td className="px-4 py-3">{s.feed}</td>
                  <td className="px-4 py-3">{s.doc}</td>
                  <td className="px-4 py-3">{s.stepover}</td>
                  <td className="px-4 py-3">{s.plunge}</td>
                  <td className="px-4 py-3 truncate max-w-[16rem]" title={s.warning || ""}>{s.warning}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4 justify-end">
                      <button aria-label="View" className="hover:opacity-80" onClick={() => handleView(s.setting_id)}>
                        <Eye className="w-5 h-5" />
                      </button>
                      <button aria-label="Edit" className="hover:opacity-80" onClick={() => handleEdit(s.setting_id)}>
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button aria-label="Trash" className="text-red-500 hover:opacity-80" onClick={() => handleTrash(s.setting_id)}>
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
            <DialogTitle className="text-[#03BFB5]">Setting Details</DialogTitle>
          </DialogHeader>
          {selectedSetting ? (
            <div className="space-y-2">
              <div><span className="font-medium">ID:</span> {selectedSetting.setting_id}</div>
              <div><span className="font-medium">Spindle:</span> {selectedSetting.spindle_name}</div>
              <div><span className="font-medium">Material:</span> {selectedSetting.material_name}</div>
              <div><span className="font-medium">Bit:</span> {selectedSetting.bit_name}</div>
              <div><span className="font-medium">RPM:</span> {selectedSetting.rpm}</div>
              <div><span className="font-medium">Feed:</span> {selectedSetting.feed}</div>
              <div><span className="font-medium">DOC:</span> {selectedSetting.doc}</div>
              <div><span className="font-medium">Stepover:</span> {selectedSetting.stepover}</div>
              <div><span className="font-medium">Plunge:</span> {selectedSetting.plunge}</div>
              <div><span className="font-medium">Warning:</span> {selectedSetting.warning}</div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Modal */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-[#004851] max-h-[90vh] overflow-y-auto border-4 border-[#03BFB5] text-white">
          <DialogHeader>
            <DialogTitle className="text-[#03BFB5]">{formMode === "edit" ? "Edit Setting" : "Add Setting"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {formMode === "create" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="spindle" className="text-white">Spindle</Label>
                  <Select value={selectedSpindleId} onValueChange={setSelectedSpindleId}>
                    <SelectTrigger className="bg-white text-black">
                      <SelectValue placeholder="Select spindle" />
                    </SelectTrigger>
                    <SelectContent>
                      {spindles.map((spindle) => (
                        <SelectItem key={spindle.id} value={String(spindle.id)}>
                          {spindle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="material" className="text-white">Material</Label>
                  <Select value={selectedMaterialId} onValueChange={setSelectedMaterialId}>
                    <SelectTrigger className="bg-white text-black">
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      {materials.map((material) => (
                        <SelectItem key={material.id} value={String(material.id)}>
                          {material.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bit" className="text-white">Bit</Label>
                  <Select value={selectedBitId} onValueChange={setSelectedBitId}>
                    <SelectTrigger className="bg-white text-black">
                      <SelectValue placeholder="Select bit" />
                    </SelectTrigger>
                    <SelectContent>
                      {bits.map((bit) => (
                        <SelectItem key={bit.id} value={String(bit.id)}>
                          {bit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="rpm" className="text-white">RPM</Label>
                <Input id="rpm" type="number" value={rpm} onChange={(e) => setRpm(e.target.value)} placeholder="18000" className="bg-white text-black" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="feed" className="text-white">Feed</Label>
                <Input id="feed" type="number" value={feed} onChange={(e) => setFeed(e.target.value)} placeholder="1500" className="bg-white text-black" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="doc" className="text-white">DOC</Label>
                <Input id="doc" type="number" step="0.01" value={doc} onChange={(e) => setDoc(e.target.value)} placeholder="2.5" className="bg-white text-black" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stepover" className="text-white">Stepover</Label>
                <Input id="stepover" type="number" step="0.001" value={stepover} onChange={(e) => setStepover(e.target.value)} placeholder="0.4" className="bg-white text-black" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="plunge" className="text-white">Plunge</Label>
                <Input id="plunge" type="number" value={plunge} onChange={(e) => setPlunge(e.target.value)} placeholder="600" className="bg-white text-black" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="warning" className="text-white">Warning</Label>
                <Input id="warning" value={warning} onChange={(e) => setWarning(e.target.value)} placeholder="Use proper safety equipment" className="bg-white text-black" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={submitForm} 
              disabled={formMode === "create" && (!selectedSpindleId || !selectedMaterialId || !selectedBitId)}
              className="bg-[#03BFB5] hover:bg-[#03BFB5]/80 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formMode === "edit" ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmationModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Warning"
        message={`Are you sure you want to delete this setting: "${settings.find((x) => x.setting_id === deleteId)?.bit_name ?? ""} / ${settings.find((x) => x.setting_id === deleteId)?.material_name ?? ""}"?`}
      />
    </div>
  )
}



