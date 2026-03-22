```markdown
# Design System Specification: The Kinetic Vault

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Kinetic Vault."** 

This system is designed to transform a standard developer dashboard into an industrial, high-precision environment that feels both indestructible and weightless. We move beyond the "template" look by embracing **Monolithic Minimalism**. Instead of traditional boxes-inside-boxes, we use expansive tonal slabs and extreme typographic hierarchy to create a "Zen" workspace. 

The aesthetic is driven by intentional asymmetry—placing high-density data visualizations against vast, "quiet" negative spaces. We reject the generic "card-based" layout in favor of a structural, editorial approach where the code and data are the only ornaments.

## 2. Colors & Surface Architecture
This system utilizes a deep, nocturnal palette designed to minimize eye strain while maximizing focus.

### The "No-Line" Rule
Standard 1px borders are prohibited for sectioning. Structural boundaries must be defined exclusively through **Background Color Shifts**. 
*   **Base Layer:** Always use `surface` (#0b1326).
*   **Secondary Logic:** Use `surface-container-low` (#131b2e) for sidebars or persistent navigation.
*   **Content Emphasis:** Use `surface-container-high` (#222a3d) to highlight active terminal windows or primary code editors.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of charcoal-colored plates. 
*   **Primary Layering:** Place a `surface-container-lowest` (#060e20) element inside a `surface-container` (#171f33) area to create a "recessed" well for inputs or log streams.
*   **The Glass Rule:** Floating elements (Command Palettes, Modals) must use `surface-bright` (#31394d) with a 20% opacity and a 12px backdrop-blur. This creates a "frosted glass" effect that keeps the developer grounded in their background context.

### Signature Accents
*   **Primary Focus:** Use `tertiary` (#4edea3) for "Success" states and "Go" actions. Its minty sharp-contrast against the charcoal provides an immediate psychological "signal."
*   **Interactive States:** Use `primary` (#c0c1ff) for focus rings and selection states.

## 3. Typography
Typography in this system is an industrial tool. We use **Space Grotesk** for structural headers to provide a technical, high-end editorial feel, and **Inter** for data-heavy body text to ensure maximum legibility.

*   **Display (Space Grotesk):** Use `display-lg` (3.5rem) for high-level metrics (e.g., "99.9% Uptime"). The wide apertures of the font reflect the "Zen" personality.
*   **Headlines (Space Grotesk):** `headline-sm` (1.5rem) should be used for section titles, set in `on-surface-variant` (#c7c4d8) to maintain a sophisticated, low-contrast hierarchy until hovered.
*   **Body & Labels (Inter):** All code and functional labels use `body-md` or `label-md`. For a "terminal" feel, increase the letter-spacing on `label-sm` to 0.05rem.

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering**, not structural shadows.

*   **The Layering Principle:** To "lift" an element, shift it one tier up in the surface scale. A card on the `surface` background should be `surface-container-low`.
*   **Ambient Shadows:** Traditional drop shadows are forbidden. If a floating element requires separation, use an "Ambient Glow": a shadow with a 32px blur, 0px offset, and 4% opacity using the `primary` (#c0c1ff) color.
*   **The "Ghost Border":** For accessibility in high-density data grids, use a "Ghost Border"—a 1px stroke of `outline-variant` (#464555) at strictly **15% opacity**. It should be felt, not seen.

## 5. Components

### Buttons
*   **Primary:** Solid `tertiary` (#4edea3) with `on-tertiary` (#003824) text. Use `DEFAULT` rounding (0.25rem). 
*   **Tertiary (Ghost):** No background. `primary` text. On hover, apply a `surface-container-highest` background.
*   **Interaction:** Sharp transitions (100ms) to mimic the "click" of a mechanical keyboard.

### Input Fields
*   **Style:** No 4-sided borders. Use a `surface-container-lowest` background with a 2px bottom-border of `outline-variant`. 
*   **Focus:** Transition the bottom border to `tertiary` and apply a subtle `surface-bright` inner glow.

### Cards & Lists
*   **Forbid Dividers:** Do not use lines to separate list items. Use `1.5` (0.3rem) spacing for tight groups and `4` (0.9rem) spacing to define separate blocks of logic.
*   **Active State:** Instead of a border, an active list item should utilize a `surface-container-highest` background and a 2px vertical "notch" of `tertiary` on the far left.

### Technical Command Palette
*   A centered, floating component using `surface-container-high` at 80% opacity with backdrop blur. Use `title-md` for the search query to emphasize the "editorial" focus of the workspace.

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical layouts. Align a large `display-lg` metric to the far left and keep the right 30% of the screen entirely empty (`surface`) to provide visual "breathing room."
*   **Do** use `on-surface-variant` for secondary text to create a high-end, "dimmed" environment that makes `primary` accents pop.
*   **Do** use the `24` (5.5rem) spacing token for major section margins to enforce the "Zen" personality.

### Don't:
*   **Don't** use pure black (#000). Always use the `surface` token to maintain tonal depth.
*   **Don't** use 100% opaque borders. They break the fluid, "layered glass" illusion of the system.
*   **Don't** use large border-radii. Keep everything to `DEFAULT` (0.25rem) or `none` to maintain the industrial, precision-engineered aesthetic.