# 🎬 SeeMe Landing Page - Animation System

## Overview
Premium GSAP-powered animations with smooth transitions, parallax effects, and interactive elements.

---

## 🌊 Scroll Animations

### **Horizontal Scroll**
- **Scrub**: 1.5 (smooth, responsive)
- **Pin**: Entire viewport during scroll
- **Easing**: None (linear for natural feel)

### **Scene Transitions**
Each scene animates independently as it enters/exits viewport:

1. **Background Parallax**
   - Moves slower than scroll (-300px)
   - Scrub: 2 (extra smooth)
   - Creates depth perception

2. **Title Animation**
   - **Enter**: Fade in + slide up (100px) + scale (0.9 → 1)
   - **Easing**: power3.out (smooth deceleration)
   - **Timing**: Starts at 80% viewport, ends at 20%

3. **Subtitle Animation**
   - **Enter**: Fade in + slide up (50px)
   - **Easing**: power2.out
   - **Timing**: Delayed slightly (70% → 30%)
   - Creates staggered reveal effect

4. **Scene Fade Out**
   - **Exit**: Opacity 1 → 0.3
   - Smooth transition as scene leaves viewport

---

## 📱 iPhone Mockup Animations

### **Floating Animation**
- **Movement**: Y-axis (-15px)
- **Duration**: 3 seconds
- **Easing**: power1.inOut
- **Loop**: Infinite yoyo (up and down)

### **Scroll-Based Transform**
- **Scale**: 1 → 0.95 (subtle shrink)
- **Rotation**: 0 → 5deg (Y-axis)
- **Scrub**: 2 (smooth)
- **3D Perspective**: 1000px

---

## 🎯 Progress Dots

### **Active State**
- **Scale**: 1 → 1.5
- **Color**: white/50 → white/100
- **Scrub**: 0.5 (responsive)
- **Trigger**: When scene is centered

### **Hover State**
- **Color**: white/50 → white/80
- **Transition**: 300ms

---

## 📍 Scroll Indicator

### **Pulse Animation**
- **Opacity**: 1 → 0.3
- **Scale**: 1 → 1.2
- **Duration**: 1.5s
- **Loop**: Infinite yoyo

### **Auto-Hide**
- **Delay**: 3 seconds
- **Fade Out**: 1 second
- Disappears after user understands interaction

---

## ⚡ Performance Optimizations

### **GSAP Context**
- All animations scoped to container
- Clean cleanup on unmount
- No memory leaks

### **ScrollTrigger**
- `anticipatePin: 1` - Prevents jump
- `invalidateOnRefresh: true` - Handles resize
- Container animation for nested triggers

### **Hardware Acceleration**
- Transform properties (x, y, scale, rotate)
- Opacity changes
- No layout-triggering properties

---

## 🎨 Animation Timing

```
Scene Enter:
├─ Background: Immediate (scrub: 2)
├─ Title: 80% → 20% (scrub: 1.5)
├─ Subtitle: 70% → 30% (scrub: 1.5)
└─ Fade Out: center → exit (scrub: 1)

iPhone:
├─ Float: Continuous (3s loop)
└─ Transform: Full scroll (scrub: 2)

Progress Dots:
└─ Active: Scene centered (scrub: 0.5)
```

---

## 🔧 Customization

### Adjust Scroll Speed
```typescript
scrub: 1.5  // Lower = faster, Higher = smoother
```

### Change Animation Distance
```typescript
y: 100  // Title slide distance
x: -300 // Background parallax distance
```

### Modify Easing
```typescript
ease: 'power3.out'  // Options: power1-4, elastic, back, etc.
```

---

## 🎯 Key Features

✅ **Smooth 60fps** - Hardware accelerated  
✅ **Responsive** - Works on all screen sizes  
✅ **Performant** - Optimized GSAP usage  
✅ **Accessible** - Respects reduced motion  
✅ **Maintainable** - Clean, scoped code  

---

## 📱 Mobile Considerations

- Reduced parallax intensity
- Touch-optimized scrub values
- Simplified 3D transforms
- Faster animation durations

---

Built with GSAP 3 + ScrollTrigger
