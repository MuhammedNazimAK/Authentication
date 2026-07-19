import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserData } from '../context/UserContext';

export const Register = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const { RegisterUser, isSubmitting } = UserData();
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            setPreview(URL.createObjectURL(file));
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append("name", name);
        formdata.append("email", email);
        formdata.append("password", password);
        formdata.append("gender", gender.toLowerCase());
        formdata.append("file", file);

      RegisterUser(formdata, navigate);
    }

    return (
    <div className="min-h-screen flex justify-center items-center px-4 py-10">
      <div className="bg-surface border border-border rounded-md px-8 py-10 w-full max-w-sm">

        <div className="text-center mb-7">
          <h1 className="text-5xl text-text tracking-widest mb-1">Core</h1>
          <p className="text-[0.7rem] text-muted tracking-[0.18em]">create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div className="flex justify-center mb-2">
            <label htmlFor="profilePic" className="w-19 h-19 rounded-full border border-border bg-surface flex items-center justify-center overflow-hidden cursor-pointer">
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
              id="profilePic"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-muted uppercase tracking-widest text-xs">full name</label>
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
            <label className="text-muted uppercase tracking-widest text-xs">email</label>
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
            <label className="text-muted uppercase tracking-widest text-xs">password</label>
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
            <label className="text-muted uppercase tracking-widest text-xs">gender</label>
            <div className="flex gap-2">
              {["Male", "Female", "Other"].map((g) => (
                <label
                  key={g}
                  className={`flex-1 text-center py-2 text-xs tracking-wide border rounded cursor-pointer transition-colors duration-200 ${gender === g ? "border-accent text-accent" : "border-border text-muted"}`}
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

          <button type="submit" className="auth-btn" disabled={isSubmitting}>
            {isSubmitting ? "Loading..." : "create account"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-muted">
          already have an account?{" "}
          <Link to="/login" className="text-text">
            sign in
          </Link>
        </p>

      </div>
    </div>
  );
}