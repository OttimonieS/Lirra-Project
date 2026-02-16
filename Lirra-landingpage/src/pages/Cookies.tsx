const Cookies = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
        <div className="prose max-w-none text-dark-gray space-y-6">
          <p className="text-lg">Last updated: December 6, 2025</p>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. What Are Cookies
            </h2>
            <p>
              Cookies are small text files that are placed on your computer or
              mobile device when you visit our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. How We Use Cookies
            </h2>
            <p>
              We use cookies to improve your experience, analyze site traffic,
              and for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Types of Cookies We Use
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Essential cookies - Required for the website to function</li>
              <li>
                Analytics cookies - Help us understand how visitors use our site
              </li>
              <li>
                Marketing cookies - Used to track visitors across websites
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Managing Cookies
            </h2>
            <p>
              You can control and/or delete cookies as you wish. You can delete
              all cookies that are already on your computer and you can set most
              browsers to prevent them from being placed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Contact Us
            </h2>
            <p>
              If you have questions about our use of cookies, please contact us
              at cookies@nexus.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Cookies;