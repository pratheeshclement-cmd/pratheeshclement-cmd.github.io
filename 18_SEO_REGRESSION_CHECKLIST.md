# 18 — SEO & Search Engine Indexing Regression Checklist
**Project:** PRATHEESH OS V2 (Portfolio X)
**Role:** Technical SEO Lead & Search Engine Indexing Specialist

---

## Executive SEO QA Strategy

The **SEO Regression Checklist** guarantees zero organic search ranking degradation, zero indexing loss, zero structured data breakage, and zero broken links during or after the visual redesign.

---

## SEO Regression Audit Matrix

| SEO Audit Dimension | Verification Standard | Target Location | Status |
| :--- | :--- | :--- | :--- |
| **Page Title Tags** | Primary title tag: `"Pratheesh Clement \| SEO, Digital Marketing & Web Development"` | `<head>` in `index.html` | [ ] PENDING |
| **Meta Description** | Full official bio description referencing Vadalur, Tamil Nadu, India | `<head>` in `index.html` | [ ] PENDING |
| **Canonical URL** | Canonical link explicitly set to `https://pratheeshclement-cmd.github.io/` | `<head>` in `index.html` | [ ] PENDING |
| **Open Graph Tags** | `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name` intact | `<head>` in `index.html` | [ ] PENDING |
| **Twitter Cards** | `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` intact | `<head>` in `index.html` | [ ] PENDING |
| **JSON-LD Schema Context**| `@context: "https://schema.org"` multi-graph script block | `<head>` in `index.html` | [ ] PENDING |
| **Person Schema** | Name, jobTitle, email, phone, address, credential (`453421024`), sameAs links | `JSON-LD` graph | [ ] PENDING |
| **WebSite Schema** | Site name `"Pratheesh OS"`, publisher `@id` pointing to Person schema | `JSON-LD` graph | [ ] PENDING |
| **Breadcrumb Schema** | `BreadcrumbList` graph mapping Home, About, Services, SEO, Projects, Blog, Contact | `JSON-LD` graph | [ ] PENDING |
| **FAQ Schema** | `FAQPage` graph with accepted answers for services, location, and contact | `JSON-LD` graph | [ ] PENDING |
| **Sitemap Consistency** | All 20+ URLs in `public/sitemap.xml` remain valid and accessible | `public/sitemap.xml` | [ ] PENDING |
| **Robots Directives** | `public/robots.txt` allows `/`, `/assets/`, `/resume/` and points to sitemap | `public/robots.txt` | [ ] PENDING |
| **Single H1 Rule** | Exactly ONE `<h1>` tag present on main page (`"PRATHEESH CLEMENT"`) | `HeroScene.tsx` | [ ] PENDING |
| **Heading Hierarchy** | Logical `<h1>` → `<h2>` → `<h3>` tree without skipped heading levels | Global Codebase | [ ] PENDING |
| **Internal Anchor Links** | All `#about`, `#skills`, `#projects`, `#services`, `#contact` links resolve cleanly | Global Navbar & Dock | [ ] PENDING |
| **Zero Broken Links** | All external links (`github`, `linkedin`, `instagram`, `facebook`) use `target="_blank"` | Global Codebase | [ ] PENDING |
