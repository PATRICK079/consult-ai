# MediNotes Pro

MediNotes Pro is a full-stack AI consultation assistant that turns clinician notes into a professional visit summary, clear next steps, and a patient-friendly follow-up email.

This project is designed as a small SaaS product rather than a raw AI demo. It includes authentication, subscription billing, a protected AI API, streamed responses, responsive product UI, and Vercel deployment support.

> **Portfolio/demo notice:** This application is not a medical device or compliant healthcare information system. Do not submit real patient-identifiable information.

## Product workflow

1. A healthcare professional signs in with Clerk.
2. The user enters a patient name, visit date, and consultation notes.
3. The protected FastAPI endpoint validates the request and verifies the Clerk JWT.
4. OpenAI generates three structured outputs:
   - Summary of visit for the doctor's records
   - Next steps for the doctor
   - Draft of an email to the patient
5. The response streams into the browser in real time as Markdown.

## What this demonstrates

- Building a complete SaaS workflow around an AI feature
- Authentication and server-side authorization with Clerk
- User subscription gating with Clerk Billing
- A typed TypeScript frontend connected to a Python API
- Pydantic request validation and FastAPI dependency injection
- Server-Sent Events for progressive AI output
- Responsive product design and clear loading/error states
- Local development and Vercel deployment for a hybrid stack
- Secure environment-variable handling for Clerk and OpenAI

## Architecture

```text
Browser
  ├── Next.js Pages Router
  │     ├── Landing page: pages/index.tsx
  │     └── Workspace: pages/product.tsx
  ├── Clerk authentication and Billing
  └── POST /api
        └── FastAPI: api/index.py
              ├── Verify Clerk bearer token
              ├── Validate Visit payload with Pydantic
              ├── Call OpenAI
              └── Stream text/event-stream response
```

## Technology

### Frontend

- Next.js 16 Pages Router
- React 19 and TypeScript
- Clerk Next.js SDK
- `react-datepicker` for visit dates
- `react-markdown`, `remark-gfm`, and `remark-breaks`
- Responsive custom CSS design system

### Backend and AI

- Python 3.13
- FastAPI and Pydantic
- `fastapi-clerk-auth`
- OpenAI API using `gpt-5-mini`
- Streaming responses with FastAPI `StreamingResponse`
- `@microsoft/fetch-event-source` in the browser

### Deployment

- Vercel for the Next.js application
- Vercel Python Functions for `api/index.py`
- `requirements.txt` for Python dependencies
- `.python-version` to keep the runtime aligned

## Authentication and billing

The workspace is protected with Clerk Billing:

```tsx
<Protect
  plan="premium_subscription"
  fallback={<PricingTable for="user" />}
>
  <ConsultationForm />
</Protect>
```

The `premium_subscription` value must exactly match the **plan slug** configured in the Clerk Dashboard. Clerk Billing must be enabled, the plan must be configured for users, and the plan must be publicly visible for it to appear in the pricing table.

The API also verifies the Clerk bearer token independently. This prevents a user from bypassing the frontend subscription gate and calling the AI endpoint directly.

## Project structure

```text
consult-ai/
├── api/
│   └── index.py              # FastAPI app and streaming AI endpoint
├── pages/
│   ├── _app.tsx              # ClerkProvider and global CSS
│   ├── _document.tsx         # Document shell
│   ├── index.tsx             # MediNotes Pro landing page
│   └── product.tsx           # Protected consultation workspace
├── styles/
│   └── globals.css           # Shared responsive styles
├── public/                   # Static assets
├── requirements.txt          # Python dependencies
├── next.config.ts            # Next.js config and local API rewrite
├── package.json              # JavaScript dependencies and scripts
└── .python-version           # Python runtime pin
```

## Environment variables

Create `.env.local` locally. Never commit it.

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWKS_URL=https://your-clerk-instance/.well-known/jwks.json
OPENAI_API_KEY=sk-...
```

The publishable key is used by the frontend. `CLERK_SECRET_KEY`, `CLERK_JWKS_URL`, and `OPENAI_API_KEY` are server-side values and must be configured as Vercel Environment Variables for deployment.

## Local development

Install JavaScript dependencies:

```bash
npm install
```

Install Python dependencies in your virtual environment:

```bash
python3 -m pip install -r requirements.txt
```

Run FastAPI in Terminal 1:

```bash
set -a
source .env.local
set +a
uvicorn api.index:app --reload --port 8000
```

Run Next.js in Terminal 2:

```bash
npm run dev
```

The development rewrite in `next.config.ts` forwards `/api` to `http://127.0.0.1:8000/api`.

Open:

```text
http://localhost:3000
```

Useful checks:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Deploying to Vercel

Vercel recognizes `api/index.py` as a Python Function and exposes it at `/api`. The development-only rewrite is disabled in production, so production requests reach the Python Function directly.

### CLI deployment

From the repository root:

```bash
vercel login
vercel --prod
```

### Git deployment

Connect the repository to Vercel and enable automatic deployments. Pushes to the production branch can then trigger a deployment.

Configure these values in the Vercel project settings:

```text
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
CLERK_JWKS_URL
OPENAI_API_KEY
```

Do not deploy `.env.local` or commit secrets. The committed `requirements.txt` supplies the Python dependencies, while `.python-version` specifies Python 3.13.

After deployment, verify:

```text
https://your-project.vercel.app/
https://your-project.vercel.app/product
https://your-project.vercel.app/api
```

## Important engineering decisions

### Streaming instead of waiting for one response

Consultation summaries can take several seconds. The backend emits SSE-formatted chunks and the frontend progressively renders the response, giving the user immediate feedback and a more responsive experience.

### Backend validation and authorization

The browser validates required fields for usability, but the backend validates the payload again with Pydantic. Clerk JWT verification happens in FastAPI, making the API the real authorization boundary rather than relying only on hidden UI controls.

### Separate Next.js and Python responsibilities

Next.js owns the product experience, routing, and client interaction. FastAPI owns the AI workflow, request validation, token verification, and streaming response. This keeps the AI service independently testable and makes the boundary between product UI and model orchestration clear.

## Production roadmap

For a real healthcare deployment, the next engineering steps would include:

- never logging patient-identifiable data;
- adding rate limiting, usage metering, and request timeouts;
- adding audit logs and a defined retention policy;
- adding tests for billing access, JWT verification, validation, and SSE parsing;
- adding observability for latency, errors, token usage, and failed streams;
- storing consultation history in a secure database;
- performing the required privacy, security, and compliance reviews;
- adding output review and safety controls before any clinical use.

## Portfolio summary

MediNotes Pro shows how to take an AI capability from prompt to product: a focused user experience, authenticated and subscription-protected access, a typed API contract, real-time model output, and a deployment path that combines Next.js with Python on Vercel.

## License

This project is intended for portfolio and educational use. Add a formal open-source license before distributing it publicly.
