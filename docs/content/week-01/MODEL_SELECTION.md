# Copilot Model Selection — “Cheap first, expensive when justified”

## What “cheap” means in Copilot Enterprise
Copilot Enterprise includes unlimited usage of certain “included models” (they do not consume premium requests),
and provides a monthly premium request allowance for “premium” models.

Key points:
- Paid plans: unlimited chat with included models.
- Premium models consume premium requests using a “multiplier.”
- Copilot Enterprise premium allowance is per-user per-month (see plan limits).
- Auto model selection can apply a discount to multipliers (where supported).

(References: GitHub Copilot request allowances + multipliers; Copilot plan premium allowances.)

## The “cheap” models to start with (Week 1 recommendation)
### Tier 0 (no premium request consumption on paid plans)
Use these as defaults for Week 1:
- GPT-5 mini (0x)
- GPT-4.1 (0x)
- GPT-4o (0x)

### Tier 1 (low multiplier premium models)
Use these when you want faster or lightweight help without burning quota:
- Grok Code Fast 1 (0.25x)
- Claude Haiku 4.5 (0.33x)
- Gemini 3 Flash (0.33x)
- GPT-5.1-Codex-Mini (0.33x)

### Tier 2 (standard premium models: 1x)
Use these only when needed for complex work:
- Claude Sonnet 4 / 4.5 (1x)
- Gemini 2.5 Pro (1x)
- GPT-5 / GPT-5.2 / GPT-5-Codex (1x)

### Tier 3 (expensive; avoid for routine work)
- Claude Opus 4.5 (3x)
- Claude Opus 4.1 (10x)

## How to choose a model (simple rules)
1) Default work (most coding + writing):
   - GPT-5 mini is a reliable general default.
2) Quick edits / repetitive tasks:
   - Claude Haiku 4.5 or Grok Code Fast 1.
3) Multi-step debugging / architecture-level reasoning:
   - GPT-5.2 or Claude Sonnet 4 (use intentionally).
4) If quota usage becomes a concern:
   - Stay on Tier 0 models until an exception is justified.

## Week 1 policy (recommended)
- Default: Tier 0 models.
- Tier 1 allowed for speed when needed.
- Tier 2 requires: “reason for premium model” in PR summary.
- Tier 3 requires: explicit lead approval during Week 1.

## Notes for lead/admins
- Verify which models are enabled for your Enterprise and IDEs.
- Establish a budget/guardrails for premium overage if your org allows paid overage.
