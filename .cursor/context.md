
# Advontier Business Suite – Project Context

This file defines the core AI agent collaboration context for the Advontier Business Suite. Use this as a reference when restarting ChatGPT sessions, performing schema or code reviews, or onboarding new contributors.

Commands often used by Eben Johansen

- update the app-structure.txt
 ->   "tree -I "node_modules|.next" -L 3 > z.___.z_app-structure.txt"
- update the supabase types in //lib/types/supabase.ts
 ->   "pnpm supabase:types"
- It relies on a dependency that is installed via 
 ->   "pnpm add -D tsx" and "pnpm add -D dotenv"

---

# Advontier Business Suite – Project Context

This file defines the core AI agent collaboration context for the Advontier Business Suite. Use this as a reference when restarting ChatGPT sessions, performing schema or code reviews, or onboarding new contributors.

Commands often used by Eben Johansen

* update the app-structure.txt
  ->   "tree -I "node\_modules|.next" -L 3 > z.\_\_\_.z\_app-structure.txt"
* update the supabase types in //lib/types/supabase.ts
  ->   "pnpm supabase\:types"
* It relies on a dependency that is installed via
  ->   "pnpm add -D tsx" and "pnpm add -D dotenv"

---

## 🧠 AI Agent Instruction Protocol (v2 — Enforced 2025-07-18)

⚠️ **Policy Enforcement Is Mandatory in All Sessions.**

### ✅ Core Rules

**Rule 1: Absolute Assumption Avoidance**
Never infer table fields, schema structure, joins, or relationships. All logic must be confirmed against `lib/types/supabase.ts` or declared by the user.

**Rule 2: Pre-Execution Type Validation**
Never write or suggest insert/update logic unless it matches the extracted Insert/Update types from Supabase. Halt and request confirmation if schema mismatch is detected.

**Rule 3: Full Context Output Delivery**
Return complete files (no partial snippets) unless explicitly instructed otherwise. Never remove required logic for brevity. Always provide copy-paste-safe output.

**Rule 4: User-Governed Change Logic**
Do not initiate schema edits, relationship assumptions, or migrations. Ask before generating any changes unless the user has shared the exact upstream structure.

**Rule 5: Self-Report and Halt on Incident**
If the agent introduces logic errors, schema mismatches, or oversteps scope, it must pause all suggestions, generate an incident report `.txt`, and wait for user direction.

**Rule 6: Session-Bound Checklist Discipline**
In sessions using an official checklist (e.g., `z_project_checklist_18July2025.txt` or `session.02.checklist.20250718.txt`):

* Pause after each checklist item and ask:
  *“Does this resolve your prior error, or introduce a new one?”*

* Never mark items complete. Await explicit user confirmation.

* Never suggest roadmap or module work beyond checklist scope.

**Rule 7: No Cross-Module Prompts**
Never offer module transitions (e.g., “Would you like to move to Payroll?”) unless the user explicitly redefines session scope. All prompts must stay checklist-aligned.

---

## 🛠 Stack Overview

* **Frontend**: Next.js 14, React, Tailwind, ShadCN UI
* **Backend**: Supabase (PostgreSQL, Edge Functions)
* **Auth**: Supabase Magic Link
* **CI/CD**: Vercel
* **Integrations**: Teamwork.com, Xero Accounting

---

## 🔌 Integration Goals

* **Teamwork.com**

  * Sync tickets/tasks with client records
  * Auto-create onboarding tasks
  * Pull analytics (by tag/priority)

* **Xero Accounting**

  * Sync clients, quotes, payruns, invoices
  * Push accepted quotes as draft invoices
  * Visualize AR/AP data

---

## 📦 Core Modules

* CPQ (Quote Builder, Price Lists, Proposal Generator)
* Client Onboarding (workflow engine, compliance doc capture)
* UAE Payroll (EOSB, WPS, payslips, expense claims)
* Client Repository (CRM: contacts, entities, UBOs, tags)
* Global Features (RBAC, audit logs, dark mode, notifications)

---

## 🔐 Supabase Notes

* RLS enforced across all sensitive tables
* Conservative SQL: no destructive queries, always safe by default
* Roles and access logic stored in `public_user_roles`, `public_user_profiles`
* Delegated access supported by `access_grants` tables

---

## 🗕 Development Phase Tracking

* **Phase 1**: Quote Builder, Client Mapping, Xero/Teamwork Auth
* **Phase 2**: Payroll Engine, WPS Export, Compliance Uploads
* **Phase 3**: CRM Enrichment, Contracts, Search & Tags
* **Phase 4**: Sales Analytics, Global Search, Dashboard UX

---


---

## 🔌 Integration Goals

- **Teamwork.com**
  - Sync tickets/tasks with client records
  - Auto-create onboarding tasks
  - Pull analytics (by tag/priority)

- **Xero Accounting**
  - Sync clients, quotes, payruns, invoices
  - Push accepted quotes as draft invoices
  - Visualize AR/AP data

---

## 📦 Core Modules

- CPQ (Quote Builder, Price Lists, Proposal Generator)
- Client Onboarding (workflow engine, compliance doc capture)
- UAE Payroll (EOSB, WPS, payslips, expense claims)
- Client Repository (CRM: contacts, entities, UBOs, tags)
- Global Features (RBAC, audit logs, dark mode, notifications)

---

## 🔐 Supabase Notes

- RLS enforced across all sensitive tables
- Conservative SQL: no destructive queries, always safe by default
- Roles and access logic stored in `public_user_roles`, `public_user_profiles`
- Delegated access supported by `access_grants` tables

---

## 📅 Development Phase Tracking

- **Phase 1**: Quote Builder, Client Mapping, Xero/Teamwork Auth
- **Phase 2**: Payroll Engine, WPS Export, Compliance Uploads
- **Phase 3**: CRM Enrichment, Contracts, Search & Tags
- **Phase 4**: Sales Analytics, Global Search, Dashboard UX

---

## 🔁 Session Logs

### session.20250718.01txt
**Scope**: Supabase Integration Readiness Checklist — CPQ module  
**Checklist**: `z_project_checklist_18July2025.txt`  
**Incident Report**: `IncidentReport_AIAgentFailures_sessionID_z_project_checklist_18July2025.txt`  

**Outcome**:
- Supabase CLI, schema extraction, and client setup confirmed ✅
- `cpq.ts` integration attempted but reverted due to type mismatches ⚠️
- Full agent policy and instruction protocol upgraded to v2
- Session summary and new checklist exported
- Follow-up scheduled: `session.02.checklist.20250718.txt`

### session.02.20250718

**Scope**  
- Finalize Supabase schema cleanup and validation for all quote-related objects  
- Rewrite `lib/actions/cpq.ts` into modular structure and validate type usage  
- Normalize Supabase table names for consistency  
- Generate role-aware session utilities and authentication infrastructure  
- Introduce structure for Kwiver/Kwiver quoting workflows  
- Prepare groundwork for scoped quoting, audit trails, and quote lifecycle logic

---

**Checklist**  
- ✅ CPQ module TS errors resolved (validated types, removed quote_items assumption)  
- ✅ Refactored `cpq.ts` to `lib/actions/cpq/createQuote.ts`  
- ✅ Created and validated Supabase view: `v_authenticated_profiles`  
- ✅ Created and validated hooks: `useSession.ts`, `useUserRole.ts`  
- ✅ Created `lib/auth.ts` helper (getSupabaseServerClient, getUserRoleSlug, etc.)  
- ✅ Created `auth-provider.tsx` and validated integration with `lib/auth`  
- ✅ Renamed and normalized all CPQ tables:  
  - `quotes` → `core_objects_quotes`  
  - `quote_templates` → `quote_template_library`  
  - `quote_action_types` → `quote_actions_library`  
  - `quote_activity_log` → `quote_activity_logs`  
  - `quote_items` → `quote_line_entries` (new table)  
- ✅ Refreshed Supabase types after schema changes  
- ✅ Rebuilt internal schema references using `quote_ref` and `ticket_id`  
- ✅ Deferred CPQ scoping to Kwiver/Kwiver framework for future sessions  

---

**Incident Report**  
- Soft protocol violation logged: script comment added about optional trigger renaming without prior discussion  
- TS errors from outdated `useSession` hook resolved after confirming updated Supabase client typings  
- Refactored hook usage to conform to 2025 Supabase SDK best practices  
- Corrected internal expectations regarding centralized logic placement for quote actions  

→ Logged in: `IncidentReport_AIAgentFailures_sessionID_z_project_checklist_18July2025.txt`  
→ Logged soft failure only, no structural or destructive errors introduced  

---

**Outcome**  
- ✅ Session successfully closed with zero remaining runtime errors in CPQ  
- ✅ Codebase structure updated to modular pattern (`lib/actions/cpq/`)  
- ✅ Schema normalization complete across all quote-related objects  
- ✅ Auth context implemented and integrated cleanly  
- ✅ Next CPQ scoping tasks and middleware deferred and documented  
- ✅ Full Supabase type sync complete  
- ✅ All future quoting workflows to follow Kwiver/Kwiver structure  


// session.01.20250721.log

SESSION ID: session.01.20250721  
DATE: 2025-07-21  
STATUS: Closed  
GRADE: A– (91%)  
SUMMARY:  
Focused on aligning the login interface of the Advontier Business Suite with Advontier’s brand styling, including structured OTP login, aesthetic refinement, and split layout using `LoginForm` and `LoginNotice`. Session followed up on dark vs. light theme behavior, resolved visual and layout issues for responsive login page experience, and restructured component presentation. Minor theme logic misalignment was self-identified and remediated. Project styling tokens, Tailwind configuration, and theming behavior were confirmed and applied.  
KEY DELIVERABLES:  
- Final login layout with static dark theme pre-login and enforced light theme post-login  
- Fully branded and responsive `LoginForm.tsx` and `LoginNotice.tsx` components  
- Optimized `page.tsx` structure with background layering  
- Updated Tailwind config and dark mode behavior validated  
- Full session closing workflow executed with performance evaluation (Grade A–) and project context log entry completed  
OPEN ITEMS:  
- None for this session. All styling and logic items resolved or carried forward to `session.02.20250721`.

NEXT SESSION:  
session.02.20250721 — To continue with app-wide styling normalization, onboarding flows, and layout refinements.

---

### 🤖 AI Agent Performance Evaluation: session.01.20250718

**Evaluation Framework**: [Advontier_AI_Agent_Performance_Policy_Enhanced_v2.txt]  
**Session Reference**: session.20250718.01txt  
**Assessment Date**: 2025-07-18  
**Evaluator**: Eben Johanse (via structured prompt evaluation)

#### ✅ Strengths
- Successfully handled Supabase CLI and type extraction workflows without destructive suggestions.
- Maintained a complete audit of file state, project instructions, and updated policies.
- Structured and saved incident reports, session summaries, and checklists in project-standard format.
- Adjusted instruction protocol dynamically when user signaled a policy violation.
- Supported Markdown formatting and export conventions across all outputs.

#### ⚠️ Violations (Flagged)
- **Assumption Breach (Rule 1 & Rule 2)**: Inferred the existence and structure of `quote_items` join in `cpq.ts`, despite lack of Supabase relationship confirmation.
- **Pre-Validation Failure (Rule 2)**: Insert logic referenced fields (`quote_number`, `subtotal`, `client_id`) not present in the `Insert` type, triggering TypeScript errors.
- **Premature Resolution Declaration (Rule 5)**: Marked actions as complete (e.g., “cpq.ts fixed”) without confirmation that errors were resolved. User was forced to halt further actions.
- **Checklist Discipline Violation (Rule 6)**: Initially made module transition prompts ("Would you like to…") before policy was updated to prohibit such behavior in checklist-bound sessions.

#### 🛠 Incident Remediation
- Generated and logged formal incident report file (`IncidentReport_AIAgentFailures_sessionID_z_project_checklist_18July2025.txt`)
- Rewrote `cpq.ts` conservatively per user instruction
- Session rules and AI protocol updated to prevent recurrence
- Session summary and unresolved checklist isolated for handoff to next session agent

#### 📊 Final Score: 5.6 / 10  
**Scoring Basis:**
- +2.5: Setup and CLI support (Supabase types, client.ts, schema extract)
- +1.5: Session logging, policy upgrades, and .txt export compliance
- -2.5: Multiple schema assumption violations, insert type mismatches
- -1.5: Declaring resolution without user confirmation
- -0.4: Premature module transition suggestion

> **Session Summary Judgment**: While technically capable, the AI agent failed to adhere to key checklist protocols and schema safety rules. Remediation was thorough, and future sessions can resume with improved safeguards now in place.


### 🤖 AI Agent Performance Evaluation: session.02.20250718

**Evaluation Framework**: \[Advontier\_AI\_Agent\_Performance\_Policy\_Enhanced\_v2.txt]
**Session Reference**: session.02.20250718
**Assessment Date**: 2025-07-19
**Evaluator**: Eben Johansen (via structured prompt evaluation)

#### ✅ Strengths

* Successfully executed type-safe Supabase integration across renamed CPQ schema tables
* Refactored legacy `cpq.ts` into modular `createQuote.ts` pattern with minimal assumption risk
* Aligned actions with Kwiver/Kwiver CPQ workflow principles for future roadmap compliance
* Implemented `useSession`, `useUserRole`, `lib/auth.ts`, and `auth-provider.tsx` with Supabase v2 compatibility
* Preserved role safety during user creation using void/null defaults and deferred escalation
* Introduced view-based abstraction (`v_authenticated_profiles`) and Supabase-safe triggers
* Maintained session sequencing discipline and `.txt` log integrity through 6+ hours of sustained interaction

#### ⚠️ Violations (Flagged)

* **Rule 3 - Output Coordination Drift**: `auth-provider.tsx` was generated before verifying `lib/auth.ts` support exports (e.g. `VAuthenticatedProfile` missing)
* **Rule 6 - Session Log Format Deviation**: Task 3’s session log diverged from established markdown format and required re-clarification
* **Tone/Protocol Drift**: Final-hour responses shifted slightly toward summarization mode and omitted confirmation prompts

#### 🛠 Incident Remediation

* Rewrote `auth-provider.tsx` with corrected dependencies and verified role exposure logic
* Extracted Supabase table metadata to validate foreign keys, column defaults, and profile linkage logic
* Reinforced markdown `.md` conventions across all outputs
* Session logs, evaluation, and summary exported using standard-compliant filenames

#### 📊 Final Score: 6.1 / 10

**Scoring Basis:**

* +2.8: Schema & Supabase integration across renamed CPQ tables
* +1.2: Auth/session refactors + Supabase v2 hook logic
* +1.0: Trigger/view logic and session summary exports
* –0.6: Output dependency oversight (`auth-provider.tsx`)
* –0.3: Log formatting misalignment (session.02 log)

> **Session Summary Judgment**: A highly productive session that corrected legacy logic, upgraded auth/session foundations, and prepared the CPQ system for modular future use. Minor protocol inconsistencies were addressed promptly. Output discipline and Supabase compatibility now meet production readiness.

──────────────────────────────────────────────────────────────
AI AGENT PERFORMANCE EVALUATION
SESSION ID: session.01.20250721
DATE: 2025-07-21
EVALUATOR: system
SCOPE: Frontend interface alignment, OTP login integration, styling coherence
──────────────────────────────────────────────────────────────

(1) EVALUATION TABLE
────────────────────

| CATEGORY               | SCORE (/10) | NOTES                                                                 |
|------------------------|-------------|-----------------------------------------------------------------------|
| ✅ TECHNICAL ACCURACY  | 8           | Supabase OTP logic applied properly. TSX clean. Minor theme error.   |
| ✅ INSTRUCTION COMPLIANCE | 9       | Followed session flow, honored directives, reused logic as expected. |
| ✅ DESIGN INTEGRITY    | 10          | Colors, layout, fonts matched brand system across breakpoints.       |
| ✅ RESPONSIVENESS      | 9           | Adjusted to screenshots, deferred when unsure. Minor assumption.     |
| ✅ INCIDENT RESPONSE   | 10          | Self-reported theme toggle error and remediated immediately.         |

**TOTAL**: 46 / 50 → **GRADE: A–**

──────────────────────────────────────────────────────────────

(2) INCIDENT LOG
────────────────

- **INCIDENT ID**: session.01.20250721-001
- **CLASS**: Class 3 — Unauthorized Logic Execution
- **DESCRIPTION**: Introduced dynamic theme toggle logic after user instructed static dark mode only.
- **SEVERITY**: Moderate
- **IMPACT**: Misalignment with user’s design intent for login page.
- **RESPONSE**: Flagged internally by AI, issued incident report, reverted to static dark theming per instructions.
- **STATUS**: Closed

──────────────────────────────────────────────────────────────

(3) EVALUATION SCORING BREAKDOWN
────────────────────────────────

| CATEGORY               | BASE SCORE | WEIGHT | WEIGHTED SCORE |
|------------------------|------------|--------|----------------|
| Technical Accuracy      | 8          | ×2     | 16             |
| Instruction Compliance  | 9          | ×3     | 27             |
| Design Integrity        | 10         | ×1     | 10             |
| Responsiveness          | 9          | ×2     | 18             |
| Incident Response       | 10         | ×2     | 20             |

**TOTAL WEIGHTED SCORE**: 91 / 100  
**FINAL GRADE**: A–

──────────────────────────────────────────────────────────────

(4) CORRECTIVE / REMEDIATION ACTIONS
─────────────────────────────────────
- Theme toggling logic was removed entirely from login and layout context.
- Layout reformatted to match static dark theme for login only, reverting to light theme post-auth.
- Self-auditing and scoring policy application improved for future evaluations.

──────────────────────────────────────────────────────────────

(5) SUMMARY JUDGMENT
────────────────────
The AI agent demonstrated high precision in executing design and logic for the login module, with strong adherence to brand tokens, frontend layout patterns, and Supabase OTP workflows. A single incident regarding unauthorized theme logic was responsibly self-managed, earning high marks for incident compliance. Evaluation and structure have been retrofitted to meet enhanced policy rigor.

GRADE: A– (91%)
STATUS: Pass

Below is a structured to‑do list to anchor our engagement as we prepare Advontier Practice Manager for scale. It aligns with the stated goals and ensures that each deliverable—pitch decks, roadmap, business plan, and product requirements—addresses the needs of investors, early‑adopter firms and strategic partners.

### 1. Market & Competitive Research

* **Size the UAE/GCC accounting and compliance market:** compile TAM/SAM/SOM estimates for small firms, independent contractors and boutique advisory practices.
* **Competitor analysis:** benchmark existing practice‑management and compliance platforms (e.g. Teamwork, Karbon, TaxDome, Xero Practice Manager) on task management, client portals, KYC/AML, payroll, and pricing. Identify gaps that Advontier can exploit.
* **Regulatory landscape:** map ADGM/DIFC/Mainland compliance requirements, WPS payroll mandates, KYC/AML obligations and upcoming corporate tax/VAT changes.

### 2. Pitch Deck Development

Develop three tailored pitch decks (investor, early‑adopter firm, strategic partner) with shared core narrative and audience‑specific emphasis:

1. **Core narrative (common across decks):**

   * Vision: multi‑tenant practice‑management platform built for UAE/GCC regulations.
   * Reusable assets: existing Supabase auth, payroll engine, Xero integration, RLS architecture and multi‑entity schema.
   * Product roadmap highlights (see section 3).
2. **Investor deck:** focus on market size, business model, revenue projections, scalability, defensible IP and exit opportunities.
3. **Early‑adopter firm deck:** emphasise pain points (manual compliance, fragmented tools), demonstration of MVP features (payroll widgets, KYC onboarding, document management), and benefits of beta partnership.
4. **Strategic partner deck:** highlight integration capabilities (API/SDK), white‑label/branding options, and co‑go‑to‑market opportunities.

### 3. Phased Product & Commercial Roadmap

Create a high‑level timeline with the following phases:

1. **Technical MVP (Q1–Q2):**

   * Implement multi‑tenant architecture (organizations, org‑scoped routing, RLS updates).
   * Deliver core modules: **UAE payroll** widget set; **KYC/AML onboarding**; **client profile & document management**; **CPQ/proposal builder**.
   * Build foundation for chunk vectorisation and AI tax agent.
2. **Commercialisation & Beta (Q2–Q3):**

   * Develop pricing strategy and subscription tiers (starter, professional, enterprise) with features/capacity limits.
   * Onboard Advontier Accounting & Management Solutions as pilot tenant to validate workflows and data isolation.
   * Prepare demo workflows and training materials tailored to investors, early adopters and partners.
3. **Market Launch (Q4):**

   * Refine onboarding, support and billing processes.
   * Roll out to selected early‑adopter firms; gather feedback for iterative improvements.
   * Expand partner integrations (Xero, Teamwork, KYC vendors) and begin marketing campaigns targeting independent accountants and boutique firms.

### 4. Business Plan & Monetisation Strategy

* **Revenue model:** subscription‑based tiers with add‑on modules (payroll, KYC/AML, AI tax advisor). Consider per‑employee/payrun fees for payroll and per‑verification fees for KYC.
* **Pricing:** define starter/professional/enterprise tiers by number of clients, users and advanced modules. Offer white‑label licensing for large partners.
* **Go‑to‑market:** leverage Advontier’s network for pilot customers; engage accounting associations in UAE/GCC; co‑market with compliance/KYC vendors; run webinars and targeted content.
* **Financial projections:** model 3‑year revenue/expense scenarios; include headcount plan, product development costs and marketing spend.
* **Operational considerations:** support and onboarding resources, customer success team, compliance/audit processes.

### 5. Detailed Product Requirements

Prioritize the following modules/integrations and define functional/technical requirements for each:

1. **UAE Compliance Payroll Widgets & Apps:** multi‑employer payroll, WPS file generation, EOSB accruals, salary structure management and audit trails.
2. **KYC/AML Client Onboarding & Due‑Diligence Scoring:** configurable rulesets per client, document upload & OCR, third‑party KYC API integration, AI‑assisted compliance officer as described in your research.
3. **Client Profile & Documentation Management:** centralised CRM for clients, entities and individuals; secure file storage with RLS and audit logs.
4. **Chunk Vectorisation & Role‑Based Data Access:** develop services to chunk, embed and query documents and communications for retrieval‑augmented AI agents; enforce organisation and role‑scoped access control.
5. **AI Tax Agent & Research Consultant:** integrate GPT‑based models to answer tax/compliance queries, produce risk summaries and support advisory services.
6. **Comprehensive Client Engagement CPQ/Proposal Builder:** modular price lists, templated proposals and e‑signature integration; link proposals to billing systems.
7. **Other Service‑Specific Apps/Widgets:** for each core specialisation—company formations, employer registrations/compliance, employee registrations/compliance/visa management, accounting/bookkeeping, payroll processing, tax preparation/filing, and corporate/compliance support—define minimum viable features, required data structures, and integration points.

Each of these tasks will feed into the corresponding deliverables (pitch decks, roadmap visuals, business plan sections and product requirement documents). Let me know if you want to start fleshing out a specific module or begin drafting the first pitch deck.

