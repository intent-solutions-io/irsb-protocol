# APPENDIX C: CLIENT RESPONSIBILITIES AND DEPENDENCIES

**Agreement No.:** LIT-2026-001
**Version:** 7.3
**Date:** January 16, 2026

*This Appendix is incorporated into and forms part of the Services Agreement between Intent Solutions and Lit Protocol dated January 16, 2026.*

---

## C.1 CLIENT RESPONSIBILITIES

Client agrees to provide the following in a timely manner to enable successful delivery:

### Required Provisions

| # | Responsibility | Deadline | Notes |
|---|---------------|----------|-------|
| 1 | GitHub repository access for skill delivery | Within 5 business days of Effective Date | Write access required |
| 2 | Lit SDK (latest TypeScript/JS version) | Within 5 business days of Effective Date | v6 or later |
| 3 | Testnet access (Chronicle Yellowstone or equivalent) | Within 5 business days of Effective Date | Must support testing |
| 4 | Testnet capacity credits for testing | Within 5 business days of Effective Date | Sufficient for skill testing |
| 5 | API documentation (latest developer docs) | Within 5 business days of Effective Date | Complete and current |
| 6 | Technical contact designation | Within 2 business days of Effective Date | With authority to approve |
| 7 | Test PKP wallet for integration testing | Within 5 business days of Effective Date | Pre-configured |
| 8 | Sample Lit Action (reference implementation) | Within 5 business days of Effective Date | Working example |

---

## C.2 DESIGNATED PRODUCT OWNER

Client shall designate a **Product Owner** with authority to:

- Accept or reject Deliverables on Client's behalf
- Provide feedback and approve revisions
- Respond to clarification requests
- Sign Change Orders up to $10,000

**Initial Product Owner:** [To be designated by Client]

**Changes:** Client may change the designated Product Owner upon written notice to Provider.

---

## C.3 COMMUNICATION EXPECTATIONS

### Response Times

| Request Type | Response Deadline |
|--------------|-------------------|
| Clarification questions | 2 business days |
| Acceptance decisions | 5 business days (per Review Period) |
| Change Order approval | 5 business days |
| Access/credential requests | 2 business days |
| Technical blockers | 1 business day |

### Communication Channels

- **Primary:** Email to designated contacts
- **Urgent:** Direct contact (phone/Slack if agreed)
- **Formal notices:** Per Master Agreement Section 15.6

### Escalation Path

| Level | Contact | When |
|-------|---------|------|
| 1 | Designated Product Owner | Day-to-day issues |
| 2 | [Client Manager TBD] | Unresolved issues after 3 business days |
| 3 | [Client Executive TBD] | Contract-level issues |

---

## C.4 CLIENT MATERIALS

### Definition
**"Client Materials"** includes any materials, data, specifications, documentation, or other information provided by Client to Provider for use in performing the Services.

### Examples of Client Materials
- Lit Protocol SDK and documentation
- Sample code and reference implementations
- Technical specifications and requirements
- Test credentials and access tokens
- Brand guidelines (if applicable)
- Feedback on Deliverables

### Client's Obligations Regarding Client Materials
Client represents and warrants that:
- Client has the right to provide Client Materials
- Client Materials do not infringe third-party rights
- Client Materials are accurate and complete to the best of Client's knowledge

### Treatment as Confidential Information
All Client Materials are treated as Client's Confidential Information unless otherwise marked.

---

## C.5 ACCESS REQUIREMENTS

Client will provide Provider with:

| Access Type | Purpose | Security |
|-------------|---------|----------|
| GitHub repository (write) | Skill delivery | Standard Git permissions |
| Lit testnet | Testing and validation | API keys via secure channel |
| Documentation portal | Reference materials | Read access |
| Slack/Discord (optional) | Real-time communication | Invitation to designated channel |

### Credential Management
- Provider will store credentials securely
- Credentials used only for this engagement
- Credentials returned/revoked upon completion
- Provider will not share credentials with third parties

---

## C.6 ASSUMPTIONS

This engagement assumes the following. If any assumption proves incorrect, a Change Order may be required:

### Client-Confirmed Assumptions

| Assumption | Impact if Incorrect |
|------------|---------------------|
| Lit provides SDK access and documentation within 5 business days of signing | Timeline delay |
| Lit provides testnet access and capacity credits | Cannot complete testing |
| Lit designates technical contact with 2-business-day response SLA | Review delays, potential deemed acceptance |
| Lit Protocol SDK is stable (no breaking changes during engagement) | Rework required |

### To-Be-Validated Assumptions

| Assumption | Validation Method | Impact if Incorrect |
|------------|-------------------|---------------------|
| Claude Code remains available and compatible | Ongoing monitoring | Force Majeure may apply |
| Lit testnet supports required functionality | Phase 1 testing | Scope adjustment needed |

---

## C.7 IMPACT OF DELAYS

### Timeline Extension
If Client delays in providing required dependencies:
- Project timeline extends **day-for-day** for the duration of the delay
- Provider not liable for resulting schedule impacts
- No additional fees for reasonable delays (under 10 business days)

### Material Delays (Over 10 Business Days)
For delays exceeding 10 business days:
- Provider may request a Change Order for context-switching costs
- Provider may reassign resources to other engagements
- Remobilization fee of $2,500 may apply

### Review Period Delays
If Client fails to respond within Review Periods:
- **Deemed Acceptance** applies per Appendix B
- Payment milestone is triggered
- Provider may proceed to next Phase

---

## C.8 FAILURE TRIGGERS

Client's failure to meet obligations triggers the following:

### Schedule Extension Triggers

| Trigger | Effect |
|---------|--------|
| Late provision of Client Materials | Day-for-day extension |
| Late response to clarification requests | Day-for-day extension |
| Late access/credential provision | Day-for-day extension |
| Testnet unavailability (Client-controlled) | Day-for-day extension |

### Change Order Triggers

| Trigger | Effect |
|---------|--------|
| Client Materials materially incomplete | Change Order for investigation |
| Requirements change after Phase start | Change Order for rework |
| SDK breaking changes (Client-initiated) | Change Order for remediation |
| Additional review cycles beyond 2 | Change Order for revision fees |

### Deemed Acceptance Triggers

| Trigger | Effect |
|---------|--------|
| No response within Review Period | Deemed Acceptance |
| Invalid rejection (lacks required elements) | Clock continues until valid rejection |
| Rejection on non-criteria grounds | Not valid; Deemed Acceptance applies |

---

## C.9 CLIENT COOPERATION

### General Cooperation
Client shall:
- Provide reasonable access to information and personnel
- Respond promptly to inquiries within stated timelines
- Escalate internal blockers promptly
- Notify Provider of any changes affecting the engagement

### Non-Interference
Client shall not:
- Modify Deliverables in repository before Acceptance
- Share Provider credentials with unauthorized personnel
- Make SDK changes that could affect Deliverables without notice
- Withhold information material to the engagement

---

## C.10 DEPENDENCY VERIFICATION

### Dependency Checklist (Pre-Kickoff)

Provider will verify the following before Phase 1 begins:

- [ ] GitHub repository access confirmed
- [ ] Lit SDK access confirmed (version documented)
- [ ] Testnet access confirmed (network documented)
- [ ] Capacity credits available
- [ ] Technical contact designated
- [ ] Communication channels established
- [ ] Sample Lit Action provided

### Kickoff Dependency Completion
All dependencies must be verified before the Phase 1 timeline begins. Timeline starts on the later of:
- Effective Date
- Dependency verification completion

---

*End of Appendix C*

*Agreement No. LIT-2026-001 | Version 7.3*
