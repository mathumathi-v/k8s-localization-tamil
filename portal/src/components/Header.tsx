'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 722 210" className="h-8">
            <g fill="#326ce5">
              <path d="M104.6 3.4C101.5 1.2 97.6 0 93.5 0c-4.1 0-8 1.2-11.1 3.4L20.3 46.8C14 50.9 9.6 58 8.5 66l-8.3 69c-.7 5.6.5 11.2 3.3 15.9l.3.5 42.8 56.3c3.6 4.7 9.1 7.8 15.2 8.5l69 8.3c2.8.3 5.6.3 8.3-.1l.7-.1 69-8.3c6.1-.7 11.6-3.8 15.2-8.5l42.8-56.3c2.9-4.8 4.1-10.5 3.3-16.2l-8.3-69c-1.1-7.8-5.5-14.9-11.8-19L188.2 3.4c-6.3-4.4-14.5-5-21.4-1.7"/>
              <circle cx="93.5" cy="105" r="60" fill="white"/>
              <path d="M93.5 36c-38 0-69 31-69 69s31 69 69 69 69-31 69-69-31-69-69-69m0 126c-31.5 0-57-25.5-57-57s25.5-57 57-57 57 25.5 57 57-25.5 57-57 57"/>
            </g>
            <text x="210" y="135" fontFamily="sans-serif" fontSize="100" fontWeight="600" fill="#303030">Kubernetes</text>
          </svg>
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
