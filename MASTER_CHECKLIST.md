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

014 [ ] Liquidity Engine

015 [~] Contract Engine

016 [~] Construction Engine

017 [~] Sales Engine

018 [~] Finance Engine

019 [~] Control Engine

020 [~] AI Decision Layer

021 [~] Action Engine

022 [ ] Feedback / Learning Loop

023 [~] Human Approval Layer

024 [~] Audit / Versioning

025 [~] Security / Permissions

026 [ ] Model Router

027 [~] Agent Registry

028 [~] Tool Registry

029 [ ] Agent Permission Matrix

030 [ ] Master Decision Loop
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

060 [ ] Arbitrary Excel Column Editor
     Manager can edit every imported field

061 [ ] Import Error Isolation
     Raw import failure ≠ normalized import failure

062 [ ] Import Preview

063 [ ] Import Validation

064 [ ] Import Rollback

065 [ ] Data Quality Dashboard


==================================================
C — REAL ESTATE INTELLIGENCE
==================================================

066 [~] Land Analysis

067 [~] Development Feasibility

068 [ ] Municipal Regulation Evidence

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

141 [ ] Purchase Approval

142 [ ] Purchase Order

143 [ ] Delivery Tracking

144 [ ] Partial Delivery

145 [ ] Material Inventory

146 [ ] Material Consumption

147 [ ] Material Shortage Alert

148 [ ] Price at Purchase Date

149 [ ] Current Material Price

150 [ ] Price Variance

151 [ ] Material Price History

152 [ ] Toman Price

153 [ ] Dollar Equivalent at Purchase

154 [ ] Current Dollar Equivalent

155 [ ] Live Material Price

156 [ ] Price Source

157 [ ] Price Timestamp

158 [ ] Purchase Forecast

159 [ ] Optimal Purchase Timing

160 [ ] Procurement Risk


==================================================
F — AI PROJECT CONTROL
==================================================

161 [ ] AI Project Assistant

162 [ ] AI Schedule Analysis

163 [ ] AI Delay Detection

164 [ ] AI Dependency Analysis

165 [ ] AI Critical Path Analysis

166 [ ] AI Procurement Prediction

167 [ ] AI Material Shortage Prediction

168 [ ] AI Cost Overrun Prediction

169 [ ] AI Schedule Recovery Suggestions

170 [ ] AI Parallel Work Analysis

171 [ ] AI Team Conflict Detection

172 [ ] AI Workfront Analysis

173 [ ] AI Crew Availability Analysis

174 [ ] AI Suggest Parallel Teams

175 [ ] AI Suggest Safe Parallel Activities

176 [ ] AI Detect Activity Dependencies

177 [ ] AI Detect Physical Interference

178 [ ] AI Detect Resource Conflict

179 [ ] AI Detect Shared Equipment Conflict

180 [ ] AI Detect Shared Material Conflict

181 [ ] AI Detect Shared Workspace Conflict

182 [ ] AI Suggest Work Zoning

183 [ ] AI Suggest Floor-by-Floor Parallelism

184 [ ] AI Suggest Trade Sequencing

185 [ ] AI "What if?" Simulation

186 [ ] AI Schedule Optimization

187 [ ] AI Cost/Time Trade-off

188 [ ] AI Human Approval Before Critical Changes

189 [ ] AI Explanation of Recommendation

190 [ ] AI Never silently changes master schedule


==================================================
G — PROFESSIONAL PROJECT ACCOUNTING
==================================================

191 [ ] Project Accounting Core

192 [ ] Project-specific Ledger

193 [ ] Project Bank/Cash Accounts

194 [ ] Budget

195 [ ] Revised Budget

196 [ ] Actual Cost

197 [ ] Committed Cost

198 [ ] Forecast Cost

199 [ ] Remaining Cost

200 [ ] Total Project Cost

201 [ ] Cost by WBS

202 [ ] Cost by Phase

203 [ ] Cost by Floor

204 [ ] Cost by Unit

205 [ ] Cost by Contractor

206 [ ] Cost by Supplier

207 [ ] Cost by Material

208 [ ] Cost by Purchase

209 [ ] Cost by Invoice

210 [ ] Cost by Payment

211 [ ] Cost by Date

212 [ ] Toman Accounting

213 [ ] Dollar Equivalent

214 [ ] Gold Equivalent

215 [ ] Historical Exchange Rate at Transaction Date

216 [ ] Current Equivalent Value

217 [ ] Cost Inflation Tracking

218 [ ] Cost Variance

219 [ ] Budget vs Actual

220 [ ] Committed vs Actual

221 [ ] Forecast at Completion

222 [ ] Cash Flow

223 [ ] Project Receivables

224 [ ] Project Payables

225 [ ] Contractor Payments

226 [ ] Supplier Payments

227 [ ] Advance Payments

228 [ ] Retention

229 [ ] Installments

230 [ ] Payment Schedule

231 [ ] Payment Approval

232 [ ] Invoice Upload

233 [ ] Receipt Upload

234 [ ] Accounting Document Archive

235 [ ] Financial Audit Trail


==================================================
H — REAL ESTATE COST / PRICE ENGINE
==================================================

236 [✓] Construction Cost Engine

237 [ ] Live Material Cost Engine

238 [ ] Daily Material Price Update

239 [ ] Construction Cost Current Value

240 [ ] Construction Cost at Purchase Date

241 [ ] Construction Cost Inflation

242 [ ] Land Purchase Price

243 [ ] Current Land Value

244 [ ] Land Value from CRM

245 [ ] Land Comparable Search

246 [ ] Land Price from Market Sources

247 [ ] Land Price from Divar Data Where Legally/Technically Available

248 [ ] Combined Land Valuation

249 [ ] Total Project Cost

250 [ ] Total Cost per Gross m²

251 [ ] Useful/Net Area %

252 [ ] Default Useful Area = 80%

253 [ ] Total Useful Area

254 [ ] Construction Cost per Useful m²

255 [ ] Land Cost per Useful m²

256 [ ] Total Cost per Useful m²

257 [ ] Cost per Unit

258 [ ] Cost per Saleable Unit

259 [ ] Cost Allocation by Unit

260 [ ] Unit-level Profitability

261 [ ] Developer Margin

262 [ ] Investor Return

263 [ ] Owner Return

264 [ ] Sensitivity Analysis


==================================================
I — SALES ENGINE / BUILDER OFFER
==================================================

265 [ ] Builder Sales Engineering

266 [ ] Developer Offer Builder

267 [ ] Project Sales Strategy

268 [ ] Unit Sales Matrix

269 [ ] Unit Price Calculator

270 [ ] Price per m²

271 [ ] Total Unit Price

272 [ ] Floor Premium

273 [ ] View Premium

274 [ ] Orientation Premium

275 [ ] Parking Value

276 [ ] Storage Value

277 [ ] Terrace Value

278 [ ] Garden Value

279 [ ] Commercial Premium

280 [ ] Payment Terms

281 [ ] Cash Price

282 [ ] Installment Price

283 [ ] Discount Calculation

284 [ ] Pre-sale / Participation distinction

285 [ ] Builder's Proposed Sales Structure

286 [ ] Sales Inventory

287 [ ] Available / Reserved / Sold

288 [ ] Customer Offer

289 [ ] Negotiation Workspace

290 [ ] Offer Versioning

291 [ ] Offer Approval

292 [ ] Sales Proposal PDF/Screen

293 [ ] Customer-facing Profitability Proposal


==================================================
J — PLAN / PERMIT / RENDER INTELLIGENCE
==================================================

294 [ ] Upload Architectural Plan

295 [ ] Upload Permit

296 [ ] Upload Municipality Documents

297 [ ] Upload Floor Plans

298 [ ] Upload Elevations

299 [ ] Upload Site Plan

300 [ ] Upload Render / Facade

301 [ ] Project Document OCR

302 [ ] AI Plan Understanding

303 [ ] AI Extract Gross Area

304 [ ] AI Extract Useful Area

305 [ ] AI Extract Unit Count

306 [ ] AI Extract Parking Count

307 [ ] AI Extract Storage Count

308 [ ] AI Extract Floor Count

309 [ ] AI Extract Land Area

310 [ ] AI Extract Setbacks

311 [ ] AI Compare Plan vs Permit

312 [ ] AI Detect Missing Information

313 [ ] Render Gallery

314 [ ] Unit Gallery

315 [ ] Project Presentation Page

316 [ ] Automatic Sales Presentation

317 [ ] Customer Room / Showroom

318 [ ] Shareable Project Link


==================================================
K — PROJECT KPI / CONTROL CENTER
==================================================

319 [ ] KPI Engine

320 [ ] Project KPI Dashboard

321 [ ] Schedule KPI

322 [ ] Cost KPI

323 [ ] Procurement KPI

324 [ ] Quality KPI

325 [ ] HSE KPI

326 [ ] Sales KPI

327 [ ] Cash Flow KPI

328 [ ] Contractor KPI

329 [ ] Supplier KPI

330 [ ] Productivity KPI

331 [ ] Progress KPI

332 [ ] Delay KPI

333 [ ] Cost Overrun KPI

334 [ ] Procurement Delay KPI

335 [ ] Unit Sales KPI

336 [ ] ROI KPI

337 [ ] Profit Margin KPI

338 [ ] Custom KPI Builder

339 [ ] KPI Thresholds

340 [ ] KPI Alerts

341 [ ] KPI Trend Charts

342 [ ] KPI Drill-down


==================================================
L — WORKFLOW ENGINE
==================================================

343 [ ] Workflow Engine

344 [ ] Visual Workflow Builder

345 [ ] Trigger

346 [ ] Condition

347 [ ] Action

348 [ ] Approval

349 [ ] Notification

350 [ ] Assignment

351 [ ] Escalation

352 [ ] Deadline

353 [ ] Recurring Workflow

354 [ ] Conditional Workflow

355 [ ] Project Workflow Templates

356 [ ] Procurement Workflow

357 [ ] Sales Workflow

358 [ ] Contract Workflow

359 [ ] Construction Workflow

360 [ ] Accounting Workflow

361 [ ] AI Workflow

362 [ ] Human Approval Workflow

363 [ ] Workflow History

364 [ ] Workflow Audit

365 [ ] Custom Workflow per Project

366 [ ] Custom Workflow per Builder

367 [ ] Custom Workflow per User


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

377 [ ] Contract Templates

378 [ ] Contract Versioning

379 [ ] Contract Attachments

380 [ ] Contract Approval

381 [ ] Contract Signature Workflow

382 [ ] Contract Financial Obligations

383 [ ] Contract Milestones

384 [ ] Contract Breach Alerts

385 [ ] Contract-to-Project Link


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

399 [ ] Advisor KPI

400 [ ] Advisor Performance Scorecard


==================================================
O — CUSTOMER / PORTAL / SHOWROOM
==================================================

401 [~] Customer Portal

402 [~] Room

403 [~] Showroom

404 [~] Project Presentation

405 [~] Property Photos

406 [ ] Interactive Project Walkthrough

407 [ ] Floor Plan Viewer

408 [ ] Unit Selector

409 [ ] Unit Price Comparison

410 [ ] Customer Request Journey

411 [ ] Customer AI Assistant

412 [ ] Customer-specific Proposal

413 [ ] Customer-specific ROI

414 [ ] Customer Notifications

415 [ ] Appointment Workflow


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

425 [ ] AI Financial Intelligence

426 [ ] AI Procurement Intelligence

427 [ ] AI Sales Intelligence

428 [ ] AI Persistent Memory

429 [ ] AI Action Execution

430 [ ] AI Explanation Layer

431 [ ] AI Permission Layer

432 [ ] AI Approval Layer

==================================================
AA — PROJECT RESULT / ARCHITECTURE VISUALIZATION
==================================================

676 [ ] Immutable Project Result
677 [ ] Project Result Versioning
678 [ ] Project → Result → Room linkage
679 [ ] Room reads only analyzed project data
680 [ ] Architectural AI Review
681 [ ] 2D Front Elevation Generator
682 [ ] 2D Floor Plan Generator
683 [ ] Alternative Floor Plan Scenarios
684 [ ] 3D Floor Plan
685 [ ] Floor-by-floor Sale Price Engine
686 [ ] Configurable Floor Premium 3–5%
687 [ ] 3D Exterior Perspective
688 [ ] Multi-angle Project Views
689 [ ] 360° Project View
690 [ ] 4D Construction Visualization
691 [ ] Architecture → Financial Impact linkage
692 [ ] Plan → Unit → Price Matrix linkage

Dependencies:
676–679 → Audit / Versioning / Security / Customer Room
680–684 → Plan / Permit / Render Intelligence / Project Presentation
685–686 → Sales Engine / Unit Sales Matrix / Price Calculator
687–690 → Render Gallery / Project Presentation / Construction Control
691–692 → Cost Engine / Finance / Unit-level Profitability / Sales Strategy

Implementation rule:
These requirements are additive. They do not replace earlier checklist items.
They must be implemented as one connected Project Result layer, not as isolated features.

