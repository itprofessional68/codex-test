import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('CI workflow inputs and scripts exist', () => {
  for (const file of [
    'README.md',
    'AGENTS.md',
    '.github/workflows/agent-ci.yml',
    'prompts/claude-orchestrator.md',
    'prompts/codex-implementer.md',
    'prompts/claude-reviewer.md',
    'herdr/README.md',
    'herdr/roles.yaml',
    'scripts/validate-docs.js',
    'docs/guides/PLAN.example.md',
    'docs/guides/codex-implementer.example.md',
  ]) {
    assert.equal(existsSync(file), true, `${file} should exist`);
  }
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  for (const script of ['lint', 'test', 'build']) {
    assert.ok(pkg.scripts[script], `package.json should define ${script}`);
  }
});

test('role prompts preserve the planner, implementer, reviewer boundaries', () => {
  const implementer = readFileSync('prompts/codex-implementer.md', 'utf8');
  const reviewer = readFileSync('prompts/claude-reviewer.md', 'utf8');
  const herdrReadme = readFileSync('herdr/README.md', 'utf8');
  const roles = readFileSync('herdr/roles.yaml', 'utf8');

  assert.match(implementer, /approved plan/i);
  assert.match(implementer, /human approval before committing/i);
  assert.match(reviewer, /Do not edit files or change Git state/i);
  assert.match(herdrReadme, /not a native Herdr configuration file/i);
  for (const role of ['planner', 'implementer', 'reviewer']) {
    assert.match(roles, new RegExp(`^  ${role}:`, 'm'));
  }
});

test('orchestrator template is planning-only and identifies untrusted inputs', () => {
  const prompt = readFileSync('prompts/claude-orchestrator.md', 'utf8');
  assert.match(prompt, /claude --permission-mode plan/);
  assert.match(prompt, /untrusted task data/i);
  assert.match(prompt, /{{ISSUE_DESCRIPTION}}/);
  assert.match(prompt, /{{ACCEPTANCE_CRITERIA}}/);
  assert.match(prompt, /{{EXPECTED_WORKTREE_CHANGES}}/);
  assert.match(prompt, /literal `None`/);
  assert.match(prompt, /first BEGIN marker and the last matching END marker/);
  assert.match(prompt, /git --no-optional-locks status/);
  assert.match(prompt, /Do not edit, create, move, or delete files/);
});

test('guide explains the subscription/API split and role asset locations', () => {
  const readme = readFileSync('README.md', 'utf8');
  assert.match(readme, /claude --permission-mode plan/);
  assert.match(readme, /{{ISSUE_ID_AND_TITLE}}/);
  assert.match(readme, /{{EXPECTED_WORKTREE_CHANGES}}/);
  assert.match(readme, /literal `None`/);
  assert.match(readme, /billed separately from Claude Pro\/Max/);
  assert.match(readme, /prompts\/codex-implementer\.md/);
  assert.match(readme, /prompts\/claude-reviewer\.md/);
  assert.match(readme, /herdr\/roles\.yaml/);
  assert.match(readme, /not a native Herdr configuration file/i);
});

test('guide stages explicit paths and macOS metadata is ignored', () => {
  const readme = readFileSync('README.md', 'utf8');
  assert.doesNotMatch(readme, /^git add -A$/m);
  assert.match(readme, /^git diff --cached --check$/m);
  assert.match(readFileSync('.gitignore', 'utf8'), /^\.DS_Store$/m);
});

test('guide points to the plan template and keeps task plans out of Git', () => {
  const readme = readFileSync('README.md', 'utf8');
  assert.match(readme, /docs\/guides\/PLAN\.example\.md/);
  assert.match(readme, /Keep the task-specific `PLAN\.md` out of commits/);
  assert.match(readFileSync('.gitignore', 'utf8'), /^\/PLAN\.md$/m);
});
