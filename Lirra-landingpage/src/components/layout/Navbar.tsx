import { navItems } from "../../data/navigation";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-gray-900">NexusLab.id</div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-dark-gray hover:text-primary transition-colors duration-180"
              >
                {item.text}
              </a>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://dashboard.lirra.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-gray hover:text-primary transition-colors duration-180 hidden md:block"
            >
              Access Dashboard
            </a>
            <a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("pricing")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-medium transition-colors duration-180"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;