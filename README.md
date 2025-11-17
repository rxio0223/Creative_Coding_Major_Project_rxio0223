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


### 2.3 Inspiration References

#### 2.3.1


#### 2.3.2 Gold Dust
Shimmering gold dust inspiration comes from Gustav Klimt's "The Kiss," with the scene filled with shimmering golden patterns and inlaid decorations. The lovers are entwined within golden robes, the gold leaf surface subtly sparkling under light, giving the entire painting a luxurious glow and mysterious atmosphere, adding delicate light and shadow and a sense of motion even in the static image.

![The Kiss - Gustav Klimt](assets\512px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg)



### 2.4 Technical Explanation

#### 2.4.1 Changes Made to Group Code
Based on the original "Tree + Apple Gravity System" in the group, I expanded the complete background animation system and removed the original static noise rectangles.  
I added three major modules: clouds and fog, gold powder, and wind, and integrated them into the main drawing process, upgrading the entire painting from a static background to a multi-layered dynamic atmospheric scene. All new modules are based on Perlin noise and reference examples from Kogan and noise rendering techniques. The overall modifications maintain the original functionality while significantly enhancing visual expressiveness.


#### 2.4.2 Internet Techniques Used



##### 2.4.2.1 Cloud

**How it Works:**
The cloud effect is achieved by traversing the pixels on the canvas and sampling Perlin noise. The program scans the upper half with small steps, calculating the noise value for each coordinate. When the noise exceeds the threshold, it draws semi-transparent pixels. At the same time, it adds gradual fading on the left and right edges to make the clouds softer. The time dimension of the noise makes the clouds produce a slow drifting animation.

**Reason for Use:**
Perlin noise can generate natural, continuous textures, making it highly suitable for simulating real clouds and fog. This method is lightweight and compatible with p5.js, allowing precise control over the density, softness, and drifting speed of the clouds and fog to meet overall artistic style requirements.

**External Technical Sources:**
Based on examples found online about "traversing pixels + noise threshold control shape drawing," it was modified.  
**Reference sources:**
Schmidty Notes – 2D Perlin Noise Effect  
https://www.schmidtynotes.com/blog/p5/2022-01-13-2d-perlin-noise-and-half-circles/  
The original technique determined whether to draw a pixel based on noise. I changed it to draw semi-transparent fog points to generate floating clouds.


##### 2.4.2.2 Wind

**How it Works:**
This wind line effect is based on Perlin noise-driven Bézier curves. Kogan's tutorial demonstrates how to use noise to continuously change the endpoints and control points of the curve, creating continuous flowing lines. This code further expands on this: multiple independent wind lines are generated using multiple sets of "noise offsets" (seed, baseShift); layered noise mixing (such as 0.7 * noise(...) + 0.3 * noise(...)) is adopted to achieve a superposition similar to "fractal noise," making the curve softer and more layered; as time progresses, each curve slowly drifts, presenting a delicate wind-like ribbon effect.

**Reason for Use:**
Layered noise-driven Bézier curves can produce natural, smooth, and directional airflow lines. This method is highly suitable for expressing lightweight visuals such as air currents, mist, and gentle breezes, adding a dynamic sense of breath to the entire scene.

**External Technical Sources:**
The main technical reference is from Kogan's Perlin Noise tutorial, which explains how to use noise to generate smooth varying curve motion.  
**Reference sources:**
Gene Kogan — Perlin Noise in p5.js  
https://genekogan.com/code/p5js-perlin-noise/

I added multi-layer noise mixing and multi-curve generation on this basis, expanding from a simple example to a complete wind line animation system.
