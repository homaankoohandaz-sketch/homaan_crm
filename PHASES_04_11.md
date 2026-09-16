# Phase 04–11 Implementation

## 04 — Land / Construction / ROI / Scenario
Tables: `construction_projects`, `project_scenarios`.
Frontend calculates base profit/ROI and stores scenario inputs/outputs.

## 05 — Market Price / Valuation
Table: `market_observations`, `valuations`.
RPC: `crm_market_value(property_id)` uses comparable observations and median price/m².

## 06 — Matching / Scoring / Deal Radar
Table: `property_matches`, `deal_radar`.
RPCs: `crm_match_score`, `crm_run_matching`, `crm_deal_radar`.

## 07 — Dashboard
Unified dashboard aggregates property, lead, deal, task and radar signals.

## 08 — ROOM / Photo / Plan / 3D
Table: `media_assets` with `photo`, `plan`, `3d`, `video`, `document` asset types. This is the asset registry layer; actual rendering remains an external renderer/AI job.

## 09 — n8n / Telegram
Existing active Supabase Edge Function `telegram-bot` handles Telegram intake, session state, lead creation and duplicate-identity alerts. Frontend exposes webhook setup and n8n webhook configuration.

## 10 — AI / Voice
Existing active Edge Function `ai-orchestrator` provides CRM tools for property search, identity checks and request creation. Browser Speech Recognition/Synthesis is used for voice input/output without storing raw voice unless explicitly added later.

## 11 — Learning Engine
Table: `learning_events`; RPC: `crm_record_learning(...)`. Events can store input, outcome and reward for later model/ranking improvement.

## Security
All new phase tables use RLS. New RPCs require an active authenticated CRM user. AI service keys remain server-side in Edge Function secrets.