# Resonance Dubbing Lab

Resonance Dubbing Lab is a video dubbing SaaS built with Next.js 14, TypeScript, Tailwind CSS, Prisma, SQLite, FFmpeg, and Sarvam AI.

It provides an enterprise landing page and a zero-login studio where a guest receives 100 initial credits, uploads a video, configures the language and voice, follows live dubbing progress, compares the source and localized result, and downloads the Sarvam export.

## Important security step

An API key was pasted into the original chat. Treat that key as compromised: delete it in the Sarvam dashboard and generate a new one before running this project. Never reuse the pasted key. The application reads only `SARVAM_API_KEY` from the server environment and never exposes it to browser code.

## Sarvam integration

The implementation follows the current dedicated Content Studio Dubbing API:

1. `POST https://api.sarvam.ai/dubbing/jobs`
2. `PUT` the raw video to the returned signed `upload_url`
3. `POST /dubbing/jobs/{job_id}/start`
4. Poll `GET /dubbing/jobs/{job_id}/live-status`
5. Poll `GET /dubbing/jobs/{job_id}/export-status?limit=100` and use the completed, non-stale video export

Authentication uses the documented `api-subscription-key` header. The signed upload request deliberately does not include the API key.

When the user selects source-language auto-detection, Resonance uses FFmpeg to extract a maximum 25-second mono sample and calls the current `POST /speech-to-text` endpoint with `saaras:v3` and `language_code=unknown`. The detected BCP-47 code is then supplied to the dedicated dubbing job. All actual dubbing remains in Sarvam’s dedicated job pipeline.

## Requirements

- Node.js 18.17 or newer
- pnpm (recommended), npm, or yarn
- FFmpeg and ffprobe available on `PATH`
- A Sarvam AI API key with access to the Dubbing API

On macOS with Homebrew:

```bash
brew install ffmpeg
```

## Local setup

```bash
cp .env.example .env
```

Open `.env` and set a newly rotated key:

```dotenv
SARVAM_API_KEY="your-new-key"
DATABASE_URL="file:./dev.db"
```

Then install, create the SQLite database, and start the app:

```bash
pnpm install
pnpm db:generate
pnpm db:deploy
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The studio is at [http://localhost:3000/dashboard](http://localhost:3000/dashboard).

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `SARVAM_API_KEY` | none | Server-only Sarvam API subscription key |
| `SARVAM_DUBBING_BASE_URL` | `https://api.sarvam.ai/dubbing` | Current dedicated dubbing base URL |
| `DATABASE_URL` | `file:./dev.db` | Prisma SQLite connection |
| `INITIAL_GUEST_CREDITS` | `100` | Credit grant for a new guest session |
| `DEMO_UPLOAD_LIMIT_MB` | `50` | Local upload cap |
| `SARVAM_DISABLE_WATERMARK` | `false` | Requests watermark-free export when enabled for the Sarvam account |
| `FFMPEG_PATH` | `ffmpeg` | FFmpeg binary or absolute path |
| `FFPROBE_PATH` | `ffprobe` | ffprobe binary or absolute path |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Public origin used for canonical SEO links |

## Product billing vs. Sarvam billing

Resonance uses the requested product price of 100 credits per started minute, where 1 credit = ₹1. This is independent of Sarvam’s upstream API billing, which its current docs describe as per whole second and per target language. Update `PRODUCT_CREDITS_PER_MINUTE` in `lib/config.ts` if your retail pricing changes.

Credits are reserved atomically when a job starts. If job creation, upload, start, or export fails, the status flow returns the credits exactly once and records the refund in the ledger.

## Useful commands

```bash
pnpm dev          # localhost:3000
pnpm build        # production build
pnpm start        # serve the production build
pnpm db:studio    # inspect local sessions, jobs, and credits
pnpm db:migrate   # create a new development migration
```

## Local-demo boundaries

- Mock top-ups do not collect payment.
- Anonymous sessions are stored in SQLite, with the session identifier kept in browser local storage.
- Video bytes are kept only in a temporary directory during validation and upload, then deleted.
- Sarvam export links are signed and time-limited; the app refreshes them through `export-status` while polling rather than treating them as permanent assets.
- The included SQLite setup is appropriate for a single local server. A horizontally scaled deployment should use a transactional production database, object storage, background workers, and authenticated accounts.
