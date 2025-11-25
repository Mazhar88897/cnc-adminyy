import React, { useState } from "react";
import ConfirmationModal from "@/components/dashboardItems/confirmationModal"; // Import the new modal
import { useRouter } from "next/navigation";
// import { useRouter } from 'next/router';
export default function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleResetSettingClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmReset = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cnc/reset-preference`, {
        method: 'DELETE',
        headers: {
         'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to reset preferences');
        return;
      }
      
    } catch (err) {
      console.log(err)
    } finally {
      setIsConfirmModalOpen(false);
      sessionStorage.setItem('rememberChoice', 'false') 
      window.location.replace('/dashboard');

      onClose(); // Close settings modal
    }
  };

  const handleCancelReset = () => {
    setIsConfirmModalOpen(false); // Close confirmation modal
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#004851] border-4 border-[#03BFB5] rounded-lg p-6 min-w-[300px] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#03BFB5] text-2xl font-bold focus:outline-none"
        >
          ×
        </button>
        <h2 className="text-[#03BFB5] text-xl font-bold mb-6">Setting</h2>
        <div className="flex flex-col gap-4">
          {/* <button className="bg-[#03BFB5] text-white font-bold py-2 rounded-md">Profile Setting</button> */}
          <button
            className="bg-[#03BFB5] text-white font-bold py-2 rounded-md"
            onClick={handleResetSettingClick} // Add onClick handler
          >
            Reset Setting
          </button>
          <button onClick={()=>{ sessionStorage.clear();
                router.push('/auth/sign-in');}} className="bg-[#03BFB5] text-[#004851] font-bold py-2 rounded-md">logout</button>
        </div>
      </div>

      {/* Render the ConfirmationModal */}
      <ConfirmationModal
        open={isConfirmModalOpen}
        onClose={handleCancelReset} // Close handler for confirmation modal
        onConfirm={handleConfirmReset} // Confirm handler
        title="Warning"
        message="Are you sure you want to Reset Setting ?"
      />
    </div>
  );
}