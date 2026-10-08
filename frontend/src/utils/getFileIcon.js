import {
  File,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Folder,
  Presentation,
} from 'lucide-react';
import { getFileCategory } from '../constants/fileTypes';

const ICON_MAP = {
  folder: { icon: Folder, color: 'text-amber-500', bg: 'bg-amber-50' },
  image: { icon: FileImage, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  video: { icon: FileVideo, color: 'text-purple-500', bg: 'bg-purple-50' },
  audio: { icon: FileAudio, color: 'text-pink-500', bg: 'bg-pink-50' },
  document: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
  spreadsheet: { icon: FileSpreadsheet, color: 'text-green-600', bg: 'bg-green-50' },
  presentation: { icon: Presentation, color: 'text-orange-500', bg: 'bg-orange-50' },
  archive: { icon: FileArchive, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  code: { icon: FileCode, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  other: { icon: File, color: 'text-slate-500', bg: 'bg-slate-100' },
};

export function getFileIconConfig(item) {
  if (item?.type === 'folder' || item?.is_folder) {
    return ICON_MAP.folder;
  }

  const category = getFileCategory(item?.name, item?.mime_type);
  return ICON_MAP[category] || ICON_MAP.other;
}
