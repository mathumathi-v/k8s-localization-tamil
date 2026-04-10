'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const searchableContent = [
  {
    title: 'Kubernetes கண்ணோட்டம்',
    titleEn: 'What is Kubernetes?',
    href: '/docs/concepts-overview',
    keywords: 'kubernetes overview கண்ணோட்டம் container கொள்கலன் cluster கொத்து orchestration அமைவு மேலாண்மை scaling அளவிடல் self-healing தன்-குணப்படுத்தல் load balancing சுமை history வரலாறு',
    description: 'Kubernetes என்றால் என்ன, அது என்ன செய்ய முடியும் என்பதை அறியுங்கள்',
  },
  {
    title: 'Pod-கள்',
    titleEn: 'Pods',
    href: '/docs/pods',
    keywords: 'pod pods container கொள்கலன் networking நெட்வொர்க் storage சேமிப்பு volume தொகுதி controller கட்டுப்படுத்தி probe sidecar init',
    description: 'Kubernetes-இல் மிகச்சிறிய வரிசைப்படுத்தக்கூடிய அலகுகள்',
  },
  {
    title: 'Deployment-கள்',
    titleEn: 'Deployments',
    href: '/docs/deployment',
    keywords: 'deployment replicaset rollout rollback update புதுப்பிப்பு scale அளவிடல் replica பிரதி rolling update உருளும் nginx strategy மூலோபாயம்',
    description: 'Pod-கள் மற்றும் ReplicaSet-களுக்கான அறிவிப்பு வகை புதுப்பிப்புகள்',
  },
  {
    title: 'சேவை (Service)',
    titleEn: 'Services',
    href: '/docs/service',
    keywords: 'service சேவை clusterip nodeport loadbalancer externalname dns endpoint முனைப்புள்ளி selector தேர்வாளர் networking நெட்வொர்க் discovery கண்டறிதல் load balancer சுமை பகிர்வி',
    description: 'Pod-களின் குழுக்களை நெட்வொர்க்கில் வெளிப்படுத்துதல்',
  },
  {
    title: 'கூறுகள்',
    titleEn: 'Components',
    href: '/docs/components',
    keywords: 'components கூறுகள் control plane கட்டுப்பாட்டு தளம் kube-apiserver etcd kube-scheduler kube-controller-manager kubelet kube-proxy container runtime addons dns dashboard',
    description: 'Kubernetes கொத்தை உருவாக்கும் முக்கிய கூறுகள்',
  },
  {
    title: 'Node-கள்',
    titleEn: 'Nodes',
    href: '/docs/nodes',
    keywords: 'node nodes kubelet heartbeat controller management registration capacity topology cordon drain',
    description: 'Pod-களை இயக்கும் மெய்நிகர் அல்லது இயற்பியல் இயந்திரங்கள்',
  },
  {
    title: 'பெயரிடல் வெளி',
    titleEn: 'Namespaces',
    href: '/docs/namespaces',
    keywords: 'namespace பெயரிடல் வெளி isolation default kube-system kube-public dns resource quota',
    description: 'ஒரு கொத்துக்குள் வளக் குழுக்களை தனிமைப்படுத்தும் வழிமுறை',
  },
  {
    title: 'முத்திரைகள் & தேர்வாளர்கள்',
    titleEn: 'Labels & Selectors',
    href: '/docs/labels',
    keywords: 'label முத்திரை selector தேர்வாளர் matchLabels matchExpressions equality set-based annotation குறிப்பு',
    description: 'பொருள்களை ஒழுங்கமைக்கவும் தேர்ந்தெடுக்கவும் பயன்படும் key/value ஜோடிகள்',
  },
  {
    title: 'ReplicaSet',
    titleEn: 'ReplicaSet',
    href: '/docs/replicaset',
    keywords: 'replicaset replica பிரதி scaling அளவிடல் selector pod template owner hpa autoscale',
    description: 'குறிப்பிட்ட எண்ணிக்கையிலான Pod பிரதிகளை பராமரித்தல்',
  },
  {
    title: 'StatefulSet',
    titleEn: 'StatefulSet',
    href: '/docs/statefulset',
    keywords: 'statefulset stateful persistent storage ordinal identity headless service volume claim rolling update partition',
    description: 'நிலையான அடையாளம் மற்றும் நிலையான சேமிப்புடன் Pod-களை நிர்வகித்தல்',
  },
  {
    title: 'DaemonSet',
    titleEn: 'DaemonSet',
    href: '/docs/daemonset',
    keywords: 'daemonset daemon node-local logging monitoring storage network plugin toleration taint',
    description: 'அனைத்து Node-களிலும் Pod-இன் நகலை இயக்குதல்',
  },
  {
    title: 'ConfigMap',
    titleEn: 'ConfigMap',
    href: '/docs/configmap',
    keywords: 'configmap configuration உள்ளமைவு environment variable volume mount immutable data settings',
    description: 'பயன்பாட்டு குறியீட்டிலிருந்து உள்ளமைவு தரவை தனியாக அமைத்தல்',
  },
  {
    title: 'சொற்களஞ்சியம்',
    titleEn: 'Glossary',
    href: '/glossary',
    keywords: 'glossary சொற்களஞ்சியம் terms translation மொழிபெயர்ப்பு tamil தமிழ்',
    description: 'Kubernetes சொற்களின் தமிழ் மொழிபெயர்ப்புகள்',
  },
  {
    title: 'பங்களிப்பு வழிகாட்டி',
    titleEn: 'Contributing Guide',
    href: '/contributing',
    keywords: 'contributing பங்களிப்பு guide வழிகாட்டி translate மொழிபெயர்ப்பு PR pull request github',
    description: 'தமிழ் மொழிபெயர்ப்புக்கு எவ்வாறு பங்களிப்பது',
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const results = query.length > 0
    ? searchableContent.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.titleEn.toLowerCase().includes(query.toLowerCase()) ||
          item.keywords.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        <h1 className="text-3xl font-bold mb-6">தேடு / Search</h1>
        <input
          type="text"
          placeholder="ஆவணங்களைத் தேடுங்கள் / Search docs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-8 focus:outline-none focus:ring-2 focus:ring-k8s-blue focus:border-transparent text-lg"
        />

        {query.length > 0 && (
          <p className="text-sm text-gray-500 mb-4">
            {results.length} முடிவுகள் &quot;{query}&quot; க்கு
          </p>
        )}

        <div className="space-y-4">
          {results.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block p-4 border border-gray-200 rounded-lg hover:border-k8s-blue hover:shadow transition"
            >
              <h2 className="font-semibold text-lg text-gray-900">{item.title}</h2>
              <p className="text-sm text-gray-500">{item.titleEn}</p>
              <p className="text-gray-600 mt-1">{item.description}</p>
            </Link>
          ))}
        </div>

        {query.length > 0 && results.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-4">🔍</p>
            <p>&quot;{query}&quot; க்கு முடிவுகள் இல்லை</p>
            <p className="text-sm mt-2">வேறு சொற்களைப் பயன்படுத்தி மீண்டும் தேடவும்</p>
          </div>
        )}

        {query.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-4">☸️</p>
            <p>Kubernetes ஆவணங்களைத் தமிழிலோ ஆங்கிலத்திலோ தேடுங்கள்</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
