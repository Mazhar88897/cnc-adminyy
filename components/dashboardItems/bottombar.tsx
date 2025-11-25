"use client"        

import React, { useState } from "react";
import ReportIssueModal from "@/components/dashboardItems/ReportIssueModal"; // Assuming this path is correct
function BottomBar() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const openReportModal = () => setIsReportModalOpen(true);
  const closeReportModal = () => setIsReportModalOpen(false);

  return (
    <>
      {/* Bottom - Report */}
      <div className="fixed bottom-0 left-0 right-0 p-5 text-end text-sm text-[#CBCBCB] font-bold bg-[#004146] z-[100]">
        <button onClick={openReportModal} className="hover:underline">
          Report An Issue?
        </button>
      </div>

      {/* Report Issue Modal */}
      <ReportIssueModal
        open={isReportModalOpen}
        onClose={closeReportModal}
      />
    </>
  );
}

export default BottomBar;
