# Easy Translate — implementation plan

## Product scope

Create a responsive voice-and-text translator web app from the supplied React translator source. Include selectors for English and the 26 requested Indian languages (Hindi, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Odia, Malayalam, Punjabi, Assamese, Sanskrit, Sindhi, Konkani, Manipuri, Nepali, Bodo, Dogri, Santali, Maithili, Bhojpuri, Awadhi, Garhwali, Kumaoni, Tulu); typed source text with automatic source-language detection; continuous browser microphone recognition with interim/final transcript synchronized into the source textarea and an `en-IN` locale for English where supported; typed-input fallback and capability/permission messaging; after 2.5 seconds without a new speech result, stop the microphone, finalize any remaining interim transcript, translate the pending conversational segment, append it to the output and speak it; require the user to activate the microphone again for another segment; a concise server-side translation request using Manus Core LLM that preserves every meaningful conversational detail and aims for fluent, idiomatic, native-sounding phrasing; progress, validation and recoverable error states; browser speech synthesis that prefers a matching-language male voice when the browser identifies one, then falls back to the closest available voice for that language; and a swap action. Select valid defaults Hindi → Bengali. The existing service does not expose model fine-tuning; use concise translation instructions rather than claim model training. Use the visible app name Easy Translate; the Preview hostname is platform-assigned and not changed by a label rename.

## Architecture and project structure

The initialized managed Web project has an empty workspace, configured server capability, no database, and preview port 3000. Build a small React client and Node server using a Vite dev server with an Express middleware/API endpoint. The recognition hook owns the inactivity timer and, after 2.5 seconds without a new speech result, stops listening, flushes any remaining interim text, and reports that the pause is complete. It creates a fresh SpeechRecognition instance when browser sessions restart, preventing replayed results from suppressing a phrase the user genuinely repeats. The app mirrors interim/final text into the source textarea and, on that pause callback, queues only the newly finalized segment through the translation endpoint, appends its translation and speaks it; it does not auto-restart after an inactivity stop, so the user explicitly activates the microphone for the next segment. A user-triggered stop also flushes and translates pending speech. For disambiguation, each voice request may include up to 800 preceding source characters as temporary context; translate only the new segment. Failed segments remain in an in-memory retry list and can be resubmitted individually without overwriting successful translations. `POST /api/translate` validates `{text, target_language, context?}`, enforcing a 5,000-character text limit and 800-character context limit, invokes the platform OpenAI-compatible chat completion endpoint with the project's server-only Manus credentials, and returns `{translation}`. Its concise prompt preserves meaning, tone, and all meaningful conversation content. No model fine-tuning or training dataset is in scope. Do not expose service credentials to browser code or persist recordings/translations. Use browser-native Web Speech APIs and feature detection; text translation remains usable where microphone/TTS support differs.

Proposed files:
- `src/main.jsx` — application entry and React mounting.
- `src/App.jsx` — responsive translator interface and application state.
- `src/languages.js` — canonical 27-language list and BCP-47 speech codes.
- `src/voiceSelection.js` — rank browser speech voices by language match and prefer male voices when identifiable.
- `src/useSpeechRecognition.js` — isolated browser speech-recognition lifecycle.
- `src/styles.css` — responsive app styling, focus states, script-friendly typography, reduced-motion behavior.
- `server/index.js` — Vite/Express runtime and validated translation API route.
- `public/manus-routes.json` — page route manifest (`/`).
- `index.html`, `package.json`, `vite.config.js` — document shell, pinned toolchain/dependencies, and development/build scripts.

## Design decisions — Indigo Manuscript

- **Design Movement:** refined editorial design inspired by Indian print traditions and a modern language field guide.
- **Core Principles:** readable across scripts; calm and uncluttered; voice-first controls; clear separation between input and result.
- **Color Philosophy:** deep indigo signals focus and reliability, warm parchment creates a welcoming paper-like canvas, and restrained saffron marks active listening and decisive actions. Keep contrast legible and backgrounds quiet.
- **Layout Paradigm:** an editorial, vertically staged conversation workspace, not a generic dashboard grid. A compact identity/header leads to a paired language bar, a prominent central voice control, then stacked source and translation cards that adapt to narrow screens.
- **Signature Elements:** a custom two-script monogram/wordmark; a fine saffron listening halo with subtle waveform ticks; paper-toned translation cards with small bilingual metadata.
- **Interaction Philosophy:** direct and forgiving. Keep the microphone's state unmistakable; preserve typed text on failures; make audio replay and swap actions accessible and predictable.
- **Animation:** brief fades and small positional transitions for card/state changes; gentle listening pulse only while actively recording; honor `prefers-reduced-motion`; never animate the whole page or delay input.
- **Typography System:** Noto Serif for editorial headings and translation emphasis, Noto Sans for interface text and controls, with system fallbacks that support Indian scripts; use a restrained scale and comfortable line-height.
- **Brand Essence:** an everyday translator that helps people bridge English and Indian languages by voice or text; personality: clear, warm, dependable.
- **Brand Voice:** concise and human, never technical. Examples: “Speak naturally. We’ll carry the meaning.” and “Your translation is ready to hear.”
- **Wordmark & Logo:** a bespoke “ET” monogram beside the “Easy Translate” wordmark, drawn in indigo with a saffron accent.
- **Signature Brand Color:** deep manuscript indigo (`#312E81`), balanced with warm parchment and restrained saffron (`#D97706`).

## Serving and dependencies

Use the managed project's supplied platform runtime credentials at call time on the server. The browser must never receive `MANUS_API_KEY`. Build the frontend to `dist`; run the application on `0.0.0.0:3000` and make the translation API available under `/api/translate`. Keep `/manus-routes.json` as the route manifest for the sole page route `/`. No account, database, persistent history, external translation API key, or mobile-native packaging is in scope.
