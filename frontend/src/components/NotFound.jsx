import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-8">
        <h1 
          className="text-8xl md:text-9xl text-[#111] opacity-10 select-none"
        >
          404
        </h1>
      </div>

      <div className="max-w-md">
        <h2 
          className="text-2xl md:text-3xl text-[#111] mb-4 tracking-tight"
        >
          Lost in the void.
        </h2>
        <p className="text-[#99968F] text-sm leading-relaxed mb-8 tracking-wide uppercase text-[0.7rem]">
          The page you are looking for has been moved, deleted, or perhaps it never existed in this reality.
        </p>
      </div>

      <Link
        to="/"
        className="px-8 py-3 bg-[#111] text-[#FDFBF8] text-[0.7rem] tracking-[0.2em] uppercase rounded-md hover:bg-[#333] transition-all duration-300 shadow-sm"
      >
        Back to Home
      </Link>

      <div className="absolute bottom-10">
        <span className="text-[0.6rem] tracking-[0.3em] uppercase text-[#DDD8CF]">
          Core System
        </span>
      </div>
    </div>
  );
};