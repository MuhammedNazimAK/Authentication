import { useState } from "react";
import { UserData } from "../context/UserContext";

export const Settings = ({ user }) => {
    const [name, setName] = useState(user.name);
    const [gender, setGender] = useState(user.gender)
    const [file, setFile] = useState(user.profilePic);
    const [preview, setPreview] = useState(user?.profilePic.url);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
    const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);

    const { updateProfile, updatePassword } = UserData();

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsProfileSubmitting(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("gender", gender.toLowerCase());
        if (file) formData.append("file", file);

        await updateProfile(user._id, formData);
        setIsProfileSubmitting(false);
    }
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setIsPasswordSubmitting(true);
        await updatePassword(user._id, { oldPassword, newPassword });
        setIsPasswordSubmitting(false);
        setNewPassword("");
        setOldPassword("");
    }

    return (
        <div className="max-w-md mx-auto py-12 px-4">
            <div>
        <div className="mb-8">
            <h1 className="text-3xl text-text tracking-widest mb-1">Settings</h1>
            <p className="text-[0.7rem] text-muted tracking-[0.24em]">manage your account profile</p>
        </div>
            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-5">
            <div className="flex items-center gap-4 mb-2">
            <label htmlFor="settingsProfilePic" className="w-19 h-19 rounded-full border border-border bg-surface flex items-center justify-center overflow-hidden cursor-pointer shrink-0">
                {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                <div className="flex flex-col items-center gap-1 text-muted">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-[10px] tracking-widest">photo</span>
                </div>
                )}
            </label>
            <input
                id="settingsProfilePic"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
            />
            <label htmlFor="settingsProfilePic" className="text-xs text-muted cursor-pointer hover:text-text transition-colors">
                change profile photo
            </label>
            </div>

            <div className="flex flex-col gap-1">
            <label className="text-muted uppercase tracking-widest text-xs">full name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="auth-input"
            />
            </div>
            <div className="flex flex-col gap-2">
            <label className="text-muted uppercase tracking-widest text-xs">gender</label>
            <div className="flex gap-2">
                {["Male", "Female", "Other"].map((g) => (
                <label
                    key={g}
                    className={`flex-1 text-center py-2 text-xs tracking-wide border rounded cursor-pointer transition-colors duration-200 ${
                    gender.toLowerCase() === g.toLowerCase() ? "border-accent text-accent" : "border-border text-muted"
                    }`}
                >
                    <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={gender.toLowerCase() === g.toLowerCase()}
                    onChange={(e) => setGender(e.target.value)}
                    className="hidden"
                    />
                    {g}
                </label>
                ))}
            </div>
            </div>
            <button type="submit" className="auth-btn mt-2" disabled={isProfileSubmitting}>
            {isProfileSubmitting ? "Saving..." : "Save Changes"}
            </button>
        </form>
      </div>

      <div className="pt-6 border-t border-border">
      <h2 className="text-x uppercase tracking-widest text-text mb-4">change password</h2>
      <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="Current password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="auth-input"
        />
        <button type="submit" className="auth-btn" disabled={isPasswordSubmitting}>
          {isPasswordSubmitting ? "Updating..." : "Update Password" }
        </button>
      </form>
    </div>
  </div>
    )
}