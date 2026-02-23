# Project Template

A modern, opinionated Next.js starter template with everything pre-configured so you can skip the setup and start building immediately.

---

## Core Technologies

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 16 | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org) | 5 | Type-safe JavaScript |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Utility-first styling |
| [Shadcn/ui](https://ui.shadcn.com) | 3 | Accessible, composable UI components |
| [Lucide React](https://lucide.dev) | 0.575 | Icon library |

---

## Quick Start

### Prerequisites

Make sure you have the following installed before continuing:

- [Node.js](https://nodejs.org) — v18 or higher
- [Git](https://git-scm.com)
- npm (comes with Node.js)

### Step-by-step installation

**1. Clone the repository**

```bash
git clone https://github.com/rudolphhugo/project-template.git
cd project-template
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the development server**

```bash
npm run dev
```

**4. Open the app**

Navigate to [http://localhost:3000](http://localhost:3000) in your browser. You should see the default Next.js page — you're ready to build.

> The app hot-reloads automatically. Edit `app/page.tsx` and save to see changes instantly.

---

## Configuration

### Adding UI components

This template uses [Shadcn/ui](https://ui.shadcn.com). Components are added on-demand — only what you use ends up in your codebase.

To add a component, run:

```bash
npx shadcn add <component-name>
```

**Examples:**

```bash
npx shadcn add button
npx shadcn add input
npx shadcn add card
npx shadcn add dialog
```

Components are installed to `components/ui/` and can be imported using the `@/` alias:

```tsx
import { Button } from "@/components/ui/button"

export default function Page() {
  return <Button>Click me</Button>
}
```

Browse all available components at [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components).

---

### Using Tailwind CSS

Tailwind is configured and ready to use. Add utility classes directly to your JSX:

```tsx
export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <h1 className="text-4xl font-bold text-foreground">Hello world</h1>
    </div>
  )
}
```

**CSS variables** (set up by Shadcn) are available as Tailwind tokens:

| Token | Usage |
|---|---|
| `bg-background` | Page background |
| `text-foreground` | Primary text |
| `bg-primary` | Primary action color |
| `text-muted-foreground` | Subdued text |
| `border` | Default border color |

Customize these variables in `app/globals.css`.

---

### Using Lucide Icons

Import any icon directly from `lucide-react`:

```tsx
import { ArrowRight, Check, Loader2 } from "lucide-react"

export default function Page() {
  return <ArrowRight className="h-4 w-4" />
}
```

Browse all icons at [lucide.dev/icons](https://lucide.dev/icons).

---

## UI Skills

[UI Skills](https://www.ui-skills.com) is a collection of specialized agent skills that enhance AI-generated interfaces. Once installed, they give your AI agent (Claude Code, Cursor, etc.) deep knowledge of animation, accessibility, design systems, and more.

### Install the full pack

```bash
npx skills add ibelick/ui-skills
```

This installs all available skills into `.agents/skills/` and symlinks them for Claude Code and Cursor automatically.

### Install a specific skill

```bash
npx ui-skills add <skill-name>
```

**Example:**

```bash
npx ui-skills add tailwind-css-patterns
npx ui-skills add fixing-accessibility
```

### Available skills

| Skill | What it does |
|---|---|
| `baseline-ui` | Enforces animation timing, typography consistency, and layout rules |
| `fixing-accessibility` | Audits and fixes ARIA, keyboard nav, focus states, and color contrast |
| `fixing-metadata` | Corrects SEO, Open Graph tags, Twitter cards, and structured data |
| `fixing-motion-performance` | Resolves animation stuttering, layout thrashing, and perf bottlenecks |
| `12-principles-of-animation` | Applies Disney's animation principles to create natural motion |
| `canvas-design` | Generates original visual designs focused on form, space, and color |
| `design-lab` | Interactive design exploration with variant generation and iteration |
| `frontend-design` | Produces polished frontends that avoid generic AI aesthetics |
| `interaction-design` | Implements microinteractions, transitions, and user feedback patterns |
| `interface-design` | Specializes in dashboards, admin panels, and SaaS layouts |
| `swiftui-ui-patterns` | SwiftUI best practices and component guidance |
| `tailwind-css-patterns` | Expert guidance for responsive interfaces using Tailwind utilities |
| `ui-ux-pro-max` | Comprehensive design intelligence with 50+ styles and 97 color palettes |
| `wcag-audit-patterns` | WCAG 2.2 accessibility audits with remediation guidance |
| `web-design-guidelines` | Reviews code against Vercel's Web Interface Guidelines |

Browse and preview all skills at [ui-skills.com](https://www.ui-skills.com).
