import { motion } from 'framer-motion';
import bike from '../assets/bike.jpg';
import rental from '../assets/rental.jpg';
import route from '../assets/route.jpg';
import landmark from '../assets/landmark.jpeg';
import charge from '../assets/charge.jpg';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

function Home() {
  return (
    <main className="flex flex-col">

      {/* Hero Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-12">
          {/* Text */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-yellow-500">
              Your bikes. Our routes.
            </h1>
            <p className="text-lg md:text-xl mb-6 text-gray-700">
              Jolteon is a simple, smart electric bike rental platform that helps you ride from A to B—with optional cultural detours. No fuss. Just freedom.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                className="btn btn-primary"
                href="https://github.com/your-org/jolteon"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Started
              </a>
              <a
                href="#features"
                className="btn btn-outline btn-primary"
              >
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
            <img src={bike} alt="electric bike" className="w-full max-w-md mx-auto" />
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
          <h2 className="text-3xl font-semibold mb-4 text-yellow-500">Overview</h2>
          <p className="text-lg text-gray-700">
            Jolteon makes urban exploration easy. Rent electric bikes from hubs across the city, plan your trip to a specific destination, and discover cultural points of interest along the way—like local landmarks or museums. Designed for tourists and casual city riders, Jolteon skips the clutter and gets you moving.
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
            <h2 className="text-3xl font-semibold mb-4 text-yellow-500">Main Features</h2>
            <p className="text-lg text-gray-700 mb-12">
            Everything you need for a smooth ride—nothing you don’t.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 place-items-center">
            {[
                {
                title: 'Point-to-point electric bike rentals',
                description:
                    'Start and end your trip at designated hubs across the city.',
                image:
                    rental,
                },
                {
                title: 'Route planning',
                description:
                    'Pick a start and destination—Jolteon maps your journey.',
                image:
                    route,
                },
                {
                title: 'Optional cultural stops',
                description:
                    'Discover museums, landmarks, and hidden gems along your route.',
                image:
                    landmark,
                },
                {
                title: 'Real-time events and notifications',
                description:
                    'Get alerts for bike availability, battery status, and more.',
                image:
                    charge,
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
                        <h2 className="card-title text-blue-900">Card Title</h2>
                        <p className="text-gray-800">
                        A card component has a figure, a body part, and inside body there are title and actions parts
                        </p>
                        <div className="card-actions justify-end">
                        <button className="btn btn-outline btn-primary">Explore</button>
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

export default Home;
