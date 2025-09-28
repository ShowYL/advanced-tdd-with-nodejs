# CI: GitHub Actions for Tests

- **Workflow file**: `.github/workflows/ci.yml`
- **Purpose**: Run Jest tests in CI, including Testcontainers-based tests.
- **Runner**: `ubuntu-latest` (Docker available)
- **Node version**: From `.nvmrc` (22.20.0) via `actions/setup-node@v4`
- **Caching**: npm cache using `package-lock.json`
- **Install**: `npm ci`
- **Test command**: `npm test -- --ci --runInBand`
- **Docker check**: `docker info` to ensure Testcontainers can start
- **Triggers**:
  - Push to any branch
  - Pull requests
- **Concurrency**: Cancel in-progress runs for the same branch/ref
- **Permissions**: Minimal (`contents: read`)
- **Timeout**: 30 minutes

## How it works
1. **Checkout** the repo.
2. **Setup Node.js** from `.nvmrc` and enable npm cache.
3. **Install deps** with `npm ci`.
4. **Verify Docker** is available (required by `testcontainers`).
5. **Run Jest** in CI mode, in-band for stability.

## Usage
- Commit and push `.github/workflows/ci.yml`.
- Open a PR or push commits to trigger the workflow.
- First run may be slower due to Docker image pulls.

## Optional tweaks
- **Matrix**: multiple Node versions or OSes.
- **Artifacts**: upload `coverage/` if you want persisted reports.
- **Split jobs**: unit, integration, e2e as separate jobs.

## Badge (replace owner/repo)
```md
![CI](https://github.com/<owner>/<repo>/actions/workflows/ci.yml/badge.svg)
```
