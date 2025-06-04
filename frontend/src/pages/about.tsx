import { motion } from "framer-motion";
import bike from "../assets/bike.jpg";
import rental from "../assets/rental.jpg";
import route from "../assets/route.jpg";
import landmark from "../assets/landmark.jpeg";
import charge from "../assets/charge.jpg";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

function About() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-12">
          {/* Text */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-yellow-500">
              Our bikes. your routes.
            </h1>
            <p className="text-lg md:text-xl mb-6 text-gray-700">
              Jolteon is a simple, smart electric bike rental platform that
              helps you ride with optional cultural detours. No fuss. Just
              freedom.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                className="btn btn-primary"
                href="/bikes"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Started
              </a>
              <a href="#features" className="btn btn-outline btn-primary">
                Learn more
              </a>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={bike}
              alt="electric bike"
              className="w-full max-w-md mx-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <motion.section
        id="overview"
        className="py-20 px-6 bg-blue-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4 text-yellow-500">
            Overview
          </h2>
          <p className="text-lg text-gray-700">
            Jolteon makes urban exploration easy. Rent electric bikes from solar-powered stations
            across the city, plan your trip to a specific destination, and
            discover cultural points of interest along the way—like local
            landmarks or museums. Designed for tourists and casual city riders,
            Jolteon skips the clutter and gets you moving.
          </p>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features"
        className="py-20 px-6 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4 text-yellow-500">
            Main Features
          </h2>
          <p className="text-lg text-gray-700 mb-12">
            Everything you need for a smooth ride, at the distance of a click.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 place-items-center text-left">
            {[
              {
                title: "Point-to-point electric bike rentals",
                description:
                  "Start and end your trip at designated stations across the city.",
                image: rental,
                buttonText: "Find a station",
              },
              {
                title: "Route planning",
                description:
                  "Pick a start and destination—Jolteon maps your journey.",
                image: route,
                buttonText: "Coming soon",
              },
              {
                title: "Optional cultural stops",
                description:
                  "Discover museums, landmarks, and hidden gems along your route.",
                image: landmark,
                buttonText: "Explore landmarks",
              },
              {
                title: "Real-time events and notifications",
                description:
                  "Get alerts for bike availability, and new landmarks or events.",
                image: charge,
                buttonText: "Coming soon",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="card w-96 bg-base-100 shadow-sm image-full"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: index * 0.1 },
                  },
                }}
              >
                <div className="card bg-white/80 backdrop-blur-sm w-96 shadow-sm">
                  <figure>
                    <img src={feature.image} alt={feature.title} />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title text-blue-900">
                      {feature.title}
                    </h2>
                    <p className="text-gray-800">{feature.description}</p>
                    <div className="card-actions justify-end">
                      {feature.buttonText === "Coming soon" ? (
                        <button className="btn btn-outline btn-primary" disabled>
                          {feature.buttonText}
                        </button>
                      ) : (
                        <a href="/bikes" className="btn btn-outline btn-primary">
                          {feature.buttonText}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
        </div>
      </motion.section>
    </main>
  );
}

export default About;
