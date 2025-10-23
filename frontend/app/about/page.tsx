"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Shield } from "lucide-react";

export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const developers = [
    { name: "Varad Khandare", image: "/logo.png" },
    { name: "Yash Dhavde", image: "/logo.png" },
    { name: "Sumit Patel", image: "/logo.png" },
    { name: "Pratik Bhuvad", image: "/logo.png" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-slate-900/95 backdrop-blur-lg shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="SecureVault Logo"
              className="w-10 h-10 rounded-lg"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              SecureVault
            </span>
          </div>
          <div className="flex items-center space-x-8">
            <a
              href="/home"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Home
            </a>
            <a
              href="/home#features"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="/home#how-it-works"
              className="text-slate-300 hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="/about"
              className="text-slate-300 hover:text-white transition-colors"
            >
              About
            </a>
            <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 font-medium shadow-lg shadow-cyan-500/30">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-28 pb-16 px-10">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent mb-6">
            Meet the Developers
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto mb-12">
            Our project is built by a dedicated team of developers focused on
            crafting a secure, intelligent, and seamless experience for all
            users.
          </p>

          {/* Developer Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center">
            {developers.map((dev, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center bg-slate-800/50 rounded-2xl border border-slate-700/30 p-6 shadow-lg shadow-cyan-600/10 hover:shadow-cyan-600/20 transition-all duration-300"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-cyan-500 mb-4">
                  <Image
                    src={dev.image}
                    alt={dev.name}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <h2 className="text-lg font-semibold text-cyan-300">
                  {dev.name}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-3 border-t border-slate-700/30">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              SecureVault
            </span>
          </div>
          <p className="text-slate-400">
            © 2025 SecureVault. Secure browsing, simplified.
          </p>
        </div>
      </footer>
    </div>
  );
}