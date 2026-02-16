import { Bell, User, LogOut, Crown } from "lucide-react";
import { auth } from "../../utils/supabase";

interface HeaderProps {
  planName?: string;
  user?: any;
}

const Header = ({ planName, user }: HeaderProps) => {
  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = "/signin";
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 ml-0 md:ml-64">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}!
          </h2>
          <p className="text-sm text-gray-500">
            Here's what's happening with your business today
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {planName && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg">
              <Crown className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                {planName}
              </span>
            </div>
          )}

          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-3 border-l pl-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-700">
                {user?.email || "User"}
              </p>
              <p className="text-xs text-gray-500">Dashboard User</p>
            </div>
            <button className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
              <User size={20} />
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;