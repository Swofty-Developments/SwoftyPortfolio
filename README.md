# Portfolio Website

A modern, modular Next.js portfolio website featuring stunning 3D backgrounds, smooth animations, and a clean design.

## Features

- **Modular Architecture**: Components organized into reusable UI components and sections
- **3D Background**: Interactive Spline 3D scene background
- **Smooth Animations**: Intersection Observer-based scroll animations
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **TypeScript**: Full type safety throughout the project
- **Performance Optimized**: Static generation with Next.js 16

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx            # Root layout with metadata
│   └── page.tsx              # Main page composition
├── components/
│   ├── layout/               # Layout components
│   │   └── SplineBackground.tsx
│   └── ui/                   # Reusable UI components
│       ├── NavBar.tsx
│       ├── Footer.tsx
│       ├── ProjectCard.tsx
│       └── index.ts
├── sections/                 # Page sections
│   ├── HeroSection.tsx
│   ├── AboutSection.tsx
│   ├── ServicesSection.tsx
│   ├── WorkSection.tsx
│   ├── ContactSection.tsx
│   └── index.ts
├── types/                    # TypeScript type definitions
└── utils/                    # Utility functions
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```bash
npm run build
npm start
```

## Customization

### Updating Content

- **Hero Section**: Edit [sections/HeroSection.tsx](sections/HeroSection.tsx)
- **About Section**: Edit [sections/AboutSection.tsx](sections/AboutSection.tsx)
- **Services**: Edit [sections/ServicesSection.tsx](sections/ServicesSection.tsx)
- **Portfolio Projects**: Edit [sections/WorkSection.tsx](sections/WorkSection.tsx)
- **Contact**: Edit [sections/ContactSection.tsx](sections/ContactSection.tsx)

### Changing the 3D Background

Replace the Spline scene URL in [components/layout/SplineBackground.tsx](components/layout/SplineBackground.tsx):

```tsx
scene="https://prod.spline.design/your-scene-id/scene.splinecode"
```

### Styling

Global styles and animations are in [app/globals.css](app/globals.css). Tailwind CSS is used for component styling.

## Technologies

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Spline** - 3D graphics
- **React 19** - UI library

## License

MIT
