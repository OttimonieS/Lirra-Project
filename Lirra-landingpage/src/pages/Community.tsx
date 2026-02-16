const Community = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Community</h1>
        <p className="text-xl text-dark-gray mb-12">
          Join our growing community of developers and teams.
        </p>

        <div className="bg-light-gray p-8 rounded-xl">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Connect With Us
          </h2>
          <p className="text-dark-gray mb-6">
            Our community is the heart of what we do. Connect with other users,
            share ideas, and get support.
          </p>
          <div className="space-y-4">
            <a
              href="#"
              className="block bg-white p-4 rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                Discord Server
              </h3>
              <p className="text-dark-gray text-sm">
                Join our Discord community for real-time discussions
              </p>
            </a>
            <a
              href="#"
              className="block bg-white p-4 rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                GitHub Discussions
              </h3>
              <p className="text-dark-gray text-sm">
                Participate in technical discussions and feature requests
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;