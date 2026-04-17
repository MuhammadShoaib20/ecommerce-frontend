import { NavLink } from 'react-router-dom';
import { FaBoxOpen, FaClipboardList, FaEnvelope, FaUsers } from 'react-icons/fa';

const links = [
  { to: '/admin/products', label: 'Products', icon: <FaBoxOpen size={12} /> },
  { to: '/admin/orders', label: 'Orders', icon: <FaClipboardList size={12} /> },
  { to: '/admin/messages', label: 'Messages', icon: <FaEnvelope size={12} /> },
  { to: '/admin/users', label: 'Users', icon: <FaUsers size={12} /> },
];

const AdminNav = () => (
  <div className="flex flex-wrap gap-1 border-b border-gray-200 mb-6 pb-0">
    {links.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        end
        className={({ isActive }) =>
          `inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            isActive
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
          }`
        }
      >
        <span className="opacity-70">{link.icon}</span>
        {link.label}
      </NavLink>
    ))}
  </div>
);

export default AdminNav;