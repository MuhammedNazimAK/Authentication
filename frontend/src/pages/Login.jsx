import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserData } from '../context/UserContext';

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const { LoginUser, isSubmitting } = UserData();

    const handleSubmit = (e) => {
        e.preventDefault();
        LoginUser(email, password, navigate);
    }

    return (
    <div className="min-h-screen flex justify-center items-center px-4 py-10">
      <div className="bg-surface border border-border rounded-md px-8 py-10 w-full max-w-sm">

        <div className="text-center mb-7">
          <h1 className="text-5xl text-text tracking-widest mb-1">Core</h1>
          <p className="text-[0.7rem] text-muted tracking-[0.18em]">sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div className="flex flex-col gap-1">
            <label className="text-muted uppercase tracking-widest text-xs">email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
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
            />
          </div>

          <button type="submit" className="auth-btn" disabled={isSubmitting}>
            {isSubmitting ? "Loading..." : "sign in"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-muted">
          don't have an account?{" "}
          <Link to="/register" className="text-text">
            sign up
          </Link>
        </p>

      </div>
    </div>
  );
}