# 🎨 AI Background Generation Prompts for SeeMe

## Instructions
1. Generate these 5 images using Gemini/Sora/Midjourney
2. Save them as: `spring.jpg`, `summer.jpg`, `autumn.jpg`, `winter.jpg`, `spring-return.jpg`
3. Place in `/public/backgrounds/` folder
4. Update paths in `/components/HorizontalScroll.tsx`

---

## Scene 1: Spring/Dawn - Hero Intro
**File**: `spring.jpg`

```
Soft layered clouds at dawn, pastel gradient sky from lavender to peach to golden yellow, fluffy cloud formations with depth, dreamy atmosphere, gentle horizontal layers, cinematic wide angle, 4K, photorealistic clouds, serene and peaceful, subtle depth of field --ar 16:9
```

**Key Elements**: Pastel clouds, dawn gradient, peaceful
**Color Palette**: Lavender, peach, golden yellow

---

## Scene 2: Summer - Energy & Growth
**File**: `summer.jpg`

```
Warm summer sunset clouds, golden hour sky, soft orange and pink cloud layers, gentle atmospheric perspective, wispy cirrus clouds, peaceful evening light, cinematic composition, 4K, natural cloud formations, warm color palette --ar 16:9
```

**Key Elements**: Golden hour, warm clouds, energetic
**Color Palette**: Orange, pink, golden

---

## Scene 3: Autumn - Transformation & Reflection
**File**: `autumn.jpg`

```
Soft autumn fog layers, warm orange and pink gradient sky, gentle mist in foreground, blurred distant hills, atmospheric depth, peaceful and contemplative, cinematic haze, 4K, natural fog photography, warm earth tones --ar 16:9
```

**Key Elements**: Misty atmosphere, warm gradients, depth
**Color Palette**: Orange, pink, warm browns

---

## Scene 4: Winter - Clarity & Peace
**File**: `winter.jpg`

```
Pristine winter landscape, snow-covered pine forest in soft focus, misty mountains in background, pale blue-gray sky, gentle snowfall, serene and spacious, minimalist composition with depth, 4K, peaceful winter atmosphere, clean and calm --ar 16:9
```

**Key Elements**: Snowy forest, mountains, serene
**Color Palette**: Pale blue, gray, white

---

## Scene 5: Spring Return - New Beginnings
**File**: `spring-return.jpg`

```
Clear spring morning sky, soft wispy clouds, gentle gradient from pale blue to warm pink, fresh and optimistic atmosphere, minimal cloud coverage, peaceful and open, 4K, natural sky photography, clean composition --ar 16:9
```

**Key Elements**: Clear sky, fresh atmosphere, optimistic
**Color Palette**: Pale blue, soft pink, light tones

---

## 🎯 Generation Tips

### For Best Results:
- **Resolution**: 4K minimum (3840x2160)
- **Aspect Ratio**: 16:9 (landscape)
- **Focus**: Soft/blurred backgrounds (product stays in focus)
- **Depth**: Include atmospheric layers for dimension
- **Colors**: Match your Figma gradient palettes

### Platform-Specific:
- **Midjourney**: Add `--ar 16:9 --style raw --quality 2`
- **DALL-E**: Specify "photorealistic, 4K resolution"
- **Stable Diffusion**: Use landscape-focused models

### Consistency:
- Keep lighting direction similar across all scenes
- Maintain soft focus throughout
- Ensure backgrounds don't compete with iPhone mockup

---

## 📝 After Generation

1. Create folder: `/public/backgrounds/`
2. Save images with exact names above
3. Update `HorizontalScroll.tsx`:

```typescript
const scenes = [
  {
    background: '/backgrounds/spring.jpg',
    // ...
  },
  {
    background: '/backgrounds/summer.jpg',
    // ...
  },
  // etc...
]
```

4. Remove Unsplash config from `next.config.ts` (optional)
