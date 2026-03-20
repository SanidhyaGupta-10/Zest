"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare, BookOpen, FileText, HelpCircle, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const features = [
    {
      title: "AI Chat",
      description: "Intelligent conversations with your notes using advanced RAG models.",
      icon: MessageSquare,
      href: "/chat",
      color: "from-blue-500 to-cyan-400",
    },
    {
      title: "Smart Notes",
      description: "Upload, process, and organize your knowledge with AI precision.",
      icon: BookOpen,
      href: "/notes",
      color: "from-purple-500 to-pink-400",
    },
    {
      title: "Instant Summary",
      description: "Extract core insights from lengthy documents in seconds.",
      icon: FileText,
      href: "/summary",
      color: "from-orange-500 to-amber-400",
    },
    {
      title: "Quiz Generator",
      description: "Master any subject with AI-generated practice questions.",
      icon: HelpCircle,
      href: "/questions",
      color: "from-emerald-500 to-teal-400",
    },
  ];

  return (
    <div className="relative pt-10 pb-20">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto mb-32"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-xs font-bold tracking-wider text-white/50 uppercase">New: GPT-4o Integration</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-white">
          Architect your <br />
          <span className="bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Knowledge
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
          The premium AI workspace for creators and researchers. Organize, 
          summarize, and interact with your data like never before.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/chat" className="btn-primary py-4 px-8 text-lg group">
            Start Creating
            <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/notes" className="btn-glass py-4 px-8 text-lg">
            Upload Data
          </Link>
        </div>
      </motion.section>

      {/* Stats/Social Proof */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-32 text-center"
      >
        {[
          { label: "Active Users", value: "20k+" },
          { label: "Notes Processed", value: "1.2M" },
          { label: "AI Queries", value: "500k" },
          { label: "Accuracy", value: "99.9%" },
        ].map((stat, i) => (
          <div key={i} className="space-y-1">
            <div className="text-3xl font-black text-white">{stat.value}</div>
            <div className="text-sm font-bold text-white/30 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Features Grid */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-32"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            className="group"
          >
            <Link 
              href={feature.href}
              className="glass-card p-10 block relative h-full overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />
              
              <div className="p-4 rounded-2xl bg-white/5 w-fit mb-8 group-hover:scale-110 transition-transform duration-500 relative">
                <feature.icon className="size-8 text-white" />
                <div className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-20 blur-xl`} />
              </div>

              <h3 className="text-2xl font-black mb-4 group-hover:text-blue-400 transition-colors">{feature.title}</h3>
              <p className="text-gray-400 font-medium leading-relaxed mb-8">
                {feature.description}
              </p>

              <div className="flex items-center text-sm font-bold text-white/30 group-hover:text-white transition-all uppercase tracking-widest">
                Explore <ArrowRight className="size-4 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="glass-card p-12 md:p-20 text-center max-w-6xl mx-auto overflow-hidden relative"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-linear-to-b from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <Sparkles className="size-12 text-blue-400 mx-auto mb-8 animate-pulse" />
        <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">
          Ready to scale your <br />
          learning curve?
        </h2>
        <p className="text-gray-400 font-medium mb-12 max-w-xl mx-auto">
          Join thousands of researchers and students who are already using Zest 
          to supercharge their knowledge management.
        </p>
        <Link href="/notes" className="btn-primary py-5 px-12 text-xl font-bold">
          Get Started Now
        </Link>
      </motion.section>
    </div>
  );
}