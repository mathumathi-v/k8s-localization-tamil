import { getDocContent } from '@/lib/markdown';

export default async function InitContainersPage() {
  const doc = await getDocContent('docs/concepts/workloads/pods/init-containers.md');
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{doc.title}</h1>
      {doc.description && <p className="text-gray-500 mb-6 text-sm">{doc.description}</p>}
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: doc.htmlContent }} />
    </div>
  );
}
