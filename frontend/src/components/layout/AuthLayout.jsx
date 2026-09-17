import { Link, Outlet } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa6";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="hidden px-7 pt-8 md:block">
        <Link
          to="/"
          className="text-sm text-[#9aa5b7] transition hover:text-brand-navy"
        >
          <div className='flex items-center gap-2'>
            <FaArrowLeft />
          <span>
            Back to Website
          </span>
          </div>
        </Link>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}