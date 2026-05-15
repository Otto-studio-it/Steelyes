# Design System Document: Industrial Editorial Excellence

## 1. Overview & Creative North Star
**Creative North Star: "The Architectural Forge"**

This design system is a digital manifestation of British industrial heritage meeting modern precision engineering. We are moving beyond the "template" look of a typical tradesperson's website to create an editorial-grade experience that feels as structural and deliberate as a custom steel gate.

The "Architectural Forge" aesthetic relies on **Structural Asymmetry** and **Tonal Weight**. We reject the standard "boxed" web layout. Instead, we use expansive white space (the "Gallery"), high-contrast typography (the "Blueprint"), and subtle shifts in warm neutrals (the "Raw Material") to guide the user. Every element should feel heavy, permanent, and masterfully crafted.

---

## 2. Colors: Tonal Architecture
Our palette is rooted in the materials of the workshop: white limestone, warm ash, and molten steel.

### Color Tokens
*   **Primary (Brand Red):** `#9E000C` — Used for high-intent actions and structural accents.
*   **Secondary (Foundry Gold):** `#795916` — Reserved for "Certified" badges or bespoke craftsmanship markers.
*   **Surface Hierarchy:**
    *   `surface_container_lowest`: `#FFFFFF` (The Canvas)
    *   `surface_container_low`: `#F5F3F0` (Secondary sections/Secondary backgrounds)
    *   `surface_container`: `#EFEEEB` (Deep nested containers)
*   **Typography:**
    *   `on_surface`: `#1B1C1A` (Deep Iron for headlines)
    *   `on_surface_variant`: `#4A4A4A` (Charcoal for body)

### The "No-Line" Rule
To achieve a premium editorial feel, **prohibit the use of 1px solid borders for sectioning.** Boundaries must be defined through background color shifts. A technical specification table should sit on a `surface_container_low` block against a `surface_container_lowest` background. Let the change in tone define the edge, mimicking the way light hits different planes of folded steel.

### Signature Textures
For hero sections or primary CTAs, use a subtle linear gradient from `primary` (`#9E000C`) to `primary_container` (`#C41E1E`) at a 135-degree angle. This prevents the red from feeling "flat" or "digital," giving it the depth of powder-coated metal.

---

## 3. Typography: The Blueprint
Typography is our primary tool for conveying "Artisanal British Craftsmanship." We pair the condensed, industrial strength of the workshop with the clean readability of modern UI.

*   **Display & Headlines (Barlow Condensed, 700, Uppercase, -0.01em Tracking):**
    These are the "Structural Beams" of our layout. Use `display-lg` (3.5rem) for hero statements. The tight tracking and uppercase styling mimic the stamped metal plates found on industrial machinery.
*   **Body & UI (Barlow, 300/400/500):**
    Provides a technical yet approachable contrast to the headlines. Use weight 300 for long-form narrative text to maintain an airy, premium feel.
*   **Technical Specs (IBM Plex Mono, 400):**
    Used exclusively for measurements, SKU numbers, and material grades. This typeface signals "Precision" and "Accuracy."

---

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to create depth; we use **Material Stacking**.

*   **The Layering Principle:** 
    Depth is achieved by "stacking" surface tiers. To make a card feel interactive, place a `surface_container_lowest` card on a `surface_container_low` background. The subtle 2% shift in brightness provides a "soft lift" that feels architectural rather than artificial.
*   **The "Ghost Border" Fallback:** 
    If a border is required for accessibility (e.g., input fields), use the `outline_variant` at 20% opacity. Forbid 100% opaque, high-contrast borders which clutter the visual field.
*   **Glassmorphism for Floating Elements:** 
    Navigation bars or floating "Request a Quote" docks should use a semi-transparent `surface` color with a `20px` backdrop-blur. This allows the "Steel" of the content to slide beneath the "Glass" of the UI.

---

## 5. Components: Precision Fabrications

### Buttons (The "Industrial Press" Pattern)
*   **Primary:** Sharp corners (`0px` or `2px` max), 44px height, `#9E000C` background. Text is Barlow Condensed, Bold, Uppercase.
*   **Secondary:** Ghost style. Transparent background with a `1px` border of `primary` and primary-colored text. 
*   **Interaction:** On hover, the primary button shifts to `Brand Red Dark` (`#9B1515`). The transition should be an immediate `100ms` "mechanical" snap.

### Input Fields (The "Spec Sheet")
*   **Style:** Minimalist. Only a bottom border (1px, `#E5E2DD`). 
*   **Focus State:** The bottom border transforms into a 2px `primary` line. 
*   **Labels:** Use `label-sm` in `IBM Plex Mono` above the field, reminiscent of technical drawing annotations.

### Cards & Lists
*   **Anti-Pattern:** Never use divider lines between list items.
*   **The Solution:** Use vertical white space from the spacing scale (e.g., 24px increments) or alternating tonal strips (`surface_container_lowest` vs `surface_container_low`).
*   **Corner Radius:** Cards should use the `lg` (0.5rem) token to provide a slight "finished" edge to the otherwise sharp industrial layout.

### Custom Component: The "Material Stat"
A specialized component for displaying gate specs (e.g., "Max Width: 4000mm"). 
*   **Header:** Barlow Condensed, 14px, Uppercase, `#8A8A8A`.
*   **Value:** IBM Plex Mono, 24px, `#1A1A1A`.
*   **Underline:** A thin `primary` accent line (2px wide) sitting under the value.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts (e.g., a 7-column image paired with a 4-column text block) to create editorial tension.
*   **Do** use `IBM Plex Mono` for any numerical data to reinforce the "Custom Engineering" brand pillar.
*   **Do** ensure high-quality photography features "The Spark"—show the welder, the texture of the steel, and the British landscape where the gates are installed.

### Don't
*   **Don't** use standard "Drop Shadows." They feel "cheap" and "SaaS-like" in a world of physical steel and stone.
*   **Don't** use rounded "Pill" buttons. Our brand is about structural integrity; use sharp or minimally rounded (4px) corners.
*   **Don't** center-align long blocks of body text. Maintain a strong "Left Axis" to mimic technical blueprints.