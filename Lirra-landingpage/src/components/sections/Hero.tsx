import { Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="pt-28 pb-20 bg-gradient-to-br from-white to-primary-light/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Transform Your Workflow with{" "}
              <span className="text-primary">Intelligent Automation</span>
            </h1>
            <p className="text-xl text-dark-gray leading-relaxed">
              Streamline operations, boost productivity, and accelerate growth
              with our all-in-one platform designed for modern teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => {
                  const section = document.getElementById("pricing");
                  section?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors duration-180 shadow-md hover:shadow-lg text-center"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => {
                  const section = document.getElementById("why-choose-us");
                  section?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-primary-light hover:bg-opacity-80 text-primary px-8 py-4 rounded-lg font-medium text-lg transition-colors duration-180 border border-primary text-center"
              >
                Why Choose Us
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-80 h-64 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-xl transform rotate-3"></div>
              <div className="absolute -top-4 -right-4 w-80 h-64 bg-gradient-to-br from-secondary to-primary rounded-2xl shadow-xl transform -rotate-3"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-xl p-6 shadow-lg w-72 h-52 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      Smart Dashboard
                    </h3>
                    <p className="text-dark-gray text-sm mt-2">
                      Real-time analytics & insights
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
