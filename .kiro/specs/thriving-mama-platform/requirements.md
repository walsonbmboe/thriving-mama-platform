# Requirements Document

## Introduction

Thriving Mama is an AI-powered maternal mental health support platform available to mothers worldwide, with a primary focus and cultural adaptation for mothers in Africa. It delivers 24/7 mental health support through a web application and WhatsApp channel, combining an AI chat coach (Amazon Nova Pro via Bedrock with RAG), multilingual support (English, French, Pidgin English), crisis detection with human counselor escalation, mood tracking, EPDS screening, peer community connections, a family portal, and dashboards for counselors and administrators. The platform uses a hybrid architecture with Netlify (hosting and serverless functions) and AWS services (DynamoDB, Cognito, S3, Bedrock, Pinecone, SNS, SES, Translate) with a Next.js frontend, targeting near-zero startup cost scaling to $150–300/month at 1,000 users.

---

## Glossary

- **Platform**: The Thriving Mama system, encompassing the web application and WhatsApp channel.
- **Mother**: A registered user of the Platform who is a new or expectant mother seeking mental health support.
- **Counselor**: A registered mental health professional who manages sessions, reviews referrals, and handles crisis escalations.
- **Admin**: A registered platform administrator responsible for user management, configuration, and analytics.
- **AI_Coach**: The conversational AI component powered by Amazon Nova Pro via Amazon Bedrock, augmented by a RAG system.
- **RAG_System**: The Retrieval-Augmented Generation system using Pinecone (vector store) and Amazon S3 (document storage) to ground AI_Coach responses in curated maternal mental health content.
- **Crisis_Detector**: The component within AI_Coach that identifies crisis signals in Mother messages and triggers the Crisis_Escalation_Flow.
- **Crisis_Escalation_Flow**: The automated process that notifies the on-call Counselor via SNS (SMS) and SES (email) and displays emergency hotline information to the Mother.
- **EPDS**: Edinburgh Postnatal Depression Scale — a validated 10-question periodic screening tool administered separately from the chat interface.
- **Mood_Tracker**: The component that records daily mood check-ins submitted by Mothers and surfaces trends over time.
- **Booking_System**: The native counselor appointment scheduling system built on Netlify Functions, DynamoDB, and SES.
- **Peer_Matcher**: The component that connects Mothers with similar profiles or experiences for peer support.
- **Family_Portal**: The section of the Platform providing mental health resources for partners and family members of Mothers.
- **WhatsApp_Bot**: The WhatsApp Business API integration that mirrors the web AI_Coach experience, including crisis detection and smart referrals.
- **Counselor_Dashboard**: The interface through which Counselors manage sessions, view referrals, and flag high-risk cases.
- **Admin_Dashboard**: The interface through which Admins manage users, configure the Platform, and view analytics and impact metrics.
- **Smart_Referral**: The AI_Coach behaviour of detecting when a Mother's needs exceed AI support and recommending a Counselor booking.
- **Translator**: The Amazon Translate integration that handles English–French translation; Nova Pro handles Pidgin English natively.
- **Voice_Input**: The optional AWS Polly-powered voice-to-text feature allowing Mothers to speak rather than type.
- **Session**: A scheduled one-on-one appointment between a Mother and a Counselor.
- **Slot**: A time block made available by a Counselor for booking.
- **On_Call_Counselor**: The Counselor designated to receive crisis notifications at a given time.

---

## Requirements

### Requirement 1: User Registration and Authentication

**User Story:** As a new user, I want to register and log in securely with a role-appropriate experience, so that I can access the features relevant to my role (Mother, Counselor, or Admin).

#### Acceptance Criteria

1. THE Platform SHALL support three user roles: Mother, Counselor, and Admin, each with distinct permissions and interface views.
2. WHEN a user submits a registration form with a valid email address, password, and role selection, THE Platform SHALL create an account in Amazon Cognito and store the user profile in DynamoDB.
3. WHEN a user submits a registration form with an email address already associated with an existing account, THE Platform SHALL return a descriptive error message without creating a duplicate account.
4. WHEN a user submits a login request with valid credentials, THE Platform SHALL issue a Cognito JWT token and grant access to role-appropriate features within 3 seconds.
5. WHEN a user submits a login request with invalid credentials, THE Platform SHALL return an authentication error message and deny access.
6. WHEN a Mother registers, THE Platform SHALL prompt the Mother to select a preferred language (English, French, or Pidgin English) and store the preference in DynamoDB.
7. WHEN a Cognito JWT token expires, THE Platform SHALL prompt the user to re-authenticate before allowing further access to protected resources.
8. IF a user attempts to access a resource outside their role's permissions, THEN THE Platform SHALL return an authorisation error and redirect the user to their role-appropriate home screen.
9. THE Platform SHALL enforce a minimum password length of 8 characters and require at least one uppercase letter, one lowercase letter, and one number during registration.

---

### Requirement 2: AI Chat Coach

**User Story:** As a Mother, I want to chat with an AI coach at any time of day, so that I can receive immediate, empathetic mental health support without waiting for a human counselor.

#### Acceptance Criteria

1. THE AI_Coach SHALL be available 24 hours a day, 7 days a week via both the web application and the WhatsApp_Bot.
2. WHEN a Mother sends a message, THE AI_Coach SHALL generate a response using Amazon Nova Pro via Amazon Bedrock, augmented by the RAG_System, and return the response within 10 seconds under normal load.
3. THE RAG_System SHALL retrieve relevant content from the Pinecone vector index and Amazon S3 document store to ground AI_Coach responses in curated maternal mental health knowledge.
4. WHEN the RAG_System returns no relevant documents for a query, THE AI_Coach SHALL generate a response based on Nova Pro's general knowledge and indicate to the Mother that the response is general guidance.
5. THE AI_Coach SHALL maintain conversation context across all messages within a single session so that responses are coherent and contextually relevant.
6. THE Platform SHALL store all AI_Coach conversation history in DynamoDB, associated with the Mother's account, and make it accessible to the Mother via the conversation history view.
7. WHEN a Mother requests to view past conversations, THE Platform SHALL retrieve and display the conversation history from DynamoDB within 5 seconds.
8. THE AI_Coach SHALL respond in the Mother's stored preferred language (English, French, or Pidgin English) for every message in a session.

---

### Requirement 3: Multilingual Support

**User Story:** As a Mother who speaks French or Pidgin English, I want to interact with the Platform in my preferred language, so that I can access support without a language barrier.

#### Acceptance Criteria

1. THE Platform SHALL support English, French, and Pidgin English across all Mother-facing interfaces and AI_Coach interactions.
2. WHEN a Mother's preferred language is French, THE Translator SHALL translate Mother messages from French to English before passing them to the AI_Coach, and translate AI_Coach responses from English to French before displaying them to the Mother.
3. WHEN a Mother's preferred language is Pidgin English, THE AI_Coach SHALL process and respond in Pidgin English natively via Nova Pro without invoking the Translator.
4. WHEN a Mother's preferred language is English, THE Platform SHALL pass messages directly to the AI_Coach without translation.
5. WHEN a Mother changes her preferred language in account settings, THE Platform SHALL update the stored preference in DynamoDB and apply the new language to all subsequent interactions within the same session.
6. THE Platform SHALL display all static UI labels, error messages, and system notifications in the Mother's preferred language.

---

### Requirement 4: Voice-to-Text Input

**User Story:** As a Mother who finds typing difficult or prefers speaking, I want to use voice input to send messages to the AI coach, so that I can access support more easily.

#### Acceptance Criteria

1. WHERE Voice_Input is enabled, THE Platform SHALL provide a voice recording control in the chat interface on the web application.
2. WHEN a Mother activates the voice recording control and speaks, THE Platform SHALL capture the audio and submit it to AWS Polly for transcription.
3. WHEN AWS Polly returns a transcription, THE Platform SHALL populate the chat input field with the transcribed text and allow the Mother to review and edit it before sending.
4. IF the AWS Polly transcription service returns an error, THEN THE Platform SHALL display a descriptive error message and allow the Mother to type her message manually.
5. THE Platform SHALL limit voice recordings to a maximum duration of 2 minutes per message to remain within AWS Polly free-tier usage limits.

---

### Requirement 5: Crisis Detection and Escalation

**User Story:** As a platform operator, I want the system to automatically detect when a Mother is in crisis and immediately alert a counselor, so that no Mother in danger is left without human support.

#### Acceptance Criteria

1. WHEN the AI_Coach processes a Mother's message, THE Crisis_Detector SHALL evaluate the message for crisis signals including suicidal ideation, self-harm language, expressions of harming the baby, and severe distress keywords.
2. WHEN the Crisis_Detector identifies a crisis signal, THE Crisis_Escalation_Flow SHALL trigger immediately, before the AI_Coach response is returned to the Mother.
3. WHEN the Crisis_Escalation_Flow is triggered, THE Platform SHALL send an SMS notification to the On_Call_Counselor via Amazon SNS within 60 seconds of crisis detection.
4. WHEN the Crisis_Escalation_Flow is triggered, THE Platform SHALL send an email notification to the On_Call_Counselor via Amazon SES within 60 seconds of crisis detection, including the Mother's name, a summary of the triggering message, and a link to the Counselor_Dashboard.
5. WHEN the Crisis_Escalation_Flow is triggered, THE AI_Coach SHALL display emergency hotline contact information and a message encouraging the Mother to seek immediate help within the chat interface.
6. THE Crisis_Escalation_Flow SHALL operate identically on both the web application and the WhatsApp_Bot channels.
7. THE Platform SHALL log every crisis event in DynamoDB with a timestamp, the triggering message content, the Mother's identifier, and the notification delivery status.
8. IF the SNS or SES notification delivery fails, THEN THE Platform SHALL log the failure in DynamoDB and retry delivery up to 3 times with exponential backoff.

---

### Requirement 6: Smart Referrals

**User Story:** As a Mother, I want the AI coach to recognise when my needs go beyond what it can provide and suggest booking a counselor, so that I receive the right level of care at the right time.

#### Acceptance Criteria

1. WHEN the AI_Coach determines that a Mother's concerns require professional human support — based on repeated distress signals, complexity of issues, or explicit Mother request — THE Smart_Referral SHALL present a counselor booking recommendation within the chat response.
2. WHEN a Smart_Referral is presented, THE Platform SHALL include a direct link or button to initiate the Booking_System flow.
3. WHEN a Mother accepts a Smart_Referral, THE Platform SHALL navigate the Mother to the Booking_System without requiring her to re-authenticate.
4. THE Smart_Referral SHALL operate on both the web application and the WhatsApp_Bot channels.
5. WHEN a Smart_Referral is triggered, THE Platform SHALL log the event in DynamoDB with the Mother's identifier, timestamp, and the AI_Coach's reasoning summary.

---

### Requirement 7: Counselor Booking System

**User Story:** As a Mother, I want to book a session with a counselor at a time that suits me, so that I can access professional support when I need it.

#### Acceptance Criteria

1. THE Booking_System SHALL allow Counselors to create, update, and delete available Slots via the Counselor_Dashboard, with Slot data stored in DynamoDB.
2. WHEN a Mother opens the booking interface, THE Booking_System SHALL display all available Slots for all active Counselors, retrieved from DynamoDB within 3 seconds.
3. WHEN a Mother selects a Slot and confirms a booking, THE Booking_System SHALL mark the Slot as reserved in DynamoDB and create a Session record associated with the Mother and Counselor.
4. WHEN a booking is confirmed, THE Platform SHALL send a confirmation email to the Mother via Amazon SES within 2 minutes, including the Session date, time, Counselor name, and any joining instructions.
5. WHEN a booking is confirmed, THE Platform SHALL send a notification email to the Counselor via Amazon SES within 2 minutes, including the Mother's name and Session details.
6. WHEN a Mother attempts to book a Slot that has already been reserved by another Mother, THE Booking_System SHALL return an availability error and display the next available Slots.
7. WHEN a Mother cancels a confirmed Session at least 24 hours before the scheduled time, THE Booking_System SHALL release the Slot back to available status in DynamoDB and send cancellation confirmation emails to both the Mother and Counselor via SES.
8. THE Booking_System SHALL prevent double-booking of a single Slot by using DynamoDB conditional writes to enforce atomicity.

---

### Requirement 8: Edinburgh Postnatal Depression Scale (EPDS) Screening

**User Story:** As a Mother, I want to complete a periodic EPDS screening, so that I and my care team can monitor my mental health over time with a validated clinical tool.

#### Acceptance Criteria

1. THE Platform SHALL present the EPDS as a standalone 10-question screening tool, separate from the AI_Coach chat interface.
2. WHEN a Mother completes all 10 EPDS questions and submits the screening, THE Platform SHALL calculate the total EPDS score and store the result in DynamoDB with the Mother's identifier and submission timestamp.
3. WHEN a Mother's EPDS score is 10 or above, THE Platform SHALL display a message recommending the Mother speak with a Counselor and present a direct link to the Booking_System.
4. WHEN a Mother's EPDS score is 13 or above, THE Platform SHALL trigger the Crisis_Escalation_Flow in addition to displaying the booking recommendation.
5. THE Platform SHALL display the Mother's EPDS score history as a timeline chart, showing all past scores and submission dates.
6. THE Platform SHALL prompt the Mother to complete a new EPDS screening every 2 weeks via an in-app notification.
7. WHEN a Counselor views a Mother's profile in the Counselor_Dashboard, THE Platform SHALL display the Mother's full EPDS score history.

---

### Requirement 9: Mood Tracking and Daily Check-ins

**User Story:** As a Mother, I want to log my mood daily and see trends over time, so that I can understand my emotional patterns and share them with my care team.

#### Acceptance Criteria

1. THE Mood_Tracker SHALL provide a daily check-in interface allowing the Mother to select a mood rating on a scale of 1 (very low) to 5 (very well) and optionally add a free-text note.
2. WHEN a Mother submits a daily check-in, THE Mood_Tracker SHALL store the mood rating, optional note, Mother identifier, and submission timestamp in DynamoDB.
3. THE Platform SHALL display the Mother's mood history as a line chart showing mood ratings over the past 30 days.
4. WHEN a Mother submits a mood rating of 1 or 2 on three or more consecutive days, THE Platform SHALL display a supportive message and present a link to the Booking_System.
5. THE Platform SHALL send a daily in-app reminder to the Mother to complete her mood check-in if she has not done so by 8:00 PM in her local time zone.
6. WHEN a Counselor views a Mother's profile in the Counselor_Dashboard, THE Platform SHALL display the Mother's mood history for the past 30 days.

---

### Requirement 10: Peer Matching and Community Connections

**User Story:** As a Mother, I want to connect with other mothers who share similar experiences, so that I can find peer support and reduce feelings of isolation.

#### Acceptance Criteria

1. THE Peer_Matcher SHALL match Mothers based on shared attributes including baby age range, language preference, and self-reported challenges, using data stored in DynamoDB.
2. WHEN a Mother opts into peer matching, THE Peer_Matcher SHALL identify up to 3 compatible peer matches and present them to the Mother within 10 seconds.
3. WHEN a Mother accepts a peer connection, THE Platform SHALL create a peer relationship record in DynamoDB and enable a private messaging thread between the two Mothers.
4. THE Platform SHALL allow Mothers to send and receive text messages within peer messaging threads, with messages stored in DynamoDB.
5. WHEN a Mother sends a message in a peer thread, THE Platform SHALL deliver the message to the recipient's interface within 5 seconds.
6. THE Platform SHALL allow a Mother to remove a peer connection at any time, which SHALL immediately disable the messaging thread and remove the connection record from DynamoDB.
7. THE Platform SHALL display a community guidelines notice to all Mothers before they send their first peer message.

---

### Requirement 11: Family Portal

**User Story:** As a partner or family member of a Mother, I want to access resources about maternal mental health, so that I can better support my loved one.

#### Acceptance Criteria

1. THE Family_Portal SHALL be accessible without requiring a registered account, providing a publicly available resource library.
2. THE Family_Portal SHALL display curated articles, guides, and videos about maternal mental health, postpartum depression, and how to support a new mother.
3. THE Platform SHALL allow Admins to add, update, and remove Family_Portal resources via the Admin_Dashboard, with resource metadata stored in DynamoDB and files stored in Amazon S3.
4. WHEN a visitor searches the Family_Portal using a keyword, THE Platform SHALL return matching resources within 3 seconds.
5. THE Family_Portal SHALL display all content in English by default, with French translations available for resources that have been translated by an Admin.

---

### Requirement 12: Counselor Dashboard

**User Story:** As a Counselor, I want a dedicated dashboard to manage my sessions, review referrals, and monitor high-risk Mothers, so that I can deliver effective and timely care.

#### Acceptance Criteria

1. THE Counselor_Dashboard SHALL display a list of all upcoming Sessions assigned to the authenticated Counselor, sorted by date and time ascending.
2. THE Counselor_Dashboard SHALL display all pending Smart_Referrals directed to the Counselor, including the referring Mother's name, referral timestamp, and AI_Coach reasoning summary.
3. WHEN a Counselor marks a Smart_Referral as reviewed, THE Platform SHALL update the referral status in DynamoDB and remove it from the pending referrals list.
4. THE Counselor_Dashboard SHALL display a list of Mothers flagged as high-risk, including their most recent EPDS score, most recent mood rating, and any open crisis events.
5. WHEN a Counselor flags a Mother as high-risk, THE Platform SHALL store the flag in DynamoDB and include the Mother in the high-risk list for all Counselors.
6. THE Counselor_Dashboard SHALL allow the Counselor to view a Mother's full conversation history, EPDS score history, and mood history, subject to the Mother's consent recorded at registration.
7. THE Counselor_Dashboard SHALL allow the Counselor to create, update, and delete their available Slots for the Booking_System.
8. WHEN a Counselor receives a crisis notification, THE Counselor_Dashboard SHALL display the crisis event prominently at the top of the dashboard with the Mother's details and triggering message summary.

---

### Requirement 13: Admin Dashboard

**User Story:** As an Admin, I want a comprehensive dashboard to manage users, configure the platform, and view impact analytics, so that I can ensure the platform operates effectively and demonstrate value to funders.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL display aggregate platform metrics including total registered Mothers, total Sessions completed, total crisis interventions, and average EPDS score improvement over selectable time periods.
2. THE Admin_Dashboard SHALL display a user management interface listing all registered users (Mothers, Counselors, Admins) with the ability to activate, deactivate, or change the role of any user.
3. WHEN an Admin deactivates a user account, THE Platform SHALL revoke the user's Cognito access and prevent login within 60 seconds of the deactivation action.
4. THE Admin_Dashboard SHALL allow Admins to manage Family_Portal resources including adding, editing, and removing articles, guides, and videos.
5. THE Admin_Dashboard SHALL display a counselor performance summary showing each Counselor's number of completed Sessions, average session rating (where collected), and number of crisis cases handled.
6. THE Admin_Dashboard SHALL display mood improvement analytics showing the distribution of mood ratings across all Mothers over selectable time periods.
7. THE Admin_Dashboard SHALL allow Admins to configure the list of crisis keywords used by the Crisis_Detector, stored in DynamoDB.
8. THE Admin_Dashboard SHALL allow Admins to designate the On_Call_Counselor for crisis notifications, with the designation stored in DynamoDB.
9. THE Platform SHALL generate a monthly impact report exportable as a CSV file, containing aggregated metrics suitable for funder reporting, including users served, mood improvements, crisis interventions, and Sessions completed.

---

### Requirement 14: WhatsApp Bot

**User Story:** As a Mother who primarily uses WhatsApp, I want to access AI mental health support through WhatsApp, so that I can get help through the channel I already use daily.

#### Acceptance Criteria

1. THE WhatsApp_Bot SHALL connect to the Platform's AI backend via the WhatsApp Business API, sharing the same AI_Coach, Crisis_Detector, and Smart_Referral logic as the web application.
2. WHEN a Mother sends a message to the WhatsApp_Bot, THE AI_Coach SHALL process the message and return a response within 10 seconds under normal load.
3. THE WhatsApp_Bot SHALL support the same three languages (English, French, Pidgin English) as the web application, applying the same Translator and AI_Coach language logic.
4. WHEN the Crisis_Detector identifies a crisis signal in a WhatsApp_Bot message, THE Crisis_Escalation_Flow SHALL trigger identically to the web application flow, including SNS and SES notifications and emergency hotline display.
5. WHEN the AI_Coach triggers a Smart_Referral in a WhatsApp_Bot conversation, THE WhatsApp_Bot SHALL send the Mother a booking link via WhatsApp message.
6. THE WhatsApp_Bot SHALL store all conversation history in DynamoDB associated with the Mother's account, accessible via the web application's conversation history view.
7. WHEN a Mother sends a voice message via WhatsApp, THE Platform SHALL transcribe the audio using AWS Polly and process the transcription as a text message through the AI_Coach.
8. THE WhatsApp_Bot SHALL allow a Mother to register a new account or link an existing account by following a guided onboarding flow within WhatsApp.

---

### Requirement 15: Analytics and Impact Metrics

**User Story:** As an Admin or platform funder, I want to view detailed analytics on platform usage and outcomes, so that I can measure impact and make data-driven decisions.

#### Acceptance Criteria

1. THE Platform SHALL track and store the following events in DynamoDB: user registrations, AI_Coach sessions initiated, messages sent, EPDS screenings completed, mood check-ins submitted, crisis events triggered, Sessions booked, Sessions completed, and Smart_Referrals generated.
2. THE Admin_Dashboard SHALL display a real-time analytics view showing daily active users, messages sent per day, and crisis events per day for the current calendar month.
3. THE Platform SHALL calculate and display the average EPDS score at first screening versus most recent screening for all Mothers who have completed two or more screenings.
4. THE Platform SHALL calculate and display the percentage of Mothers whose mood rating improved (average of last 7 days versus average of first 7 days of platform use) for all Mothers active for more than 14 days.
5. WHEN an Admin exports the monthly impact report, THE Platform SHALL generate a CSV file containing all tracked metrics for the selected month and make it available for download within 30 seconds.
6. THE Platform SHALL retain all analytics event data in DynamoDB for a minimum of 24 months to support longitudinal impact reporting.

---

### Requirement 16: Data Privacy and Security

**User Story:** As a Mother, I want my personal and health data to be stored and handled securely, so that I can trust the platform with sensitive information.

#### Acceptance Criteria

1. THE Platform SHALL encrypt all data at rest in DynamoDB and Amazon S3 using AWS-managed encryption keys.
2. THE Platform SHALL enforce HTTPS for all data in transit between clients (web and WhatsApp) and the Platform's serverless function endpoints.
3. THE Platform SHALL require explicit consent from a Mother at registration for the storage and use of her conversation history, mood data, and EPDS results, with consent recorded in DynamoDB.
4. WHEN a Mother withdraws consent or requests account deletion, THE Platform SHALL delete or anonymise all personally identifiable data associated with the Mother's account in DynamoDB and S3 within 30 days.
5. THE Platform SHALL restrict Counselor access to a Mother's personal data to only those Mothers who have an active or past Session with that Counselor, or who have been flagged as high-risk.
6. THE Platform SHALL log all access to Mother health records (conversation history, EPDS scores, mood data) in DynamoDB with the accessor's identifier and timestamp.
7. THE Platform SHALL implement AWS Cognito-based role-based access control so that Mothers, Counselors, and Admins can only access API endpoints authorised for their role.

---

### Requirement 17: System Performance and Cost Efficiency

**User Story:** As a platform operator, I want the system to remain responsive and cost-efficient as usage grows, so that the platform remains financially sustainable.

#### Acceptance Criteria

1. THE Platform SHALL handle up to 100 concurrent users with API response times under 3 seconds for non-AI endpoints, using Netlify Functions auto-scaling.
2. THE Platform SHALL handle up to 1,000 registered users with a total monthly infrastructure cost not exceeding $300, achieved through Netlify free tier, DynamoDB on-demand capacity, and Pinecone free tier.
3. WHEN Netlify Functions cold start latency exceeds 2 seconds for a critical endpoint, THE Platform SHALL use background functions or edge functions for that endpoint to reduce latency.
4. THE Platform SHALL use DynamoDB on-demand capacity mode to automatically scale read and write throughput without manual intervention.
5. THE Platform SHALL implement rate limiting at the application level within Netlify Functions to protect against traffic spikes and unexpected cost overruns.
