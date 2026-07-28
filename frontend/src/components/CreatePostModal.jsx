import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PostData } from "../context/PostContext";

export const CreatePostModal = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const { addPost } = PostData();

  useEffect(() => {
    return () => {
        if (preview) URL.revokeObjectURL(preview);
    };
 }, [preview]);

  const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        if (selectedFile.size > 40 * 1024 * 1024) {
            toast.error("File is too large. Please select a file under 40MB.");
            return;
        }
          setFile(selectedFile);
          setFileType(selectedFile.type.startsWith('video') ? 'video' : 'image');
          setPreview(URL.createObjectURL(selectedFile));
    }

    const captionError = caption.length > 200 ? 'Caption cannot exceed 200 characters' : null;

    const submitHandler = async (e) => {
      e.preventDefault();

      if (!file) return toast.error("Please select a file to upload.");
      const type = file.type.startsWith('video') ? 'reel' : 'post';

      const formData = new FormData();
      formData.append("file", file);
      formData.append("caption", caption);
      formData.append("type", type);

      setIsSubmitting(true);
      await addPost(formData, setFile, setCaption, setFileType, setPreview);
      setIsSubmitting(false);
      onClose();
    }

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-bg/40 backdrop-blur-sm p-4">
      <form onClick={(e) => e.stopPropagation()} onSubmit={submitHandler} className="bg-bg w-full max-w-lg rounded-xl overflow-hidden border border-border h-[60dvh] flex flex-col">
        
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <button onClick={onClose} className="w-20 text-left text-xs uppercase tracking-widest text-subtle cursor-pointer">Cancel</button>
          <span className="text-sm font-medium tracking-wide">Create New Post</span>
          <button
             type="submit"
             disabled={captionError || !file || isSubmitting}
             className="w-20 text-right text-xs uppercase tracking-widest text-text font-bold disabled:opacity-30 cursor-pointer"
          >
            {isSubmitting ? "Sharing..." : "Share"}
          </button>
        </div>

        <div className="flex flex-col min-h-0 flex-1">
          {!file ? (
            <label className="flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-surface/30">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#99968F" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span className="mt-4 text-[0.7rem] uppercase tracking-widest text-subtle">Select from device</span>
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,video/*" />
            </label>
          ) : (
            <>
              <div className="h-72 w-full overflow-hidden bg-bg">
                {fileType === 'image' ? (
                  <img src={preview} className="w-full h-full object-contain" alt="Preview" />
                ) : (
                  <video src={preview} className="w-full h-full object-contain" controls autoPlay muted loop />
                )}
              </div>
              <textarea
                placeholder="Write a caption..."
                className="w-full flex-1 p-4 text-sm bg-transparent outline-none resize-none"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              {captionError && <p className="text-red-500 text-center font-medium">{captionError}</p>}
            </>
          )}
        </div>
      </form>
    </div>
  );
};