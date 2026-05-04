import { useRef, useState } from 'react';
import { ImagePlus, RefreshCw } from 'lucide-react';

interface PhotoUploadProps {
  currentDataUrl: string;
  onUpload: (dataUrl: string) => void;
}

export function PhotoUpload({ currentDataUrl, onUpload }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentDataUrl);

  const handleFile = (file: File) => {
    setError('');
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError('Image must be smaller than 15 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;

      // Check resolution via an Image element
      const img = new Image();
      img.onload = () => {
        if (img.width < 400 || img.height < 400) {
          setError('Image resolution is too low. Please use at least 400×400 px.');
          return;
        }
        setPreview(dataUrl);
        onUpload(dataUrl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="relative group rounded-2xl overflow-hidden aspect-[9/16] max-h-64 w-full">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 bg-white/90 text-slate-800 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Change photo
            </button>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <ImagePlus className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-primary font-medium mb-1">Upload your motivation photo</p>
          <p className="text-secondary text-sm">Drag & drop or click to browse</p>
          <p className="text-secondary text-xs mt-1">Portrait photos work best • Max 15 MB</p>
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
