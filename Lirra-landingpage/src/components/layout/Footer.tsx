import { footerSections, footerCompanyInfo } from "../../data/footer";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="text-2xl font-bold mb-4">
              {footerCompanyInfo.name}
            </div>
            <p className="text-gray-400">{footerCompanyInfo.description}</p>
          </div>
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <div className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.href}
                    className="block text-gray-400 hover:text-white transition-colors duration-180"
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-gray-800 text-gray-400 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {footerCompanyInfo.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
