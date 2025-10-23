"use client"
import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, Globe, Lock, Zap, CheckCircle, ArrowRight } from 'lucide-react';

export default function SecureVault() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleclick = () => {
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
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
            <a href="/home" className="text-slate-300 hover:text-white transition-colors">Home</a>
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">How It Works</a>
            <a href="/about" className="text-slate-300 hover:text-white transition-colors">About</a>
            <button onClick={handleclick} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 font-medium shadow-lg shadow-cyan-500/30">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <div className="inline-block">
              <div className="flex items-center space-x-2 bg-blue-500/10 border border-slate-700/30 rounded-full px-4 py-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-cyan-300">Enterprise-Grade Security</span>
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              Browse the Web in
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
                Isolated VM Containers
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              SecureVault creates isolated virtual machine sessions for your browsing activities, 
              authenticated seamlessly through your mobile device. Browse with confidence, knowing 
              your data is protected in sandboxed environments.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <button onClick={handleclick} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 font-semibold text-lg shadow-2xl shadow-cyan-500/50 flex items-center space-x-2">
                <span>Start Secure Session</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-5 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 bg-slate-700/50 rounded-lg px-4 py-2 text-sm text-slate-400">
                  https://securevault.session/vm-container-8f3a9b
                </div>
                <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-md text-cyan-400 text-xs font-medium flex items-center space-x-1">
                  <Lock className="w-3 h-3" />
                  <span>Secured</span>
                </div>
              </div>
              <div className="bg-slate-950/50 rounded-lg p-8 h-64 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Globe className="w-16 h-16 mx-auto text-cyan-400 animate-pulse" />
                  <p className="text-slate-400">VM Container Active</p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
                    <Smartphone className="w-4 h-4" />
                    <span>Authenticated via Mobile</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-10 px-3">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">SecureVault</span>
            </h2>
            <p className="text-xl text-slate-300">Next-generation browsing security at your fingertips</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-lg border border-slate-700/30 rounded-2xl p-8 hover:border-cyan-500/30 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/30">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">VM Isolation</h3>
              <p className="text-slate-300 leading-relaxed">
                Each browsing session runs in a completely isolated virtual machine container, 
                protecting your system from malware and tracking.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-lg border border-slate-700/30 rounded-2xl p-8 hover:border-cyan-500/30 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/30">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Mobile Auth</h3>
              <p className="text-slate-300 leading-relaxed">
                Seamless authentication through your mobile device ensures only you can 
                access your secure browsing sessions.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-lg border border-slate-700/30 rounded-2xl p-8 hover:border-cyan-500/30 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/30">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Instant Sessions</h3>
              <p className="text-slate-300 leading-relaxed">
                Launch secure browsing environments in seconds. No setup required, 
                just authenticate and start browsing safely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-10 px-3">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-2">How It Works</h2>
            <p className="text-xl text-slate-300">Three simple steps to secure browsing</p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Smartphone, title: 'Authenticate with Mobile', description: 'Open the SecureVault app on your mobile device and scan the QR code or approve the session request.' },
              { icon: Globe, title: 'VM Container Launches', description: 'A fresh virtual machine container is instantly created with a clean browsing environment.' },
              { icon: CheckCircle, title: 'Browse Securely', description: 'Your session is completely isolated. When you\'re done, the VM is destroyed, leaving no trace.' }
            ].map((step, index) => (
              <div key={index} className="flex items-start space-x-6 bg-slate-800/50 backdrop-blur-lg border border-slate-700/30 rounded-2xl p-8 hover:bg-slate-700/30 transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-cyan-500/30">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <step.icon className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-2xl font-bold">{step.title}</h3>
                  </div>
                  <p className="text-slate-300 text-lg leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
          <p className="text-slate-400">© 2025 SecureVault. Secure browsing, simplified.</p>
        </div>
      </footer>
    </div>
  );
}