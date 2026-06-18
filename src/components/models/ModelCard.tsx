"use client";

import { Download, Box } from "lucide-react";

export interface FreeModelItem {
  _id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  fileUrl?: string;
  fileFormat: string;
  fileSize?: string;
  category: string;
  tags: string[];
  downloads: number;
  isActive: boolean;
  order: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  functional: "ชิ้นส่วนใช้งาน",
  decorative: "ของตกแต่ง",
  art: "งานศิลปะ",
  toys: "ของเล่น",
  other: "อื่นๆ",
};

const CATEGORY_COLORS: Record<string, string> = {
  functional: "bg-blue-100 text-blue-700",
  decorative: "bg-pink-100 text-pink-700",
  art: "bg-purple-100 text-purple-700",
  toys: "bg-amber-100 text-amber-700",
  other: "bg-slate-100 text-slate-600",
};

interface ModelCardProps {
  model: FreeModelItem;
  onDownload?: (id: string) => void;
}

export default function ModelCard({ model, onDownload }: ModelCardProps) {
  const handleDownloadClick = () => {
    if (model.fileUrl) {
      onDownload?.(model._id);
      window.open(model.fileUrl, "_blank");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col">
      {/* Thumbnail */}
      <div className="aspect-square bg-slate-100 relative overflow-hidden flex items-center justify-center">
        {model.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={model.thumbnail}
            alt={model.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <Box className="w-16 h-16 text-slate-300 group-hover:text-blue-400 transition-colors duration-300" />
        )}
        {/* Format badge overlay */}
        <div className="absolute top-2 left-2">
          <span className="text-[10px] font-bold bg-white/90 text-slate-600 px-2 py-0.5 rounded shadow-sm border border-slate-200">
            {model.fileFormat}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category badge */}
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit mb-2 ${CATEGORY_COLORS[model.category] || CATEGORY_COLORS.other}`}>
          {CATEGORY_LABELS[model.category] || model.category}
        </span>

        <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-2">{model.name}</h3>

        {model.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-2 flex-1">{model.description}</p>
        )}

        {/* Tags */}
        {model.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {model.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
            <Download className="w-3 h-3" />
            <span>{model.downloads.toLocaleString()}</span>
            {model.fileSize && (
              <span className="ml-1 text-slate-300">· {model.fileSize}</span>
            )}
          </div>

          {model.fileUrl ? (
            <button
              onClick={handleDownloadClick}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              ดาวน์โหลด
            </button>
          ) : (
            <button
              disabled
              className="flex items-center gap-1.5 bg-slate-100 text-slate-400 text-xs font-bold px-3 py-1.5 rounded-lg cursor-not-allowed"
            >
              ไม่มีไฟล์
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
