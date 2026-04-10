# Kubernetes Tamil Localization / குபெர்னெட்டீஸ் தமிழ் மொழிபெயர்ப்பு

**TossHack 2026 — Problem Statement #4**

Localizing Kubernetes documentation into Tamil (`ta`) and building a demo portal for the Tamil-speaking community.

Kubernetes ஆவணங்களை தமிழில் மொழிபெயர்த்து, தமிழ் பேசும் சமூகத்திற்கான demo portal உருவாக்குதல்.

---

## Demo Portal

**Live Demo:** _Deploy to Vercel and add link here_

```bash
cd portal
npm install
npm run dev
# Opens at http://localhost:3000
```

### Portal Features
- Tamil Kubernetes docs browser with sidebar navigation
- English ↔ Tamil language toggle on every page
- Searchable Tamil ↔ English glossary (40+ terms)
- Full-text search across Tamil docs
- Contributing guide for new translators
- Responsive design with Tailwind CSS

---

## Translated Pages

| # | Page | Tamil File |
|---|------|-----------|
| 1 | Documentation Home | [translations/content/ta/docs/home/_index.md](translations/content/ta/docs/home/_index.md) |
| 2 | What is Kubernetes? | [translations/content/ta/docs/concepts/overview/_index.md](translations/content/ta/docs/concepts/overview/_index.md) |
| 3 | Pods | [translations/content/ta/docs/concepts/workloads/pods/_index.md](translations/content/ta/docs/concepts/workloads/pods/_index.md) |
| 4 | Deployments | [translations/content/ta/docs/concepts/workloads/controllers/deployment.md](translations/content/ta/docs/concepts/workloads/controllers/deployment.md) |
| 5 | Services | [translations/content/ta/docs/concepts/services-networking/service.md](translations/content/ta/docs/concepts/services-networking/service.md) |

---

## Project Structure

```
k8s-localization-tamil/
├── README.md                    ← this file
├── CLAUDE.md                    ← project context and rules
├── CONTRIBUTING-ta.md           ← guide for Tamil contributors
├── GLOSSARY.md                  ← Tamil ↔ English K8s term glossary (40+ terms)
├── hugo-toml-snippet.toml       ← hugo.toml config for kubernetes/website
├── i18n/
│   └── ta.toml                  ← Tamil UI strings for Hugo
├── translations/
│   └── content/
│       └── ta/
│           ├── OWNERS
│           └── docs/            ← 5 translated Tamil pages
└── portal/                      ← Next.js demo portal
    ├── package.json
    ├── next.config.js
    └── src/
        ├── app/                 ← pages (home, docs, glossary, search, contributing)
        └── components/          ← Header, Footer, Sidebar, LanguageToggle
```

---

## kubernetes/website PR

**PR:** _Add link after opening_

### Files for PR:
- `content/ta/` — Tamil translated pages + OWNERS file
- `i18n/ta.toml` — Tamil UI strings
- `hugo.toml` changes — Tamil language block (see `hugo-toml-snippet.toml`)

---

## Translation Guidelines

- **Translate:** All prose, titles, descriptions
- **Keep in English:** Code blocks, kubectl commands, API fields, object names (Pod, Node, Deployment, Service), URLs, Hugo shortcodes
- **Technical terms:** English term + Tamil in parentheses on first use, then English only
- **Style:** Formal written Tamil (எழுத்து வழக்கு)

See [CONTRIBUTING-ta.md](CONTRIBUTING-ta.md) for full details.

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Portal | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Language | TypeScript |
| Docs format | Markdown (Hugo-compatible) |
| Deployment | Vercel |

---

## Hackathon Checklist

- [x] `content/ta/` directory with OWNERS file
- [x] `hugo.toml` Tamil language block (snippet)
- [x] `i18n/ta.toml` with UI strings
- [x] 5 priority pages translated
- [x] `GLOSSARY.md` with 40+ terms
- [x] `CONTRIBUTING-ta.md` written
- [ ] PR opened to `kubernetes/website`
- [ ] Demo portal deployed on Vercel
- [x] README with project overview

---

## References

- [Kubernetes Localization Guide](https://kubernetes.io/docs/contribute/localization/)
- [kubernetes/website](https://github.com/kubernetes/website)
- [TossHack 2026 Problem Statement](https://github.com/tossconf/TossHack26-ProblemStatements/issues/4)
- [Hindi localization (reference)](https://kubernetes.io/hi/)
- [Bengali localization (reference)](https://kubernetes.io/bn/)

---

## Team

_Add team members here_

---

## License

Content translations follow the same license as the Kubernetes documentation: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
Portal code is MIT licensed.
