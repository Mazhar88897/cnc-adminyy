import React from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

interface SponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SponsorModal: React.FC<SponsorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const SponsorLogo = ({ size = 'medium' }: { size?: 'large' | 'medium' | 'small' }) => {
    const sizeClasses = {
      large: 'h-20 w-32',
      medium: 'h-16 w-24',
      small: 'h-12 w-20'
    };

    return (
      <div className="flex flex-col items-center space-y-2">
        <Image
          src="/only-cnc.svg"
          alt="ONLY CNCs Logo"
          width={size === 'large' ? 160 : size === 'medium' ? 120 : 80}
          height={size === 'large' ? 100 : size === 'medium' ? 80 : 60}
          className={`w-auto ${sizeClasses[size]}`}
        />
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0  flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#004146] border-4 border-white rounded-[5px] p-8 max-w-[440px] w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-left mb-3">
          <p className="text-gray-200 text-sm font-semibold te">Empowering Our Journey</p>
          <h2 className="text-2xl sm:text-3xl font-bold">
            <span className="text-white">Our Proud </span>
            <span className="text-[#14B8A6]">Sponsors</span>
          </h2>
        </div>

        {/* Body Text */}
        <div className="text-center mb-8">
          <p className="text-left text-white font-semibold text-xs">
            We are grateful for the incredible support of our sponsors who make this mission possible. 
            Their partnership helps us grow, innovate, and deliver more value to our CNC community.
          </p>
        </div>

        {/* Sponsor Logos Grid */}
        <div className="space-y-8">
          {/* Row 1 - 2 Large Logos */}
          <div className="flex justify-center gap-12">
            <SponsorLogo size="large" />
            <SponsorLogo size="large" />
          </div>
          
          {/* Row 2 - 3 Medium Logos */}
          <div className="flex justify-center gap-8">
            <SponsorLogo size="medium" />
            <SponsorLogo size="medium" />
            <SponsorLogo size="medium" />
          </div>
          
          {/* Row 3 - 4 Small Logos */}
          <div className="flex justify-center gap-6">
            <SponsorLogo size="small" />
            <SponsorLogo size="small" />
            <SponsorLogo size="small" />
            <SponsorLogo size="small" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorModal;