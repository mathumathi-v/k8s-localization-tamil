# Contributing to Tamil (ta) Kubernetes Localization

# தமிழ் Kubernetes மொழிபெயர்ப்புக்கு பங்களிப்பு செய்வது எப்படி

நன்றி! Kubernetes ஆவணங்களை தமிழில் மொழிபெயர்க்க உங்கள் உதவி மிகவும் மதிப்புமிக்கது.

Thank you for your interest in contributing to the Tamil localization of Kubernetes documentation!

---

## Getting Started / தொடங்குவது எப்படி

### Prerequisites / முன்தேவைகள்

- Git and GitHub account
- Basic knowledge of Markdown
- Fluency in Tamil and English
- Familiarity with Kubernetes concepts (helpful but not required)

### Setup / அமைப்பு

1. Fork the [kubernetes/website](https://github.com/kubernetes/website) repository
2. Clone your fork:
   ```bash
   git clone https://github.com/<your-username>/website.git
   cd website
   ```
3. Create a branch for your work:
   ```bash
   git checkout -b ta-translate-<page-name>
   ```

---

## Translation Workflow / மொழிபெயர்ப்பு வழிமுறை

### Step 1: Choose a page to translate

Check the [tracking issue](https://github.com/tossconf/TossHack26-ProblemStatements/issues/4) for pages that need translation. Comment on the issue to claim a page.

### Step 2: Copy the English source

```bash
# Example: translating the overview page
mkdir -p content/ta/docs/concepts/overview/
cp content/en/docs/concepts/overview/_index.md content/ta/docs/concepts/overview/_index.md
```

### Step 3: Translate the content

Open the copied file and translate following these rules:

#### DO translate:
- All body text and prose → Tamil
- `title` and `description` in front matter → Tamil
- Image alt text → Tamil

#### DO NOT translate (keep in English):
- YAML front matter **keys** (`title:`, `weight:`, `description:`)
- Code blocks and CLI commands (`kubectl`, `--namespace`, `apply`)
- Technical object names: `Pod`, `Node`, `Deployment`, `Service`, `Namespace`
- API field names: `spec`, `metadata`, `replicas`
- URLs and links
- Hugo shortcode syntax: `{{< note >}}`, `{{< warning >}}`

#### Technical terms:
On **first use**, include both English and Tamil:
```
Pod (பாட்) என்பது Kubernetes-இல் மிகச்சிறிய deploy பண்ணக்கூடிய அலகு ஆகும்.
```
After first use, just use the English term naturally in Tamil sentences.

### Step 4: Check the glossary

Use [GLOSSARY.md](./GLOSSARY.md) for consistent Tamil translations of technical terms. If you encounter a term not in the glossary, add it!

### Step 5: Validate your changes

```bash
# Check markdown formatting
npx markdownlint content/ta/**/*.md

# Build locally to preview (requires Hugo)
hugo server --buildFuture
```

### Step 6: Submit a PR

```bash
git add content/ta/
git commit -m "[ta] Translate docs/concepts/overview/_index.md to Tamil

- Translated all prose to Tamil
- Kept technical terms (Pod, Node, Deployment) in English
- Added Tamil glossary entries for new terms"

git push origin ta-translate-overview
```

Then open a Pull Request against `kubernetes/website` with the title format:
```
[ta] Add Tamil localization for <page name>
```

---

## Front Matter Template / முன்பகுதி வார்ப்புரு

Every translated page should have this front matter structure:

```yaml
---
title: "தமிழ் தலைப்பு இங்கே"
linkTitle: "குறுகிய தலைப்பு"
description: >-
  பக்க விளக்கம் இங்கே
weight: <same as English original>
---
```

---

## Style Guide / நடை வழிகாட்டி

1. **Formal Tamil**: Use formal written Tamil (எழுத்து வழக்கு), not colloquial
2. **Consistency**: Always refer to GLOSSARY.md for term translations
3. **Clarity over literal translation**: If a literal translation is confusing, rephrase for clarity
4. **Keep sentences concise**: Tamil sentences can get long — break them up when needed
5. **Preserve formatting**: Keep all Markdown formatting (headers, lists, bold, links) intact

---

## File Structure / கோப்பு அமைப்பு

Tamil translations mirror the English directory structure:

```
content/ta/
├── docs/
│   ├── home/
│   │   └── _index.md
│   ├── concepts/
│   │   ├── overview/
│   │   │   └── _index.md
│   │   └── workloads/
│   │       ├── pods/
│   │       │   └── _index.md
│   │       └── controllers/
│   │           └── deployment.md
│   └── services-networking/
│       └── service.md
```

---

## Review Process / மதிப்பாய்வு செயல்முறை

1. All PRs require at least one review from a Tamil-speaking contributor
2. Reviewers check for:
   - Translation accuracy
   - Glossary consistency
   - Preserved formatting and links
   - No translated code blocks or commands
3. Use GitHub's suggestion feature for minor fixes

---

## Resources / வளங்கள்

- [Kubernetes Localization Guide](https://kubernetes.io/docs/contribute/localization/)
- [Tamil Glossary](./GLOSSARY.md)
- [Hindi Localization (reference)](https://kubernetes.io/hi/)
- [Bengali Localization (reference)](https://kubernetes.io/bn/)
- [SIG Docs Slack](https://slack.k8s.io) — #sig-docs-localizations channel

---

## Questions? / கேள்விகள்?

Open an issue or reach out on the SIG Docs Slack channel. We're happy to help!

நன்றி! 🙏
