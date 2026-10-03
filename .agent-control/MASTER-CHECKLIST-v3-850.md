BUILDWISE AI — MASTER CHECKLIST v2
Real Estate Operating System (REOS)
هدف: ساخت یک سیستم حرفه‌ای و قابل سفارشی‌سازی برای املاک، ساخت‌وساز، سرمایه‌گذاری، فروش و کنترل پروژه

قانون وضعیت:
[✓] DONE = پیاده‌سازی + تست + تأیید Runtime
[~] PARTIAL = بخشی پیاده شده
[ ] TODO = انجام نشده
[⛔] BLOCKED = نیازمند دسترسی/احراز هویت خارجی

==================================================
A — CORE REOS ARCHITECTURE
==================================================

001 [✓] Data Foundation
    Excel / Manual / AI / Files / Documents / Users / History

002 [✓] Data Normalization
    Persian/Arabic digits
    Text normalization
    Phone normalization
    Number normalization
    Identity keys

003 [~] Entity Resolution
    Person
    Owner
    Buyer
    Investor
    Builder
    Supplier
    Contractor
    Property
    Land
    Project
    Unit
    Deal

004 [~] Real Estate Intelligence Graph
    Person ↔ Property
    Owner ↔ Land
    Builder ↔ Project
    Investor ↔ Deal
    Supplier ↔ Procurement
    Project ↔ Unit
    Contract ↔ Money

005 [~] Persistent Graph Store

006 [~] Graph Synchronization

007 [~] Opportunity Engine
    Sale
    Purchase
    Participation
    Barter
    Investment
    Development
    Procurement

008 [~] Matching Engine

009 [~] Deal Intelligence

010 [~] Valuation Engine

011 [~] Scenario Engine

012 [~] Risk Engine

013 [~] ROI Engine

014 [✓] Liquidity Engine

015 [~] Contract Engine

016 [~] Construction Engine

017 [~] Sales Engine

018 [~] Finance Engine

019 [~] Control Engine

020 [~] AI Decision Layer

021 [~] Action Engine

022 [✓] Feedback / Learning Loop

023 [~] Human Approval Layer

024 [~] Audit / Versioning

025 [~] Security / Permissions

026 [✓] Model Router

027 [~] Agent Registry

028 [~] Tool Registry

029 [✓] Agent Permission Matrix

030 [✓] Master Decision Loop
    INPUT
    → IDENTIFY
    → UNDERSTAND
    → ANALYZE
    → MATCH
    → CALCULATE
    → SIMULATE
    → RECOMMEND
    → HUMAN APPROVAL
    → EXECUTE
    → MONITOR
    → MEASURE
    → LEARN


==================================================
B — CRM / DATA MANAGEMENT
==================================================

031 [~] People

032 [~] Owners

033 [~] Buyers

034 [~] Investors

035 [~] Builders

036 [~] Suppliers

037 [~] Contractors

038 [~] Properties

039 [~] Lands

040 [~] Leads

041 [~] Public Requests

042 [~] Deals

043 [~] Contacts / Phones

044 [~] Search

045 [~] Advanced Filters

046 [~] Excel Import

047 [~] Google Sheets Import

048 [~] Multi-Sheet Import

049 [~] Preserve Every Excel Column

050 [~] Preserve Every Excel Row

051 [~] Preserve Original Raw Data

052 [~] Import Batch Tracking

053 [~] Duplicate Detection

054 [~] Same Phone Preservation
     Never merge records only because surname/phone matches

055 [~] Activity Timeline

056 [~] Data Export

057 [~] JSON Backup

058 [~] Manager Data Editing

059 [~] Manager Audit Trail

060 [~] Arbitrary Excel Column Editor
     Manager can edit every imported field

061 [~] Import Error Isolation
     Raw import failure ≠ normalized import failure

062 [~] Import Preview

063 [~] Import Validation

064 [~] Import Rollback

065 [~] Data Quality Dashboard


==================================================
C — REAL ESTATE INTELLIGENCE
==================================================

066 [~] Land Analysis

067 [~] Development Feasibility

068 [~] Municipal Regulation Evidence

069 [~] Participation Analysis

070 [~] Barter Analysis

071 [~] Investor Matching

072 [~] Builder Matching

073 [~] Supplier Matching

074 [~] Property Matching

075 [~] Opportunity Radar

076 [✓] Valuation Engine

077 [~] Comparable Evidence

078 [✓] Construction Cost Engine

079 [~] ROI / Profit Scenarios

080 [~] Gold Comparison

081 [~] Dollar Comparison

082 [ ] Historical Market Analysis

083 [ ] Live Market Snapshot

084 [~] Scenario Forecasting

085 [ ] Liquidity Analysis

086 [~] Deal Risk Analysis

087 [ ] Market Data Timestamp

088 [ ] Daily Gold Price Update

089 [ ] Daily Dollar Price Update

090 [ ] Property Price vs Gold

091 [ ] Property Price vs Dollar

092 [ ] Property Value in Grams of 18K Gold

093 [ ] 6-Month Historical Comparison

094 [ ] 12-Month Historical Comparison

095 [ ] 18-Month Historical Comparison

096 [ ] 24-Month Historical Comparison

097 [ ] Historical Performance Chart

098 [ ] Future Scenario Chart

099 [ ] Proposal-Ready Investment Analysis

100 [ ] Clearly distinguish forecast/scenario from guarantee


==================================================
D — PROFESSIONAL PROJECT MANAGEMENT
==================================================

101 [ ] Project Management Core

102 [ ] Project / Complex / Building / Phase / Floor / Unit Hierarchy

103 [ ] Project Dashboard

104 [ ] Project Master Plan

105 [ ] Project Calendar

106 [ ] WBS — Work Breakdown Structure

107 [ ] MSP-style Scheduling

108 [ ] Gantt Chart

109 [ ] Milestones

110 [ ] Dependencies

111 [ ] Predecessors / Successors

112 [ ] Critical Path

113 [ ] Critical Path Method — CPM

114 [ ] Float / Slack

115 [ ] Baseline Schedule

116 [ ] Actual vs Baseline

117 [ ] Schedule Variance

118 [ ] Time Variance %

119 [ ] Progress %

120 [ ] Planned Progress

121 [ ] Actual Progress

122 [ ] Earned Progress

123 [ ] Delay Detection

124 [ ] Delay Reason

125 [ ] Delay Responsibility

126 [ ] Recovery Plan

127 [ ] Revised Schedule

128 [ ] Multiple Project Versions

129 [ ] Project Snapshot

130 [ ] Project Status


==================================================
E — PROCUREMENT / PURCHASING
==================================================

131 [ ] Procurement Master Plan

132 [ ] Material List

133 [ ] BOQ Integration

134 [ ] Purchase Schedule

135 [ ] Required Date

136 [ ] Order Date

137 [ ] Delivery Date

138 [ ] Supplier

139 [ ] Supplier Comparison

140 [ ] Purchase Request

141 [~] Purchase Approval

142 [~] Purchase Order

143 [~] Delivery Tracking

144 [~] Partial Delivery

145 [~] Material Inventory

146 [~] Material Consumption

147 [~] Material Shortage Alert

148 [~] Price at Purchase Date

149 [~] Current Material Price

150 [~] Price Variance

151 [~] Material Price History

152 [~] Toman Price

153 [~] Dollar Equivalent at Purchase

154 [~] Current Dollar Equivalent

155 [~] Live Material Price

156 [~] Price Source

157 [~] Price Timestamp

158 [~] Purchase Forecast

159 [~] Optimal Purchase Timing

160 [~] Procurement Risk


==================================================
F — AI PROJECT CONTROL
==================================================

161 [~] AI Project Assistant

162 [~] AI Schedule Analysis

163 [~] AI Delay Detection

164 [~] AI Dependency Analysis

165 [~] AI Critical Path Analysis

166 [~] AI Procurement Prediction

167 [~] AI Material Shortage Prediction

168 [~] AI Cost Overrun Prediction

169 [~] AI Schedule Recovery Suggestions

170 [~] AI Parallel Work Analysis

171 [~] AI Team Conflict Detection

172 [~] AI Workfront Analysis

173 [~] AI Crew Availability Analysis

174 [~] AI Suggest Parallel Teams

175 [~] AI Suggest Safe Parallel Activities

176 [~] AI Detect Activity Dependencies

177 [~] AI Detect Physical Interference

178 [~] AI Detect Resource Conflict

179 [~] AI Detect Shared Equipment Conflict

180 [~] AI Detect Shared Material Conflict

181 [~] AI Detect Shared Workspace Conflict

182 [~] AI Suggest Work Zoning

183 [~] AI Suggest Floor-by-Floor Parallelism

184 [~] AI Suggest Trade Sequencing

185 [ ] AI "What if?" Simulation

186 [~] AI Schedule Optimization

187 [~] AI Cost/Time Trade-off

188 [~] AI Human Approval Before Critical Changes

189 [~] AI Explanation of Recommendation

190 [~] AI Never silently changes master schedule


==================================================
G — PROFESSIONAL PROJECT ACCOUNTING
==================================================

191 [~] Project Accounting Core

192 [~] Project-specific Ledger

193 [~] Project Bank/Cash Accounts

194 [~] Budget

195 [~] Revised Budget

196 [~] Actual Cost

197 [~] Committed Cost

198 [~] Forecast Cost

199 [~] Remaining Cost

200 [~] Total Project Cost

201 [~] Cost by WBS

202 [~] Cost by Phase

203 [~] Cost by Floor

204 [~] Cost by Unit

205 [~] Cost by Contractor

206 [~] Cost by Supplier

207 [~] Cost by Material

208 [~] Cost by Purchase

209 [~] Cost by Invoice

210 [~] Cost by Payment

211 [~] Cost by Date

212 [~] Toman Accounting

213 [~] Dollar Equivalent

214 [~] Gold Equivalent

215 [~] Historical Exchange Rate at Transaction Date

216 [~] Current Equivalent Value

217 [~] Cost Inflation Tracking

218 [~] Cost Variance

219 [~] Budget vs Actual

220 [~] Committed vs Actual

221 [~] Forecast at Completion

222 [~] Cash Flow

223 [~] Project Receivables

224 [~] Project Payables

225 [~] Contractor Payments

226 [~] Supplier Payments

227 [~] Advance Payments

228 [~] Retention

229 [~] Installments

230 [~] Payment Schedule

231 [~] Payment Approval

232 [~] Invoice Upload

233 [~] Receipt Upload

234 [~] Accounting Document Archive

235 [~] Financial Audit Trail


==================================================
H — REAL ESTATE COST / PRICE ENGINE
==================================================

236 [✓] Construction Cost Engine

237 [~] Live Material Cost Engine

238 [~] Daily Material Price Update

239 [~] Construction Cost Current Value

240 [~] Construction Cost at Purchase Date

241 [~] Construction Cost Inflation

242 [~] Land Purchase Price

243 [~] Current Land Value

244 [~] Land Value from CRM

245 [~] Land Comparable Search

246 [~] Land Price from Market Sources

247 [~] Land Price from Divar Data Where Legally/Technically Available

248 [~] Combined Land Valuation

249 [~] Total Project Cost

250 [~] Total Cost per Gross m²

251 [~] Useful/Net Area %

252 [~] Default Useful Area = 80%

253 [~] Total Useful Area

254 [~] Construction Cost per Useful m²

255 [~] Land Cost per Useful m²

256 [~] Total Cost per Useful m²

257 [~] Cost per Unit

258 [~] Cost per Saleable Unit

259 [~] Cost Allocation by Unit

260 [~] Unit-level Profitability

261 [~] Developer Margin

262 [~] Investor Return

263 [~] Owner Return

264 [~] Sensitivity Analysis


==================================================
I — SALES ENGINE / BUILDER OFFER
==================================================

265 [~] Builder Sales Engineering

266 [~] Developer Offer Builder

267 [~] Project Sales Strategy

268 [~] Unit Sales Matrix

269 [~] Unit Price Calculator

270 [~] Price per m²

271 [~] Total Unit Price

272 [~] Floor Premium

273 [~] View Premium

274 [~] Orientation Premium

275 [~] Parking Value

276 [~] Storage Value

277 [~] Terrace Value

278 [~] Garden Value

279 [~] Commercial Premium

280 [~] Payment Terms

281 [~] Cash Price

282 [~] Installment Price

283 [~] Discount Calculation

284 [~] Pre-sale / Participation distinction

285 [~] Builder's Proposed Sales Structure

286 [~] Sales Inventory

287 [~] Available / Reserved / Sold

288 [~] Customer Offer

289 [~] Negotiation Workspace

290 [~] Offer Versioning

291 [~] Offer Approval

292 [~] Sales Proposal PDF/Screen

293 [~] Customer-facing Profitability Proposal


==================================================
J — PLAN / PERMIT / RENDER INTELLIGENCE
==================================================

294 [~] Upload Architectural Plan

295 [~] Upload Permit

296 [~] Upload Municipality Documents

297 [~] Upload Floor Plans

298 [~] Upload Elevations

299 [~] Upload Site Plan

300 [~] Upload Render / Facade

301 [~] Project Document OCR

302 [~] AI Plan Understanding

303 [~] AI Extract Gross Area

304 [~] AI Extract Useful Area

305 [~] AI Extract Unit Count

306 [~] AI Extract Parking Count

307 [~] AI Extract Storage Count

308 [~] AI Extract Floor Count

309 [~] AI Extract Land Area

310 [~] AI Extract Setbacks

311 [~] AI Compare Plan vs Permit

312 [~] AI Detect Missing Information

313 [~] Render Gallery

314 [~] Unit Gallery

315 [~] Project Presentation Page

316 [~] Automatic Sales Presentation

317 [~] Customer Room / Showroom

318 [~] Shareable Project Link


==================================================
K — PROJECT KPI / CONTROL CENTER
==================================================

319 [~] KPI Engine

320 [~] Project KPI Dashboard

321 [~] Schedule KPI

322 [~] Cost KPI

323 [~] Procurement KPI

324 [~] Quality KPI

325 [~] HSE KPI

326 [~] Sales KPI

327 [~] Cash Flow KPI

328 [~] Contractor KPI

329 [~] Supplier KPI

330 [~] Productivity KPI

331 [~] Progress KPI

332 [~] Delay KPI

333 [~] Cost Overrun KPI

334 [~] Procurement Delay KPI

335 [~] Unit Sales KPI

336 [~] ROI KPI

337 [~] Profit Margin KPI

338 [~] Custom KPI Builder

339 [~] KPI Thresholds

340 [~] KPI Alerts

341 [~] KPI Trend Charts

342 [~] KPI Drill-down


==================================================
L — WORKFLOW ENGINE
==================================================

343 [~] Workflow Engine

344 [~] Visual Workflow Builder

345 [~] Trigger

346 [~] Condition

347 [~] Action

348 [~] Approval

349 [~] Notification

350 [~] Assignment

351 [~] Escalation

352 [~] Deadline

353 [~] Recurring Workflow

354 [~] Conditional Workflow

355 [~] Project Workflow Templates

356 [~] Procurement Workflow

357 [~] Sales Workflow

358 [~] Contract Workflow

359 [~] Construction Workflow

360 [~] Accounting Workflow

361 [~] AI Workflow

362 [~] Human Approval Workflow

363 [~] Workflow History

364 [~] Workflow Audit

365 [~] Custom Workflow per Project

366 [~] Custom Workflow per Builder

367 [~] Custom Workflow per User


==================================================
M — DEAL / CONTRACT
==================================================

368 [~] Persistent Deal Workspace

369 [~] Deal Timeline

370 [~] Persistent Chat

371 [~] Deal Actions

372 [~] Follow-ups

373 [~] Deal Risk

374 [~] Participation Calculation

375 [~] Payment Schedule

376 [~] Contract Validation

377 [~] Contract Templates

378 [~] Contract Versioning

379 [~] Contract Attachments

380 [~] Contract Approval

381 [~] Contract Signature Workflow

382 [~] Contract Financial Obligations

383 [~] Contract Milestones

384 [~] Contract Breach Alerts

385 [~] Contract-to-Project Link


==================================================
N — CRM / REQUEST / ADVISOR OPERATIONS
==================================================

386 [~] Public Requests

387 [~] Request Routing

388 [~] Advisor Assignment

389 [~] Advisor Workload

390 [~] Advisor Dashboard

391 [~] Advisor Follow-ups

392 [~] Advisor Reports

393 [~] Security Reports

394 [~] Access Logging

395 [~] Promotion Governance

396 [~] Hot Slot Governance

397 [~] Manager Control

398 [~] Accept / Reject / Transfer

399 [~] Advisor KPI

400 [~] Advisor Performance Scorecard


==================================================
O — CUSTOMER / PORTAL / SHOWROOM
==================================================

401 [~] Customer Portal

402 [~] Room

403 [~] Showroom

404 [~] Project Presentation

405 [~] Property Photos

406 [~] Interactive Project Walkthrough

407 [~] Floor Plan Viewer

408 [~] Unit Selector

409 [~] Unit Price Comparison

410 [~] Customer Request Journey

411 [~] Customer AI Assistant

412 [~] Customer-specific Proposal

413 [~] Customer-specific ROI

414 [~] Customer Notifications

415 [~] Appointment Workflow


==================================================
P — AI FIELD / SECTION INTELLIGENCE
==================================================

416 [~] Hooman AI

417 [~] Section-level AI

418 [~] AI Form Fill

419 [~] AI Field Fill

420 [~] AI Context Collection

421 [~] AI Action Logging

422 [~] AI Deal Intelligence

423 [~] AI Routing Intelligence

424 [~] AI Project Intelligence

425 [~] AI Financial Intelligence

426 [~] AI Procurement Intelligence

427 [~] AI Sales Intelligence

428 [~] AI Persistent Memory

429 [~] AI Action Execution

430 [~] AI Explanation Layer

431 [~] AI Permission Layer

432 [~] AI Approval Layer

==================================================
Q — AGENT / AUTOMATION INFRASTRUCTURE
==================================================

433 [~] Master AI Orchestrator

434 [~] Model Router

435 [~] Agent Registry

436 [~] Task Contract

437 [~] Tool Registry

438 [~] Agent Permissions

439 [~] Agent Audit

440 [~] Agent Memory

441 [~] Agent Context

442 [~] Agent Handoff

443 [~] Agent Result Validation

444 [~] Agent Failure Recovery

445 [ ] Codex Worker [⛔]

446 [ ] Claude Worker [⛔]

447 [ ] Gemini Worker [⛔]

448 [ ] n8n Runtime [⛔]

449 [ ] Independent Agent Execution [⛔]

450 [ ] Non-production Agent Sandbox

451 [ ] Read-only Audit Runtime

452 [ ] Human Approval for Production Actions


==================================================
R — CONSTRUCTION CONTROL
==================================================

453 [~] Project Model

454 [~] WBS

455 [~] Schedule

456 [~] Gantt

457 [~] Baseline

458 [~] Variance

459 [~] BOQ

460 [~] Procurement

461 [~] Supplier Commitment

462 [~] RFI

463 [~] Submittal

464 [~] Quality

465 [~] HSE

466 [~] Risk

467 [~] Corrective Action

468 [~] Site Diary

469 [~] Daily Report

470 [~] Crew Management

471 [~] Equipment Management

472 [~] Material Management

473 [~] Work Progress Photos

474 [~] Geotagged Progress

475 [~] Before / After Progress

476 [~] AI Progress Verification


==================================================
S — UI / UX
==================================================

477 [~] Mobile-first

478 [~] Responsive Desktop

479 [ ] Feature Parity Mobile/Desktop

480 [~] AI-first UX

481 [~] Minimal Technical Language

482 [~] No Internal Prompts Exposed

483 [~] No Model Names Exposed

484 [~] No Tool Names Exposed

485 [~] Contextual AI Button per Section

486 [~] AI Embedded in Background

487 [~] AI Auto-placement

488 [~] AI Auto-fill

489 [~] AI Only Appears When Useful

490 [~] Persistent Workspace UI

491 [~] Notion-like Workspace

492 [~] Project Control Center UI

493 [~] Gantt UI

494 [~] KPI Dashboard UI

495 [~] Procurement Calendar UI

496 [~] Financial Dashboard UI

497 [~] Unit Sales Matrix UI

498 [~] Drag & Drop Workflow UI

499 [~] Timeline UI

500 [~] Professional Animation System


==================================================
T — WEBSITE / APP PRESENTATION
==================================================

501 [ ] BuildWise AI Landing Website

502 [ ] Premium animated hero

503 [ ] Interactive product demonstrations

504 [ ] Scroll-driven animations

505 [ ] App screenshots inside website

506 [ ] Interactive dashboard preview

507 [ ] Interactive project-control preview

508 [ ] Interactive Gantt preview

509 [ ] Interactive KPI preview

510 [ ] Interactive AI assistant preview

511 [ ] Interactive sales proposal preview

512 [ ] Interactive customer room preview

513 [ ] Responsive mobile website

514 [ ] PWA

515 [ ] Add to Home Screen

516 [ ] Installable mobile experience

517 [ ] App icon

518 [ ] Splash screen

519 [ ] Offline shell

520 [ ] Professional SEO

521 [ ] OpenGraph

522 [ ] Social share previews

523 [ ] Analytics

524 [ ] Conversion tracking


==================================================
U — CONTENT / MARKETING / LAUNCH
==================================================

525 [ ] BuildWise Brand System

526 [ ] Brand Guidelines

527 [ ] Logo System

528 [ ] Social Media Visual System

529 [ ] Instagram Content System

530 [ ] Instagram Launch Campaign

531 [ ] Educational Content

532 [ ] Product Demo Content

533 [ ] Construction AI Content

534 [ ] Real Estate Intelligence Content

535 [ ] Before/After Project Content

536 [ ] Customer Case Studies

537 [ ] Reels System

538 [ ] Stories System

539 [ ] YouTube Content

540 [ ] LinkedIn Content

541 [ ] Launch Calendar

542 [ ] Marketing Workflow

543 [ ] Lead Capture

544 [ ] Landing → Request → CRM

545 [ ] Campaign Analytics


==================================================
V — AI CONTENT PRODUCTION BOT
==================================================

546 [ ] Content Production Bot

547 [ ] Prompt → Video

548 [ ] Prompt → Image

549 [ ] Prompt → Reel

550 [ ] Prompt → Voiceover

551 [ ] Prompt → Caption

552 [ ] Prompt → Hashtags

553 [ ] Prompt → Thumbnail

554 [ ] Real Estate Video Generator

555 [ ] Land Dimensions Input

556 [ ] Width Input

557 [ ] Street Width Input

558 [ ] Aerial Image Input

559 [ ] Automatic Dimension Lines

560 [ ] Yellow Length/Width Lines

561 [ ] Blueprint Overlay

562 [ ] Floor Area Visualization

563 [ ] 3D Massing

564 [ ] Modern Architectural Render

565 [ ] Construction Progress Video

566 [ ] Property Presentation Reel

567 [ ] Investor Proposal Video

568 [ ] Automated Voiceover

569 [ ] Automated Subtitles

570 [ ] Instagram-ready Export

571 [ ] YouTube-ready Export

572 [ ] Content Library

573 [ ] Prompt Library

574 [ ] Brand-consistent Content

575 [ ] Free/low-cost generation pipeline


==================================================
W — MARKET / EXTERNAL DATA
==================================================

576 [ ] Live Gold Feed

577 [ ] Live Dollar Feed

578 [ ] Material Price Feed

579 [ ] Property Market Feed

580 [ ] Divar-compatible acquisition strategy

581 [ ] CRM Property Data

582 [ ] Market Comparable Engine

583 [ ] Source Registry

584 [ ] Source Timestamp

585 [ ] Source Reliability

586 [ ] Historical Snapshots

587 [ ] Daily Snapshot Job

588 [ ] Market Data Archive

589 [ ] Market Data API Layer

590 [ ] External Data Failure Fallback


==================================================
X — SECURITY / GOVERNANCE
==================================================

591 [~] RLS — 16 missing-policy tables remediated; telegram_sessions intentionally service-only with RLS and no client grant

592 [~] Manager Permissions

593 [~] Advisor Permissions

594 [~] User Permissions

595 [~] Access Logging

596 [~] Audit Events

597 [~] Manager Edit Audit

598 [~] Field-level Permissions — governance registry added; final column enforcement staged behind client migration

599 [~] Phone-number visibility rules — manager-only field policy persisted; trigger-only RPC execution revoked; authenticated SECURITY DEFINER read gates audited; raw property phone SELECT revoked

600 [~] Sensitive Data Masking — properties_client rebuilt without raw phone/internal notes; sensitive property columns are not selectable by authenticated API; phone mask helper runtime-verified

601 [~] AI Data Permissions — AI audit/alerts/approval RLS narrowed to actor/manager/assigned-user boundaries

602 [~] Agent Tool Permissions — agent_tool_permissions registry + manager RLS added

603 [~] Production Action Approval — approval registry with pending-request + manager-decision RLS added

604 [~] Secret Management — existing Vault-backed get_secret verified; no client execute grant

605 [~] Webhook Secret Remediation — Google Sheets sync uses BUILDWISE_SYNC_TOKEN environment secret; no hardcoded fallback token

606 [~] Security Advisor Cleanup — 17→1 RLS no-policy, 22→0 non-invoker views, 4→0 anon SECURITY DEFINER, 3→0 mutable search_path

607 [~] SECURITY DEFINER Review — 23 authenticated RPC findings remain intentionally exposed pending per-function client-use audit

608 [~] Permission Regression Tests — focused governance tests added; full CI/browser/runtime confirmation pending


==================================================
Y — TESTING / RELEASE
==================================================

609 [~] Unit Tests

610 [~] Architecture Contract Tests

611 [~] Graph Tests

612 [~] Decision Engine Tests

613 [~] Contract Engine Tests

614 [~] Release Smoke Test

615 [~] JS Syntax Check

616 [ ] Import 2,000+ Row Test

617 [ ] Multi-Sheet Excel Test

618 [ ] Full Column Preservation Test

619 [ ] Duplicate Test

620 [ ] Manager Edit Test

621 [ ] Project Accounting Test

622 [ ] Gantt Test

623 [ ] Procurement Test

624 [ ] KPI Test

625 [ ] Workflow Test

626 [ ] AI Parallel Work Test

627 [ ] Mobile Test

628 [ ] PWA Install Test

629 [ ] Customer Portal Test

630 [ ] Production E2E Test

631 [ ] Regression Test Suite

632 [ ] Security Regression Test


==================================================
Z — INFRASTRUCTURE / DEPLOYMENT
==================================================

633 [~] GitHub Repository

634 [~] buildwise-implementation Branch

635 [~] GitHub Actions

636 [~] Supabase

637 [~] Edge Functions

638 [~] Database Schema

639 [~] Graph Tables

640 [~] AI Orchestrator

641 [~] GitHub Pages

642 [ ] Final Production Domain

643 [ ] Cloudflare

644 [ ] Cloudflare Workers if needed

645 [ ] Automated Deployment

646 [ ] Deployment Health Check

647 [ ] Database Migration Pipeline

648 [ ] Backup Strategy

649 [ ] Rollback Strategy

650 [ ] Environment Separation
     Development
     Staging
     Production


==================================================
FINAL MASTER OBJECTIVE
==================================================

651 [ ] BuildWise AI must become a REAL ESTATE OPERATING SYSTEM,
    not a CRM.

652 [ ] One connected intelligence graph for:
    Property
    Person
    Owner
    Land
    Builder
    Investor
    Supplier
    Contractor
    Project
    Unit
    Deal
    Contract
    Money
    Task
    Document
    Schedule
    Procurement
    Sale

653 [ ] One connected project-control system:
    WBS
    MSP
    Gantt
    Critical Path
    KPI
    Workflow
    Procurement
    Accounting
    Cash Flow
    Quality
    HSE
    Risk
    Progress

654 [ ] AI must sit across the entire system.

655 [ ] AI must be able to detect opportunities for
    parallel work without creating team/resource conflicts.

656 [ ] Manager remains final authority for critical decisions.

657 [ ] Every important AI action must be auditable.

658 [ ] Every project must have its own configurable workflow.

659 [ ] Every project must have configurable KPIs.

660 [ ] Every project must have configurable accounting.

661 [ ] Every project must have configurable procurement.

662 [ ] Every project must have configurable schedule.

663 [ ] Every project must have configurable sales strategy.

664 [ ] Every project must accept:
    Plan
    Permit
    Render
    Photos
    Documents
    Excel
    Financial Data

665 [ ] System must calculate:
    Land Cost
    Current Land Value
    Construction Cost
    Current Material Cost
    Gross Area
    Useful Area
    Useful Area %
    Cost / Gross m²
    Cost / Useful m²
    Cost / Unit
    Sale Price
    Profit
    ROI
    Risk
    Liquidity

666 [ ] System must compare:
    Property
    Gold
    Dollar
    Construction Inflation
    Market Price

667 [ ] Customer must receive understandable,
    professional, proposal-ready outputs.

668 [ ] Website must demonstrate the software,
    not merely describe it.

669 [ ] Website must be animated,
    interactive,
    responsive,
    and installable as PWA.

670 [ ] Content Bot must turn prompts into
    professional real-estate marketing assets.

671 [ ] Open-source GitHub projects should be reused
    whenever legally compatible and technically suitable.
    Do not rewrite existing mature components unnecessarily.

672 [ ] Every reused open-source component must be
    customized to BuildWise AI.

673 [ ] Customization must be a core architectural principle,
    not an afterthought.

674 [ ] Final UX must feel like a unified professional product,
    not a collection of separate tools.

675 [ ] No feature is DONE until:
    IMPLEMENTED
    + TESTED
    + RUNTIME VERIFIED
    + UI VERIFIED
    + SECURITY VERIFIED where applicable.

==================================================
AA — RECOVERED DECISIONS / CONTROL PLANE / DECISION GOVERNANCE
==================================================

NOTE:
The original supplied file ends at item 675.
The following additions recover decisions made after that version and formalize
rules that were discussed but were not yet represented as numbered checklist items.
No prior decision is silently deleted or replaced.

676 [ ] Project Result must be immutable/versioned
677 [ ] Project Result v1 must remain recoverable after later analysis
678 [ ] Project Result v2 must be stored as a new version, not overwrite v1
679 [ ] Project → Result → Room relationship must be persistent
680 [ ] Room reads only published/analyzed project results
681 [ ] Architectural AI review must operate on the project result layer
682 [~] 2D elevation generator
683 [~] 2D floor-plan generator
684 [~] Alternative project scenarios
685 [~] 3D project view
686 [~] 360-degree project view
687 [~] Exterior/multi-angle project views
688 [~] 4D project view / time-based visualization
689 [ ] Floor pricing must be configurable
690 [ ] Default floor premium range 3–5% must be configurable, not hard-coded
691 [ ] Architecture → financial model linkage
692 [ ] Plan → unit → price matrix linkage

693 [ ] Master Checklist is the project-wide acceptance/source-of-truth register
694 [ ] Every finalized architecture decision enters the source-of-truth register
695 [ ] Every finalized UX decision enters the source-of-truth register
696 [ ] Every finalized business-logic decision enters the source-of-truth register
697 [ ] Every finalized AI rule enters the source-of-truth register
698 [ ] Every finalized data-model decision enters the source-of-truth register
699 [ ] Every finalized module relationship enters the source-of-truth register
700 [ ] Every important operational rule enters the source-of-truth register
701 [ ] Maintain Decision → Architecture → Requirement → Feature → Dependency → Implementation → Test → Runtime Verification → Status traceability
702 [ ] SUMMARY.md is the concise project map/status/change ledger
703 [ ] MASTER-ARCHITECTURE.md is the mother architecture and decision reference
704 [ ] Phase documents contain phase-specific execution detail
705 [ ] Task documents contain task-specific execution detail
706 [ ] Agents read only the minimum required context for a task
707 [ ] No agent-wide repository scan merely to recover context
708 [ ] .agent-control/ is the shared execution control plane
709 [ ] .agent-control/BRIEF.md is the short shared project brief
710 [ ] .agent-control/STATE.md is the current execution state
711 [ ] .agent-control/ROADMAP.md is the execution roadmap
712 [ ] .agent-control/TASK_CONTRACT.md defines bounded agent tasks
713 [ ] .agent-control/AGENT_REGISTRY.md defines available agents/workers
714 [ ] .agent-control/DECISION_LOG.md records important decisions
715 [ ] .agent-control/CHANGELOG.md records structural changes
716 [ ] .agent-control/PERFORMANCE_LOG.md records agent/work performance
717 [ ] NOW.md is the first context entry point for active execution
718 [ ] NOW.md must contain only current state, current objective, current blocker, and next action
719 [ ] Agent memory records concise task history
720 [ ] Agent memory records changes made
721 [ ] Agent memory records positive results
722 [ ] Agent memory records negative results
723 [ ] Agent memory records failures
724 [ ] Agent memory records rejected ideas/approaches
725 [ ] Agent memory records blockers
726 [ ] Agent memory records the next step
727 [ ] Agents must not reread the whole repository just to recover prior context
728 [ ] Context recovery order: NOW → BRIEF → PERFORMANCE → TASK CONTRACT → required files
729 [ ] After execution: test → runtime verify → record result → update state
730 [ ] ChatGPT is the CTO/orchestrator and controls task sequencing
731 [ ] Claude is the implementation/coding worker when available
732 [ ] Grok is used for research/review/task work when available
733 [ ] Control Plane mediates work between orchestrator and workers
734 [ ] Workers must read current state before starting work
735 [ ] Workers must execute only their assigned task scope
736 [ ] Workers must not rebuild already-working components without a recorded reason
737 [ ] Workers must not duplicate work already completed by another worker
738 [ ] No task is considered complete from prose/status alone
739 [ ] Completion requires implementation + test + runtime verification
740 [ ] UI verification is required where UI is affected
741 [ ] Security verification is required where security is affected
742 [ ] Blocked access must be recorded as BLOCKED, not represented as DONE
743 [ ] Failed work must record cause, attempted fix, result, and next action
744 [ ] Rejected approaches must be preserved so they are not retried unnecessarily
745 [ ] Every structural change must be logged in SUMMARY/change ledger
746 [ ] Obsolete duplicate execution references must not compete with the canonical structure
747 [ ] Existing mature/open-source components must be reused when legally and technically suitable
748 [ ] Reused components must be customized to BuildWise AI
749 [ ] Customization is an architectural principle, not an afterthought


==================================================
AB — DECISION CONSTITUTION / AI BEHAVIOR CONTRACT
==================================================

750 [ ] BuildWise AI must have a single Decision Constitution governing AI decisions
751 [ ] Every important decision must identify its source of truth
752 [ ] Source-of-truth hierarchy must be explicit
753 [ ] Conflicting sources must be preserved and flagged
754 [ ] System must never silently resolve a material data conflict
755 [ ] Every important output must identify its evidence
756 [ ] Evidence strength must be represented
757 [ ] Decision confidence must be represented where applicable
758 [ ] FACT must be distinguishable from SOURCE FACT
759 [ ] CALCULATION must be distinguishable from FACT
760 [ ] INFERENCE must be distinguishable from FACT
761 [ ] SCENARIO must be distinguishable from forecast/guarantee
762 [ ] RECOMMENDATION must be distinguishable from executed ACTION
763 [ ] Important calculations must expose their assumptions
764 [ ] Assumptions must be versioned
765 [ ] Assumption changes must identify affected outputs
766 [ ] Material changes must trigger dependency-impact analysis
767 [ ] Recalculation behavior must be explicit: AUTO / MANUAL / APPROVAL REQUIRED
768 [ ] Locked/approved records must not be silently overwritten
769 [ ] Critical changes must create a new version
770 [ ] Previous approved versions must remain recoverable
771 [ ] Sensitive actions must support DRY RUN before execution
772 [ ] AI must not guess missing critical facts
773 [ ] Unknown data must be marked missing or requested
774 [ ] Uncertain results must expose uncertainty
775 [ ] Conflicting data must be flagged before critical action
776 [ ] AI must never silently modify master records/schedules
777 [ ] Human approval remains final authority for critical decisions
778 [ ] Every important AI action must be auditable
779 [ ] Every action must have a traceable execution identity
780 [ ] Duplicate execution must be prevented through idempotency controls
781 [ ] Action execution must support verification
782 [ ] Failed critical actions must support rollback or compensating action
783 [ ] AI must stop after the minimum required actions are complete
784 [ ] No unnecessary tool calls or side effects
785 [ ] Agent scope must define allowed reads
786 [ ] Agent scope must define allowed writes
787 [ ] Agent scope must define allowed executions
788 [ ] Agent scope must define prohibited operations
789 [ ] Agent failure classes must be explicit
790 [ ] Failure policy must define retry/fallback/stop/escalate behavior
791 [ ] Human escalation must be available when confidence or authority is insufficient
792 [ ] Decision trace must record input, evidence, assumptions, reasoning class, decision, and outcome
793 [ ] Execution trace must record actor, tool, time, action, result, and verification
794 [ ] AI/model/tool names must remain hidden from end users where required by UX rules
795 [ ] Internal prompts must never be exposed to end users


==================================================
AC — AI ECONOMICS / EXECUTION CONTROL
==================================================

796 [ ] Every bounded AI task may define a token budget
797 [ ] Every bounded AI task may define a time budget
798 [ ] Every bounded AI task may define a cost budget
799 [ ] Every bounded AI task may define maximum iterations
800 [ ] Task Contract may restrict allowed models
801 [ ] Task Contract may define fallback model/tool
802 [ ] Simple tasks should use the lowest-cost suitable execution path
803 [ ] High-risk tasks require stronger validation regardless of model cost
804 [ ] Tool calls must be limited to task scope
805 [ ] Repeated context loading must be avoided
806 [ ] Stable project context should be cached/reused
807 [ ] Performance logging must record useful execution outcomes
808 [ ] Token/cost waste caused by context recovery must be measurable
809 [ ] Agent performance must be evaluated from actual execution results
810 [ ] Performance history must distinguish successful and unsuccessful approaches
811 [ ] Worker selection should use task suitability, access, cost, and reliability
812 [ ] No worker should be selected solely because it is available


==================================================
AD — DATA LINEAGE / CHANGE IMPACT / RECOVERY
==================================================

813 [ ] Important calculated values must expose their input lineage
814 [ ] Important values must be traceable to source records
815 [ ] Important values must retain source timestamp where applicable
816 [ ] Important values must retain source/version identity where applicable
817 [ ] Change impact must identify downstream calculations and decisions
818 [ ] Recalculation must preserve prior results
819 [ ] Approved baselines must be immutable
820 [ ] Signed/approved contract data must be protected from silent mutation
821 [ ] Critical project state must support version comparison
822 [ ] Critical actions must support before/after inspection
823 [ ] Rollback must preserve an audit trail
824 [ ] Schema changes must be versioned
825 [ ] Schema migrations must be testable
826 [ ] Schema changes must preserve backward compatibility where required
827 [ ] Data loss must never be treated as successful migration


==================================================
AE — EXECUTION DISCIPLINE / ANTI-LOOP RULES
==================================================

828 [ ] One canonical implementation path per active feature
829 [ ] One canonical file/source per architectural responsibility
830 [ ] Duplicate implementations must be identified and retired safely
831 [ ] Do not restart architecture when an existing working path can be repaired
832 [ ] Do not replace working components merely for cosmetic restructuring
833 [ ] Do not declare progress from discussion alone
834 [ ] Do not declare DONE from a commit alone
835 [ ] Do not declare DONE from a successful build alone
836 [ ] Do not declare DONE from unit tests alone
837 [ ] Runtime verification is mandatory for DONE
838 [ ] User-visible UI must be verified when affected
839 [ ] Security must be verified when applicable
840 [ ] Every execution session ends with a recorded current state
841 [ ] Every execution session ends with one explicit next action
842 [ ] If no implementation occurred, status must remain unchanged
843 [ ] If a task is blocked, stop at the blocker and record it
844 [ ] If a task fails, diagnose → fix → retest
845 [ ] If a route is replaced, record why the old route was rejected
846 [ ] Never repeatedly revisit a rejected approach without new evidence
847 [ ] Voice/discussion decisions must be converted into persistent written decisions before they can govern implementation
848 [ ] Persistent history must be updated after material decisions
849 [ ] Current status must be recoverable without replaying old conversations
850 [ ] The project must expose one concise current-state view for human and agent use


==================================================
AF — CONSOLIDATION NOTE
==================================================

The supplied Master Checklist v2 contained 675 items.
Prior project history recovered a further 676–692 decision set.
This v3 consolidation adds the recovered 676–692 set plus the governance,
control-plane, memory, AI-decision, execution-discipline, and observability rules
that were discussed afterward but were not present as numbered items in v2.

Current consolidated numbered range: 001–850.

IMPORTANT:
850 does NOT mean 850 implemented features.
It is the acceptance/architecture register. Status must remain separate from
item existence. Existing [✓], [~], [ ], and [⛔] states must not be converted
without actual implementation/testing/runtime verification.