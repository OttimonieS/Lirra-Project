const Documentation = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Documentation</h1>
        <div className="prose max-w-none">
          <p className="text-xl text-dark-gray mb-8">
            Welcome to our documentation center. Find guides, tutorials, and API
            references to help you get started.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-light-gray p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Getting Started
              </h3>
              <p className="text-dark-gray mb-4">
                Learn the basics and set up your first project.
              </p>
              <a
                href="#"
                className="text-primary hover:text-primary-hover font-medium"
              >
                Read more →
              </a>
            </div>

            <div className="bg-light-gray p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                API Reference
              </h3>
              <p className="text-dark-gray mb-4">
                Complete API documentation for developers.
              </p>
              <a
                href="#"
                className="text-primary hover:text-primary-hover font-medium"
              >
                Read more →
              </a>
            </div>

            <div className="bg-light-gray p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Tutorials
              </h3>
              <p className="text-dark-gray mb-4">
                Step-by-step guides for common use cases.
              </p>
              <a
                href="#"
                className="text-primary hover:text-primary-hover font-medium"
              >
                Read more →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
