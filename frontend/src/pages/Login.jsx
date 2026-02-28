import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log( email, password );
    }

    return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="text-center mb-8">
          <h1 className="auth-logo">Core</h1>
          <p className="auth-tagline">sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div className="flex flex-col gap-1">
            <label className="auth-label">email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
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
            />
          </div>

          <button type="submit" className="auth-btn">
            sign in
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-[#99968F]">
          don't have an account?{" "}
          <Link to="/register" className="text-[#111] underline underline-offset-2">
            sign up
          </Link>
        </p>

      </div>
    </div>
  );
}