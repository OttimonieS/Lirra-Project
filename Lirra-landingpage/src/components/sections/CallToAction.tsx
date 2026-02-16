const CallToAction = () => {
  return (
    <section className="py-20 bg-primary">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Ready to Transform Your Workflow?
        </h2>
        <p className="text-xl text-primary-light mb-8">
          Join thousands of teams who have already accelerated their growth.
        </p>
        <button className="bg-white hover:bg-gray-100 text-primary px-10 py-4 rounded-lg font-bold text-lg transition-colors duration-180 shadow-lg hover:shadow-xl">
          Start Your Free Trial
        </button>
        <p className="text-primary-light mt-4">
          No credit card required • 14-day free trial
        </p>
      </div>
    </section>
  );
};

export default CallToAction;