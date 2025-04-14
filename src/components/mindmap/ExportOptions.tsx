import React, { useCallback } from 'react';
import { Button } from '../ui/button';
import { Download, FileText, Image, Share2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ExportOptionsProps {
  onExport: (format: 'svg' | 'png' | 'pdf') => void;
  onShare?: () => void;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({
  onExport,
  onShare,
}) => {
  const handleExport = useCallback(
    (format: 'svg' | 'png' | 'pdf') => {
      onExport(format);
    },
    [onExport]
  );

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExport('png')}
          className="flex items-center gap-2"
        >
          <Image className="h-4 w-4" />
          Export as PNG
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExport('svg')}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Export as SVG
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExport('pdf')}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export as PDF
        </Button>
      </div>
      {onShare && (
        <Button
          variant="outline"
          size="sm"
          onClick={onShare}
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share Map
        </Button>
      )}
    </div>
  );
}; 