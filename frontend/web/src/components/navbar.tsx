import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">EnergyX</h1>
      <div className="flex space-x-6">
        <Link to="/dashboard" className="hover:text-green-600">Dashboard</Link>
        <Link to="/reports" className="hover:text-green-600">Reports</Link>
        <Link to="/documentation" className="hover:text-green-600">Documentation</Link>
      </div>
    </nav>
  );
}
