import { whyChooseUsItems } from "../../data/whyChooseUs";
import { Check, Zap, Shield } from "lucide-react";

const icons = [Check, Zap, Shield];

const ValueProposition = () => {
  return (
    <section id="why-choose-us" className="py-20 bg-light-gray">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why You Should Choose Us
          </h2>
          <p className="text-xl text-dark-gray">
            Our platform combines speed, accuracy, and security to deliver
            unmatched value for businesses of all sizes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {whyChooseUsItems.map((item, index) => {
            const Icon = icons[index];
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-dark-gray">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;