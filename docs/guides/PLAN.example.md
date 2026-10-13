# Example engineering plan

> Reusable format example only. Replace every bracketed instruction with evidence from the current issue and worktree. This file is not approval to implement; get human approval for the actual task plan first.

**Approval record:** [Draft / Ready for human review / Approved for implementation. If approved, record date, scope, and approval reference. This field is informational only; it does not authorize implementation. Codex must ask for direct approval of the exact plan and operational prompt versions in the active conversation.]

## 1. Problem summary

[State the requested outcome and summarize the acceptance criteria in plain language.]

## 2. Verified state

- **Initial status check:** [record `git status --short --branch`; compare expected and actual changes before planning. Stop for unexpected or missing changes.]
- **Worktree:** [absolute path; confirm it is the intended linked worktree]
- **Branch and base:** [branch, current commit, upstream, and base comparison; state when the base reflects the last fetch]
- **Changes:** [separate tracked, staged, and untracked changes]
- **Relevant files:** [list files inspected and the evidence they provide]
- **Checks:** [list only checks actually run and their results]

## 3. Assumptions and open questions

- **Assumption:** [inference that affects the plan]
- **Open question:** [decision or fact that needs confirmation]

If there are none, write `None`.

## 4. Scoped implementation plan

1. [First compare actual worktree status with the verified expected state; stop before editing or staging if they differ.]
2. [Describe the smallest change that satisfies the request and name exact expected deliverable paths.]
3. [Call out anything outside scope separately.]

## 5. Acceptance mapping

| Acceptance criterion | Planned change | How it will be reviewed |
| --- | --- | --- |
| [Criterion] | [File or action] | [Check or inspection] |

## 6. Checks for the implementer

- `[command]` — [what it checks and whether it changes files or Git state]
- [List separate checks for tracked, staged, and untracked changes. For untracked files, give the exact whitespace-check method and explain any expected nonzero exit status.]
- [Do not report checks as passed until they have actually run.]

## 7. Risks and approval gates

- **Risk:** [material implementation or CI risk, or `None`]
- **Approval:** [human decision required before the next consequential action]

## 8. Codex handoff

- **Expected files:** [explicit paths; distinguish deliverables from ignored task-specific plan files]
- **Staging command:** [one explicit-path command; never use broad add-all commands]
- **Constraints:** [worktree boundaries, no-go actions, and required approvals]
- **Checks:** [commands Codex should run and report]
- **Stop condition:** [when Codex should pause and ask the human]
