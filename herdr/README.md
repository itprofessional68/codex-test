# Herdr workflow contract

`roles.yaml` records this repository's human-reviewed role policy. It is a repository-owned contract, **not a native Herdr configuration file** and is not automatically loaded by Herdr. The installed Herdr CLI version must be checked before building a dispatcher that consumes it.

Herdr's documented automation interface controls terminal panes and recognized agents. It does not define this repository's planner/implementer/reviewer permissions from `roles.yaml`. For now, follow the manual workflow in the root README and use Herdr only to host and observe CLI sessions. Do not automate approval, commits, pushes, pull requests, merges, or deployment.

The role contract is validated by this repository's dependency-free CI checks so changes to role names, prompt paths, or write permissions are reviewed with the rest of the workflow.
