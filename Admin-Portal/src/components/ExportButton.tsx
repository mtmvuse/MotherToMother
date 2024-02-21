import React from "react";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

interface ExportButtonProps {
  handleExport: () => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({ handleExport }) => {
  return (
    <Button
      onClick={handleExport}
      variant="contained"
      sx={{ margin: "auto 10px 10px auto" }}
    >
      <DownloadIcon sx={{ marginRight: "6px" }} />
      Export
    </Button>
  );
};

export default ExportButton;
