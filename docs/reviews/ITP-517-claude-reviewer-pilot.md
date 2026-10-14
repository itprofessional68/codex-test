# ITP-517 Claude reviewer pilot — QA record

**Date:** 2026-10-14
**Purpose:** Record Claude Code's read-only review as QA evidence. This is not a GitHub review, independent human approval, or merge authorization.

## Review setup

- **Reviewer prompt:** `prompts/claude-reviewer.md`, Git blob `62647da0aa3d67eba9ff6b2c40253b07148c6848`.
- **Claude Code:** 2.1.300, Sonnet, Plan mode; read tools only (`Bash`, `Read`, `Glob`, `Grep`); MCP and Chrome integrations disabled; session persistence disabled.
- **Issue:** ITP-517, Configure and verify solo-maintainer GitHub rulesets.
- **Review base:** `e9114f05b83e72e5d8b1706b87f0de0aa67e2d1b`.
- **Review commit:** `548d375b805f7e50a726bd1b00887f2d372e4ad3`, PR #10 merge commit.
- **Reviewed path:** `docs/guides/ITP-517-manual-ruleset-setup.md`; blob `33d0466868a2de03c6e3048e3c0526509a845f19`.
- **Target state:** detached at the supplied review commit; clean before and after review, with no staged, unstaged, or untracked files.
- **Scope provenance:** the user directly requested the guide additions in this conversation. No standalone `PLAN.md` or separate formal plan-approval record existed; the review explicitly reported that limitation.
- **Check evidence:** GitHub Actions run [38652371300](https://github.com/itprofessional68/codex-test/actions/runs/38652371300) passed for PR #10. The exact change also passed local `npm test` (7 tests), `npm run lint`, `npm run build`, and `git diff --check` before commit.

## Post-review follow-up

Claude noted that PR #6's Actions run ID might be discoverable even though it was not in ITP-517's issue text. After the review, a GitHub workflow-run lookup for PR #6's head commit `10b92ce2131852e898081f303963e6e7b34d0350` found [run 38648657551](https://github.com/itprofessional68/codex-test/actions/runs/38648657551), completed successfully. The guide's wording that the ID was not recorded in the available **issue evidence** remains accurate, but the run is available from GitHub and could be linked in a future documentation update. This follow-up is Codex evidence, not part of Claude's reviewed snapshot.

## Claude's review output

The following is Claude Code's output, preserved verbatim:

> ## Findings
>
> **No actionable findings.**
>
> Observations that are not defects:
>
> - **Minor / optional (`docs/guides/ITP-517-manual-ruleset-setup.md:31`):** The PR #6 run ID is stated as "not recorded in the available issue evidence." That matches the acceptance criterion. The run is likely discoverable from PR #6's head commit `10b92ce` via GitHub. A later edit could add it if the maintainer wants completeness, but omitting it is not inaccurate.
> - **Verification limit (line 7):** The Linear link (`linear.app/.../ITP-517`) and the claim that the read-back is recorded there could not be verified. I have no access to Linear. The link is also not the same as the UI read-back method, so the claim is only as good as the maintainer's statement.
> - **Verification limit (lines 7, 35):** The 2026-10-14 UI read-back and the "unchanged" result are maintainer-reported and not independently verifiable. Reading the live ruleset settings was out of scope for this documentation review.
>
> ## Review identity
>
> - Base SHA: `e9114f05b83e72e5d8b1706b87f0de0aa67e2d1b`. It resolves to a commit and is an ancestor of the review SHA.
> - Review SHA: `548d375b805f7e50a726bd1b00887f2d372e4ad3`. `HEAD` matched exactly (detached HEAD).
> - Changed paths in the range: only `docs/guides/ITP-517-manual-ruleset-setup.md` (M). This matches the expected list.
> - Worktree: clean. Nothing staged, unstaged, or untracked, as expected.
> - Plan identity: external scope taken from the user's direct request, with no plan file or blob. No separate formal plan-approval record exists, which is a verification limit. I did not treat the request as approval of a separate plan.
> - Target stability: `HEAD`, status, and the guide's blob hash (`33d0466868a2de03c6e3048e3c0526509a845f19`) were unchanged between the start and end of the review.
>
> ## Acceptance criteria
>
> 1. **Links to PR #6, #8, and #7: met.** Lines 31–33 link the passing PR #6, failing PR #8, and missing-check PR #7. The `gh` metadata confirms #6 is MERGED and #7 and #8 are CLOSED and unmerged. The titles match the roles described.
> 2. **Runs for #7 and #8 linked, PR #6 run ID stated as not recorded: met.**
>    - Run 38649556897 belongs to PR #8's head SHA `f118e4a`. Its `validate` job concluded failure.
>    - Run 38649551357 belongs to PR #7's head SHA `7d23ca5`. Its job was named `validate_missing_check_probe` and concluded success, which matches the "renamed job / required context absent" description.
>    - Line 31 states that PR #6's run ID is not recorded.
> 3. **Read-back date and method: met.** Lines 7 and 35 give 2026-10-14 and the method: reopening both rulesets in Settings → Rules → Rulesets after the behavioral probes.
> 4. **Observed vs. untested distinction; no bypass attempt claimed on #7/#8: met.**
>    - Line 34 and lines 37–38 state that the bypass control was not exposed and that no bypass merge was submitted.
>    - They explicitly say not to infer that a bypass attempt was made, and that other UI or API paths are untested.
>    - The guide makes no independent-reviewer end-to-end claim.
>
> ## Checks
>
> - **GitHub Actions run 38652371300:** pass. It is a `pull_request` event with `conclusion: success`, head SHA `ca1e5ce…` as claimed, and a `validate` job that succeeded. Verified via `gh run view`.
> - **Local `npm test`, `npm run lint`, `npm run build`, and `git diff --check`:** not independently verified. They were reported by the implementer and I did not run them, per the read-only role.
>
> ## Limits
>
> - No formal plan-approval record exists beyond the user's request.
> - I did not verify the live GitHub ruleset settings, ruleset IDs (`24935988`, `25066576`), integration ID `15368`, or user ID `22293977`. This is a documentation review.
> - The Linear issue content and the claims that bypass controls were absent or that no bypass merge was submitted are maintainer-attested. GitHub data confirms only that #7 and #8 were unmerged.
> - I did not compare the review SHA to PR #10's merge commit; I reviewed only the supplied SHA.
> - This is QA evidence only. It is not a GitHub review, human approval, or authorization to merge.
