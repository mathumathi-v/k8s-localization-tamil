'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

type NavItem = {
  title: string;
  titleEn?: string;
  href?: string;
  children?: NavItem[];
};

const navTree: NavItem[] = [
  {
    title: 'ஆவணம்',
    titleEn: 'Documentation',
    href: '/',
  },
  {
    title: 'தொடங்குதல்',
    titleEn: 'Getting started',
    children: [
      { title: 'Kubernetes கண்ணோட்டம்', titleEn: 'Overview', href: '/docs/concepts-overview' },
      { title: 'கூறுகள்', titleEn: 'Components', href: '/docs/components' },
    ],
  },
  {
    title: 'கருத்துகள்',
    titleEn: 'Concepts',
    children: [
      {
        title: 'கண்ணோட்டம்',
        titleEn: 'Overview',
        children: [
          { title: 'Kubernetes என்றால் என்ன?', titleEn: 'What is Kubernetes?', href: '/docs/concepts-overview' },
          { title: 'Kubernetes கூறுகள்', titleEn: 'Kubernetes Components', href: '/docs/components' },
        ],
      },
      {
        title: 'கொத்து கட்டமைப்பு',
        titleEn: 'Cluster Architecture',
        children: [
          { title: 'கட்டமைப்பு', titleEn: 'Architecture', href: '/docs/cluster-architecture' },
          { title: 'Node-கள்', titleEn: 'Nodes', href: '/docs/nodes' },
          { title: 'குப்பை சேகரிப்பு', titleEn: 'Garbage Collection', href: '/docs/garbage-collection' },
        ],
      },
      {
        title: 'கொள்கலன்கள்',
        titleEn: 'Containers',
        children: [
          { title: 'கொள்கலன் படங்கள்', titleEn: 'Container Images', href: '/docs/container-images' },
          { title: 'வாழ்க்கைச் சுழற்சி hooks', titleEn: 'Container Lifecycle Hooks', href: '/docs/container-lifecycle-hooks' },
        ],
      },
      {
        title: 'பணிச்சுமைகள்',
        titleEn: 'Workloads',
        children: [
          { title: 'Pod-கள்', titleEn: 'Pods', href: '/docs/pods' },
          { title: 'Pod வாழ்க்கைச் சுழற்சி', titleEn: 'Pod Lifecycle', href: '/docs/pod-lifecycle' },
          { title: 'Init கொள்கலன்கள்', titleEn: 'Init Containers', href: '/docs/init-containers' },
          { title: 'Pod இடையூறுகள்', titleEn: 'Disruptions', href: '/docs/disruptions' },
          { title: 'Deployments', titleEn: 'Deployments', href: '/docs/deployment' },
          { title: 'ReplicaSet', titleEn: 'ReplicaSet', href: '/docs/replicaset' },
          { title: 'StatefulSet', titleEn: 'StatefulSet', href: '/docs/statefulset' },
          { title: 'DaemonSet', titleEn: 'DaemonSet', href: '/docs/daemonset' },
          { title: 'Job', titleEn: 'Job', href: '/docs/job' },
          { title: 'CronJob', titleEn: 'CronJob', href: '/docs/cronjob' },
          { title: 'அளவிடல்', titleEn: 'Autoscaling', href: '/docs/autoscaling' },
        ],
      },
      {
        title: 'சேவைகள், நெட்வொர்க்கிங்',
        titleEn: 'Services, Networking',
        children: [
          { title: 'சேவை (Service)', titleEn: 'Service', href: '/docs/service' },
          { title: 'Ingress', titleEn: 'Ingress', href: '/docs/ingress' },
          { title: 'DNS', titleEn: 'DNS for Services and Pods', href: '/docs/dns' },
          { title: 'நெட்வொர்க் கொள்கைகள்', titleEn: 'Network Policies', href: '/docs/network-policies' },
        ],
      },
      {
        title: 'சேமிப்பு',
        titleEn: 'Storage',
        children: [
          { title: 'தொகுதிகள்', titleEn: 'Volumes', href: '/docs/volumes' },
          { title: 'நிலையான தொகுதிகள்', titleEn: 'Persistent Volumes', href: '/docs/persistent-volumes' },
          { title: 'சேமிப்பு வகுப்புகள்', titleEn: 'Storage Classes', href: '/docs/storage-classes' },
        ],
      },
      {
        title: 'உள்ளமைவு',
        titleEn: 'Configuration',
        children: [
          { title: 'ConfigMap', titleEn: 'ConfigMap', href: '/docs/configmap' },
          { title: 'Secret', titleEn: 'Secret', href: '/docs/secret' },
          { title: 'வள மேலாண்மை', titleEn: 'Resource Management', href: '/docs/manage-resources' },
        ],
      },
      {
        title: 'பாதுகாப்பு',
        titleEn: 'Security',
        children: [
          { title: 'ServiceAccount', titleEn: 'Service Accounts', href: '/docs/service-accounts' },
          { title: 'RBAC அனுமதி', titleEn: 'RBAC Authorization', href: '/docs/rbac' },
        ],
      },
      {
        title: 'திட்டமிடல், இடையூறு',
        titleEn: 'Scheduling, Eviction',
        children: [
          { title: 'Pod-களை Node-களுக்கு ஒதுக்குதல்', titleEn: 'Assigning Pods to Nodes', href: '/docs/assign-pod-node' },
          { title: 'Taints & Tolerations', titleEn: 'Taints and Tolerations', href: '/docs/taints-tolerations' },
        ],
      },
      {
        title: 'பொருள்கள் பற்றி',
        titleEn: 'Working with Objects',
        children: [
          { title: 'பெயரிடல் வெளி', titleEn: 'Namespaces', href: '/docs/namespaces' },
          { title: 'முத்திரைகள் & தேர்வாளர்கள்', titleEn: 'Labels and Selectors', href: '/docs/labels' },
          { title: 'குறிப்புகள்', titleEn: 'Annotations', href: '/docs/annotations' },
        ],
      },
    ],
  },
  {
    title: 'குறிப்பு',
    titleEn: 'Reference',
    children: [
      { title: 'kubectl', titleEn: 'kubectl Overview', href: '/docs/kubectl' },
      { title: 'சொற்களஞ்சியம்', titleEn: 'Glossary', href: '/glossary' },
    ],
  },
  {
    title: 'பங்களிக்க',
    titleEn: 'Contribute',
    href: '/contributing',
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3 h-3 shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function isActive(item: NavItem, pathname: string): boolean {
  if (item.href === pathname) return true;
  if (item.children) {
    return item.children.some((child) => isActive(child, pathname));
  }
  return false;
}

function NavTreeItem({
  item,
  pathname,
  level,
  closeMobile,
}: {
  item: NavItem;
  pathname: string;
  level: number;
  closeMobile: () => void;
}) {
  const active = isActive(item, pathname);
  const hasChildren = !!item.children?.length;
  const [open, setOpen] = useState(active);

  // Auto-expand when route changes to an active child
  useEffect(() => {
    if (active && hasChildren) setOpen(true);
  }, [active, hasChildren]);

  const isCurrent = item.href === pathname;
  const indentPx = level * 14;

  if (!hasChildren) {
    return (
      <Link
        href={item.href || '#'}
        onClick={closeMobile}
        style={{ paddingLeft: `${12 + indentPx}px` }}
        className={`flex items-center gap-2 py-1.5 pr-3 text-sm rounded-md transition-colors ${
          isCurrent
            ? 'text-k8s-blue font-medium bg-blue-50'
            : 'text-gray-700 hover:text-k8s-blue hover:bg-gray-50'
        }`}
      >
        <span className="w-3 shrink-0" />
        <span className="truncate">
          {item.title}
          {item.titleEn && (
            <span className="text-[11px] text-gray-400 ml-1">{item.titleEn}</span>
          )}
        </span>
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{ paddingLeft: `${12 + indentPx}px` }}
        className={`w-full flex items-center gap-2 py-1.5 pr-3 text-sm rounded-md transition-colors text-left ${
          active
            ? 'text-k8s-blue font-semibold'
            : 'text-gray-800 hover:text-k8s-blue hover:bg-gray-50'
        }`}
      >
        <ChevronIcon open={open} />
        <span className="truncate flex-1">
          {item.title}
          {item.titleEn && (
            <span className="text-[11px] text-gray-400 ml-1 font-normal">
              {item.titleEn}
            </span>
          )}
        </span>
      </button>
      {open && (
        <div className="mt-0.5 mb-1">
          {item.children!.map((child, i) => (
            <NavTreeItem
              key={`${child.href || child.titleEn || child.title}-${i}`}
              item={child}
              pathname={pathname}
              level={level + 1}
              closeMobile={closeMobile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DocsSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');

  const closeMobile = () => setMobileOpen(false);

  // Filter helper
  const filterTree = (items: NavItem[], query: string): NavItem[] => {
    if (!query) return items;
    const q = query.toLowerCase();
    const result: NavItem[] = [];
    for (const item of items) {
      const matches =
        item.title.toLowerCase().includes(q) ||
        (item.titleEn || '').toLowerCase().includes(q);
      if (item.children) {
        const filteredChildren = filterTree(item.children, query);
        if (matches || filteredChildren.length > 0) {
          result.push({ ...item, children: filteredChildren.length > 0 ? filteredChildren : item.children });
        }
      } else if (matches) {
        result.push(item);
      }
    }
    return result;
  };

  const filteredTree = filterTree(navTree, search);

  const sidebarContent = (
    <>
      {/* Search box */}
      <div className="relative mb-3 px-2">
        <svg
          className="absolute left-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="இந்த தளத்தை தேடு / Search..."
          className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-k8s-blue/30 focus:border-k8s-blue bg-white"
        />
      </div>

      <nav className="space-y-0.5">
        {filteredTree.map((item, i) => (
          <NavTreeItem
            key={`${item.href || item.titleEn || item.title}-${i}`}
            item={item}
            pathname={pathname}
            level={0}
            closeMobile={closeMobile}
          />
        ))}
        {filteredTree.length === 0 && (
          <p className="px-3 py-4 text-xs text-gray-400 text-center">
            முடிவுகள் இல்லை / No results
          </p>
        )}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-k8s-blue text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition"
        aria-label="Toggle docs menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-40"
          onClick={closeMobile}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-40 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <span className="text-xl">☸️</span>
          <span className="font-bold text-k8s-blue">K8s ஆவணம்</span>
        </div>
        <div className="p-2 overflow-y-auto h-[calc(100%-57px)] scrollbar-thin">
          {sidebarContent}
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="w-[280px] shrink-0 hidden lg:block">
        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 -mr-2 pb-8 scrollbar-thin">
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}
