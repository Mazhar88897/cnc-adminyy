import React, { useState } from "react";
import { X } from "lucide-react";
import Swal from 'sweetalert2';

interface ReportIssueModalProps {
  open: boolean;
  onClose: () => void;
}

const ReportIssueModal = ({ open, onClose }: ReportIssueModalProps) => {
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Show success alert with report theme
        await Swal.fire({
          title: 'Issue Reported Successfully!',
          text: 'Thank you for reporting this issue. We will investigate and get back to you soon.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#03BFB5',
          background: '#004851',
          color: '#ffffff',
          customClass: {
            popup: 'swal2-popup-report',
            title: 'swal2-title-report',
            htmlContainer: 'swal2-html-container-report'
          }
        });
        
        // Reset form and close modal
        setFormData({ email: "", subject: "", message: "" });
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to report issue');
      }
    } catch (error) {
      // Show error alert with report theme
      await Swal.fire({
        title: 'Error Reporting Issue',
        text: error instanceof Error ? error.message : 'Failed to report issue. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#03BFB5',
        background: '#004851',
        color: '#ffffff',
        customClass: {
          popup: 'swal2-popup-report',
          title: 'swal2-title-report',
          htmlContainer: 'swal2-html-container-report'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-[#004851] border-4 border-[#03BFB5] rounded-lg p-6 w-full max-w-md relative text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300"
          disabled={isLoading}
        >
          <X size={24} />
        </button>
        <h2 className="text-[#03BFB5] text-2xl font-bold mb-2">Report An Issue</h2>
        <p className="text-sm mb-6">
          Fill out the form below to report an issue or get help with your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-bold mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 rounded-md bg-white text-black placeholder-gray-500"
              placeholder="jhondow@email.com"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-bold mb-1">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full p-2 rounded-md bg-white text-black placeholder-gray-500"
              placeholder="Brief Description of your problem"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-bold mb-1">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full p-2 rounded-md bg-white text-black placeholder-gray-500 min-h-[100px]"
              placeholder="Enter your message here..."
              required
              disabled={isLoading}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-[#03BFB5] text-[#004851] font-bold py-2 rounded-md hover:bg-[#03BFB5]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Reporting Issue...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportIssueModal;