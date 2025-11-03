# Typography System

## Current Implementation

### Font Pairing: **Inter + Space Grotesk**

This is the **industry-leading** combination used by top tech companies.

#### **Inter** (Body & UI Text)
- **Used by**: Linear, Vercel, Notion, Stripe, GitHub
- **Purpose**: Body text, UI elements, buttons, descriptions
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
- **Why**: Designed specifically for screen readability, excellent legibility at all sizes
- **Source**: Google Fonts (FREE)

#### **Space Grotesk** (Headlines & Display)
- **Purpose**: Headlines, titles, logo, hero text
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
- **Why**: Modern geometric sans with strong personality, perfect for attention-grabbing headlines
- **Source**: Google Fonts (FREE)

### Typography Scale

```css
/* Headlines */
h1: 6xl-8xl (96px-128px) - Space Grotesk Bold
h2: 4xl-6xl (48px-72px) - Space Grotesk Bold
h3: 2xl-4xl (32px-48px) - Space Grotesk Semi-Bold

/* Body */
p: xl-2xl (20px-24px) - Inter Light/Regular
small: sm-base (14px-16px) - Inter Regular

/* Letter Spacing */
Headlines: -0.03em (tighter, modern look)
Body: -0.01em (subtle tightening)
```

---

## Alternative Font Options

### Option 2: **Satoshi + General Sans** (FREE - Most Trendy 2024-2025)
```typescript
// In layout.tsx
import { General_Sans } from "next/font/google"
// Satoshi from Fontshare (requires manual setup)

const generalSans = General_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-general-sans",
})
```
- **Headlines**: Satoshi (geometric with personality)
- **Body**: General Sans (humanist, approachable)
- **Used by**: Modern startups, design agencies
- **Vibe**: Fresh, friendly, cutting-edge

### Option 3: **Geist Sans + Geist Mono** (FREE - Vercel's Official)
```typescript
// In layout.tsx
import { GeistSans, GeistMono } from "geist/font"

const geistSans = GeistSans({
  variable: "--font-geist-sans",
})
```
- **All text**: Geist family
- **Created by**: Vercel
- **Used by**: Vercel, developer tools
- **Vibe**: Ultra-modern, technical, premium

### Option 4: **GT Super + Inter** (PREMIUM - $200-500)
```typescript
// Requires purchasing from Grilli Type
// https://www.grillitype.com/typeface/gt-super
```
- **Headlines**: GT Super (serif, editorial quality)
- **Body**: Inter
- **Used by**: WeTransfer, top SaaS companies
- **Vibe**: Sophisticated, editorial, high-end

### Option 5: **Tiempos Headline + Inter** (PREMIUM)
```typescript
// Requires purchasing from Klim Type Foundry
// https://klim.co.nz/retail-fonts/tiempos-headline/
```
- **Headlines**: Tiempos Headline (elegant serif)
- **Body**: Inter
- **Used by**: Airbnb, premium brands
- **Vibe**: Elegant, trustworthy, refined

---

## How to Switch Fonts

### 1. Update `app/layout.tsx`:
```typescript
import { YourFont1, YourFont2 } from "next/font/google"

const font1 = YourFont1({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
})

const font2 = YourFont2({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
})

// In body tag:
<body className={`${font1.variable} ${font2.variable}`}>
```

### 2. Update `app/globals.css`:
```css
@theme inline {
  --font-sans: var(--font-body);
  --font-display: var(--font-display);
}
```

### 3. Components use:
- Headlines: `font-[family-name:var(--font-space-grotesk)]`
- Body: `font-[family-name:var(--font-inter)]`

---

## Best Practices

### ✅ Do:
- Use Space Grotesk for all headlines (h1-h6)
- Use Inter for body text, buttons, UI elements
- Keep letter-spacing tight (-0.02em to -0.03em) for headlines
- Use font-weight 700 (Bold) for headlines
- Use font-weight 300-400 (Light/Regular) for body text

### ❌ Don't:
- Mix more than 2 font families
- Use decorative fonts for body text
- Ignore mobile font sizes
- Use too many font weights (stick to 3-4)

---

## Performance Tips

1. **Preload fonts** (already configured with `display: "swap"`)
2. **Limit font weights** (only load what you need)
3. **Use variable fonts** when available
4. **Subset fonts** (we're using `subsets: ["latin"]`)

---

## Research Sources

- [SaaS Landing Page - Top 15 Fonts](https://saaslandingpage.com/articles/the-15-most-popular-fonts-for-landing-pages/)
- [Stylokit - Top 20 Fonts 2025](https://stylokit.com/blog/top-20-fonts-for-modern-web-design-2025)
- [Landing Page Flow - Modern Font Choices](https://www.landingpageflow.com/post/font-choices-for-modern-landing-pages)

---

## Quick Font Swap Commands

```bash
# To see current fonts in use:
grep -r "font-\[family-name" components/

# To test different Google Fonts:
# Just update the import in app/layout.tsx
```
