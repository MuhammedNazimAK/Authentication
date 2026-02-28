import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Register = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setPreview(URL.createObjectURL(file));
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log( name, email, password, gender );
    }

    return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="text-center mb-8">
          <h1 className="auth-logo">Core</h1>
          <p className="auth-tagline">create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div className="flex justify-center mb-2">
            <label htmlFor="profilePic" className="avatar-upload">
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1 text-[#99968F]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className="text-[10px] tracking-widest">photo</span>
                </div>
              )}
            </label>
            <input
              id="profilePic"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="auth-label">full name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="auth-input"
              placeholder="Jane Doe"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="auth-label">email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              placeholder="jane@example.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="auth-label">password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
              className="auth-input"
              placeholder="min. 8 characters"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="auth-label">gender</label>
            <div className="flex gap-2">
              {["male", "female", "other"].map((g) => (
                <label
                  key={g}
                  className={`gender-option ${gender === g ? "gender-selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={gender === g}
                    onChange={(e) => setGender(e.target.value)}
                    className="hidden"
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="auth-btn">
            create account
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-[#99968F]">
          already have an account?{" "}
          <Link to="/login" className="text-[#111] underline underline-offset-2">
            sign in
          </Link>
        </p>

      </div>
    </div>
  );
}