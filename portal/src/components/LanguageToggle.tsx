'use client';

import { useState } from 'react';

interface LanguageToggleProps {
  tamilContent: string;
  englishContent: string;
}

export default function LanguageToggle({ tamilContent, englishContent }: LanguageToggleProps) {
  const [lang, setLang] = useState<'ta' | 'en'>('ta');

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          onClick={() => setLang('ta')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            lang === 'ta' ? 'bg-white shadow text-k8s-blue' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          தமிழ்
        </button>
        <button
          onClick={() => setLang('en')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            lang === 'en' ? 'bg-white shadow text-k8s-blue' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          English
        </button>
      </div>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: lang === 'ta' ? tamilContent : englishContent }}
      />
    </div>
  );
}
