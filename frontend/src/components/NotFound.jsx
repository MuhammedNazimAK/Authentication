import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-8">
        <h1 
          className="text-8xl md:text-9xl text-text opacity-10 select-none"
        >
          404
        </h1>
      </div>

      <div className="max-w-md">
        <h2 
          className="text-2xl md:text-3xl text-text mb-4 tracking-tight"
        >
          Page not found.
        </h2>
        <p className="text-muted text-sm leading-relaxed mb-8 tracking-wide uppercase text-[0.7rem]">
          The page you are looking for has been moved, or deleted.
        </p>
      </div>

      <Link
        to="/"
        className="px-8 py-3 bg-surface text-text text-[0.7rem] tracking-[0.2em] uppercase rounded-md hover:bg-border transition-all duration-300 shadow-sm"
      >
        Back to Home
      </Link>
    </div>
  );
};