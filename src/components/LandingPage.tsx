import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Home,
  Users,
  Receipt,
  UtensilsCrossed,
  CalendarClock,
  ShieldCheck,
  FileText,
  ChevronDown,
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: (mode: "login" | "register") => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const detailsRef = useRef<HTMLDivElement>(null);

  const scrollToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="min-h-screen bg-[#0F0C15] text-zinc-100 flex flex-col font-sans overflow-x-hidden pt-4 md:pt-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/20 via-purple-900/5 to-[#0F0C15] pointer-events-none"></div>

      <header className="relative z-10 p-6 md:px-12 flex justify-between items-center bg-transparent">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-amber to-purple-500 flex items-center justify-center shadow-lg shadow-brand-amber/20">
            <Home className="w-4 h-4 text-zinc-950" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            Dorm<span className="text-brand-amber">z</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-3"
        >
          <button
            onClick={() => onGetStarted("login")}
            className="px-5 py-2 text-sm font-semibold rounded-full border border-purple-500/30 text-white hover:bg-purple-500/10 transition-colors hidden sm:block"
          >
            লগইন
          </button>
          <button
            onClick={() => onGetStarted("register")}
            className="px-5 py-2 text-sm font-semibold rounded-full bg-brand-amber text-zinc-950 hover:bg-amber-400 transition-colors shadow-lg shadow-brand-amber/20"
          >
            সাইন আপ
          </button>
        </motion.div>
      </header>

      <main className="flex-1 flex flex-col relative z-10 px-6 md:px-12 max-w-6xl mx-auto w-full">
        {/* Hero Section */}
        <div className="pt-6 pb-10 md:py-24 flex flex-col items-center text-center min-h-[calc(100vh-100px)] justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/30 border border-purple-500/20 text-purple-300 text-xs font-medium mb-4"
          >
            <SparkleIcon />
            স্মার্ট মেস ম্যানেজমেন্ট সিস্টেম
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-3 leading-tight"
          >
            Dorm
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-amber via-yellow-300 to-orange-400">
              z
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-zinc-400 text-sm md:text-lg max-w-2xl mb-6 leading-relaxed px-2"
          >
            Dormz (ডর্মস) হলো একটি অত্যাধুনিক এবং সহজবোধ্য মেস ম্যানেজমেন্ট
            অ্যাপ্লিকেশন যা তৈরি করা হয়েছে ব্যাচেলর এবং মেসে বসবাসরত মানুষদের
            দৈনন্দিন হিসাব-নিকাশকে ঝামেলামুক্ত করার জন্য।
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-2"
          >
            <button
              onClick={() => onGetStarted("login")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-medium text-base shadow-sm shadow-purple-600/20 transition-all w-full sm:w-auto"
            >
              লগইন করুন
            </button>
            <button
              onClick={() => onGetStarted("register")}
              className="group flex items-center justify-center gap-2 px-6 py-3 bg-brand-amber hover:bg-amber-400 text-zinc-950 rounded-full font-medium text-base shadow-sm shadow-brand-amber/20 transition-all w-full sm:w-auto"
            >
              নতুন একাউন্ট খুলুন
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-6 flex flex-col items-center justify-center text-zinc-500 cursor-pointer hover:text-brand-amber transition-colors"
            onClick={scrollToDetails}
          >
            <span className="text-sm font-medium mb-2 uppercase tracking-widest text-xs">
              আরও জানুন
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </div>

        {/* Detailed Description Section in Bengali */}
        <motion.div
          ref={detailsRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-zinc-900/50 border border-purple-900/40 rounded-3xl p-8 md:p-12 mb-24 max-w-4xl mx-auto text-center md:text-left"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            অ্যাপ সম্পর্কে বিস্তারিত
          </h2>
          <div className="space-y-6 text-zinc-300 text-base md:text-lg leading-relaxed">
            <p>
              খাতা-কলমে হিসাব রাখার দিন শেষ! এখন আপনি খুব সহজেই আপনার স্মার্টফোন
              বা পিসি থেকে মেসের মিল (Meals), বাজার খরচ (Bazaar Expenses),
              ইউটিলিটি বিল (Utility Bills), এবং সদস্যদের টাকা জমার (Deposits)
              হিসাব রিয়েল-টাইমে ট্র্যাক করতে পারবেন। অ্যাপটি স্বয়ংক্রিয়ভাবে কার
              কত টাকা ব্যক্তিগত জমা আছে, কে কত টাকা খরচ করেছে এবং মাস শেষে কার
              দেনা বা পাওনা কত—তা মুহূর্তের মধ্যে হিসাব করে দেয়।
            </p>
            <p>
              এছাড়া রয়েছে ডিউটি রোস্টার সিস্টেম, যার মাধ্যমে প্রতি সপ্তাহের
              বাজার এবং অন্যান্য কাজের দায়িত্ব সদস্যদের মাঝে বণ্টন করা যায়। ডেটা
              ব্যাকআপ ও ক্লাউড সিঙ্ক সুবিধায় আপনার মেসের হিসাব কখনোই হারাবে না।
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24"
        >
          <FeatureCard
            icon={<Users className="w-6 h-6 text-blue-400" />}
            title="সদস্য ব্যবস্থাপনা"
            description="মেসের সকল সদস্যের তথ্য, জমা ও বকেয়ার রিয়েল-টাইম হিসাব রাখুন খুব সহজেই।"
          />
          <FeatureCard
            icon={<UtensilsCrossed className="w-6 h-6 text-emerald-400" />}
            title="মিল ট্র্যাকিং"
            description="নির্ধারিত মিল রেট অনুযায়ী স্বয়ংক্রিয়ভাবে প্রতি সদস্যের মাসিক খরচ হিসাব করুন।"
          />
          <FeatureCard
            icon={<Receipt className="w-6 h-6 text-rose-400" />}
            title="দৈনন্দিন খরচ"
            description="প্রতিদিনের বাজার ও ইউটিলিটি বিলের স্বচ্ছ হিসাব সংরক্ষণ করুন ক্লাউডে।"
          />
          <FeatureCard
            icon={<CalendarClock className="w-6 h-6 text-purple-400" />}
            title="ডিউটি রোস্টার"
            description="সদস্যদের সাপ্তাহিক বাজারের দায়িত্ব নির্ধারণ ও ট্র্যাক করার সহজ মাধ্যম।"
          />
          <FeatureCard
            icon={<ShieldCheck className="w-6 h-6 text-brand-amber" />}
            title="সিকিউরড ক্লাউড"
            description="বিনা মূল্যে আপনার মেসের সমস্ত ডেটা সুরক্ষিত রাখুন অফলাইন সাপোর্টের সাথে।"
          />
          <FeatureCard
            icon={<SparkleIcon className="w-6 h-6 text-cyan-400" />}
            title="অটোমেটেড ব্যালেন্স"
            description="কার কত টাকা পাওনা বা দেনা আছে তা এক ক্লিকে জেনে নিন যেকোনো সময়।"
          />
        </motion.div>
      </main>

      <footer className="border-t border-purple-950/30 py-10 flex flex-col items-center text-zinc-500 text-sm gap-4">
        <button
          onClick={scrollToDetails}
          className="flex items-center gap-2 hover:text-brand-amber transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span>শর্তাবলী (Terms and Conditions)</span>
        </button>
        <p>© {new Date().getFullYear()} Dormz. অল রাইটস রিজার্ভড।</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 300, damping: 24 },
        },
      }}
      className="bg-zinc-900/40 border border-purple-950/30 rounded-3xl p-6 hover:bg-zinc-900/60 transition-colors"
    >
      <div className="w-12 h-12 bg-[#0F0C15] rounded-2xl flex items-center justify-center border border-purple-900/20 shadow-inner mb-5">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-zinc-100 mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function SparkleIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
