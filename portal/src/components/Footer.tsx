import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-3">Kubernetes தமிழ்</h3>
            <p className="text-sm">
              TossHack 2026 Hackathon திட்டம். Kubernetes ஆவணங்களை தமிழில் கொண்டுவருதல்.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">ஆவணங்கள்</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/docs/concepts-overview" className="hover:text-white transition">கண்ணோட்டம்</Link></li>
              <li><Link href="/docs/pods" className="hover:text-white transition">Pod-கள்</Link></li>
              <li><Link href="/docs/deployment" className="hover:text-white transition">Deployment-கள்</Link></li>
              <li><Link href="/docs/service" className="hover:text-white transition">Service-கள்</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">இணைப்புகள்</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://kubernetes.io" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">kubernetes.io</a></li>
              <li><a href="https://github.com/kubernetes/website" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
              <li><Link href="/glossary" className="hover:text-white transition">சொற்களஞ்சியம்</Link></li>
              <li><Link href="/contributing" className="hover:text-white transition">பங்களிக்க</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>TossHack 2026 - Problem Statement #4 | Kubernetes Tamil Localization</p>
        </div>
      </div>
    </footer>
  );
}
