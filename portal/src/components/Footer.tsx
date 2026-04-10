import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#303030] text-gray-400 text-sm">
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">☸️</span>
              <span className="text-white font-semibold">Kubernetes தமிழ்</span>
            </div>
            <p className="text-xs leading-5 text-gray-500">
              TossHack 2026 — Problem Statement #4. Kubernetes ஆவணங்களை தமிழில் மொழிபெயர்த்தல்.
            </p>
          </div>

          {/* Docs */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">ஆவணம்</h3>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/docs/concepts-overview" className="hover:text-white transition">கண்ணோட்டம்</Link></li>
              <li><Link href="/docs/pods" className="hover:text-white transition">Pod-கள்</Link></li>
              <li><Link href="/docs/deployment" className="hover:text-white transition">Deployments</Link></li>
              <li><Link href="/docs/service" className="hover:text-white transition">Services</Link></li>
              <li><Link href="/glossary" className="hover:text-white transition">சொற்களஞ்சியம்</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">சமூகம்</h3>
            <ul className="space-y-1.5 text-xs">
              <li><a href="https://kubernetes.io" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">kubernetes.io</a></li>
              <li><a href="https://github.com/kubernetes/website" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="https://slack.k8s.io" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">Slack</a></li>
              <li><Link href="/contributing" className="hover:text-white transition">பங்களிக்க</Link></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">இணைப்புகள்</h3>
            <ul className="space-y-1.5 text-xs">
              <li><a href="https://kubernetes.io/hi/" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">Hindi Localization</a></li>
              <li><a href="https://kubernetes.io/bn/" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">Bengali Localization</a></li>
              <li><a href="https://kubernetes.io/docs/contribute/localization/" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">Localization Guide</a></li>
              <li><a href="https://github.com/tossconf/TossHack26-ProblemStatements/issues/4" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">TossHack 2026 Issue</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            &copy; 2026 Kubernetes Authors | Content licensed under <a href="https://creativecommons.org/licenses/by/4.0/" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>
          </p>
          <p className="text-xs text-gray-500">
            <a href="https://www.cncf.io/" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">
              CNCF Graduate Project
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
