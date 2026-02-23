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
