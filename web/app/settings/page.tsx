"use client";

import { motion } from "framer-motion";
import { Settings, Shield, Lock, Eye, FileText, Server, Trash2, Bell, Moon, Sun } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Settings className="size-5 text-blue-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Settings</h1>
        </div>
        <p className="text-gray-400 font-medium max-w-2xl">
          Manage your preferences, privacy settings, and account information.
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              {darkMode ? <Moon className="size-5 text-purple-400" /> : <Sun className="size-5 text-purple-400" />}
            </div>
            <div>
              <h2 className="text-lg font-bold">Appearance</h2>
              <p className="text-sm text-white/40">Customize your interface preferences</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-white/5">
            <span className="font-medium text-white/80">Dark Mode</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${darkMode ? 'bg-blue-500' : 'bg-white/20'}`}
            >
              <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-white/5">
            <span className="font-medium text-white/80">Compact Mode</span>
            <button className="w-12 h-6 rounded-full bg-white/20 p-1">
              <span className="block w-4 h-4 rounded-full bg-white/60 translate-x-0" />
            </button>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Bell className="size-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Notifications</h2>
              <p className="text-sm text-white/40">Manage your notification preferences</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-white/5">
            <span className="font-medium text-white/80">Push Notifications</span>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications ? 'bg-blue-500' : 'bg-white/20'}`}
            >
              <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-white/5">
            <span className="font-medium text-white/80">Email Updates</span>
            <button className="w-12 h-6 rounded-full bg-blue-500 p-1">
              <span className="block w-4 h-4 rounded-full bg-white translate-x-6" />
            </button>
          </div>
        </motion.div>

        {/* Privacy Policy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Shield className="size-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Privacy Policy</h2>
              <p className="text-sm text-white/40">How we handle your data</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-white/70 leading-relaxed">
            <p>
              <strong className="text-white">1. Data Collection:</strong> We collect information you provide directly,
              including your study materials, notes, and chat interactions. This data is used solely to provide
              AI-powered learning assistance.
            </p>
            <p>
              <strong className="text-white">2. Data Usage:</strong> Your content is processed using AI models to generate
              summaries, questions, and answers. We do not use your data for training our models or share it with third parties.
            </p>
            <p>
              <strong className="text-white">3. Data Storage:</strong> Your data is stored securely in encrypted databases.
              Vector embeddings of your content are created for semantic search capabilities.
            </p>
            <p>
              <strong className="text-white">4. User Rights:</strong> You can delete your account and all associated data
              at any time. You have the right to export your data upon request.
            </p>
          </div>
        </motion.div>

        {/* Terms of Service */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <FileText className="size-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Terms of Service</h2>
              <p className="text-sm text-white/40">Rules and guidelines for using our platform</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-white/70 leading-relaxed">
            <p>
              <strong className="text-white">1. Acceptable Use:</strong> You agree to use this platform for educational
              purposes only. Do not upload copyrighted material without permission or content that violates any laws.
            </p>
            <p>
              <strong className="text-white">2. Content Ownership:</strong> You retain ownership of your original content.
              By uploading content, you grant us a license to process it for the purpose of providing our services.
            </p>
            <p>
              <strong className="text-white">3. AI-Generated Content:</strong> AI-generated responses are provided for
              educational assistance. Always verify important information and do not rely solely on AI-generated answers.
            </p>
            <p>
              <strong className="text-white">4. Account Termination:</strong> We reserve the right to suspend accounts
              that violate our terms or engage in abusive behavior toward the platform or other users.
            </p>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <Lock className="size-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Security</h2>
              <p className="text-sm text-white/40">How we protect your information</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-white/70 leading-relaxed">
            <div className="flex items-start gap-3">
              <Server className="size-4 text-white/40 mt-1 shrink-0" />
              <p>
                <strong className="text-white">Encryption:</strong> All data is encrypted in transit using TLS 1.3
                and at rest using AES-256 encryption.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Eye className="size-4 text-white/40 mt-1 shrink-0" />
              <p>
                <strong className="text-white">Access Control:</strong> Your data is isolated by user account.
                No other user can access your uploaded documents or chat history.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <Trash2 className="size-5 text-rose-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Data Management</h2>
              <p className="text-sm text-white/40">Control your stored data</p>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left">
              <div>
                <span className="font-bold text-white/80 block">Clear All Notes</span>
                <span className="text-xs text-white/40">Delete all uploaded documents and their embeddings</span>
              </div>
              <Trash2 className="size-5 text-rose-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left">
              <div>
                <span className="font-bold text-white/80 block">Clear Chat History</span>
                <span className="text-xs text-white/40">Delete all chat conversations</span>
              </div>
              <Trash2 className="size-5 text-rose-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors text-left">
              <div>
                <span className="font-bold text-rose-400 block">Delete Account</span>
                <span className="text-xs text-rose-400/60">Permanently delete your account and all data</span>
              </div>
              <Trash2 className="size-5 text-rose-400" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
