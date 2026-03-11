# Derivity — Financial Intelligence. Reimagined.

A cinematic, production-grade landing page for **Derivity** — an AI-powered financial intelligence platform. Built to match the quality of Antigravity, Apple, Stripe, OpenAI, and Linear.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 18 + Vite 5** | Framework & build tool |
| **TailwindCSS 3** | Utility-first styling |
| **Framer Motion 11** | Component animations & scroll effects |
| **GSAP 3 + ScrollTrigger** | Advanced scroll-driven animations |
| **Lenis** | Buttery-smooth inertia scrolling |
| **Lucide React** | Clean SVG icons |

---

## Project Structure

```
Derivity LP/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Fixed navbar with scroll blur
│   │   ├── ParticleNetwork.jsx # Canvas 2D particle system
│   │   └── GlassCard.jsx       # Reusable glassmorphism card
│   ├── sections/
│   │   ├── Hero.jsx            # Full-screen cinematic hero
│   │   ├── Products.jsx        # Animated product capability cards
│   │   ├── AIEngine.jsx        # Animated architecture diagram
│   │   ├── Features.jsx        # Interactive feature showcase
│   │   ├── FutureOfFinance.jsx # GSAP word-reveal section
│   │   ├── CTA.jsx             # Call to action
│   │   └── Footer.jsx          # Minimal footer
│   ├── App.jsx                 # Root app + Lenis/GSAP setup
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles + Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
# → http://localhost:5173
```

---

## Build for Production

```bash
npm run build
# Output: dist/

# Preview production build
npm run preview
```

---

## Deploy

### Vercel (recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Drag & drop the /dist folder to netlify.com/drop
```

### GitHub Pages
```bash
# Add to vite.config.js: base: '/your-repo-name/'
npm run build
# Deploy the /dist folder
```

---

## Sections

| Section | Description |
|---|---|
| **Hero** | Full-screen cinematic hero with animated particle network, floating UI preview cards, gradient blobs, and parallax scrolling |
| **Products** | 4 animated product capability cards (AI Copilot, Dashboard, Investing, Analytics) with staggered scroll reveal |
| **AI Engine** | Split-layout architecture visualization with 6 animated layers and flowing data dots |
| **Features** | 5 glassmorphism feature cards with hover lift effects and gradient overlays |
| **Future of Finance** | GSAP ScrollTrigger word-reveal section — words light up as you scroll through |
| **CTA** | Gradient call-to-action with animated particle background |
| **Footer** | Clean 4-column footer with social links and system status |

---

## Animation System

- **Lenis** drives smooth inertia scrolling across all sections
- **GSAP ScrollTrigger** powers the word-reveal text animation (scrub: 1.8)
- **Framer Motion** handles entrance animations (`whileInView`) and hover states
- **Canvas 2D** drives the particle network (80 particles, purple/blue gradient connections)
- **CSS animations** handle blob movement, floating cards, and gradient shifts
- Lenis is integrated with GSAP ticker for perfect sync between smooth scroll and ScrollTrigger

---

## Customization

### Colors
Edit `tailwind.config.js` to change brand colors:
```js
colors: {
  derivity: {
    purple: '#7c3aed',
    blue: '#3b82f6',
    cyan: '#06b6d4',
  }
}
```

### Video Background
To replace the animated gradient with a real video in `Hero.jsx`:
```jsx
// Add inside the background div:
<video
  autoPlay loop muted playsInline
  className="absolute inset-0 w-full h-full object-cover opacity-30"
>
  <source src="/your-video.mp4" type="video/mp4" />
</video>
```

### Content
All section text is hardcoded in each section file for easy editing:
- `src/sections/Hero.jsx` — heading, subtitle, stats
- `src/sections/Products.jsx` — product cards array
- `src/sections/AIEngine.jsx` — architecture layers array
- `src/sections/Features.jsx` — features array
- `src/sections/CTA.jsx` — CTA text and links
- `src/sections/Footer.jsx` — footer links

---

## Performance

Production build output:
- **CSS**: ~34 KB (gzip: ~7 KB)
- **JS**: ~440 KB (gzip: ~147 KB)
- Build time: ~5s
- All animations are GPU-accelerated via `transform` and `opacity`
- Particle network uses `requestAnimationFrame` with proper cleanup

---

*Derivity — The operating system for the financial world.*
