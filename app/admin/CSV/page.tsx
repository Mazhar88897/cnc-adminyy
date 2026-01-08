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


export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [viewOpen, setViewOpen] = useState<boolean>(false)
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null)
  const [formOpen, setFormOpen] = useState<boolean>(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [formId, setFormId] = useState<number | null>(null)

  // CSV upload states
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  // Spindle deletion states
  const [deleteSpindleOpen, setDeleteSpindleOpen] = useState<boolean>(false)
  const [spindleNameConfirm, setSpindleNameConfirm] = useState<string>("")
  const [isDeletingSpindle, setIsDeletingSpindle] = useState<boolean>(false)


  // numeric fields
  const [rpm, setRpm] = useState<string>("")
  const [feed, setFeed] = useState<string>("")
  const [doc, setDoc] = useState<string>("")
  const [stepover, setStepover] = useState<string>("")
  const [plunge, setPlunge] = useState<string>("")
  const [warning, setWarning] = useState<string>("")

  const baseUrl = useMemo(() => process.env.NEXT_PUBLIC_BASE_URL_ADMIN || "", [])
  const sortedSettings = useMemo(() => {
    // Ensure settings is always an array
    const settingsArray = Array.isArray(settings) ? settings : []
    
    const spindleIdFromSession = typeof window !== "undefined" ? sessionStorage.getItem("spindle_id") : null
    const spindleId = spindleIdFromSession ? Number(spindleIdFromSession) : null
    
    if (spindleId) {
      return [...settingsArray]
        .filter(setting => setting.spindle_id === spindleId)
        .sort((a, b) => b.setting_id - a.setting_id)
    }
    
    return [...settingsArray].sort((a, b) => b.setting_id - a.setting_id)
  }, [settings])

  const getToken = () => (typeof window !== "undefined" ? sessionStorage.getItem("Authorization") : null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken()
        
        // Fetch only spindle settings
        const settingsRes = await fetch(`${baseUrl}/admin/cnc/settings/spindle/${sessionStorage.getItem("spindle_id")}`, {
          headers: { Authorization: token || "" },
          cache: "no-store",
        })

        if (!settingsRes.ok) throw new Error(`Failed to load settings (${settingsRes.status})`)

        const responseData = await settingsRes.json()
        // Extract settings array from the response object
        const settingsData = responseData.settings || []
        setSettings(Array.isArray(settingsData) ? settingsData : [])
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
    setCsvFile(null)
    setIsDragOver(false)
    setIsUploading(false)
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

  // CSV upload handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'))
    
    if (csvFile) {
      setCsvFile(csvFile)
    } else {
      setError("Please select a valid CSV file")
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setCsvFile(file)
    } else {
      setError("Please select a valid CSV file")
    }
  }

  const removeFile = () => {
    setCsvFile(null)
  }

  // Spindle deletion handlers
  const openDeleteSpindle = () => {
    setSpindleNameConfirm("")
    setDeleteSpindleOpen(true)
  }

  const confirmDeleteSpindle = async () => {
    if (spindleNameConfirm !== spindleName) {
      setError("Spindle name does not match. Please enter the exact spindle name to confirm deletion.")
      return
    }

    try {
      setIsDeletingSpindle(true)
      const token = getToken()
      const spindleIdFromSession = typeof window !== "undefined" ? sessionStorage.getItem("spindle_id") : null
      
      if (!spindleIdFromSession) {
        setError("No spindle ID found in session")
        return
      }

      const response = await fetch(`${baseUrl}/admin/cnc/settings/delete/spindle/${spindleIdFromSession}`, {
        method: "DELETE",
        headers: {
          Authorization: token || "",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to delete spindle: ${errorText}`)
      }

      setDeleteSpindleOpen(false)
      setSpindleNameConfirm("")
      
      // Clear session storage and redirect to spindles page
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("spindle_id")
        sessionStorage.removeItem("spindle_name")
        window.location.href = "/admin/spindles"
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete spindle")
    } finally {
      setIsDeletingSpindle(false)
    }
  }

  const submitForm = async () => {
    try {
      const token = getToken()
      const isEdit = formMode === "edit" && formId !== null

      if (!isEdit) {
        // CSV upload mode
        if (!csvFile) {
          setError("Please select a CSV file to upload")
          return
        }

        const spindleIdFromSession = typeof window !== "undefined" ? sessionStorage.getItem("spindle_id") : null
        if (!spindleIdFromSession) {
          setError("No spindle selected. Please go back to spindles and select a spindle first.")
          return
        }

        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', csvFile)
        formData.append('spindle_id', spindleIdFromSession)

        const response = await fetch(`${baseUrl}/admin/cnc/settings/upload`, {
          method: "POST",
          headers: {
            Authorization: token || "",
          },
          body: formData,
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to upload CSV: ${errorText}`)
        }

        setFormOpen(false)
        setCsvFile(null)
        
        // refresh list
        const listRes = await fetch(`${baseUrl}/admin/cnc/settings/spindle/${sessionStorage.getItem("spindle_id")}`, {
          headers: { Authorization: token || "" },
          cache: "no-store",
        })
        if (listRes.ok) {
          const responseData = await listRes.json()
          const settingsData = responseData.settings || []
          setSettings(Array.isArray(settingsData) ? settingsData : [])
        }
        
        return
      }

      // Edit mode - keep original logic
      const original = settings.find((x) => x.setting_id === formId)
      const spindleId = original ? original.spindle_id : 0
      const materialId = original ? original.material_id : 0
      const bitId = original ? original.bit_id : 0
      
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
      
      const response = await fetch(`${baseUrl}/admin/cnc/settings/${formId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify(payload),
      })
      
      if (!response.ok) throw new Error("Failed to update setting")
      setFormOpen(false)
      
      // refresh list
      const listRes = await fetch(`${baseUrl}/admin/cnc/settings/spindle/${sessionStorage.getItem("spindle_id")}`, {
        headers: { Authorization: token || "" },
        cache: "no-store",
      })
      if (listRes.ok) {
        const responseData = await listRes.json()
        const settingsData = responseData.settings || []
        setSettings(Array.isArray(settingsData) ? settingsData : [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed")
    } finally {
      setIsUploading(false)
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
      const listRes = await fetch(`${baseUrl}/admin/cnc/settings/spindle/${sessionStorage.getItem("spindle_id")}`, {
        headers: { Authorization: token || "" },
        cache: "no-store",
      })
      if (listRes.ok) {
        const responseData = await listRes.json()
        const settingsData = responseData.settings || []
        setSettings(Array.isArray(settingsData) ? settingsData : [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    }
  }

  const downloadCSV = () => {
    if (!settings || settings.length === 0) {
      setError("No settings available to download")
      return
    }

    // CSV Headers
    const headers = ["Bit Id", "Bit Name", "Material Id", "Material", "RPM", "Feed", "DOC", "Stepover", "Plunge", "Warning"]
    
    // Convert settings to CSV rows
    const csvRows = [
      headers.join(","),
      ...settings.map(setting => {
        const row = [
          setting.bit_id,
          `"${setting.bit_name}"`,
          setting.material_id,
          `"${setting.material_name}"`,
          setting.rpm,
          setting.feed,
          setting.doc,
          setting.stepover,
          setting.plunge,
          setting.warning ? `"${setting.warning}"` : ""
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
    link.setAttribute("download", `settings_${spindleName || "spindle"}_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const spindleName = typeof window !== "undefined" ? sessionStorage.getItem("spindle_name") : ""
  const materialName = typeof window !== "undefined" ? sessionStorage.getItem("material_name") : ""
  const bitName = typeof window !== "undefined" ? sessionStorage.getItem("bit_name") : ""

  return (
    <div className="p-6">
      <div className="mb-6">
        <Heading color="white" heading1={spindleName || "Spindle"} heading2="Settings" subheading={`Manage your ${spindleName || "Spindle"} settings`} />
      </div>
      <div className="flex justify-between mb-4">
        <div>
          {/* <div className="flex text-white items-center gap-2"><span className="font-bold">Spindle:</span> <span className="font-bold text-xl">{spindleName}</span></div> */}
          {/* <div className="flex text-white items-center gap-2"><span className="font-bold">Material:</span> {materialName}</div> */}
          {/* <div className="flex text-white items-center gap-2"><span className="font-bold">Bit:</span> {bitName}</div> */}
        </div>
      
         <div className="flex gap-2">
         <Button onClick={downloadCSV} className="bg-teal-600 hover:bg-teal-700 text-white">Download CSV</Button>
         <Button onClick={openCreate} className="bg-teal-600 hover:bg-teal-700 text-white">Upload CSV</Button>
         <Button onClick={openDeleteSpindle} className="bg-red-600 hover:bg-red-700 text-white">Delete entire Spindle</Button>
         </div>
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
            <DialogTitle className="text-[#03BFB5]">{formMode === "edit" ? "Edit Setting" : "Upload CSV Settings"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {formMode === "create" ? (
              // CSV Upload Interface
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-white mb-4">Upload a CSV file to add multiple settings at once</p>
                  <p className="text-sm text-gray-300 mb-6">Spindle: <span className="font-bold text-[#03BFB5]">{spindleName}</span></p>
                </div>
                
                {/* Drag and Drop Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver 
                      ? 'border-[#03BFB5] bg-[#03BFB5]/10' 
                      : 'border-gray-400 hover:border-[#03BFB5]'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {csvFile ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-white font-medium">{csvFile.name}</span>
                      </div>
                      <div className="text-sm text-gray-300">
                        {(csvFile.size / 1024).toFixed(1)} KB
                      </div>
                      <Button
                        onClick={removeFile}
                        variant="outline"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                      >
                        Remove File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto bg-gray-600 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium">Drop your CSV file here</p>
                        <p className="text-sm text-gray-300">or click to browse</p>
                      </div>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="csv-upload"
                      />
                      <label
                        htmlFor="csv-upload"
                        className="inline-block px-4 py-2 bg-[#03BFB5] hover:bg-[#03BFB5]/80 text-white rounded-lg cursor-pointer transition-colors"
                      >
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-400 text-center">
                  <p>Supported format: CSV files only</p>
                  <p>Make sure your CSV contains the required columns for settings</p>
                </div>
              </div>
            ) : (
              // Edit Mode - Original Form
              <div className="space-y-4">
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
            )}
          </div>
          <DialogFooter>
            <Button 
              onClick={submitForm} 
              disabled={
                formMode === "create" 
                  ? (!csvFile || isUploading)
                  : false
              }
              className="bg-[#03BFB5] hover:bg-[#03BFB5]/80 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : formMode === "edit" ? "Update" : "Upload CSV"}
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

      {/* Delete Spindle Confirmation Modal */}
      <Dialog open={deleteSpindleOpen} onOpenChange={setDeleteSpindleOpen}>
        <DialogContent className="bg-[#004851] border-4 border-red-500 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-500 text-xl font-bold"> Delete Entire Spindle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
              <p className="text-red-300 font-semibold mb-2">This action cannot be undone!</p>
              <p className="text-white">
                This will permanently delete the spindle <span className="font-bold text-[#03BFB5]">&quot;{spindleName}&quot;</span> and 
                <span className="font-bold text-red-400"> ALL {sortedSettings.length}</span> settings associated with it.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="spindle-name-confirm" className="text-white font-medium">
                To confirm deletion, type the spindle name exactly as shown:
              </Label>
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 mb-2">
                <span className="text-[#03BFB5] font-bold text-lg">&quot;{spindleName}&quot;</span>
              </div>
              <Input
                id="spindle-name-confirm"
                value={spindleNameConfirm}
                onChange={(e) => setSpindleNameConfirm(e.target.value)}
                placeholder="Type spindle name here..."
                className="bg-white text-black"
                autoComplete="off"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              onClick={() => setDeleteSpindleOpen(false)}
              variant="outline"
              className="bg-gray-600 hover:bg-gray-700 text-white border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteSpindle}
              disabled={spindleNameConfirm !== spindleName || isDeletingSpindle}
              className="bg-red-600 hover:bg-red-700 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeletingSpindle ? "Deleting..." : "Delete Spindle & All Settings"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}



