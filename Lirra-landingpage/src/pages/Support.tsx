const Support = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Support</h1>
        <p className="text-xl text-dark-gray mb-12">
          We're here to help. Get in touch with our support team.
        </p>

        <div className="bg-light-gray p-8 rounded-xl">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Contact Support
          </h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Message
              </label>
              <textarea
                rows={6}
                className="w-full px-4 py-3 border border-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="How can we help?"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Support;
