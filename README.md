# progsu Wiki

The open wiki for breaking into tech built by progsu members for GSU students.

## About

progsu is Georgia State University's programming club. This wiki is our knowledge base: guides written by members who landed offers in quant, big tech, research, and beyond. Signed, dated, free.

### What's Inside

- **Foundations**: CS theory, math, and first principles
- **Career**: Recruiting, resumes, and offer strategy
- **Technical**: LC, system design, and take-homes
- **Networking**: Cold outreach, LinkedIn, and warm intros
- **Resources**: Tools, courses, and reading lists

## Technology Stack

- **Astro**: Static site generator
- **Inter / JetBrains Mono**: Self-hosted variable fonts via Fontsource
- **Shiki**: Build-time syntax highlighting
- **Mermaid**: Diagrams, loaded lazily only on pages that use them
- **MDX**: Markdown with component support

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/progsu-official/wiki.git
cd wiki
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:4321`

### Development Commands

```bash
npm run dev        # Start development server with hot reload
npm run build      # Build for production
npm run preview    # Preview production build locally
npm run fmt        # Format code with Prettier
```

## Project Structure

```
wiki/
├── src/
│   ├── components/
│   │   ├── Navbar.astro             # Site navigation + theme toggle
│   │   ├── Sidebar.astro            # Docs sidebar (built from the guides collection)
│   │   ├── Aside.astro              # "on this page" rail
│   │   ├── DocFooter.astro          # Edit link, last updated, prev/next
│   │   └── Footer.astro             # Site footer
│   ├── layouts/
│   │   ├── Layout.astro             # Base shell: head, theme bootstrap, nav, footer
│   │   └── DocsLayout.astro         # Three-column docs shell
│   ├── lib/
│   │   ├── guideNav.ts              # Sidebar tree + prev/next order
│   │   └── remark-*.mjs             # Wikilinks, mermaid, callouts
│   ├── pages/
│   │   ├── index.astro              # Landing page
│   │   ├── guides/                  # Guide listings and articles
│   │   └── _courses/                # Courses (not routed yet)
│   ├── styles/
│   │   └── global.css               # Design tokens, base, prose, components
│   └── consts.ts                    # Site config and nav links
├── reference/                       # Design reference files
├── public/                          # Static assets
└── astro.config.mjs                 # Astro configuration
```

## Contributing

Contributions from all club members are welcome whether that's writing a new guide, fixing a typo, or improving the site.

### Adding or Editing Guides

Guides are Markdown in the [vault](https://github.com/progsu-official/vault) submodule, surfaced through `src/content/guides/`. To add one:

1. Create a new `.mdx` file in the appropriate category folder
2. Follow the existing frontmatter format
3. Write your guide in Markdown
4. Submit a pull request

### Contribution Workflow

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Make your changes and test locally with `npm run dev`
5. Commit with a clear message:
   ```bash
   git commit -m "add: networking cold outreach guide"
   ```
6. Push and open a pull request with a description of your changes

## Getting Help

- Join the progsu Discord for questions
- Open a GitHub issue for bugs or feature requests
- Reach out to a club officer for write access

---

Built with care by progsu. Everyone is welcome to contribute.
