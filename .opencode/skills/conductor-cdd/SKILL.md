---
name: conductor-cdd
description: Enforce structured Context-Driven Development natively in OpenCode
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: planning
---

## What I do
I provide the strict rulebook for executing tasks under a project's Context-Driven Development (CDD) framework. By using this skill, you (the agent) agree to:

- Suspend ad-hoc or impulsive coding behavior.
- Proactively read the project's state from the `conductor/` directory.
- Work exclusively within documented "Tracks" located in `conductor/tracks/`.
- Autonomously manage your own state by checking off completed tasks (`[x]`) in the active `plan.md` file *only after* verifying your work via terminal tests.

## When to use me
Use me whenever you are asked to implement a feature, fix a bug, or perform complex codebase modifications in a repository containing a `conductor/` directory.

## Operational Directives

### 1. Information Gathering
- Before making architectural, stylistic, or technological decisions, you **MUST** read `conductor/product.md` and `conductor/tech-stack.md`.
- Ensure all your code generation strictly obeys these documents. Do not hallucinate external frameworks.

### 2. Track Discipline
- Identify the user's current track by referencing the registry at `conductor/tracks.md`.
- Read the corresponding `spec.md` and `plan.md` for that specific track.
- If a user requests a task that is not covered by an active track plan, ask them if they want to run the `/conductor-newtrack` command to formalize the work.

### 3. The Checkbox Rule (CRITICAL)
- Execute the uncompleted steps (`[ ]`) in `plan.md` sequentially.
- You MUST use your file-editing tools to mark a checkbox as complete (`[x]`) in the `plan.md` file the exact moment step verification finishes. **Do not wait for the user to prompt you to update the plan.**

### 4. Zero Silent Failures
- You are not permitted to mark a task as complete without first running the testing or build scripts defined in `conductor/workflow.md`. 
- If a test fails in the terminal, you must diagnose and fix the issue before updating the checklist.
