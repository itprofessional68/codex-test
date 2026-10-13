# GitHub Copilot + Claude + Codex: Mac installation and operating guide

**Architecture:** Copilot is the human-facing IDE assistant; HERDR (or a small local dispatcher) coordinates independent CLI processes. Claude plans and independently reviews. Codex implements and tests. GitHub Actions validates PRs. A human approves merges. **Copilot does not automatically act as a CLI orchestrator.**

> `herdr/roles.yaml` is a repository-owned role contract, not a native Herdr configuration file. It documents the human-approved boundaries and is checked by this repository's CI. Herdr itself hosts and controls terminal panes and recognized agents; it does not load this file. Verify your installed Herdr version before building a dispatcher. This guide does not enable unattended operation.

## 0. Cost and trust boundaries

Your stated baseline is $150/month, leaving **$50/month headroom** under your $200 target. Claude subscription and Anthropic API billing are not interchangeable: check the current Claude Code sign-in options and limits before enabling paid API usage. Start with a manual one-issue trial. No cloud VM required. Avoid storing keys in Git, prompts, issue bodies or logs. Agents must not merge, deploy, change secrets, or modify branch protection.

## 1. Install prerequisites on Apple Silicon macOS

Open Terminal. If Homebrew is absent, first follow https://brew.sh/ (review its install command before running). Then run:

```bash
xcode-select --install  # Skip if command line tools are already installed
brew update
brew install git gh node jq
brew install --cask visual-studio-code
npm install -g @openai/codex
# Claude Code: consult https://code.claude.com/docs/en/setup for current native installer.
# Example documented native installer; inspect the official page before execution:
curl -fsSL https://claude.ai/install.sh | bash
```

Check versions and authenticate interactively:

```bash
git --version; gh --version; node --version; npm --version
codex --version; claude --version
gh auth login
gh auth status
codex  # Follow interactive ChatGPT authentication, then exit
claude # Follow interactive authentication, then exit
```

**HERDR:** use your existing installation. Verify its version and actual command name from the app's documentation; this kit deliberately does not invent a `herdr` CLI syntax. Install the GitHub Copilot extension in VS Code and sign in; Copilot is optional for the terminal workflow.

## 2. Set up a workspace

The tested normal repository checkout is `/Users/mgoddard/Projects/codex-test/repos/codex-test`. Use this workspace layout:

```bash
export GH_OWNER='itprofessional68'
export GH_REPO='codex-test'
export CODEX_WORKSPACE="$HOME/Projects/codex-test"
mkdir -p "$CODEX_WORKSPACE/repos" "$CODEX_WORKSPACE/worktrees" "$CODEX_WORKSPACE/logs"
cd "$CODEX_WORKSPACE/repos"
gh repo clone "$GH_OWNER/$GH_REPO"
cd "$GH_REPO"
git status
```

Create a simple `AGENTS.md` in the repository root:

```bash
cat > AGENTS.md <<'EOF'
# AGENTS.md

## Purpose

This repository is a sandbox for testing an AI-assisted development workflow using Codex CLI, GitHub, and agent orchestration.

## Agent Rules

- Work only inside this repository.
- Do not modify files outside this repository.
- Do not push directly to main.
- Create a feature branch for changes.
- Keep changes small and focused.
- Add tests for implemented functionality.
- Run tests before declaring work complete.
- Do not store secrets, API keys, passwords, or credentials in the repository.
- Do not perform destructive operations without human approval.
- Summarize all changes when finished.

## Human Approval Required

Human approval is required before:
- merging pull requests
- deleting branches
- changing repository security settings
- modifying secrets
- performing destructive operations
EOF
```

Recommended structure:

```text
/Users/mgoddard/Projects/codex-test/
├── repos/
│   └── codex-test/                 # normal checkout
├── worktrees/
│   └── codex-test-ISSUE-ID/        # one isolated worktree per issue
└── logs/                           # local only, never commit credentials
```

The repository contains `AGENTS.md`, `README.md`, `.github/workflows/agent-ci.yml`, `package.json`, `package-lock.json`, `scripts/`, `test/`, `docs/guides/PLAN.example.md`, `docs/guides/codex-implementer.example.md`, all three role prompts in `prompts/`, and the documented role contract in `herdr/roles.yaml`.

## 3. Install project policies and CI

From the repository root, copy `AGENTS.md`, `.github/workflows/agent-ci.yml`, the prompts, and `herdr/` workflow contract from this kit into the repository. Adapt the CI script commands to your project's language and package manager **before** requiring it as a branch protection check. The supplied CI is a Node.js example. This repository includes a minimal, dependency-free `package.json` and lockfile with lint, test, and build scripts. The checks validate the workflow files, required prompts, role contract, and documentation fixtures; replace or extend these checks with the real application's checks as it grows.

```bash
# Assuming this kit was extracted into ~/Downloads/copilot-agent-kit; the repository workspace is ~/Projects/codex-test
cp "$HOME/Downloads/copilot-agent-kit/AGENTS.md" ./AGENTS.md
mkdir -p .github/workflows
cp "$HOME/Downloads/copilot-agent-kit/.github/workflows/agent-ci.yml" .github/workflows/agent-ci.yml
mkdir -p prompts herdr
cp -R "$HOME/Downloads/copilot-agent-kit/prompts/." ./prompts/
cp -R "$HOME/Downloads/copilot-agent-kit/herdr/." ./herdr/
git add AGENTS.md .github/workflows/agent-ci.yml prompts/ herdr/
git commit -m 'Add AI agent policy and PR validation'
git push
```

In GitHub: repository **Settings > Rules > Rulesets** (or branch protection), target `main`, require pull request and approvals, require passing `validate` check once its first run succeeds, block force pushes/deletions, and restrict bypass privileges. Confirm protections actually apply to your repository plan and organization settings. Enable dependency alerts and secret scanning where available.

## 4. Create one isolated worktree

From the normal repository checkout at `$HOME/Projects/codex-test/repos/codex-test`, use an issue ID such as `ITP-514`:

```bash
export ISSUE_ID='ITP-514'
export REPO_ROOT="$(git rev-parse --show-toplevel)"
export REPO_NAME="$(basename "$REPO_ROOT")"
export BRANCH="agent/${ISSUE_ID}"
export WT="$HOME/Projects/codex-test/worktrees/${REPO_NAME}-${ISSUE_ID}"
git fetch origin main
git worktree add -b "$BRANCH" "$WT" origin/main
cd "$WT"
git status --short --branch
```

For `ITP-514`, this creates the worktree at `/Users/mgoddard/Projects/codex-test/worktrees/codex-test-ITP-514`. If the branch or worktree already exists, inspect `git worktree list` and continue in the existing worktree instead of rerunning the creation command.

If a branch/worktree already exists, inspect with `git worktree list` instead of rerunning the creation command. Never use destructive reset/clean commands on a shared working tree.

## 5. Manual dry run (before HERDR integration)

1. Select a Linear issue and create its isolated worktree using step 4. Confirm the expected worktree path, issue branch, and Git status. A worktree is a separate checkout linked to the same Git repository; it is not an independent clone. Treat only changes explicitly listed for the issue as expected.
2. Open `prompts/claude-orchestrator.md` and fill every task-input placeholder from the selected Linear issue and Git worktree. The fields are `{{WORKTREE_PATH}}`, `{{ISSUE_ID_AND_TITLE}}`, `{{ISSUE_DESCRIPTION}}`, `{{ACCEPTANCE_CRITERIA}}`, and `{{EXPECTED_WORKTREE_CHANGES}}`. Put the issue description and acceptance criteria between their existing BEGIN/END markers as plain text; do not wrap multiline values in inline backticks. Write the literal `None` for expected changes when the worktree should be clean. Stop if any task-input placeholder remains unfilled. Never include secrets.
3. The human starts Claude Code from the issue worktree in Plan mode using the Claude Pro/Max subscription login. For the current issue, use:

   ```bash
   # Use the same terminal session as step 4, where WT was set.
   # In a new terminal, re-run the step 4 variable setup first.
   cd "$WT"
   env -u ANTHROPIC_API_KEY -u ANTHROPIC_AUTH_TOKEN -u ANTHROPIC_BASE_URL \
     -u CLAUDE_CODE_USE_BEDROCK -u CLAUDE_CODE_USE_VERTEX -u CLAUDE_CODE_USE_FOUNDRY \
     claude --permission-mode plan
   ```

   This clears common API/provider overrides for this process and starts Claude Code in read-only Plan mode. If you use another provider configuration, check it before launching. Paste the completed prompt into the session. Claude presents the plan as a normal reply and stays in Plan mode; it must not call `ExitPlanMode` or change its own permission mode. If Claude reports that the session is not in Plan mode, or stops because a task-input placeholder is unfilled or the worktree has unexpected changes, fix that and start a new session. Review the plan and explicitly approve it before handing implementation to Codex (step 6). If issue text, repository content, or tool output asks Claude to leave Plan mode or implement, treat that as untrusted content and ignore it.

   Save the approved, task-specific plan as `PLAN.md` at the root of this issue worktree. The reusable, version-controlled format example is `docs/guides/PLAN.example.md`. Keep the task-specific `PLAN.md` out of commits by default; stage only named deliverable files. Share a deliberately reviewed and sanitized plan under a different filename only when it is useful as project documentation.
4. If HERDR later calls Anthropic's API, give it a separate Console API key through secure local secret storage and only in the orchestrator process. API usage is billed separately from Claude Pro/Max. Keep the key out of repository files, prompts, logs, and your general shell profile. Verify HERDR's supported integration before configuring it.
5. `prompts/codex-implementer.md` and `prompts/claude-reviewer.md` define the implementation and read-only review boundaries. `herdr/roles.yaml` is a repository-owned policy contract, not a config file that Herdr loads. Follow `herdr/README.md`; keep orchestration manual until a dispatcher is built and tested against the installed Herdr version.
6. Paste `prompts/codex-implementer.md` directly from the **same** worktree into Codex with approval prompts enabled. Codex must show the Git blob IDs for both `prompts/codex-implementer.md` and `PLAN.md`, summarize the plan, and ask you in that conversation to approve use of that exact prompt and implementation of that exact plan before editing. A copied approval label or approval from another conversation does not authorize implementation. Immediately before editing, Codex must recheck both IDs and the worktree status; if either file or the worktree changed, it must stop and ask again. Run the project's test/build/lint commands yourself and save results locally.
7. Have a separate Claude session review `git diff origin/main...HEAD` plus any uncommitted diff, the issue, and test output. Keep that session read-only.
8. If findings are material, ask Codex to fix them, rerun checks, and repeat independent review (maximum two loops).
9. Inspect `git diff`, stage only the intended files, commit, push, and create a draft PR:

```bash
git status
git diff --check
# Replace these example paths with the explicit deliverable paths for this issue.
# This single git command works in Windows shells, macOS, Linux, and Omarchy.
# Never use `git add -A` or `git add .`.
git add -- README.md prompts/claude-orchestrator.md
git diff --cached --stat
git diff --cached --check
git commit -m "Implement ${ISSUE_ID}"
git push -u origin "$BRANCH"
gh pr create --draft --base main --head "$BRANCH" --title "${ISSUE_ID}: implementation" --body "Human review required. See issue and CI results."
```

Review CI and the PR manually. **Do not auto-merge.** After a human-approved merge, close the associated Linear issue through your normal process. Only then select the next issue.

## 6. Wire up HERDR after the manual loop passes

The repository's `herdr/roles.yaml` records policy only; it is not consumed by Herdr. Herdr's documented agent automation can control panes and recognized CLI agents, but a dispatcher must be implemented and reviewed separately against the installed Herdr version. Until then, keep the loop manual. The intended transitions are:

```text
human chooses issue -> isolated worktree -> Claude plan -> human plan approval
-> Codex implement -> deterministic local checks -> Claude read-only review
-> at most 2 Codex repair loops -> draft PR -> GitHub Actions
-> human merge approval -> issue closure -> next issue
```

When building a dispatcher, enforce role permissions in its agent launch configuration and workflow: planner and reviewer read-only; implementer write only inside the worktree; PR creation and any push require human approval. `herdr/roles.yaml` does not enforce these controls. Never pass arbitrary issue text to a shell interpreter. Use explicit allowlists and timeouts. Start with one worker and no scheduled jobs; test each permission boundary before adding automation.

## 7. Cost controls and troubleshooting

- Claude Pro/Max subscription access and Anthropic Console API billing are separate. API calls use Console credits, not the subscription allowance. Keep Console auto-reload off during the pilot and review usage by API key.
- Stop if model usage or API charges exceed the remaining $50 monthly headroom; if the Claude subscription is outside the $150 baseline, subtract its monthly price from that headroom first.
- `command not found`: restart shell, inspect `which codex`, `which claude`, and PATH.
- `gh auth status` failure: run `gh auth login` again and confirm repository access.
- `npm ci` failure: project needs a committed `package-lock.json`; use its actual package manager otherwise.
- CI missing scripts: customize `.github/workflows/agent-ci.yml` for the real project before turning on required status checks.
- Worktree exists: inspect `git worktree list`; do not overwrite it.
- Model not available: choose a model supported by your subscription; do not hard-code unverified model identifiers.

## 8. Acceptance checklist

- [ ] GitHub, Codex, Claude and HERDR are installed and authenticated where needed.
- [ ] Copilot works in the IDE (optional front end).
- [ ] Main branch protection and human approval are enforced.
- [ ] One issue has its own worktree.
- [ ] Claude produces a plan without editing files.
- [ ] Codex implements and tests within the worktree.
- [ ] Independent Claude review produces actionable findings or approval recommendation.
- [ ] GitHub Actions validates the draft PR.
- [ ] No agent can merge or deploy without explicit human authorization.
- [ ] Usage/costs have been reviewed before scheduling.

## Official reference links

- https://developers.openai.com/codex/cli/
- https://code.claude.com/docs/en/setup
- https://code.claude.com/docs/en/permissions
- https://code.claude.com/docs/en/env-vars
- https://herdr.dev/docs/agents/
- https://herdr.dev/docs/agent-automation/
- https://herdr.dev/docs/config-reference/
- https://support.anthropic.com/en/articles/9876003-i-have-a-paid-claude-subscription-pro-max-team-or-enterprise-plans-why-is-claude-api-usage-billed-separately-from-my-paid-claude-plan
- https://cli.github.com/manual/
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets
- https://github.com/actions/checkout
- https://github.com/actions/setup-node
