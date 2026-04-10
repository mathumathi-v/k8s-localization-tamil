'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-2xl">☸️</span>
          <span className="text-k8s-blue">K8s தமிழ்</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/docs/concepts-overview" className="text-gray-600 hover:text-k8s-blue transition">
            ஆவணம்
          </Link>
          <Link href="/glossary" className="text-gray-600 hover:text-k8s-blue transition">
            சொற்களஞ்சியம்
          </Link>
          <Link href="/contributing" className="text-gray-600 hover:text-k8s-blue transition">
            பங்களிக்க
          </Link>
          <Link href="/search" className="text-gray-600 hover:text-k8s-blue transition">
            தேடு
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-gray-200 bg-white px-6 py-4 space-y-3">
          <Link href="/docs/concepts-overview" className="block text-gray-600" onClick={() => setMenuOpen(false)}>
            ஆவணம்
          </Link>
          <Link href="/glossary" className="block text-gray-600" onClick={() => setMenuOpen(false)}>
            சொற்களஞ்சியம்
          </Link>
          <Link href="/contributing" className="block text-gray-600" onClick={() => setMenuOpen(false)}>
            பங்களிக்க
          </Link>
          <Link href="/search" className="block text-gray-600" onClick={() => setMenuOpen(false)}>
            தேடு
          </Link>
        </nav>
      )}
    </header>
  );
}
