---
name: Amber Glass
colors:
  surface: '#fff8f7'
  surface-dim: '#ffcfca'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0ef'
  surface-container: '#ffe9e7'
  surface-container-high: '#ffe2df'
  surface-container-highest: '#ffdad6'
  on-surface: '#390b0a'
  on-surface-variant: '#5c403c'
  inverse-surface: '#54201d'
  inverse-on-surface: '#ffedeb'
  outline: '#906f6b'
  outline-variant: '#e5bdb8'
  surface-tint: '#bc1515'
  primary: '#950008'
  on-primary: '#ffffff'
  primary-container: '#bd1616'
  on-primary-container: '#ffcfc8'
  inverse-primary: '#ffb4aa'
  secondary: '#944a07'
  on-secondary: '#ffffff'
  secondary-container: '#ff9f5a'
  on-secondary-container: '#733700'
  tertiary: '#685f30'
  on-tertiary: '#ffffff'
  tertiary-container: '#b7ab75'
  on-tertiary-container: '#473f14'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4aa'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#930007'
  secondary-fixed: '#ffdcc6'
  secondary-fixed-dim: '#ffb786'
  on-secondary-fixed: '#311300'
  on-secondary-fixed-variant: '#723600'
  tertiary-fixed: '#f0e3a8'
  tertiary-fixed-dim: '#d4c78e'
  on-tertiary-fixed: '#211b00'
  on-tertiary-fixed-variant: '#4f471b'
  background: '#fff8f7'
  on-background: '#390b0a'
  surface-variant: '#ffdad6'
  warm-amber: '#FF9F5A'
  crimson-accent: '#BD1616'
  parchment-glow: '#FFF1B5'
  deep-maroon: '#2F0505'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 72px
    fontWeight: '600'
    lineHeight: 80px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '500'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  bento-gap: 20px
  container-padding: 32px
  glass-padding: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

This design system evolves the "Physical Digitalism" of its predecessor into a warmer, more organic aesthetic. It blends **Glassmorphism** with a **Tactile** and **Textured** narrative, inspired by the sun-drenched, vintage newsprint quality of the reference material.

The brand personality is energetic yet grounded, evoking a sense of history through texture while maintaining a futuristic edge through spatial UI. It is designed for users who appreciate premium, high-contrast interfaces that feel like physical objects illuminated by a warm light source. The mood is "Vibrant Sophistication"—shifting from the cold vacuum of deep space to the rich, glowing atmosphere of a setting sun.

## Colors

The palette is anchored by a high-texture global background image that transitions from vibrant amber to a deep, dark crimson.

- **Primary**: A bold, authoritative Crimson (#BD1616) derived from the logo accents, used for critical actions and brand-heavy elements.
- **Secondary**: A warm, saturated Amber (#FF9F5A) that serves as the core highlight color.
- **Background**: The global background is set to the provided image, creating a "distressed parchment" texture throughout the UI.
- **Surface Strategy**: Unlike standard light/dark modes, surfaces here are "Fused Glass." They use the Parchment Glow (#FFF1B5) at varying opacities to create a sense of light being trapped within the glass panels.
- **On-Surface**: Text and icons primarily use Deep Maroon (#2F0505) to ensure legibility against the warm background, maintaining high contrast without the harshness of pure black.

## Typography

Typography remains modern and sharp to provide a necessary counterpoint to the organic, textured background.

- **Headlines (Hanken Grotesk)**: Chosen for its precise, contemporary character. In this warm theme, headlines should utilize the Deep Maroon for a "stamped" editorial effect.
- **Body (Inter)**: Maintains its role as the functional workhorse, ensuring clarity when layered over glass blurs and textured ambers.
- **Data (Geist)**: Provides a technical, monospaced feel for labels and metadata, reinforcing the idea of a modern interface built atop a traditional, textured foundation.

## Layout & Spacing

The **Bento Grid** model is retained but refined for a more compact, editorial feel.

- **Grid Model**: A 12-column fluid grid. Gutters are slightly reduced to 20px to make the glass panels feel more interconnected and substantial.
- **Bento Logic**: Content is encapsulated in glass modules. Large margin-desktops (48px) allow the textured background to frame the central interface.
- **Adaptation**: Modules stack vertically on mobile. The background image should remain fixed during scroll to maintain the illusion of glass panels sliding over a static, textured surface.

## Elevation & Depth

Depth is achieved through **Warm Glassmorphism** and **Chiaroscuro** (light and dark) principles.

1.  **Background**: The textured amber/crimson image provides the foundation.
2.  **Surface Tiers**:
    - **Base Glass**: `rgba(255, 241, 181, 0.15)` (Parchment Glow) with a `backdrop-filter: blur(25px)`.
    - **Elevated Glass**: `rgba(255, 255, 255, 0.3)` with a `blur(40px)`.
3.  **Borders**: Instead of white outlines, use "Inner Glow" borders: 1.5px solid `rgba(255, 159, 90, 0.4)` (Warm Amber) on the top and left, and `rgba(47, 5, 5, 0.1)` on the bottom and right.
4.  **Shadows**: Use soft, tinted shadows (`rgba(47, 5, 5, 0.2)`) rather than black to maintain the warm, organic atmosphere.

## Shapes

The shape language is **Rounded**, softening the technical edges to match the organic background.

- **Bento Modules**: Use 1.5rem (xl) corners to echo the circular motifs found in the reference logos.
- **Interactive Elements**: Buttons and inputs use 1rem (lg) corners.
- **Consistency**: Maintain strict nested corner radius logic (Inner radius = Outer radius - Padding) to ensure the glass panels look "manufactured" and precise.

## Components

### Buttons
- **Primary**: Solid Crimson (#BD1616) background with Parchment Glow (#FFF1B5) text. On hover, it gains a subtle amber outer glow.
- **Secondary (Glass)**: A thick `blur(20px)` background with an Amber (#FF9F5A) 2px border.

### Bento Cards
The primary container. Must include a 10% opacity "Grain" overlay to harmonize the clean glass with the distressed background. The top edge should have a 1px "Light Leak" highlight in a bright pale yellow.

### Input Fields
Recessed surfaces using Deep Maroon (#2F0505) at 5% opacity. The cursor and focus ring should use the Primary Crimson to stand out against the warm backdrop.

### Chips & Tags
Pill-shaped, using the Secondary Amber at 20% opacity with a solid Amber border. Text is always Deep Maroon for maximum legibility.

### Global Footer / Navigation
Following the reference image, the bottom navigation or social bar should be a solid Deep Maroon (#2F0505) strip with high-contrast Parchment Glow text and icons, providing a heavy "anchor" to the airy, glass-filled layout.