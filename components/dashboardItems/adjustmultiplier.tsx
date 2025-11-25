"use client"

import React, { useEffect, useState } from "react";
import { X, Plus, Minus } from "lucide-react"; // Assuming you have lucide-react installed
import WarningModal from "@/components/dashboardItems/warningmodal";
import Swal from "sweetalert2";

interface AdjustMultiplierModalProps {
  open: boolean;
  onClose: () => void;
  initialValue?: number; // Optional initial value
  onSaveMultiplier: (newMultiplier: number) => void; // Add this prop
}



export default function AdjustMultiplierModal({
  open,
  onClose,
  initialValue = 1, // Default value without sessionStorage
  onSaveMultiplier, // Destructure the new prop
}: AdjustMultiplierModalProps) {
  const [multiplier, setMultiplier] = useState(initialValue);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showSuccessFlag, setShowSuccessFlag] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedMultiplier = sessionStorage.getItem('multiplier');
      const storedToken = sessionStorage.getItem('token');
      
      if (storedMultiplier) {
        setMultiplier(parseFloat(storedMultiplier));
      }
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, [])

  if (!open) return null;

  const handlePlusClick = () => {
    setMultiplier(prev => parseFloat((prev + 0.1).toFixed(1)));
  };

  const handleMinusClick = () => {
    setMultiplier(prev => parseFloat((prev - 0.1).toFixed(1)));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setMultiplier(parseFloat(value.toFixed(1)));
    } else {
        setMultiplier(0);
    }
  };

  const handleSaveClick = () => {
    
    setIsWarningModalOpen(true);
  };

  const handleProceedFromWarning = () => {
    // Call the parent handler with the new multiplier
    onSaveMultiplier(multiplier);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('multiplier', multiplier.toString());
    }
    setIsWarningModalOpen(false); // Close warning modal
    onClose(); // Close adjust multiplier modal
  };

  const handleShare = async () => {
    setIsSharing(true);
    setShowSuccessFlag(false);
    
    try {
      // Get the required data from sessionStorage
      if (typeof window === 'undefined') {
        throw new Error('Cannot access sessionStorage on server side');
      }
      
      const machine = sessionStorage.getItem('selectedMachine');
      const spindle = sessionStorage.getItem('selectedRouter');
      const bit = sessionStorage.getItem('selectedBit');
      const material = sessionStorage.getItem('selectedMaterial');
      
      const requestBody = {
        machine: machine || '',
        spindle: spindle || '',
        bit: bit || '',
        material: material || '',
        multiplier: multiplier
      };

      console.log('Sharing settings:', requestBody);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cnc/share-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        // Show success alert
        await Swal.fire({
          title: 'Success!',
          text: 'Your message has been sent successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#03BFB5'
        })
          setShowSuccessFlag(true);
        // Hide success flag after 3 seconds
        setTimeout(() => {
          setShowSuccessFlag(false); 
        }, 3000);
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error sharing settings:', error);
      alert('Error sharing settings. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center  p-4 ">
      <div className="bg-[#004851] border-4 border-[#03BFB5] rounded-lg p-6 w-full max-w-sm relative text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300"
        >
          <X size={24} />
        </button>
        <h2 className="text-[#03BFB5] text-xl font-bold mb-4">Area Clearance (Pocket):</h2>

        <p className="text-sm mb-4">
          By increasing or decreasing this number, you can tune the settings to your machine.
        </p>
         <p className="text-sm mb-6 font-bold">
          One click of the + or - will adjust the core value by 10%
        </p>


        <div className="flex items-center justify-center gap-4 mb-6">
        <button
            onClick={handleMinusClick}
            className="bg-[#03BFB5] text-[#004851] p-2 rounded-md hover:bg-[#03BFB5]/80"
          >
            <Minus size={24} />
          </button>
          <input
            type="number"
            value={multiplier}
            onChange={handleInputChange}
            className="w-20 text-center p-2 rounded-md bg-white text-black font-bold text-lg"
            step="0.1"
          />
           <button
            onClick={handlePlusClick}
            className="bg-[#03BFB5] text-[#004851] p-2 rounded-md hover:bg-[#03BFB5]/80"
          >
            <Plus size={24} />
          </button>
        
        </div>

        <button
          onClick={handleSaveClick} // Call the new handler
          className="w-full bg-[#03BFB5] text-white font-bold py-2 rounded-md mb-4 hover:bg-[#03BFB5]/80 transition-colors"
        >
          Save
        </button>

        <p className="text-sm text-center mb-4">
          Feedback is vital. If this new value is better, please click the share button
        </p>

         <button
          onClick={handleShare}
          disabled={isSharing}
          className="w-full bg-[#03BFB5] text-[#004851] font-bold py-2 rounded-md hover:bg-[#03BFB5]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSharing ? 'Sharing...' : 'Share'}
        </button>

        {/* Success Flag */}
        {showSuccessFlag && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[300] animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Feedback submitted successfully!</span>
            </div>
          </div>
        )}

      </div>

      {/* Warning Modal */}
      <WarningModal
        open={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)} // Close warning modal handler
        onProceed={handleProceedFromWarning} // Handler for Proceed button
        title="Warning"
        message="Be cautious with this setting"
      />

    </div>
  );
}