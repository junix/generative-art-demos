# Generative Art Demos

Deterministic p5.js sketches designed as finished transparent PNG compositions rather than perpetual animations.

| Scene | Preview | Technique |
|---|---|---|
| Flow field | ![flow](out/flow-field-transparent.png) | Curl-like noise trajectories |
| Reaction garden | ![reaction](out/reaction-transparent.png) | Iterated activator/inhibitor field |
| Botanical recursion | ![botanical](out/botanical-transparent.png) | L-system branching and seeded blossoms |

Run `npm install && npm test`. The test launches real Chrome offline, captures alpha-preserving PNGs, validates pixels, and checks pointer interaction.
