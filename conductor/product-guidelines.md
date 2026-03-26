# Product Guidelines: OpenCode Conductor Plugin

## 1. Prose Style

**Technical & Precise** — All plugin documentation, command descriptions, and system messages use clear, unambiguous technical language. No jargon without definition. Every term is intentional.

- Use active voice
- Keep sentences concise (max 20 words average)
- Define acronyms on first use

## 2. Status Display

**Informative** — The plugin provides clear progress indicators and regular status updates during long-running operations.

- Show current phase: `[PLANNING]`, `[BUILDING]`, `[VERIFYING]`
- Display task completion: `✓ 3/7 tasks complete`
- Use spinners for indeterminate operations
- Show elapsed time for tracked operations

## 3. Naming Conventions

**CamelCase** — Commands and track IDs use CamelCase.

| Element | Convention | Example |
| :--- | :--- | :--- |
| Commands | `/conductor:newTrack` | `/conductor:newTrack`, `/conductor:buildFeature` |
| Track IDs | `shortNameYYYYMMDD` | `authFlow20260326`, `apiRefactor20260325` |
| File Names | kebab-case | `product-guidelines.md`, `code-styleguides/` |

## 4. Error Handling

**Blocking + Detailed** — The plugin stops immediately on validation failures with full context and suggested fixes.

- Error format:
  ```
  [ERROR] <Component>: <Short description>
  
  Context: <What happened>
  Expected: <What should have occurred>
  Suggestion: <How to fix>
  ```
- Never proceed past a validation failure
- Log all errors to `conductor/error.log`

## 5. Command Syntax

```
/conductor:setup              Initialize conductor structure
/conductor:newTrack <desc>     Create new track with description
/conductor:implement          Begin implementation of current track
/conductor:commit             Commit completed tasks (auto-generated message)
/conductor:status             Show current track and progress
```