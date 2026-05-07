# MediRemind Design System

## Overview
MediRemind is a healthcare-focused medicine reminder application with a premium, clinical aesthetic. Clean card-based layouts, deep teal/blue primary palette (oklch 0.58 0.16 178), white cards with soft shadows, and healthy accents (success green). Designed for trust, clarity, and accessibility—suitable for elderly users and medical professionals.

## Tone & Purpose
Refined, clinical, trustworthy. Emphasis on reliability, accessibility, and calm interaction. No playfulness; precision and data clarity are paramount. Pill-shaped iconography reinforces pharmaceutical identity.

## Color Palette

| Token | OKLCH Value | Purpose |
|---|---|---|
| Primary (Teal) | 0.58 0.16 178 | CTAs, active states, primary emphasis |
| Secondary (Cyan) | 0.94 0.02 178 | Subtle highlights, secondary actions |
| Success (Green) | 0.72 0.17 145 | Adherence success, dose taken, positive feedback |
| Accent (Lime) | 0.56 0.18 145 | Pulsing green status dot (active notifications) |
| Warning (Amber) | 0.78 0.16 70 | Missed doses, low adherence alerts |
| Destructive (Red) | 0.577 0.245 27.325 | Delete, critical errors, negative actions |
| Background | 0.98 0.004 180 (light), 0.14 0.02 220 (dark) | Page canvas |
| Card | 1 0 0 (light), 0.18 0.025 220 (dark) | Widget backgrounds |
| Border | 0.9 0.015 180 (light), 1 0 0 / 10% (dark) | Dividers, subtle separation |

## Typography
**Display Font:** Plus Jakarta Sans (500–700 wt) — clean, modern, slightly geometric.  
**Body Font:** Plus Jakarta Sans (300–400 wt) — legible, neutral, approachable.  
**Mono Font:** Geist Mono — code snippets, technical labels, timestamps.  
**Scale:** 12px (caption), 14px (body), 16px (subtitle), 20px (heading-3), 24px (heading-2), 32px (heading-1).

## Shape Language
**Border Radius:** 12px (default), 8px (compact), 4px (tight), 0 (sharp edges for tables/charts).  
**Shadows:** `shadow-card` (0 2px 12px 0 rgba(0,0,0,0.06)) for elevated surfaces. No glows or glow effects.  
**Spacing:** 4px grid. 8px gutters, 16px section padding, 24px between major sections.

## Structural Zones

| Zone | Treatment | Purpose |
|---|---|---|
| Header | `bg-primary/5` with `border-b` | Navigation, app title, status dot, profile avatar |
| Main Content | `bg-background` | Tab content, forms, dashboards |
| Cards/Widgets | `bg-card` with `shadow-card` | Reminder cards, charts, profile sections |
| Footer | `border-t` with `bg-muted/5` | Secondary actions, meta info |
| Modal Overlay | Transparent backdrop | Dialogs, confirmations, edit forms |

## Components
**Buttons:** Primary (teal fill), Secondary (outline), Ghost (text-only), Danger (red). Consistent 32px height, 12px rounded corners.  
**Cards:** White/dark card bg, subtle shadow, 12px padding, 12px radius.  
**Forms:** Outlined inputs, placeholder text, validation errors in red.  
**Tabs:** Underline indicator (primary color), inactive tabs muted.  
**Charts:** SVG bar charts (7-day adherence), flame animation for streak counter.  
**Badges:** Inline labels (medicine dosage, status, frequency).  
**Notifications:** Browser popup (with fallback window.alert), Web Speech API voice alert.

## Motion & Interaction
**Transitions:** 0.3s cubic-bezier(0.4, 0, 0.2, 1) for all interactive elements (buttons, tabs, form inputs).  
**Pulsing Dot:** 1.5s opacity pulse (green) to indicate active notification monitoring.  
**Flame Animation:** 1.5s flicker transform for streak visualization.  
**No** bouncy, playful, or excessive animations — all motion serves clarity and feedback.

## Signature Detail
**Pulsing Green Status Dot:** A subtle, always-visible indicator in the app header that pulses when notification monitoring is active. Reinforces the app's core reminder function and gives users visual confidence that the system is watching for scheduled times.

## Accessibility
**Contrast:** All text meets WCAG AA+ (foreground-on-background ≥ 0.7 lightness difference).  
**Typography:** Sans-serif, 16px+ base, generous line-spacing (1.6).  
**Interactions:** Keyboard-navigable tabs and forms, focus outlines visible, touch-friendly (44px min tap targets).  
**Semantic HTML:** Proper heading hierarchy, form labels, ARIA labels where needed.

## Anti-Patterns (Avoided)
- No purple gradients, no rainbow palettes, no generic blue CTAs.  
- No full-page gradients, no neon glows, no bouncy animations.  
- No flat hierarchy — card surfaces use subtle shadows to create visual depth.  
- No repeated generic UI — intentional color/size variation for rhythm.

## Screenshots Showcase Page (for Project Report)

**Purpose:** Professional mockup gallery for B.Tech university project documentation.

**Layout:** 2-column responsive grid (1 column mobile) with 8 screenshot cards + feature summary section.

**Cards:** Login, Dashboard, Reminders, Medicine Search, Analytics, History, Profile (User), Profile (Medical Records).

**Header:** Fixed sticky, pill logo (emoji) + branding + dark mode toggle.

**Footer:** Copyright, project name, university context.

**Color coding:** Teal primary (CTAs), green (taken doses), amber (missed), red (destructive actions).

**Dark mode:** Full support via Tailwind `dark:` prefix, smooth 300ms transitions.

**Accessibility:** WCAG AA+ contrast, semantic HTML, focus outlines, keyboard navigation.

**Print-friendly:** Optimized for PDF export and university report formatting.
