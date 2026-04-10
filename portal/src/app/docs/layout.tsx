import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DocsSidebar from '@/components/DocsSidebar';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header />
      <div className="flex-1 max-w-7xl mx-auto w-full flex">
        <DocsSidebar />
        <main className="flex-1 min-w-0 bg-white lg:border-l border-gray-100">
          <div className="max-w-3xl px-6 lg:px-10 py-10">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
