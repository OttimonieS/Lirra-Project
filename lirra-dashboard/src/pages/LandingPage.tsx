import {
  Zap,
  Receipt,
  Tag,
  Image,
  MessageSquare,
  BarChart3,
  Check,
  ArrowRight,
  Star,
} from "lucide-react";

const LandingPage = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const features = [
    {
      icon: Receipt,
      title: "Auto Bookkeeping",
      description:
        "Automated income and expense recording with receipt scanning and financial summaries",
    },
    {
      icon: Tag,
      title: "Label Generator",
      description:
        "Create professional product labels instantly with templates and auto-generated content",
    },
    {
      icon: Image,
      title: "Catalog Enhancer",
      description:
        "Enhance product photos with automatic background removal and marketplace-ready formatting",
    },
    {
      icon: MessageSquare,
      title: "WhatsApp AI Reply",
      description:
        "AI-powered customer responses based on your product catalog with multilingual support",
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description:
        "Real-time insights on sales, top products, and business health notifications",
    },
    {
      icon: Zap,
      title: "Multi-Store Management",
      description:
        "Manage Tokopedia, Shopee, Instagram, and WhatsApp from one unified dashboard",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Lee",
      business: "Lee's Bakery",
      quote:
        "Lirra helped me save 10 hours a week on bookkeeping. The automated label maker is a game changer!",
      rating: 5,
    },
    {
      name: "Ahmad Rahman",
      business: "Fashion Hub",
      quote:
        "Managing 3 stores used to be chaos. Now everything is organized in one place. Highly recommended!",
      rating: 5,
    },
    {
      name: "Maria Santos",
      business: "Handmade Crafts",
      quote:
        "The WhatsApp AI handles most customer questions while I sleep. My sales increased by 40%!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
<section className="container mx-auto px-6 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            All-in-One Automation Hub for{" "}
            <span className="text-primary">Small Businesses</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Automate bookkeeping, product labels, photo editing, customer
            replies, and analytics. Focus on growing your business, not managing
            it.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={onGetStarted}
              className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              Get Started Free
              <ArrowRight className="ml-2" size={20} />
            </button>
            <button className="bg-white hover:bg-gray-50 text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-colors border-2 border-primary">
              Watch Demo
            </button>
          </div>
<div className="relative max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-2xl p-6">
              <div className="aspect-video bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <Zap size={64} className="mx-auto mb-4" />
                  <p className="text-2xl font-semibold">
                    Your Business Dashboard
                  </p>
                  <p className="text-sm opacity-90 mt-2">
                    Everything you need in one place
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
<section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Small Businesses Love Lirra
            </h2>
            <p className="text-xl text-gray-600">
              Save time, reduce errors, and grow faster
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
              <p className="text-gray-600">
                No technical skills needed. Set up in minutes, not days.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Immediate Results</h3>
              <p className="text-gray-600">
                Start automating tasks from day one.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Affordable</h3>
              <p className="text-gray-600">
                Built for small businesses with small budgets.
              </p>
            </div>
          </div>
        </div>
      </section>
<section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to run your business efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
<section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Small Businesses
            </h2>
            <p className="text-xl text-gray-600">
              See how Lirra is helping businesses like yours
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="text-yellow-400 fill-current"
                      size={18}
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonial.business}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
<section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Automate Your Business?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of small businesses saving time and money with Lirra
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Start Free Trial
          </button>
          <p className="mt-4 opacity-75">
            No credit card required • Free 14-day trial
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;