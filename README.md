# Creative_Coding_Major_Project_rxio0223

## 1. Interact with the Work
When the page loads, all animations begin automatically — including drifting clouds and mist, shimmering gold dust, flowing wind lines, and the gentle sway of branches.  
Apples will remain on the tree for about **two seconds** before falling on their own, pausing briefly on the ground, and then returning to the tree in a continuous loop.

No user input is required to enjoy the full animation.  
However, you can **press the Spacebar** to switch the direction of gravity, causing the apples to fall upward or downward. When gravity changes, all apples reset and restart their motion.  
The canvas will automatically adapt to the size of the browser window.

---

## 2. Details of the Approach

### 2.1 Animation Driver
The system uses **Perlin noise**, combining noise values, random values, and random seeds to drive all dynamic elements.

### 2.2 Animated Properties
- **Cloud Background**  
  The sky background is formed using layered Perlin-noise-based cloud textures. As time progresses, `noise() + t` produces a slow drifting effect.

- **Gold Powder Layer**  
  Randomly generated particles create a subtle twinkling sheen, enhancing visual richness.

- **Wind Flow Lines**  
  Wind is constructed by linking moving points influenced by Perlin noise and Bézier curves.  
  Multiple layers of these curves, combined with slight distortion from `sin()`, produce a soft, continuous flowing-wind effect.

---
