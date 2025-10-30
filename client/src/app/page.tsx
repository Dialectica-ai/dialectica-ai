"use client";

import { motion } from "motion/react";
import {
  IconMessage,
  IconUsers,
  IconBrain,
  IconSparkles,
  IconArrowRight,
  IconPlayerPlay,
  IconShield,
  IconBolt,
} from "@tabler/icons-react";
import { Navbar } from "@/components/navigation/Navbar";
import { useRouter } from "next/navigation";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

interface StatCounterProps {
  target: number | string;
  label: string;
  suffix?: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group h-full flex flex-col items-center justify-between text-center
                 p-6 rounded-xl bg-white dark:bg-neutral-800 border border-gray-200
                 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-500
                 transition-all duration-300 hover:shadow-lg"
    >
      {/* Inner wrapper for consistent height and spacing */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="w-12 h-12 mb-4 rounded-lg bg-blue-600 text-white flex items-center justify-center
                        group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h3>

        {/* Set a min height to equalize cards visually */}
        <p className="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed mt-1 min-h-[56px]">
          {description}
        </p>
      </div>
    </motion.div>
  );
};


const StatCounter: React.FC<StatCounterProps> = ({ target, label, suffix = "", delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="text-center p-4"
    >
      <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">
        {target.toLocaleString()}
        {suffix}
      </div>
      <div className="text-xs md:text-sm text-gray-600 dark:text-neutral-400 uppercase tracking-wider font-medium">
        {label}
      </div>
    </motion.div>
  );
};

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: <IconBrain className="w-6 h-6" />,
      title: "AI-Powered Debates",
      description:
        "Engage in intelligent discussions powered by advanced AI that understands context and nuance.",
    },
    {
      icon: <IconUsers className="w-6 h-6" />,
      title: "Real-time Collaboration",
      description:
        "Connect with debaters worldwide in real-time rooms designed for structured discourse.",
    },
    {
      icon: <IconShield className="w-6 h-6" />,
      title: "Secure & Private",
      description:
        "Your conversations are protected with end-to-end encryption and privacy-first design.",
    },
    {
      icon: <IconBolt className="w-6 h-6" />,
      title: "Lightning Fast",
      description:
        "Experience instant responses and seamless interactions with our optimized platform.",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-12"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6">
              Dialectica AI
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-neutral-400 mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
              Experience the future of intellectual discourse. Engage in debates that challenge your
              thinking and expand your perspectives.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 md:mb-16 px-4">
              <button onClick={() => router.push('/main/signin')} className="group px-6 md:px-8 py-3 md:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2">
                <IconPlayerPlay className="w-5 h-5" />
                Start Debating
                <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-6 md:px-8 py-3 md:py-4 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-gray-100 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
              <StatCounter target={50} label="Debates" suffix="+" delay={0.2} />
              <StatCounter target={100} label="Users" suffix="+" delay={0.4} />
              <StatCounter target={"Vercel"} label="Hosted on" delay={0.6} />
              <StatCounter target={"Next.js"} label="Tech stack" delay={0.8} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 md:py-20 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 text-gray-900 dark:text-gray-100">
              Powerful Features
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto px-4">
              Discover the tools that make Dialectica AI the premier platform for intellectual
              discourse.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch auto-rows-fr place-items-stretch">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl border border-gray-200 dark:border-neutral-700 p-6 sm:p-8 md:p-12 text-center shadow-2xl"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 md:mb-6">
              <IconSparkles className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-6 text-white">
              Ready to Elevate Your Discourse?
            </h3>
            <p className="text-base md:text-lg text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of thinkers, debaters, and curious minds using Dialectica AI to enhance
              their intellectual journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button className="px-6 md:px-8 py-3 md:py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-xl font-medium transition-all duration-300 shadow-lg">
                Join the Community
              </button>
              <button className="px-6 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-medium hover:bg-white/20 transition-colors">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-4 sm:px-6 lg:px-8 py-8 md:py-12 border-t border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <IconMessage className="w-4 h-4 text-white" />
              </div>
              <span className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                Dialectica AI
              </span>
            </div>

            <div className="flex items-center gap-4 md:gap-6 text-sm text-gray-600 dark:text-neutral-400">
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Contact
              </a>
            </div>

            <div className="text-sm text-gray-600 dark:text-neutral-400">© 2025 Dialectica AI</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
