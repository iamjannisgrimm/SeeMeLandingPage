# 🌟 SeeMe Landing Page

Ultra-minimalistic horizontal scroll landing page for SeeMe - AI-powered mental health & life coaching app.

## 🎯 Features

- **Horizontal GSAP Scroll** - Cinematic one-page experience
- **5 Seasonal Scenes** - Spring, Summer, Autumn, Winter transitions
- **Fixed iPhone Mockup** - Centered with floating animation
- **Parallax Backgrounds** - Depth and movement
- **Zero Vertical Scroll** - Pure horizontal navigation
- **Responsive** - Mobile & desktop optimized

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Structure

```
/components
  HorizontalScroll.tsx  # Main scroll container
  Scene.tsx             # Individual scene component
  IPhoneMockup.tsx      # Centered phone mockup
/app
  page.tsx              # Entry point
  globals.css           # Global styles
```

## 🎨 Customization

### Replace Background Images

Edit `/components/HorizontalScroll.tsx` - update the `scenes` array:

```typescript
const scenes = [
  {
    background: '/your-spring-image.jpg', // Replace with your AI-generated images
    title: 'Welcome to SeeMe',
    // ...
  },
  // ...
]
```

### Update Content

- **Titles/Subtitles**: Edit `scenes` array in `HorizontalScroll.tsx`
- **iPhone Screen**: Modify `IPhoneMockup.tsx` component
- **Colors**: Update Tailwind classes in components

### Add Real App Store Link

In `Scene.tsx`, update the App Store URL:

```typescript
<a href="YOUR_APP_STORE_LINK">
```

## 🛠️ Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- GSAP 3 + ScrollTrigger
- React 19

## 📝 TODO

- [ ] Replace Unsplash placeholders with AI-generated seasonal backgrounds
- [ ] Add real iPhone screen content (videos/screenshots)
- [ ] Update App Store link
- [ ] Add analytics
- [ ] Optimize images for production

## 🎬 Animation Details

- **Horizontal Scroll**: GSAP ScrollTrigger with scrub
- **Parallax**: Background moves slower than scroll
- **iPhone Float**: Subtle y-axis animation
- **Smooth Transitions**: 60fps performance

Built with ❤️ for SeeMe
