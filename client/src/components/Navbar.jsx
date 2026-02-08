import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-[#daf1ff] shadow-md py-3 px-6 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-[#1e5588]">FutureSpend EDU</Link>
      <div className="space-x-4">
        <Link to="/login" className="text-sm text-[#57708c] hover:text-[#1e5588]">Login</Link>
        <Link to="/signup" className="text-sm text-[#57708c] hover:text-[#1e5588]">Sign Up</Link>
      </div>
    </nav>
  );
}
