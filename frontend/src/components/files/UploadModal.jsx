import { useCallback, useState, useRef } from 'react';
import { CloudUpload, File, X } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { formatBytes } from '../../utils/formatBytes';
import { MAX_UPLOAD_SIZE_MB } from '../../constants/routes';
import { handleApiError } from '../../utils/errorHandler';

export default function UploadModal({
  isOpen,
  onClose,
  onUpload,
  uploadProgress = 0,
  folderId = null,
}) {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const reset = () => {
    setFiles([]);
    setDragActive(false);
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    if (!uploading) {
      reset();
      onClose();
    }
  };

  const addFiles = (fileList) => {
    const maxSize = MAX_UPLOAD_SIZE_MB * 1024 * 1024;
    const rejected = [];
    const valid = Array.from(fileList).filter((f) => {
      if (f.size > maxSize) {
        rejected.push(f.name);
        return false;
      }
      return true;
    });
    if (rejected.length > 0) {
      handleApiError(
        { message: `${rejected.length} file(s) exceeded ${MAX_UPLOAD_SIZE_MB} MB limit: ${rejected.join(', ')}` },
        'Some files were too large'
      );
    }
    setFiles((prev) => [...prev, ...valid]);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) {
      addFiles(e.dataTransfer.files);
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    const success = await onUpload(files, folderId);
    setUploading(false);
    if (success) {
      reset();
      onClose();
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files?.length) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  };

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload Files" size="lg">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative rounded-xl border-2 border-dashed p-8 text-center transition-colors
          ${dragActive ? 'border-brand-400 bg-brand-50' : 'border-slate-300 bg-slate-50'}
        `}
      >
        <CloudUpload className="mx-auto mb-3 h-12 w-12 text-slate-400" />
        <p className="text-sm font-medium text-slate-700">
          Drag and drop files here, or{' '}
          <label className="cursor-pointer text-brand-600 hover:text-brand-700">
            browse
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
            />
          </label>
        </p>
        <p className="mt-1 text-xs text-slate-500">Max file size: {MAX_UPLOAD_SIZE_MB} MB</p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 max-h-48 space-y-2 overflow-y-auto scrollbar-thin">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              <File className="h-4 w-4 shrink-0 text-slate-400" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-slate-900">{file.name}</p>
                <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
              </div>
              {!uploading && (
                <button
                  onClick={() => removeFile(index)}
                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-3 text-sm text-slate-500">
          Total: {formatBytes(totalSize)} ({files.length} file{files.length !== 1 ? 's' : ''})
        </div>
      )}

      {uploading && uploadProgress > 0 && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-slate-500">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-brand-500 transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>
        <Button onClick={handleUpload} loading={uploading} disabled={files.length === 0}>
          Upload {files.length > 0 && `(${files.length})`}
        </Button>
      </div>
    </Modal>
  );
}
