# ITP-517: GitHub ruleset configuration and observed behavior

This guide records the rulesets verified for `itprofessional68/codex-test` during ITP-517 and the results of the related test pull requests. It is a reference for human review; it does not change GitHub settings. Reopen the live rulesets and verify their current values before relying on this snapshot, since repository settings can change.

## Current verified rulesets

The ITP-517 read-back found two active repository rulesets targeting the default branch and `refs/heads/main`:

### Codex Test PR and CI Protection (ID `24935988`)

- Requires a pull request.
- Requires the GitHub Actions status check `validate` (integration ID `15368`) and requires the branch to be up to date.
- Requires review conversations to be resolved.
- Blocks branch deletion and non-fast-forward updates.
- Requires zero approving reviews in this ruleset.
- Has no bypass actors.

### Codex Test Review Requirement (ID `25066576`)

- Requires one approving review and resolution of review conversations.
- Lists only `itprofessional68` (user ID `22293977`) as a bypass actor, with **For pull requests only** scope.

This is the configured solo-maintainer exception: the bypass is attached to the review-only ruleset, while the PR and CI ruleset has no bypass. A bypass is not an approval. The configuration is intended to preserve the PR and CI requirements while allowing a solo maintainer to bypass the review requirement on a pull request; see the observed limitations below before depending on that behavior.

## Observed test outcomes

These results are observations from ITP-517, not guarantees about every future PR or GitHub UI state:

- A harmless documentation-only test PR passed `validate` and was merged using the review-only bypass.
- An intentional failing-`validate` test PR remained blocked from merge.
- A test PR with no required `validate` check remained blocked from merge.
- For the failing and missing-check PRs, GitHub did not expose the review-only bypass merge control. No bypass merge was submitted, and neither PR was merged; both were closed unmerged after verification.
- The rulesets were read back after the tests and were unchanged.

The failed and missing-check tests show that those PRs could not be merged in the tested state. Because GitHub did not expose the bypass control, they do not demonstrate what would happen if a different UI or API path attempted to invoke the review-only bypass while CI was unsatisfied. Do not infer that such a bypass attempt was made.

## Verify before using the configuration

In **GitHub → repository Settings → Rules → Rulesets**, reopen both rulesets and verify:

- [ ] Both are active and target the default branch and `main`.
- [ ] **Codex Test PR and CI Protection** requires PRs and the `validate` check, enforces up-to-date branches, protects against deletion and non-fast-forward updates, and has an empty bypass list.
- [ ] **Codex Test Review Requirement** requires one approval and lists only `itprofessional68` with **For pull requests only** scope.
- [ ] No other repository or organization ruleset targeting `main` adds a bypass or weakens the required PR, CI, or review controls.

Confirm the status-check identity in the current UI rather than relying solely on the previously observed integration ID. If names, targets, rules, bypass actors, or check identity differ from this record, stop and reconcile the configuration before using it.

## Safe fallback: one approval and no bypass

If the review-only bypass is unavailable, its scope is unclear, or the two-ruleset separation cannot be verified, use the conservative configuration:

1. Remove `itprofessional68` from the review-only ruleset's bypass list.
2. Keep the review-only ruleset active with one required approving review.
3. Keep the PR and CI ruleset active with its required PR, `validate`, branch-protection, and empty-bypass settings.
4. Reopen both rulesets and verify the saved configuration and combined coverage of `main`.

This fallback requires independent approval and may prevent a solo maintainer from merging. Do not replace it with zero required approvals or a bypass on the PR and CI ruleset merely to make solo merging possible.

## Operating guidance

For any PR, wait for `validate` to pass, review the complete diff, resolve review conversations, and confirm the required check still passes after the last change. A solo maintainer may use the review-only PR bypass only when GitHub clearly offers that scoped action and all PR/CI requirements are satisfied. If the control is absent or the resulting enforcement is unclear, stop and use the safe fallback; do not use an administrator override or bypass the PR and CI ruleset.

When an independent reviewer is available, remove the solo bypass actor and verify that one approval is required. Never use this exception to authorize direct pushes to `main`, agent merges, or merging a PR with a failing or missing required check.
