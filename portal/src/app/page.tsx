import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero — K8s style */}
        <section className="bg-[#326ce5] text-white py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              உற்பத்தி-தயாரான கொள்கலன் அமைவு மேலாண்மை
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Production-Grade Container Orchestration
            </p>
            <p className="text-blue-200 max-w-xl mx-auto mb-10 leading-relaxed text-sm md:text-base">
              கொள்கலன் மயமாக்கப்பட்ட பயன்பாடுகளின் தானியங்கி வரிசைப்படுத்தல், அளவிடல் மற்றும்
              மேலாண்மையை Kubernetes எளிதாக்குகிறது.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/docs/concepts-overview"
                className="bg-white text-[#326ce5] px-6 py-3 rounded font-semibold text-sm hover:bg-blue-50 transition"
              >
                ஆவணங்களைப் படிக்கவும்
              </Link>
              <Link
                href="/glossary"
                className="border-2 border-white/60 text-white px-6 py-3 rounded font-semibold text-sm hover:bg-white/10 transition"
              >
                சொற்களஞ்சியம்
              </Link>
            </div>
          </div>
        </section>

        {/* Features — K8s 3-column style */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-10">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#326ce5]/10 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#326ce5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">அளவிடக்கூடிய</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  உங்கள் பணிச்சுமைக்கு ஏற்ப தானாகவே அளவிடும். நூற்றுக்கணக்கான Node-களில் ஆயிரக்கணக்கான கொள்கலன்களை நிர்வகிக்கலாம்.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#326ce5]/10 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#326ce5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">எங்கும் இயங்கும்</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  பொது கிளவுட், தனியார் கிளவுட் அல்லது ஹைப்ரிட் — எந்த சூழலிலும் Kubernetes இயங்கும்.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#326ce5]/10 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#326ce5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">தன்-குணப்படுத்தல்</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  தோல்வியுற்ற கொள்கலன்களை தானாகவே மறுதொடக்கம் செய்கிறது, மாற்றுகிறது மற்றும் திட்டமிடுகிறது.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Docs Grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl font-semibold text-center mb-2">மொழிபெயர்க்கப்பட்ட ஆவணங்கள்</h2>
            <p className="text-gray-500 text-center mb-10 text-sm">37 பக்கங்கள் | 11,000+ வரிகள் தமிழில்</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'கண்ணோட்டம்', en: 'Overview', href: '/docs/concepts-overview' },
                { title: 'கூறுகள்', en: 'Components', href: '/docs/components' },
                { title: 'Node-கள்', en: 'Nodes', href: '/docs/nodes' },
                { title: 'Pod-கள்', en: 'Pods', href: '/docs/pods' },
                { title: 'Deployments', en: 'Deployments', href: '/docs/deployment' },
                { title: 'சேவை', en: 'Services', href: '/docs/service' },
                { title: 'Ingress', en: 'Ingress', href: '/docs/ingress' },
                { title: 'ConfigMap', en: 'ConfigMap', href: '/docs/configmap' },
                { title: 'Secret', en: 'Secret', href: '/docs/secret' },
                { title: 'தொகுதிகள்', en: 'Volumes', href: '/docs/volumes' },
                { title: 'RBAC', en: 'RBAC', href: '/docs/rbac' },
                { title: 'kubectl', en: 'kubectl', href: '/docs/kubectl' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block p-4 bg-white border border-gray-200 rounded hover:border-[#326ce5] hover:shadow-sm transition group"
                >
                  <h3 className="font-medium text-gray-900 group-hover:text-[#326ce5] transition text-sm">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400">{item.en}</p>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/docs/concepts-overview"
                className="text-[#326ce5] text-sm font-medium hover:underline"
              >
                அனைத்து 37 பக்கங்களையும் காண &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-[#326ce5]">37</div>
                <div className="text-xs text-gray-500 mt-1">மொழிபெயர்க்கப்பட்ட பக்கங்கள்</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#326ce5]">11K+</div>
                <div className="text-xs text-gray-500 mt-1">மொழிபெயர்க்கப்பட்ட வரிகள்</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#326ce5]">40+</div>
                <div className="text-xs text-gray-500 mt-1">சொற்களஞ்சிய சொற்கள்</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#326ce5]">8 கோடி+</div>
                <div className="text-xs text-gray-500 mt-1">தமிழ் பேசுபவர்கள்</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-gray-50 border-t border-gray-100">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="text-xl font-semibold mb-3">பங்களிக்க விரும்புகிறீர்களா?</h2>
            <p className="text-sm text-gray-600 mb-6">
              Kubernetes ஆவணங்களை தமிழில் மொழிபெயர்க்க உங்கள் உதவி மிகவும் மதிப்புமிக்கது.
            </p>
            <Link
              href="/contributing"
              className="inline-block bg-[#326ce5] text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-[#2a5cc4] transition"
            >
              பங்களிப்பு வழிகாட்டி
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
