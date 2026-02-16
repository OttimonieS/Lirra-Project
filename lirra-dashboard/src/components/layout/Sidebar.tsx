import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Tag,
  Image,
  MessageSquare,
  BarChart3,
  Settings,
  Store,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ setActiveTab }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      id: "bookkeeping",
      label: "Bookkeeping",
      icon: Receipt,
      path: "/bookkeeping",
    },
    {
      id: "label-generator",
      label: "Label Generator",
      icon: Tag,
      path: "/label-generator",
    },
    {
      id: "catalog-enhancer",
      label: "Catalog Enhancer",
      icon: Image,
      path: "/catalog-enhancer",
    },
    {
      id: "whatsapp-ai",
      label: "WhatsApp AI",
      icon: MessageSquare,
      path: "/whatsapp-ai",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      path: "/analytics",
    },
    { id: "stores", label: "Stores", icon: Store, path: "/stores" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <>
<button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-primary text-white p-2 rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
<aside
        className={`fixed left-0 top-0 h-full bg-gray-900 text-white w-64 transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">Lirra</h1>
          <p className="text-sm text-gray-400 mt-1">Business Hub</p>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  navigate(item.path);
                  if (window.innerWidth < 768) setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-6 py-3 transition-colors ${
                  location.pathname === item.path
                    ? "bg-primary text-white border-l-4 border-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
{isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;