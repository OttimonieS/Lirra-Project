const Privacy = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Privacy Policy
        </h1>
        <div className="prose max-w-none text-dark-gray space-y-6">
          <p className="text-lg">Last updated: December 6, 2025</p>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Information We Collect
            </h2>
            <p>
              We collect information you provide directly to us, such as when
              you create an account, use our services, or communicate with us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <p>
              We use the information we collect to provide, maintain, and
              improve our services, to communicate with you, and to protect our
              users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Information Sharing
            </h2>
            <p>
              We do not sell your personal information. We may share your
              information with service providers who perform services on our
              behalf.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Data Security
            </h2>
            <p>
              We implement appropriate security measures to protect your
              personal information against unauthorized access and disclosure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy, please contact us
              at privacy@nexuslabid.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;