import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = [
  'AGENTS.md',
  'README.md',
  '.github/workflows/agent-ci.yml',
  'prompts/claude-orchestrator.md',
  'prompts/codex-implementer.md',
  'prompts/claude-reviewer.md',
  'herdr/README.md',
  'herdr/roles.yaml',
  'package.json',
  'package-lock.json',
  'test/workflow.test.js',
];

const missing = requiredFiles.filter((file) => !existsSync(file));
if (missing.length > 0) {
  console.error(`Missing required CI fixture files: ${missing.join(', ')}`);
  process.exit(1);
}

const readme = readFileSync('README.md', 'utf8');
const prompt = readFileSync('prompts/claude-orchestrator.md', 'utf8');
const roles = readFileSync('herdr/roles.yaml', 'utf8');
const workflow = readFileSync('.github/workflows/agent-ci.yml', 'utf8');
if (!readme.includes('claude --permission-mode plan')) {
  throw new Error('README must document Claude Code Plan mode.');
}
if (!prompt.includes('{{EXPECTED_WORKTREE_CHANGES}}')) {
  throw new Error('Orchestrator prompt must include the expected-change input.');
}
for (const role of ['planner', 'implementer', 'reviewer']) {
  if (!new RegExp(`^  ${role}:`, 'm').test(roles)) {
    throw new Error(`HERDR role contract is missing ${role}.`);
  }
}
if (!roles.includes('not a native Herdr config file')) {
  throw new Error('HERDR role contract must state that it is not a native Herdr config.');
}
for (const script of ['npm run lint', 'npm test', 'npm run build']) {
  if (!workflow.includes(script)) {
    throw new Error(`CI workflow is missing required check: ${script}`);
  }
}

console.log('Documentation, role prompts, HERDR role contract, and CI checks are present.');
