'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src="https://kubernetes.io/images/kubernetes-horizontal-color.png"
            alt="Kubernetes"
            className="h-7"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link href="/docs/concepts-overview" className="px-3 py-2 text-gray-600 hover:text-[#326ce5] rounded transition">
            ஆவணம்
          </Link>
          <Link href="/glossary" className="px-3 py-2 text-gray-600 hover:text-[#326ce5] rounded transition">
            சொற்களஞ்சியம்
          </Link>
          <Link href="/contributing" className="px-3 py-2 text-gray-600 hover:text-[#326ce5] rounded transition">
            பங்களிக்க
          </Link>
          <Link href="/search" className="px-3 py-2 text-gray-600 hover:text-[#326ce5] rounded transition">
            தேடு
          </Link>
          <span className="ml-2 px-3 py-1 bg-[#326ce5]/10 text-[#326ce5] text-xs font-semibold rounded-full">
            தமிழ் / Tamil
          </span>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-gray-600"
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
        <nav className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
          <Link href="/docs/concepts-overview" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded" onClick={() => setMenuOpen(false)}>ஆவணம்</Link>
          <Link href="/glossary" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded" onClick={() => setMenuOpen(false)}>சொற்களஞ்சியம்</Link>
          <Link href="/contributing" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded" onClick={() => setMenuOpen(false)}>பங்களிக்க</Link>
          <Link href="/search" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded" onClick={() => setMenuOpen(false)}>தேடு</Link>
        </nav>
      )}
    </header>
  );
}
