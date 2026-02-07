import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "../../data/testimonials";

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-20 bg-light-gray">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-dark-gray">
            Hear from teams who transformed their operations with our platform.
          </p>
        </div>

        <div className="relative">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <img
                src={testimonials[currentTestimonial].avatar}
                alt={testimonials[currentTestimonial].name}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {testimonials[currentTestimonial].name}
                </h3>
                <p className="text-dark-gray">
                  {testimonials[currentTestimonial].role}
                </p>
              </div>
            </div>
            <blockquote className="text-lg text-gray-900 italic">
              "{testimonials[currentTestimonial].quote}"
            </blockquote>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-180 ${
                  index === currentTestimonial ? "bg-primary" : "bg-gray"
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors duration-180"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 text-dark-gray" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors duration-180"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 text-dark-gray" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
