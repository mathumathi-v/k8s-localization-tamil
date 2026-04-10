import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const docPages = [
  {
    title: 'Kubernetes கண்ணோட்டம்',
    titleEn: 'What is Kubernetes?',
    description: 'Kubernetes என்றால் என்ன, அது என்ன செய்ய முடியும் என்பதை அறியுங்கள்',
    href: '/docs/concepts-overview',
    icon: '☸️',
  },
  {
    title: 'கூறுகள்',
    titleEn: 'Components',
    description: 'Kubernetes கொத்தை உருவாக்கும் முக்கிய கூறுகளின் கண்ணோட்டம்',
    href: '/docs/components',
    icon: '🧩',
  },
  {
    title: 'Node-கள்',
    titleEn: 'Nodes',
    description: 'Pod-களை இயக்கும் மெய்நிகர் அல்லது இயற்பியல் இயந்திரங்கள்',
    href: '/docs/nodes',
    icon: '🖥️',
  },
  {
    title: 'பெயரிடல் வெளி',
    titleEn: 'Namespaces',
    description: 'ஒரு கொத்துக்குள் வளக் குழுக்களை தனிமைப்படுத்தும் வழிமுறை',
    href: '/docs/namespaces',
    icon: '📁',
  },
  {
    title: 'முத்திரைகள் & தேர்வாளர்கள்',
    titleEn: 'Labels & Selectors',
    description: 'பொருள்களை ஒழுங்கமைக்கவும் தேர்ந்தெடுக்கவும் பயன்படும் key/value ஜோடிகள்',
    href: '/docs/labels',
    icon: '🏷️',
  },
  {
    title: 'Pod-கள்',
    titleEn: 'Pods',
    description: 'Kubernetes-இல் மிகச்சிறிய வரிசைப்படுத்தக்கூடிய அலகுகள்',
    href: '/docs/pods',
    icon: '🫛',
  },
  {
    title: 'Deployment-கள்',
    titleEn: 'Deployments',
    description: 'Pod-கள் மற்றும் ReplicaSet-களுக்கான அறிவிப்பு வகை புதுப்பிப்புகள்',
    href: '/docs/deployment',
    icon: '🚀',
  },
  {
    title: 'ReplicaSet',
    titleEn: 'ReplicaSet',
    description: 'குறிப்பிட்ட எண்ணிக்கையிலான Pod பிரதிகளை பராமரித்தல்',
    href: '/docs/replicaset',
    icon: '🔄',
  },
  {
    title: 'StatefulSet',
    titleEn: 'StatefulSet',
    description: 'நிலையான அடையாளம் மற்றும் நிலையான சேமிப்புடன் Pod-களை நிர்வகித்தல்',
    href: '/docs/statefulset',
    icon: '💾',
  },
  {
    title: 'DaemonSet',
    titleEn: 'DaemonSet',
    description: 'அனைத்து Node-களிலும் Pod-இன் நகலை இயக்குதல்',
    href: '/docs/daemonset',
    icon: '👹',
  },
  {
    title: 'சேவை (Service)',
    titleEn: 'Services',
    description: 'Pod-களின் குழுக்களை நெட்வொர்க்கில் வெளிப்படுத்துதல்',
    href: '/docs/service',
    icon: '🔗',
  },
  {
    title: 'ConfigMap',
    titleEn: 'ConfigMap',
    description: 'பயன்பாட்டு குறியீட்டிலிருந்து உள்ளமைவு தரவை தனியாக அமைத்தல்',
    href: '/docs/configmap',
    icon: '⚙️',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-k8s-blue to-blue-800 text-white py-20">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="text-7xl mb-6">☸️</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Kubernetes ஆவணம் தமிழில்
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-2">
              Kubernetes Documentation in Tamil
            </p>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto mt-4">
              கொள்கலன் மயமாக்கப்பட்ட பயன்பாடுகளின் தானியங்கி வரிசைப்படுத்தல், அளவிடல்
              மற்றும் மேலாண்மைக்கான திறந்த மூல இயந்திரம்
            </p>
            <div className="mt-8 flex gap-4 justify-center flex-wrap">
              <Link
                href="/docs/concepts-overview"
                className="bg-white text-k8s-blue px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                ஆவணங்களைப் படிக்கவும்
              </Link>
              <Link
                href="/glossary"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
              >
                சொற்களஞ்சியம்
              </Link>
            </div>
          </div>
        </section>

        {/* Doc Cards */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-8 text-center">மொழிபெயர்க்கப்பட்ட ஆவணங்கள்</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {docPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="block p-6 border border-gray-200 rounded-xl hover:border-k8s-blue hover:shadow-lg transition group"
              >
                <div className="text-3xl mb-3">{page.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-k8s-blue transition">
                  {page.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{page.titleEn}</p>
                <p className="text-gray-600">{page.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-k8s-blue">37</div>
                <div className="text-gray-600 mt-1">மொழிபெயர்க்கப்பட்ட பக்கங்கள்</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-k8s-blue">40+</div>
                <div className="text-gray-600 mt-1">சொற்களஞ்சிய சொற்கள்</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-k8s-blue">ta</div>
                <div className="text-gray-600 mt-1">ISO 639-1 குறியீடு</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-k8s-blue">8 கோடி+</div>
                <div className="text-gray-600 mt-1">தமிழ் பேசுபவர்கள்</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contributing */}
        <section className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">பங்களிக்க விரும்புகிறீர்களா?</h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Kubernetes ஆவணங்களை தமிழில் மொழிபெயர்க்க உங்கள் உதவி மிகவும் மதிப்புமிக்கது.
            எங்கள் பங்களிப்பு வழிகாட்டியைப் படிக்கவும்.
          </p>
          <Link
            href="/contributing"
            className="inline-block bg-k8s-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            பங்களிப்பு வழிகாட்டி
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
