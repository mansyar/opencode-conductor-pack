# Specification: /conductor:status Command

## 1. Overview
The `/conductor:status` command provides developers with an immediate, high-level summary of the current project's progress based on the Conductor `tracks.md` registry and individual track `plan.md` files. This command allows the AI and the user to inspect the state of the project, see completed tasks, current blockers, and pending tasks.

## 2. Functional Requirements
- **Command Registration**: Expose a `/conductor:status` slash command by registering it as a `tool` in the `ConductorPlugin`.
- **Context Resolution**: Locate `tracks.md` relative to the project root using the provided `directory` context.
- **Plan Parsing**:
  - Parse `tracks.md` for both standard (`- [ ] **Track:`) and legacy (`## [ ] Track:`) formats.
  - Resolve and read `plan.md` for each track via its index path.
  - Gracefully handle missing `plan.md` files by skipping them.
- **Status Calculation**:
  - Tally total phases (Markdown headings in `plan.md`), total tasks (list items with status checkboxes `[ ]`, `[x]`, `[~]`), completed tasks, in-progress tasks, and pending tasks.
- **Reporting Metrics**:
  - Tally the overall project progress (`completed / total` tasks).
  - Identify the currently "IN PROGRESS" (`[~]`) task and its phase.
  - Identify the target "PENDING" (`[ ]`) task (next action needed).
  - Extract explicitly marked "Blockers" from the plan if present.
- **User Presentation**:
  - **Toast Notification**: Use `client.tui.showToast` (variant: "success") to show the overall completion percentage.
  - **Detailed Summary**: Use `client.tui.appendPrompt` to inject the full markdown breakdown (Current Date/Time, Project Status, Current Phase, Next Action, Blockers, Breakdown) into the prompt area.

## 3. Non-Functional Requirements
- **Performance**: The command should process files rapidly without noticeable UI lag.
- **Resilience**: Skip tracks with missing or corrupt plan files without failing the whole command.

## 4. Acceptance Criteria
1. `/conductor:status` triggers a `success` variant toast with percentage summary.
2. The prompt area is populated with a formatted markdown summary of all tracks.
3. The printed summary accurately represents the state of `tracks.md` and `plan.md` files.
4. Missing track files do not crash the command.
