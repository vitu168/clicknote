# Running This Project with Claude AI Agents

This guide explains how to let Claude Code agents check, review, and maintain this
project **from the terminal** — so routine quality work runs by AI instead of by hand.

---

## What's been set up

```
.claude/
├── settings.json          # permission allowlist (lets agents run checks without prompting you)
└── agents/
    ├── i18n-auditor.md     # finds hardcoded strings + missing Khmer translations
    ├── type-checker.md     # runs tsc + lint and fixes errors
    └── ui-reviewer.md      # reviews components for dark-mode, Tailwind v4, a11y
```

- **`settings.json`** pre-approves safe, read-only and check commands (`tsc`, `lint`,
  `git diff`, etc.) so agents don't stop to ask. Dangerous commands (`git push`,
  `rm -rf`, reading `.env`) are explicitly denied.
- **Sub-agents** are specialist Claudes with focused instructions. The main Claude
  delegates work to them automatically, or you can invoke one directly.

---

## 1. The two concepts

| Term | What it is |
|------|-----------|
| **Agent** | The main Claude session you talk to in the terminal (`claude`). |
| **Sub-agent** | A specialist defined in `.claude/agents/*.md`. Runs in its own context window with its own instructions and tool access. The main agent hands tasks to it. |

Each sub-agent file has YAML frontmatter (`name`, `description`, `tools`, `model`)
followed by its system prompt. The `description` tells the main agent *when* to use it.

---

## 2. Running from the terminal

### Interactive session
```bash
cd ~/projects/simple-yby
claude
```
Then just ask: *"Use the i18n-auditor to check the calendar module."*

### One-shot (runs and exits — best for automation)
```bash
# Run a check and print the result
claude -p "Use the type-checker agent to verify the whole project"

# Audit translations
claude -p "Run the i18n-auditor across src/ and fix any missing Khmer keys"

# Review a component
claude -p "Use the ui-reviewer on src/components/calendar/KhmerCalendar.tsx"
```

### Pipe a file in
```bash
cat src/lib/i18n.tsx | claude -p "list every key missing from the km locale"
```

### Hands-off mode (for scheduled / CI runs)
```bash
# Auto-approve safe actions, no interactive prompts
claude --auto-mode -p "Run type-checker and i18n-auditor, fix what you can, summarize"
```

---

## 3. Invoking a specific sub-agent

You don't call sub-agents with a special command — you **ask for them by name** and the
main agent routes the work:

```bash
claude -p "Use the i18n-auditor agent to audit src/app/(app)/settings"
claude -p "Have the type-checker fix all TypeScript errors"
claude -p "Ask the ui-reviewer to check dark-mode coverage in the messenger components"
```

---

## 4. Useful CLI flags

| Flag | Purpose |
|------|---------|
| `-p "..."` | One-shot print mode (run + exit, output to stdout) |
| `--auto-mode` | Judge each tool call's safety automatically — no prompts. Use for automation. |
| `--model sonnet` | Pick the model (`haiku` cheap/fast, `sonnet` balanced, `opus` strongest) |
| `--dangerously-skip-permissions` | Skip ALL permission checks. **Only inside a container**, never on your machine. |

---

## 5. Automating it (run "by AI, not by you")

### Option A — A check script
Create `scripts/ai-check.sh`:
```bash
#!/bin/bash
set -e
cd "$(dirname "$0")/.."

echo "▶ Type & lint check…"
claude --auto-mode -p "Use the type-checker agent. Fix all tsc and lint errors. Report a summary."

echo "▶ i18n audit…"
claude --auto-mode -p "Use the i18n-auditor agent. Find hardcoded strings and missing Khmer keys. Fix what's safe, list anything needing human review."
```
```bash
chmod +x scripts/ai-check.sh
./scripts/ai-check.sh
```

### Option B — Scheduled cloud routine
Inside an interactive `claude` session, type:
```
/schedule
```
Set a prompt like *"Run type-checker and i18n-auditor on simple-yby, open a PR with fixes"*
and pick a cadence (e.g. nightly). It runs on Anthropic's cloud without you present.

### Option C — Recurring during a session
```
/loop 30m "Use the type-checker to verify the project is still clean"
```

### Option D — GitHub Actions (runs on every PR)
```yaml
# .github/workflows/ai-review.yml
name: AI Review
on: pull_request
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx @anthropic-ai/claude-code -p "Use the ui-reviewer and type-checker agents on the PR diff. Report findings."
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

---

## 6. Adding your own sub-agent

Drop a new file in `.claude/agents/`, e.g. `.claude/agents/test-writer.md`:

```markdown
---
name: test-writer
description: Use to write Vitest/Jest tests for components and services.
tools: Read, Edit, Bash, Grep
model: sonnet
---

You write tests for this project using Vitest. Follow existing patterns,
mock Supabase via src/lib/supabase, and run `npx vitest run` to confirm they pass.
```

It's available immediately next time you start `claude`.

---

## 7. Safety notes

- Agents **cannot** `git push` or delete files recursively — denied in `settings.json`.
- `.env` files are blocked from being read.
- `--auto-mode` is safe for automation; `--dangerously-skip-permissions` is **not** for
  your local machine — only use it in disposable containers.
- Review what an agent changed with `git diff` before committing. Agents prepare work;
  you stay the final approver on anything that ships.

---

## Quick reference

```bash
# Everyday: ask the main agent, let it delegate
claude

# Check the whole project, hands-off
claude --auto-mode -p "Run type-checker and i18n-auditor, fix and summarize"

# Review one file
claude -p "Use ui-reviewer on src/components/notes/NoteCard.tsx"

# See what changed
git diff
```
