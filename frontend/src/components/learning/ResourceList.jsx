import React from 'react';
import { Download, FileText, FileSpreadsheet, FileCode } from 'lucide-react';
import Button from '../ui/Button';

export default function ResourceList({ resources = [] }) {
  if (!resources || resources.length === 0) {
    return (
      <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 text-center text-xs text-gray-500">
        No downloadable attachments for this lesson.
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'sheet': return <FileSpreadsheet className="h-4 w-4 text-emerald-600" />;
      case 'cad': return <FileCode className="h-4 w-4 text-purple-600" />;
      default: return <FileText className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
        Lesson Attachments ({resources.length})
      </h4>
      {resources.map((res, index) => (
        <div 
          key={index}
          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              {getIcon(res.type)}
            </div>
            <div>
              <h5 className="text-xs font-semibold text-gray-900">{res.name}</h5>
              <span className="text-[10px] font-mono text-gray-500">{res.size}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={() => alert(`Downloading ${res.name}`)}
          >
            Download
          </Button>
        </div>
      ))}
    </div>
  );
}
