# OpenCode Conductor Workflow Pack

Context-Driven Development (CDD) automated workflows natively built for OpenCode.

This package provides a strict CDD architecture via native OpenCode **Agents**, **Commands**, and **Skills**. It teaches OpenCode how to scaffold a self-documenting "brain" for your project (the `conductor/` directory), enforcing Test-Driven Development and rigorous task tracking.

## Installation

You do not need to install complex extensions. Simply initialize the workflows in any project by running:

```bash
npx opencode-conductor-pack
```

This will safely drop the exact `.opencode/` architecture into your project, instantly registering the commands and agent in your OpenCode IDE.

## Features & Usage

Once initialized, open your project in OpenCode. You now have access to:

### 1. The `@conductor` Agent
Type `@conductor` in chat to summon the dedicated CDD agent. The Conductor agent natively refuses to write ad-hoc code. It uses a custom system prompt to read your `conductor/product.md` vision, strictly follow `.plan.md` checkboxes, and enforce Test-Driven Development (TDD).

### 2. CDD Commands
Type the following slash commands in the chat to automate your software lifecycle:

*   `/conductor-setup` — Scaffolds the `conductor/` directory and interviews you to set up your product vision and tech stack.
*   `/conductor-newtrack` — Automated planning phase. Generates an intelligent, phased `plan.md` with checkboxes for a new feature.
*   `/conductor-implement` — Directs the agent to sequentially execute the uncompleted steps (`[ ]`) in your `plan.md`.
*   `/conductor-review` — Triggers a verification sweep to ensure standards and UI guidelines were met.
*   `/conductor-status` — Parses the exact progress of your project across all tracks.

### 3. The CDD Skill Base
Generic agents in your IDE will automatically read the bundled `.opencode/skills/conductor-cdd/SKILL.md` when tasked with codebase modifications, ensuring they respect your tracks and checklists even if you don't explicitly summon the `@conductor` agent!

## Development

If you wish to contribute or modify the inner workings:

1. Clone the repository.
2. Ensure you have your origin Gemini extension TOMLs saved in the expected user directory.
3. Run `npm run sync` to parse legacy `.toml` text schemas into native OpenCode markdown.

---
*Built natively for the OpenCode Agent Ecosystem.*
