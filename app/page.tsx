'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  GitBranch,
  Zap,
  Shield,
  Code,
  ArrowRight,
  Github,
  Star,
  FileCode,
  Bot,
  Sparkles,
} from 'lucide-react'
import { AuthButton } from '@/components/AuthButton'
import { TestVideoPlayer } from '@/components/TestVideoPlayer'
import { AnimatedBackground } from '@/components/AnimatedBackground'

export default function Home() {
  const features = [
    {
      icon: <GitBranch className="w-6 h-6" />,
      title: 'GitHub Integration',
      description:
        'Seamlessly connect with your GitHub repositories and browse code structure with ease.',
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: 'AI-Powered Reviews',
      description:
        'Get intelligent code analysis and suggestions powered by advanced AI models.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Security Analysis',
      description:
        'Identify security vulnerabilities and potential risks in your codebase.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Performance Insights',
      description:
        'Receive recommendations to optimize your code for better performance.',
    },
    {
      icon: <FileCode className="w-6 h-6" />,
      title: 'Syntax Highlighting',
      description:
        'Beautiful code display with syntax highlighting for multiple languages.',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Auto-Fix Suggestions',
      description:
        'Get automatic code fixes and improvements with one-click application.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-300"
              >
                <Code className="w-8 h-8 text-white" />
                <span className="text-2xl font-bold text-white">
                  ReviewStack
                </span>
              </Link>
            </motion.div>
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link
                href="/workspace"
                className="glass glass-hover px-4 py-2 rounded-lg text-white transition-all duration-300 hover:bg-white/20 hover:scale-105"
              >
                Workspace
              </Link>
              <AuthButton variant="primary" />
            </motion.div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
              AI-Powered
              <br />
              <span className="bg-gradient-to-r from-gray-100 via-gray-400 to-gray-700 bg-clip-text text-transparent">
                Code Review
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your development workflow with intelligent code
              analysis, automated reviews, and seamless GitHub integration. Get
              instant feedback and suggestions to write better code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/workspace"
                  className="glass glass-hover px-8 py-4 rounded-lg text-white font-semibold text-lg flex items-center gap-2 justify-center transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass glass-hover px-8 py-4 rounded-lg text-white font-semibold text-lg flex items-center gap-2 justify-center transition-all duration-300 border border-white/20"
                >
                  <Github className="w-5 h-5" />
                  View on GitHub
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>{' '}
      {/* Video Showcase Section - Enhanced */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Background gradient overlay - matching page theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-transparent to-gray-800/20"></div>
        {/* Animated background elements */}
        <AnimatedBackground />
        <div className="container mx-auto relative z-10">
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <TestVideoPlayer />

            {/* Feature highlights below video */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 mx-auto mb-3 glass rounded-lg flex items-center justify-center">
                  <GitBranch className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  3-Panel Workspace
                </h4>
                <p className="text-gray-400 text-sm">
                  Repository browser, code viewer, and AI review panel in one
                  unified interface
                </p>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 mx-auto mb-3 glass rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Instant AI Analysis
                </h4>
                <p className="text-gray-400 text-sm">
                  Get real-time code analysis and suggestions as you browse your
                  repository
                </p>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 mx-auto mb-3 glass rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Smart Suggestions
                </h4>
                <p className="text-gray-400 text-sm">
                  Auto-fix suggestions with one-click application for faster
                  development
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Everything you need to perform comprehensive code reviews with the
              power of artificial intelligence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="glass glass-hover p-6 rounded-lg border border-white/10 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/10 rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            className="glass p-12 rounded-2xl border border-white/10"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-white mb-2">99%</div>
                <div className="text-gray-300">Accuracy Rate</div>
                <div className="text-sm text-gray-400 mt-1">
                  in identifying code issues
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">70%</div>
                <div className="text-gray-300">Faster Reviews</div>
                <div className="text-sm text-gray-400 mt-1">
                  compared to manual reviews
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-300">Availability</div>
                <div className="text-sm text-gray-400 mt-1">
                  automated code analysis
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Code Reviews?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already using ReviewStack to
              write better, more secure code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/workspace"
                  className="glass glass-hover px-8 py-4 rounded-lg text-white font-semibold text-lg flex items-center gap-2 justify-center transition-all duration-300 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/workspace"
                  className="glass glass-hover px-8 py-4 rounded-lg text-white font-semibold text-lg flex items-center gap-2 justify-center transition-all duration-300 border border-white/20"
                >
                  <Code className="w-5 h-5" />
                  Try Demo
                </Link>
              </motion.div>
            </div>

            {/* Trust indicators */}
            <motion.div
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                <span>GitHub Integration</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Link
                href="/"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-300"
              >
                <Code className="w-6 h-6 text-white" />
                <span className="text-xl font-bold text-white">
                  ReviewStack
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Star className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm mt-6">
            © 2025 ReviewStack. Built with Next.js and AI.
          </div>
        </div>
      </footer>
    </div>
  )
}
