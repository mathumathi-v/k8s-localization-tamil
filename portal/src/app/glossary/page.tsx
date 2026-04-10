'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const glossaryData = [
  { en: 'Kubernetes', ta: 'Kubernetes', notes: 'Keep as-is' },
  { en: 'Container', ta: 'கொள்கலன்', notes: 'Use English in code' },
  { en: 'Pod', ta: 'Pod', notes: 'Keep as-is' },
  { en: 'Node', ta: 'Node', notes: 'Keep as-is' },
  { en: 'Cluster', ta: 'கொத்து', notes: '' },
  { en: 'Deployment', ta: 'Deployment', notes: 'Keep as-is' },
  { en: 'Service', ta: 'சேவை', notes: '' },
  { en: 'Namespace', ta: 'பெயரிடல் வெளி', notes: '' },
  { en: 'Volume', ta: 'தொகுதி', notes: '' },
  { en: 'Image', ta: 'படம்', notes: '' },
  { en: 'Control Plane', ta: 'கட்டுப்பாட்டு தளம்', notes: '' },
  { en: 'Scheduler', ta: 'திட்டமிடுபவர்', notes: '' },
  { en: 'API Server', ta: 'API சேவையகம்', notes: 'Keep "API" in English' },
  { en: 'etcd', ta: 'etcd', notes: 'Keep as-is' },
  { en: 'kubelet', ta: 'kubelet', notes: 'Keep as-is' },
  { en: 'kube-proxy', ta: 'kube-proxy', notes: 'Keep as-is' },
  { en: 'Controller Manager', ta: 'கட்டுப்படுத்தி மேலாளர்', notes: '' },
  { en: 'Workload', ta: 'பணிச்சுமை', notes: '' },
  { en: 'ReplicaSet', ta: 'ReplicaSet', notes: 'Keep as-is' },
  { en: 'StatefulSet', ta: 'StatefulSet', notes: 'Keep as-is' },
  { en: 'DaemonSet', ta: 'DaemonSet', notes: 'Keep as-is' },
  { en: 'Job', ta: 'Job', notes: 'Keep as-is' },
  { en: 'CronJob', ta: 'CronJob', notes: 'Keep as-is' },
  { en: 'Replica', ta: 'பிரதி', notes: '' },
  { en: 'Rolling Update', ta: 'உருளும் புதுப்பிப்பு', notes: '' },
  { en: 'Rollback', ta: 'பின்னோக்கி மாற்றம்', notes: '' },
  { en: 'Load Balancer', ta: 'சுமை பகிர்வி', notes: '' },
  { en: 'Ingress', ta: 'Ingress', notes: 'Keep as-is' },
  { en: 'Endpoint', ta: 'முனைப்புள்ளி', notes: '' },
  { en: 'DNS', ta: 'DNS', notes: 'Keep as-is' },
  { en: 'ConfigMap', ta: 'ConfigMap', notes: 'Keep as-is' },
  { en: 'Secret', ta: 'Secret', notes: 'Keep as-is' },
  { en: 'Configuration', ta: 'உள்ளமைவு', notes: '' },
  { en: 'Scaling', ta: 'அளவிடல்', notes: '' },
  { en: 'Self-healing', ta: 'தன்-குணப்படுத்தல்', notes: '' },
  { en: 'Container Orchestration', ta: 'கொள்கலன் அமைவு மேலாண்மை', notes: '' },
  { en: 'Open Source', ta: 'திறந்த மூலம்', notes: '' },
  { en: 'Documentation', ta: 'ஆவணம்', notes: '' },
  { en: 'Label', ta: 'முத்திரை', notes: '' },
  { en: 'Selector', ta: 'தேர்வாளர்', notes: '' },
  { en: 'Annotation', ta: 'குறிப்பு', notes: '' },
  { en: 'Manifest', ta: 'அறிவிப்பு கோப்பு', notes: '' },
];

export default function GlossaryPage() {
  const [search, setSearch] = useState('');

  const filtered = glossaryData.filter(
    (item) =>
      item.en.toLowerCase().includes(search.toLowerCase()) ||
      item.ta.includes(search)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <h1 className="text-3xl font-bold mb-2">சொற்களஞ்சியம் / Glossary</h1>
        <p className="text-gray-600 mb-8">
          Kubernetes தொழில்நுட்ப சொற்களுக்கான தமிழ் மொழிபெயர்ப்புகள்
        </p>

        <input
          type="text"
          placeholder="சொல்லைத் தேடுங்கள் / Search a term..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-k8s-blue focus:border-transparent"
        />

        <div className="text-sm text-gray-500 mb-4">
          {filtered.length} சொற்கள் காட்டப்படுகின்றன
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold">English</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold">தமிழ்</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold">குறிப்புகள்</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={i} className="hover:bg-blue-50 transition">
                  <td className="border border-gray-200 px-4 py-2 font-mono text-sm">{item.en}</td>
                  <td className="border border-gray-200 px-4 py-2">{item.ta}</td>
                  <td className="border border-gray-200 px-4 py-2 text-sm text-gray-500">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}
