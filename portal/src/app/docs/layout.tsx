import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DocsSidebar from '@/components/DocsSidebar';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex max-w-[1400px] mx-auto w-full">
        <DocsSidebar />
        <main className="flex-1 min-w-0 border-l border-gray-200">
          <div className="max-w-4xl px-6 lg:px-10 py-8">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
