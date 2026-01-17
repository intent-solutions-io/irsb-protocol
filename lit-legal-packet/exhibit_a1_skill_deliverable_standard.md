# EXHIBIT A.1: SKILL DELIVERABLE STANDARD

**Agreement No.:** LIT-2026-001
**Version:** 7.3
**Date:** January 16, 2026

*This Exhibit is incorporated into and forms part of the Services Agreement between Intent Solutions and Lit Protocol dated January 16, 2026.*

---

## A1.1 PURPOSE

This Exhibit defines the **Skill Deliverable Standard** that all Skills must conform to. Each Skill delivered under this Agreement shall meet the requirements set forth herein.

---

## A1.2 DIRECTORY STRUCTURE

Each Skill shall be delivered in the following directory structure:

```
skill-name/
├── SKILL.md                    # Required: Skill documentation
├── README.md                   # Required: Quick start guide
├── skill.yaml                  # Required: Skill configuration
├── NOTICE                      # Required: Third-party attributions
├── src/                        # Skill source code
│   ├── index.ts               # Main entry point
│   └── [additional modules]
├── tests/                      # Test files
│   ├── unit/                  # Unit tests
│   └── integration/           # Integration tests (if applicable)
├── examples/                   # Usage examples
│   ├── example-1.md           # At least 2 examples required
│   └── example-2.md
└── evidence/                   # Evidence Bundle (per phase)
    ├── checklist.md           # Acceptance checklist
    ├── test-results.md        # Test output summary
    └── [additional evidence]
```

---

## A1.3 NAMING CONVENTIONS

### Skill Directory Name
- Lowercase with hyphens
- Descriptive of skill function
- Example: `pkp-wallet-setup`, `lit-action-builder`

### File Names
- Lowercase with hyphens for markdown
- camelCase for TypeScript/JavaScript
- Example: `session-manager.ts`, `usage-example.md`

---

## A1.4 SKILL.md REQUIREMENTS

Each SKILL.md file shall include:

### Required Sections

| Section | Description |
|---------|-------------|
| **Title** | Skill name as H1 heading |
| **Description** | 1-2 paragraph description of skill purpose |
| **Prerequisites** | Required setup, dependencies, access |
| **Usage** | How to invoke the skill |
| **Parameters** | Input parameters with types and descriptions |
| **Output** | Expected output format |
| **Examples** | At least 2 usage examples |
| **Failure Modes** | Known failure scenarios and handling |
| **Limitations** | Scope limitations and disclaimers |
| **Version** | Skill version and compatibility |

### Example SKILL.md Structure

```markdown
# PKP Wallet Setup

## Description
Creates and configures Programmable Key Pairs (PKPs) for Lit Protocol...

## Prerequisites
- Lit Protocol TypeScript SDK v6+
- Claude Code v1.0+
- Testnet access

## Usage
Invoke with: "Create a PKP wallet for [use case]"

## Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| authMethod | string | Yes | Authentication method to bind |
| ...

## Output
Returns TypeScript code that creates a PKP wallet...

## Examples
### Example 1: Basic PKP Creation
...

### Example 2: PKP with Custom Auth
...

## Failure Modes
| Scenario | Behavior |
|----------|----------|
| Invalid auth method | Returns error with valid options |
| ...

## Limitations
- This skill generates code patterns, not runtime execution
- Security review recommended before production use

## Version
- Skill Version: 1.0.0
- Lit SDK Compatibility: v6.0.0+
- Claude Code Compatibility: v1.0.0+
```

---

## A1.5 README.md REQUIREMENTS

README.md provides a quick start guide:

### Required Content

| Section | Description |
|---------|-------------|
| **Title** | Skill name |
| **One-Line Description** | Brief description |
| **Quick Start** | Minimal steps to use |
| **Links** | Link to full SKILL.md |

### Example README.md

```markdown
# PKP Wallet Setup

Create and configure Programmable Key Pairs for Lit Protocol.

## Quick Start

1. Open Claude Code in a Lit Protocol project
2. Say: "Create a PKP wallet with Google OAuth"
3. Follow the generated code instructions

## Documentation

See [SKILL.md](./SKILL.md) for full documentation.
```

---

## A1.6 SKILL.YAML REQUIREMENTS

Configuration file for skill metadata:

```yaml
name: pkp-wallet-setup
version: 1.0.0
description: Create and configure Programmable Key Pairs
author: Intent Solutions
license: Proprietary

compatibility:
  lit_sdk: ">=6.0.0"
  claude_code: ">=1.0.0"

triggers:
  - "create pkp"
  - "pkp wallet"
  - "programmable key pair"

dependencies:
  - "@lit-protocol/lit-node-client"
  - "@lit-protocol/auth-helpers"

tags:
  - lit-protocol
  - pkp
  - wallet
  - authentication
```

---

## A1.7 NOTICE FILE REQUIREMENTS

NOTICE file lists all third-party components:

### Required Format

```
NOTICE

This skill includes the following third-party components:

1. @lit-protocol/lit-node-client
   License: MIT
   Copyright (c) Lit Protocol

2. @lit-protocol/auth-helpers
   License: Apache 2.0
   Copyright (c) Lit Protocol

[Additional components...]

---

Generated by Intent Solutions
Agreement: LIT-2026-001
```

---

## A1.8 TEST REQUIREMENTS

### Unit Tests

| Requirement | Description |
|-------------|-------------|
| Coverage | Core logic covered |
| Naming | Descriptive test names |
| Isolation | No external dependencies |
| Output | Pass/fail with clear messages |

### Test Output Format

```
SKILL TEST RESULTS
==================
Skill: pkp-wallet-setup
Date: 2026-01-20
Environment: Claude Code v1.0.0, Node v20.x

Unit Tests: 12/12 passed
- test_basic_pkp_creation: PASS
- test_oauth_integration: PASS
- test_invalid_auth_method: PASS
[...]

Integration Tests: 3/3 passed (if applicable)
- test_testnet_deployment: PASS
[...]

Linting: 0 errors, 0 warnings
```

---

## A1.9 EXAMPLES REQUIREMENTS

### Minimum Examples
At least **2 distinct examples** per skill.

### Example Structure

| Element | Required |
|---------|----------|
| Title | Yes |
| Description | Yes |
| Input | Yes |
| Expected Output | Yes |
| Explanation | Recommended |

### Example Format

```markdown
# Example 1: Basic PKP Creation

## Description
Create a simple PKP wallet with default settings.

## Input
"Create a PKP wallet for my dApp"

## Expected Output
[Code block showing generated TypeScript]

## Explanation
This example demonstrates the basic usage of the skill...
```

---

## A1.10 EVIDENCE BUNDLE REQUIREMENTS

Each Phase delivery includes an Evidence Bundle in the `/evidence` directory.

### Required Evidence

| Item | Description | Format |
|------|-------------|--------|
| **Acceptance Checklist** | Completed checklist | Markdown |
| **Test Results** | Test output summary | Markdown/Text |
| **Dependency Versions** | Locked versions used | JSON/YAML |
| **Changelog** | Changes in this delivery | Markdown |

### Optional Evidence (If Applicable)

| Item | Description | Format |
|------|-------------|--------|
| Screenshots | UI/output screenshots | PNG/JPG |
| CI Links | Links to CI runs | URL list |
| Performance Data | Timing/resource data | JSON |

### Acceptance Checklist Format

```markdown
# Acceptance Checklist: Phase 1

## Skills Delivered
- [x] PKP Wallet Setup
- [x] Lit Action Builder
- [x] Session Signature Manager
- [x] Auth Method Configuration
- [x] Access Control Conditions
- [x] Encrypt/Decrypt Workflows

## Quality Standards
- [x] All skills have SKILL.md
- [x] All skills have README.md
- [x] All skills have skill.yaml
- [x] All skills have NOTICE file
- [x] All skills have 2+ examples
- [x] All unit tests pass
- [x] No critical linting errors
- [x] Documentation complete

## Acceptance Criteria (per skill)
### PKP Wallet Setup
- [x] Generates working PKP wallet configuration code
- [x] Supports multiple auth methods
- [x] Includes error handling
- [x] Documentation accurate

[Repeat for each skill...]

## Sign-off
Submitted by: Intent Solutions
Date: 2026-01-XX
Delivery Notice: Sent via email on [date]
```

---

## A1.11 CODE QUALITY STANDARDS

### Style Guidelines
- Follow Claude Code skill conventions
- Consistent formatting
- Clear variable names
- Appropriate comments

### Linting Requirements
- No critical errors
- No high-severity warnings
- Warnings documented if intentional

### Documentation in Code
- JSDoc/TSDoc for public functions
- Inline comments for complex logic
- Type annotations (TypeScript)

---

## A1.12 COMPATIBILITY REQUIREMENTS

### Supported Environment

| Component | Version |
|-----------|---------|
| Lit Protocol TypeScript SDK | v6.0.0 or later |
| Claude Code | v1.0.0 or later |
| Node.js | v18.x or later |
| TypeScript | v5.x or later |

### Compatibility Statement
Each skill includes a compatibility statement in SKILL.md and skill.yaml.

### Breaking Changes
If a skill requires a specific SDK version:
- Document in SKILL.md
- Note in skill.yaml compatibility section
- Include in Evidence Bundle

---

## A1.13 SECURITY CONSIDERATIONS

### Security-Marked Skills
Skills marked with * in Appendix A include additional requirements:

| Requirement | Description |
|-------------|-------------|
| Security Disclaimer | Prominent disclaimer in SKILL.md |
| Limitation Section | Clear security limitations |
| Recommendation | Recommend professional audit |

### All Skills
- No hardcoded credentials
- No logging of sensitive data
- Input validation patterns
- Error handling without leaking information

---

## A1.14 DELIVERABLE VERIFICATION

### Self-Verification Checklist

Before submission, verify:

```markdown
## Pre-Submission Checklist

### Structure
- [ ] Directory structure matches A1.2
- [ ] All required files present
- [ ] Naming conventions followed

### Documentation
- [ ] SKILL.md complete with all sections
- [ ] README.md provides quick start
- [ ] skill.yaml populated correctly
- [ ] NOTICE file lists all dependencies
- [ ] 2+ examples provided

### Quality
- [ ] Unit tests pass
- [ ] Linting passes (no critical errors)
- [ ] Code formatted consistently
- [ ] Types properly annotated

### Evidence
- [ ] Acceptance checklist completed
- [ ] Test results documented
- [ ] Dependencies locked
- [ ] Changelog prepared
```

---

*End of Exhibit A.1*

*Agreement No. LIT-2026-001 | Version 7.3*
