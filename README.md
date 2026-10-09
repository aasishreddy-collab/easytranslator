# Easy Translate

Easy Translate is a responsive voice-and-text translator for 27 languages: English plus 26 Indian languages. Typed input can be translated manually. When browser speech recognition is available, the **Speak** control syncs interim and finalized words into the source text field. The silence timer starts when recognition begins and resets with new speech results. After **2.5 seconds without speech**, the mic stops, any remaining interim words are finalized, and the pending spoken segment is translated, appended to the conversation, and spoken aloud. The mic stays off until the user taps **Speak** again; the existing transcript and translated conversation are retained so the next segment continues the conversation. Manually stopping also flushes and translates the current segment.

## Conversation translation

The translation prompt aims to preserve every meaningful conversational detail—including idioms, repetitions, tone, register, names, numbers, and speaker turns—while using fluent phrasing in the requested language and script. For spoken segments, the app sends only the new segment plus up to the previous 800 characters as temporary context to help resolve references; it does not translate the context a second time. If an automatic segment fails, use **Retry voice segment(s)** to resubmit only failed segments without replacing successful translations. The app does not store voice recordings or conversation history. This uses the existing Manus-managed LLM; it does not fine-tune or retrain the underlying model.

## Run

```sh
npm install
npm run dev
```

The app serves on port `3000`. To create and run the production bundle, use `npm run build` and `npm start`.

## Deploy on Render

Connect this repository to Render and create a Blueprint from `render.yaml`. Set `MANUS_API_URL` and `MANUS_API_KEY` in the service environment to enable translation. Render assigns the public deployment URL after the first successful deploy.

## Translation service

`POST /api/translate` accepts `{ "text": "...", "target_language": "Bengali", "context": "optional previous conversation text" }`. It validates nonblank text (up to 12,000 characters), a supported target language, and optional context of at most 800 characters. The server calls the Manus-managed OpenAI-compatible LLM endpoint; the browser never receives the server credential. In the managed Manus app environment, the server reads `MANUS_API_URL` and `MANUS_API_KEY` at runtime; the sandbox prototype also supports `OPENAI_API_BASE` and `OPENAI_API_KEY`. If running the source outside that environment, configure equivalent server-side values; do not put credentials in client code.

## Speech

Speech recognition uses the selected source language, including `en-IN` for English where supported. It stops after 2.5 seconds of silence from recognition startup or the latest speech result, can recover from browser session restarts while actively listening, and does not automatically restart after a silence or explicit stop. Recognition availability varies by browser and system speech service; typed input remains available if it is unsupported or microphone permission is declined. The transcript field is read-only during active voice capture and while a translation is in progress, to avoid losing speech. Speech playback prefers a matching-language voice that the browser identifies as male. Because browser voice metadata does not consistently expose gender, it falls back to the closest available voice for that language when necessary.

The browser title and visible brand are **Easy Translate**. The Preview hostname is platform-assigned and remains unchanged when the app label changes.

## Image translation page

Open `/image-translation` from the Image Translation link in the header. The page accepts an image upload, uses the same server-side LLM translation configuration as Voice Translation through `POST /api/image-translate`, supports the full 27-language catalog, shows detected text and the translated result, and can speak the result aloud. Images up to 10 MB are supported.

## Translator pages

- `/` — Voice Translator
- `/communicative-translator` — Communicative Translator
- `/image-translation` — Image Translator
