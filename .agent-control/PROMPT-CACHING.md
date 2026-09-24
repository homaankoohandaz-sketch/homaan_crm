# Prompt Caching Guide — BuildWise / Homaan CRM

Goal: keep stable instructions identical so Claude (and compatible gateways) can cache them at ~10% of normal input cost.

## 1. Claude explicit breakpoints (preferred)

Mark the **last stable content block** with:

```json
"cache_control": { "type": "ephemeral" }
```

For long sessions (agents that pause >5 min):

```json
"cache_control": { "type": "ephemeral", "ttl": "1h" }
```

### Recommended structure for Claude reviewer calls

```python
system = [
  {
    "type": "text",
    "text": open("CLAUDE.md").read() + "\n" + open("AGENTS.md").read(),
    "cache_control": {"type": "ephemeral", "ttl": "1h"}
  },
  {
    "type": "text",
    "text": short_protocol_and_gates,  # from PROTOCOL.md token section
    "cache_control": {"type": "ephemeral"}
  }
]

messages = [
  {
    "role": "user",
    "content": [
      {"type": "text", "text": task_contract_text},           # semi-stable
      {"type": "text", "text": state_summary},               # short only
      {"type": "text", "text": allowed_files_or_diff},       # variable
      {"type": "text", "text": user_or_tool_message}         # variable last
    ]
  }
]
```

### Tools
Place `cache_control` on the **last** tool definition so the whole tools prefix is cached:

```json
"tools": [
  { "name": "...", "...": "..." },
  {
    "name": "last_tool",
    "...": "...",
    "cache_control": { "type": "ephemeral" }
  }
]
```

## 2. Automatic caching (simple multi-turn)

Add at the top level of the request:

```json
"cache_control": { "type": "ephemeral", "ttl": "1h" }
```

The system places the breakpoint on the last cacheable block and advances it as the conversation grows.

## 3. Pre-warm (session start)

```python
client.messages.create(
  model="claude-sonnet-4-5",  # or current Sonnet
  max_tokens=0,
  system=[{
    "type": "text",
    "text": stable_system_text,
    "cache_control": {"type": "ephemeral", "ttl": "1h"}
  }],
  messages=[{"role": "user", "content": "warmup"}]
)
```

## 4. What invalidates the cache
- Any change to content **before** the breakpoint (tools, system text, earlier messages)
- Changing tool_choice, thinking params, or presence of images in some cases
- TTL expiry (5m default, 1h when requested)

## 5. Verify it works
Inspect response `usage`:
- `cache_creation_input_tokens` > 0 → write happened
- `cache_read_input_tokens` > 0 → hit (cheap)

If both are 0, the prompt was probably under the minimum token threshold or the prefix changed.

## 6. Master (ChatGPT) notes
- OpenAI automatic prefix caching works when the **exact same prefix** is sent first.
- Keep Master system prompt + tool schemas identical; put variable routing context last.
- Prefer cheaper models for pure classification/routing when quality allows.

## 7. Project rules
- CLAUDE.md and AGENTS.md are the primary stable documents — keep them short.
- Full specification is **on-demand only**.
- Every task contract should list `cache_keys` so orchestrators know what must stay fixed.
