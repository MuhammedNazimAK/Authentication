import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const CreatePostModal = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    return () => {
        if (preview) URL.revokeObjectURL(preview);
    };
 }, [preview]);

  const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile.size > 40 * 1024 * 1024) {
            toast.error("File is too large. Please select a file under 40MB.");
            return;
        }
        if (selectedFile) {
            setFile(selectedFile);
            const type = selectedFile.type.startsWith('video') ? 'video' : 'image';
            setFileType(type);
            setPreview(URL.createObjectURL(selectedFile));
        }
    }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111]/40 backdrop-blur-sm p-4">
      <div className="bg-[#FDFBF8] w-full max-w-lg rounded-xl overflow-hidden border border-[#DDD8CF]">
        
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#DDD8CF]">
          <button onClick={onClose} className="text-xs uppercase tracking-widest text-[#99968F]">Cancel</button>
          <span className="text-sm font-medium tracking-wide">Create New Post</span>
          <button 
             disabled={!file || isSubmitting}
             className="text-xs uppercase tracking-widest text-[#111] font-bold disabled:opacity-30"
          >
            {isSubmitting ? "Sharing..." : "Share"}
          </button>
        </div>

        <div className="flex flex-col">
          {!file ? (
            <label className="flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-[#F0EBE1]/30">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#99968F" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span className="mt-4 text-[0.7rem] uppercase tracking-widest text-[#99968F]">Select from device</span>
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,video/*" />
            </label>
          ) : (
            <>
              {fileType === 'image' ? (
                    <img 
                    src={preview} 
                    className="w-full h-full object-contain" 
                    alt="Preview" 
                    />
                ) : (
                    <video 
                    src={preview} 
                    className="w-full h-full object-contain" 
                    controls 
                    autoPlay 
                    muted 
                    loop
                    />
                )}
              <textarea
                placeholder="Write a caption..."
                className="w-full p-4 text-sm bg-transparent outline-none resize-none h-24"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};