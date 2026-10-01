# BuildWise AI — Customer Experience Specification v1

Status: CANONICAL PRODUCT REQUIREMENT
Scope: BuildWise AI / REOS / Customer & Portal / Customer-facing experience
Registry relationship: additive to `.agent-control/MASTER-CHECKLIST-v3-850.md`; it does not replace or renumber the master task registry.
Implementation rule: remain inside the existing BuildWise architecture and canonical domains. Do not create a parallel customer application, portal engine, CRM request engine, rating engine, or AI architecture.

## 1. Core customer experience

The customer enters BuildWise, authenticates, and can communicate with the AI in a conversational interface.

The customer should provide only the minimum information necessary. The AI must:
- understand intent from conversation;
- extract structured requirements;
- fill available fields automatically;
- ask only for missing information that is necessary;
- answer in the same conversational workspace;
- propose the next useful action without forcing technical forms.

Primary entry flow:
LOGIN → AI ASSISTANT → INTENT DETECTION → MINIMUM DATA COLLECTION → CUSTOMER PROFILE / REQUIREMENT → MARKET ANALYSIS → MATCHING → FOUR RECOMMENDATIONS → COMPARE → PROJECT → UNIT → VALUATION / ROI → REQUEST VISIT → CALENDAR → VISIT → RATE → ADVISOR / NEGOTIATION / BUY.

Supported customer intents include:
- buy for living;
- buy for investment;
- sell / property request;
- land-owner analysis;
- build;
- participation;
- barter;
- property/plot analysis.

## 2. Customer marketplace and discovery

Customers can:
- view projects in a requested area;
- see project/property photos and permitted media;
- browse units;
- compare units;
- inspect floor plans where permission allows;
- view renders where permission allows;
- request a visit;
- connect with an advisor through the system.

Project/unit presentation is customer-facing and must reuse the canonical project, unit, media, sales and customer-portal architecture.

For location recommendations, BuildWise should rank locations by the relevant price evidence and present four location options, not an uncontrolled long list.

## 3. Customer requirement logic

### Living
Relevant criteria may include:
- area range;
- bedroom count;
- age range;
- price range;
- location range;
- priorities.

### Luxury
The AI must surface the documented trade-off:
- smaller area + better materials/location; OR
- larger area + weaker location;
with comparable total-budget context where data supports it.

### Investment
The AI may compare:
- small unit;
- large unit;
- land;
- land in another area;
- build/participation;
using available capital, current price evidence, costs, ROI, profit, liquidity and risk.

### Land owner
The AI must support analysis of whether the owner's land is better suited to:
- building;
- participation;
- full barter;
- barter for several small apartments;
- sale;
according to the owner's goal, including living, investment or cash.

Land analysis should use the existing canonical land/feasibility/valuation/project/cost paths and should not create a separate land-analysis system.

## 4. Customer-facing valuation and market information

Customer-facing prices are ranges, not internal exact transaction values.

Default customer-facing tolerance:
- target/property/unit price range: ±5% around the supported customer-facing estimate, when the underlying evidence is sufficient.

Customer-facing market analysis may include:
- area price range;
- target unit price range;
- comparable evidence where permitted;
- customer-specific ROI;
- scenario comparison;
- location price tiers.

Internal exact values, negotiation values, margins and sensitive calculations remain protected.

## 5. Customer rating and market intelligence

Ratings are a first-class BuildWise capability.

Customer may rate:
- unit quality;
- price/quality fit for their needs;
- location;
- plan/value where applicable;
- builder quality;
- builder commitment;
- delivery;
- design;
- builder value.

Unit/project/builder ratings shown publicly must be based on verified interactions where possible.

Rating controls:
- one rating per valid interaction, subject to the canonical interaction rules;
- timestamp;
- interaction type;
- auditable source;
- anti-manipulation controls;
- aggregation before public display.

Strategic intent:
Market Data + Verified Human Preference Data → BuildWise Market Intelligence.

The rating layer must remain compatible with the existing AI feedback/learning architecture; it must not create an independent learning loop.

## 6. Visit and calendar flow

Customer can:
1. request purchase/viewing;
2. select an available visit flow;
3. place the request into the canonical calendar/appointment workflow;
4. receive system notifications;
5. attend the visit;
6. rate the visit/unit/builder after a valid interaction.

Advisor connection must be mediated by BuildWise permissions and workflow; private phone numbers are not exposed unless explicitly permitted by the canonical security policy.

## 7. Customer privacy firewall

The customer MUST NOT see:
- owner internal information;
- exact property address;
- private phone numbers;
- exact internal transaction price;
- full internal specifications when restricted;
- facade image or other restricted media;
- sensitive financial numbers;
- other customers' information;
- internal calculations;
- internal negotiations/offers;
- internal margins;
- internal risk assessments;
- internal notes;
- other deals or confidential project information.

Customer-facing location should use only the permitted level, such as street/neighborhood/region or approximate location, according to permission.

Customer-facing media must be permission-aware.

Customer-facing data must be field-level controlled and masked where required.

## 8. Required capability set C01–C40

These are product requirements, not a second task registry:

C01 Customer Authentication
C02 Customer AI Entry
C03 Conversational Requirement Collection
C04 AI Field Fill
C05 Intent Detection
C06 Buyer Profile
C07 Living Purchase Journey
C08 Investment Purchase Journey
C09 Land Owner Journey
C10 Property/Plot Analysis
C11 Location Intelligence
C12 Location Price Tiering
C13 Smart Location Recommendation
C14 Project Marketplace
C15 Unit Marketplace
C16 Project Gallery
C17 Unit Gallery
C18 Floor Plan Viewer
C19 Customer Price Range ±5%
C20 Comparable Evidence Layer
C21 Customer-specific ROI
C22 Scenario Comparison
C23 Unit Comparison
C24 Request Visit
C25 Calendar Integration
C26 Advisor Connection
C27 Visit Feedback
C28 Unit Rating
C29 Builder Rating
C30 Quality/Price Rating
C31 Verified Review System
C32 Anti-manipulation Rating
C33 Public Rating Aggregation
C34 BuildWise Market Score
C35 Customer Notifications
C36 Customer-specific Proposal
C37 Customer Data Privacy
C38 Field-level Customer Permissions
C39 Sensitive Data Masking
C40 Internal Data Firewall

## 9. Existing checklist reconciliation

The current master registry already contains the canonical customer portal/showroom tasks 401–415:
- 401 Customer Portal
- 402 Room
- 403 Showroom
- 404 Project Presentation
- 405 Property Photos
- 406 Interactive Project Walkthrough
- 407 Floor Plan Viewer
- 408 Unit Selector
- 409 Unit Price Comparison
- 410 Customer Request Journey
- 411 Customer AI Assistant
- 412 Customer-specific Proposal
- 413 Customer-specific ROI
- 414 Customer Notifications
- 415 Appointment Workflow

AI field/section capabilities relevant to this specification include 418–432, especially AI Form Fill, AI Field Fill, AI Context Collection, AI Action Logging, AI Routing Intelligence, AI Financial/Sales Intelligence, persistent memory, action execution, explanation, permissions and approval.

No new task numbers are invented by this specification. Any missing capability must be reconciled against the canonical 850-task registry before implementation.

## 10. Architectural non-negotiables

1. This specification is inside the BuildWise build scope.
2. It is stored in the repository and is not an external-only note.
3. Existing canonical implementations must be extended/reconciled before any new subsystem is created.
4. Customer experience must connect to the existing identity, CRM, property, land, project, unit, sales, finance, AI, workflow, calendar, notification, rating and security boundaries.
5. No customer-facing feature may bypass RLS, role permissions, field-level permissions or sensitive-data masking.
6. No exact internal price, address, phone, negotiation or confidential calculation may leak through UI, API, AI response, logs or exports.
7. Customer-facing recommendations are evidence-based outputs; forecasts/scenarios must remain distinguishable from guarantees.
8. Any material future change to this specification must be recorded as a new repository decision and must identify what it supersedes.

## 11. Acceptance gate

A capability is not DONE merely because a UI/control exists.

Customer-facing acceptance requires, as applicable:
- implementation;
- focused tests;
- relevant full-suite tests;
- browser/E2E verification;
- runtime/persistence verification;
- permission/RLS verification;
- sensitive-data masking verification;
- evidence recorded in `.agent-control/`;
- corresponding master-checklist status reconciled.

