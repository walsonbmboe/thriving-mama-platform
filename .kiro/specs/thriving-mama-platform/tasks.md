# Implementation Plan: Thriving Mama Platform

## Tasks

- [ ] 1. Project Scaffolding & Infrastructure Setup
  - [ ] 1.1 Initialise Next.js project with TypeScript, configure Netlify hosting (netlify.toml), and set up Netlify Functions directory
  - [ ] 1.2 Set up Amazon Cognito User Pool with three groups: Mothers, Counselors, Admins
  - [ ] 1.3 Create all DynamoDB tables (users, chat_messages, crisis_events, epds_results, mood_checkins, booking_slots, sessions, peer_connections, peer_messages, family_resources, analytics_events, config, notifications, access_logs) with GSIs and on-demand capacity
  - [ ] 1.4 Create S3 buckets (rag-documents, voice-uploads, family-resources, exports) with encryption, lifecycle rules, and CORS
  - [ ] 1.5 Configure AWS SDK credentials for Netlify Functions (environment variables in Netlify dashboard)
  - [ ] 1.6 Configure IAM roles and least-privilege policies for Netlify Functions to access DynamoDB, S3, Bedrock, Cognito, SNS, SES, Translate, Transcribe
  - [ ] 1.7 Initialise Pinecone index (thriving-mama-rag, 1536 dimensions, cosine metric, en/fr namespaces)
  - [ ] 1.8 Configure Amazon SES (verify sender domain/email, set up templates for booking confirmation, cancellation, crisis alert)
  - [ ] 1.9 Write property-based and unit test scaffolding (Vitest + fast-check)
  - [ ] 1.10 Set up shared middleware module for JWT validation (Cognito token verification in Netlify Functions)

- [ ] 2. Authentication & User Management
  - [ ] 2.1 Implement register Netlify Function — Cognito account creation + DynamoDB profile write with consent and language preference
  - [ ] 2.2 Implement login and token-refresh Netlify Functions — Cognito auth flow, JWT issuance
  - [ ] 2.3 Implement profile Netlify Function — update language preference and consent in DynamoDB
  - [ ] 2.4 Implement account-delete Netlify Function — account deletion/anonymisation flow (Cognito disable + DynamoDB PII removal)
  - [ ] 2.5 Implement RBAC middleware module — extract Cognito groups claim from JWT, enforce role-based endpoint access across all functions
  - [ ] 2.6 Build Next.js registration, login, and account settings UI pages with form validation
  - [ ] 2.7 Write property-based tests for Properties 1 (Registration Round-Trip), 2 (Login Issues Valid JWT), 3 (RBAC), 4 (Password Validation), 34 (Consent Storage)

- [ ] 3. AI Chat Coach Core
  - [ ] 3.1 Implement RAG document ingestion pipeline — embed documents using Bedrock Titan Embeddings v2, upsert vectors to Pinecone with metadata (docId, source, language, category)
  - [ ] 3.2 Implement translation module — Amazon Translate fr↔en; pass-through for English and Pidgin English
  - [ ] 3.3 Implement chat Netlify Function — orchestrate RAG retrieval (top-5 Pinecone query), sliding context window (20 turns from DynamoDB), Bedrock Nova Pro invocation, translation middleware, response storage in DynamoDB
  - [ ] 3.4 Implement GET chat-history and chat-sessions Netlify Functions — paginated retrieval from DynamoDB
  - [ ] 3.5 Build Next.js chat UI — message bubbles, send input, conversation history view, session list
  - [ ] 3.6 Write property-based tests for Properties 5 (Chat Response Generation), 6 (Context Preservation), 7 (History Round-Trip), 8 (French Translation Pipeline), 9 (Language Preference Change Persistence)

- [ ] 4. Crisis Detection & Escalation
  - [ ] 4.1 Implement crisis keyword configuration — seed default keywords in DynamoDB config table; expose admin crisis-keywords Netlify Function (GET/PUT)
  - [ ] 4.2 Implement CrisisDetector module — two-pass: keyword scan against DynamoDB config, then Bedrock severity classification (LOW/MEDIUM/HIGH)
  - [ ] 4.3 Implement notification module — SNS SMS + SES email dispatch to on-call counselor with retry logic (3x exponential backoff); in-app notification write to DynamoDB
  - [ ] 4.4 Wire CrisisDetector into chat function — runs synchronously before Bedrock response is returned; on HIGH severity triggers notification module
  - [ ] 4.5 Implement crisis event logging — write to DynamoDB crisis_events table with all required fields
  - [ ] 4.6 Implement on-call counselor designation — admin oncall Netlify Function updates DynamoDB config table
  - [ ] 4.7 Build crisis UI response — display emergency hotline info and supportive message in chat when crisis flag returned
  - [ ] 4.8 Write property-based tests for Properties 12 (Crisis Detection Always Runs), 13 (Crisis Notification Dispatch), 14 (Crisis Response Includes Hotline), 15 (Crisis Event Logging), 16 (Crisis Notification Retry)

- [ ] 5. Multilingual Support & Voice Input
  - [ ] 5.1 Integrate Amazon Translate into translation module for French ↔ English; configure Nova Pro system prompt for Pidgin English native handling
  - [ ] 5.2 Implement language preference routing in chat function — apply correct translation path based on stored preference
  - [ ] 5.3 Implement voice input using Browser Web Speech API (client-side, zero cost) as primary method for web app
  - [ ] 5.4 Implement voice Netlify Function for WhatsApp voice messages — download audio, upload to S3, AWS Transcribe job, return transcript
  - [ ] 5.5 Build voice recording UI control in chat interface — Web Speech API integration, 2-minute limit indicator, transcript preview before send
  - [ ] 5.6 Write property-based tests for Properties 8 (French Translation Pipeline), 9 (Language Preference Change), 10 (Voice Duration Limit), 11 (Voice Transcription Round-Trip)

- [ ] 6. Smart Referrals
  - [ ] 6.1 Implement smart referral detection logic in chat function — secondary Bedrock evaluation after main response to assess referral need
  - [ ] 6.2 Implement smart referral logging — write event to DynamoDB analytics_events with Mother ID, timestamp, AI reasoning summary
  - [ ] 6.3 Build smart referral UI component — inline booking recommendation card with CTA button in chat response
  - [ ] 6.4 Write property-based test for Property 17 (Smart Referral Logging)

- [ ] 7. Counselor Booking System
  - [ ] 7.1 Implement booking Netlify Function — slot CRUD (create, update, delete, list available), DynamoDB conditional write for booking atomicity, session record creation
  - [ ] 7.2 Implement Mother-facing booking endpoints (list slots, book, cancel)
  - [ ] 7.3 Implement Counselor-facing booking endpoints (create/update/delete slots, list sessions)
  - [ ] 7.4 Wire booking confirmation and cancellation emails via notification module → SES
  - [ ] 7.5 Build Mother booking UI — available slot calendar/list view, booking confirmation screen, cancellation flow
  - [ ] 7.6 Build Counselor slot management UI in Counselor Dashboard — add/edit/delete availability slots
  - [ ] 7.7 Write property-based tests for Properties 18 (Slot Booking State Transition), 19 (Booking Confirmation Notifications), 20 (Session Cancellation State Transition), 21 (Double-Booking Prevention)

- [ ] 8. EPDS Screening
  - [ ] 8.1 Implement epds Netlify Function — server-side score calculation (sum of 10 answers), DynamoDB storage, threshold logic (≥10 booking recommendation, ≥13 crisis escalation trigger)
  - [ ] 8.2 Implement EPDS endpoints (submit, history for Mother, history for Counselor)
  - [ ] 8.3 Set up Netlify Scheduled Function (cron) — fires daily to check which Mothers are due for EPDS (every 14 days), writes in-app notification to DynamoDB
  - [ ] 8.4 Build standalone EPDS UI — 10-question form, score result screen with recommendation, score history timeline chart
  - [ ] 8.5 Write property-based tests for Properties 22 (EPDS Score Calculation), 23 (EPDS Threshold ≥10), 24 (EPDS Threshold ≥13)

- [ ] 9. Mood Tracking & Daily Check-ins
  - [ ] 9.1 Implement mood Netlify Function — check-in submission with consecutive low mood detection (query last 3 days), DynamoDB storage
  - [ ] 9.2 Implement mood endpoints (checkin, history for Mother, history for Counselor)
  - [ ] 9.3 Set up Netlify Scheduled Function (cron) — fires daily to check which Mothers haven't checked in, writes in-app mood reminder to DynamoDB
  - [ ] 9.4 Build mood check-in UI — 1–5 rating selector with emoji, optional note field, 30-day line chart history view
  - [ ] 9.5 Write property-based tests for Properties 25 (Mood Check-In Storage Round-Trip), 26 (Consecutive Low Mood Detection)

- [ ] 10. Peer Matching & Community
  - [ ] 10.1 Implement peer Netlify Function — matching algorithm (baby age range, language, challenges set intersection), returns top 3 matches from DynamoDB
  - [ ] 10.2 Implement peer messaging — thread creation on connection accept, message send/receive stored in DynamoDB, connection removal disables thread
  - [ ] 10.3 Implement peer endpoints (opt-in, matches, connect, threads, message, messages by thread, disconnect)
  - [ ] 10.4 Build peer matching UI — opt-in screen, match cards, connection accept/decline, messaging thread view with community guidelines notice
  - [ ] 10.5 Write property-based tests for Properties 27 (Peer Match Attribute Overlap), 28 (Peer Match Count Invariant), 29 (Peer Connection Enables Messaging), 30 (Peer Connection Removal Disables Thread)

- [ ] 11. Family Portal
  - [ ] 11.1 Implement family-resources Netlify Function — public resource list/search (DynamoDB contains filter on title/tags), resource detail retrieval, Admin CRUD
  - [ ] 11.2 Implement family portal endpoints (public GET list/detail, Admin POST/PUT/DELETE)
  - [ ] 11.3 Build public Family Portal Next.js pages — resource library with search, resource detail view, English/French language toggle
  - [ ] 11.4 Write property-based test for Property 31 (Family Portal Search Relevance)

- [ ] 12. Counselor Dashboard
  - [ ] 12.1 Implement Counselor Dashboard Netlify Functions — upcoming sessions list, pending referrals list, high-risk mothers list, referral mark-as-reviewed, Mother flag as high-risk
  - [ ] 12.2 Implement health record access endpoints for Counselors — conversation history, EPDS history, mood history (with access log write and relationship check)
  - [ ] 12.3 Build Counselor Dashboard Next.js page — sessions panel, referrals panel, high-risk mothers panel, crisis alert banner, Mother profile drawer
  - [ ] 12.4 Write property-based tests for Properties 32 (Counselor Data Access Restriction), 33 (Health Record Access Logging)

- [ ] 13. Admin Dashboard
  - [ ] 13.1 Implement admin Netlify Function — user management (list, activate/deactivate via Cognito AdminDisableUser, role change), counselor performance summary, on-call designation
  - [ ] 13.2 Implement admin endpoints (users CRUD, analytics, export, crisis-keywords, oncall, counselor performance)
  - [ ] 13.3 Implement analytics Netlify Function — aggregate metrics from DynamoDB analytics_events, CSV generation uploaded to S3 with pre-signed URL
  - [ ] 13.4 Build Admin Dashboard Next.js page — metrics overview, user management table, counselor performance table, crisis keyword editor, on-call selector, CSV export button
  - [ ] 13.5 Write property-based test for Property 35 (Analytics Event Completeness)

- [ ] 14. WhatsApp Bot Integration
  - [ ] 14.1 Implement whatsapp-webhook Netlify Function — verify webhook token, parse incoming messages, lookup/create Mother account by phone number in DynamoDB, invoke chat function logic
  - [ ] 14.2 Implement WhatsApp reply dispatch — call WhatsApp Business API to send AI response, booking links, crisis hotline info
  - [ ] 14.3 Implement WhatsApp onboarding flow — guided multi-step conversation for new account registration or existing account linking
  - [ ] 14.4 Implement WhatsApp voice message handling — download audio from WhatsApp media URL, upload to S3, invoke Transcribe, process transcript through chat function
  - [ ] 14.5 Configure Netlify Function endpoint for WhatsApp webhook (public, no JWT auth)
  - [ ] 14.6 Write integration tests for WhatsApp end-to-end flow (webhook → chat function → WhatsApp reply)

- [ ] 15. Notifications & Reminders
  - [ ] 15.1 Implement notifications Netlify Function — GET notifications (Mother, paginated, unread first)
  - [ ] 15.2 Implement notification mark-as-read — PUT notification by ID
  - [ ] 15.3 Build notification bell UI component — unread count badge, notification dropdown list
  - [ ] 15.4 Verify Netlify Scheduled Functions for EPDS (14-day) and mood (daily) reminders are correctly writing notifications to DynamoDB

- [ ] 16. Data Privacy, Security & Compliance
  - [ ] 16.1 Verify DynamoDB and S3 encryption at rest (AWS-managed keys) across all tables and buckets
  - [ ] 16.2 Verify HTTPS enforcement on Netlify hosting and all function endpoints
  - [ ] 16.3 Implement data deletion function — on account deletion request, anonymise PII in DynamoDB and delete S3 objects within 30-day SLA
  - [ ] 16.4 Implement access log writes on all health record endpoints (conversation history, EPDS, mood) — accessor ID, target user ID, resource type, timestamp to DynamoDB access_logs
  - [ ] 16.5 Audit all function RBAC checks — confirm Mothers, Counselors, and Admins cannot access endpoints outside their role
  - [ ] 16.6 Implement application-level rate limiting in Netlify Functions to protect against abuse

- [ ] 17. UI/UX Polish & Accessibility
  - [ ] 17.1 Implement global Next.js layout — navigation bar (role-aware), footer, responsive mobile-first design
  - [ ] 17.2 Implement language switcher component — persists preference to backend, updates all UI labels immediately
  - [ ] 17.3 Apply consistent design system — colour palette (warm, maternal), typography, spacing, button styles, form components
  - [ ] 17.4 Ensure WCAG 2.1 AA compliance — keyboard navigation, ARIA labels, colour contrast, screen reader support across all pages
  - [ ] 17.5 Build onboarding flow for new Mothers — welcome screen, language selection, consent form, profile setup, first EPDS prompt
  - [ ] 17.6 Build public marketing/landing page — platform overview, features, how it works, CTA to register

- [ ] 18. Testing, CI/CD & Deployment
  - [ ] 18.1 Complete all remaining property-based test implementations (fast-check, Vitest) for all 35 correctness properties
  - [ ] 18.2 Write unit tests for all Netlify Function handlers covering edge cases and error conditions
  - [ ] 18.3 Write integration tests against staging environment — WhatsApp flow, Pinecone RAG, scheduled functions, Cognito groups
  - [ ] 18.4 Write smoke tests (post-deployment) — function endpoint health checks, Cognito group existence, encryption verification, public Family Portal access
  - [ ] 18.5 Configure GitHub Actions CI pipeline — unit + property tests on PR, integration tests on merge to main, Netlify deploy trigger
  - [ ] 18.6 Configure Netlify deployment — branch-based deploys (dev, staging, prod), environment variable management, deploy previews on PRs
  - [ ] 18.7 Set up monitoring — Netlify Analytics + AWS CloudWatch for DynamoDB throttling and Bedrock latency
  - [ ] 18.8 Perform end-to-end manual testing across all three roles (Mother, Counselor, Admin) on staging before production launch
