# APPENDIX B: ACCEPTANCE AND CHANGE CONTROL

**Agreement No.:** LIT-2026-001
**Version:** 7.3
**Date:** January 16, 2026

*This Appendix is incorporated into and forms part of the Services Agreement between Intent Solutions and Lit Protocol dated January 16, 2026.*

---

## B.1 ACCEPTANCE PROCESS

Each Deliverable follows this acceptance workflow:

### Step 1: Delivery Notification
Provider notifies Client of Deliverable completion via:
- Written email to designated Client contact
- Specification of repository location
- Identification of Deliverables included
- Confirmation that Evidence Bundle is complete

### Step 2: Review Period
Client has **five (5) business days** from Delivery Notification to review Deliverables.

### Step 3: Acceptance or Rejection
Client must provide **written response** within the Review Period:
- **Acceptance:** Written confirmation that Deliverables meet Acceptance Criteria
- **Rejection:** Written notice specifying Defects per Section B.3

### Step 4: Revision (If Needed)
- Provider addresses valid Defects within commercially reasonable time
- **Up to two (2) revision rounds** included per Phase
- Additional revision rounds require a Change Order

### Step 5: Final Acceptance
- Written confirmation from Client, OR
- Deemed Acceptance per Section B.4

---

## B.2 ACCEPTANCE CRITERIA

A Deliverable is considered acceptable when:

| Criterion | Description |
|-----------|-------------|
| **Functionality** | Performs the functionality described in the scope |
| **Specific Criteria** | Meets the specific Acceptance Criteria listed in Appendix A |
| **No Critical Defects** | Free of critical Defects that prevent core functionality |
| **Documentation** | Documentation is complete and accurate |
| **Evidence Bundle** | Evidence Bundle is complete per Exhibit A.1 |

---

## B.3 REJECTION REQUIREMENTS

A valid rejection **must** include:

| Requirement | Description |
|-------------|-------------|
| **Specific Deliverables** | Identify which Deliverable(s) are being rejected |
| **Detailed Defects** | Describe each Defect in detail with steps to reproduce |
| **Criteria Reference** | Reference specific Acceptance Criteria not met |
| **Environment** | Specify environment where Defect was observed |
| **Contact** | Provide contact information for follow-up |

### Invalid Rejections

The following do **not** constitute valid rejection:

- General dissatisfaction without specific Defects
- Preference or style concerns not in Acceptance Criteria
- Requests for functionality not in original Scope of Work
- Issues arising from Client modifications
- Issues arising from use outside Supported Environment

**Invalid rejections do not stop the Review Period clock.** Client must provide a valid rejection before the Review Period expires to prevent Deemed Acceptance.

---

## B.4 DEEMED ACCEPTANCE

> **DEEMED ACCEPTANCE:** Deliverables will be deemed accepted if Client does not provide written notice of specific Defects within five (5) business days of Delivery Notification. Failure to reject within this window constitutes final and irrevocable acceptance.

### Effect of Deemed Acceptance
- Payment milestone is triggered
- Warranty Period begins
- Deliverable is considered complete

### Avoiding Deemed Acceptance
To avoid Deemed Acceptance, Client must:
1. Provide written rejection before Review Period expires
2. Include all required elements per Section B.3
3. Reference specific Acceptance Criteria not met

---

## B.5 DEFECT DEFINITION

### What Constitutes a Defect

A **"Defect"** is a reproducible failure of a Deliverable to conform to its documented Acceptance Criteria when operated in a Supported Environment.

### Defect Requirements
- **Reproducible:** Can be consistently reproduced following specific steps
- **Documented Criteria:** Fails to meet criteria explicitly stated in Appendix A
- **Supported Environment:** Occurs in the Supported Environment defined in the Agreement

### What Is NOT a Defect

| Category | Description |
|----------|-------------|
| Enhancement | New functionality not in original scope |
| Preference | Stylistic or preference-based concerns |
| Environment | Issues in unsupported environments |
| Modification | Issues caused by Client modifications |
| Third-Party | Issues caused by third-party changes (SDK, Claude Code, etc.) |

---

## B.6 WARRANTY

### Warranty Period
**Sixty (60) days** from Acceptance of each Deliverable.

### Warranty Coverage

| Covered | Not Covered |
|---------|-------------|
| Defects in delivered work | Changes to Lit SDK breaking compatibility |
| Issues from delivered code | Changes to Claude Code breaking compatibility |
| Functionality not matching specifications | Client modifications to Deliverables |
| | Issues in Client's infrastructure |
| | Third-party service outages |

### Bug vs. Change Request

| Bug (Warranty Covered) | Change Request (Requires Change Order) |
|------------------------|---------------------------------------|
| Delivered work does not function as specified | New functionality not in original scope |
| Regression from previously working functionality | Modifications to accepted Deliverables |
| Critical error preventing core use | Enhancements beyond specifications |

### Platform Dependency Clause

> Provider is not liable for functionality failures caused by changes to third-party platforms (including but not limited to Claude Code, Anthropic API, Lit Protocol SDK, or other third-party services) occurring after delivery and acceptance of a Deliverable. Remediation of third-party platform changes after acceptance will be handled as a Change Order at standard rates, or under a maintenance agreement if one is in place.

---

## B.7 CHANGE CONTROL

### Change Order Requirement

> Any request to alter the Scope of Work that materially impacts timeline or cost must be submitted via a signed Change Order. Provider is not obligated to perform out-of-scope work until a Change Order is executed by both parties.

### Change Order Process

| Step | Action | Timeline |
|------|--------|----------|
| 1 | Client submits written change request | - |
| 2 | Provider assesses impact | Within 3 business days |
| 3 | Provider prepares Change Order document | Within 2 business days of assessment |
| 4 | Client reviews and signs Change Order | - |
| 5 | Work proceeds upon execution | - |

### Change Order Contents

A Change Order includes:
- Description of requested changes
- Impact on timeline (if any)
- Additional cost (if any)
- Updated Acceptance Criteria
- Signatures from both parties

### Standard Change Fees

| Change Type | Fee |
|-------------|-----|
| Swap skill (same complexity, before phase starts) | No charge |
| Add skill to phase | +$5,000 per skill |
| Change skill mid-phase | +$2,500 change fee |
| Remove skill before phase starts | Credit for future work |
| Rush assessment (same-day response) | +$500 |

---

## B.8 MULTIPLE REVIEW CYCLES

### Included Revision Rounds
- **Two (2) revision rounds** are included per Phase
- Revision rounds apply only to **Defect remediation**
- Each round has a 5-business-day review period

### Additional Revision Rounds
Beyond the included two rounds:
- Require a signed Change Order
- Standard fee: $2,500 per round
- New Acceptance Criteria if scope has changed

### Scope of Revisions
Revision rounds are limited to:
- Correcting documented Defects
- Addressing specific Acceptance Criteria failures
- Fixing reproducible issues in Supported Environment

Revision rounds do **not** include:
- New functionality requests
- Preference-based changes
- Changes to accepted Deliverables

---

## B.9 PAYMENT TRIGGERS

### Invoice on Delivery Notice
Provider shall issue invoice upon sending Delivery Notice for each Phase.

### Payment Not Conditioned on Acceptance
Payment is due per the Payment Schedule regardless of:
- Pending review period
- Ongoing revision rounds
- Disputed Defects (undisputed amounts due)

### Dispute Resolution
- Client must pay undisputed amounts on time
- Disputed amounts resolved per Section 5.6 of Master Agreement
- Invalid disputes do not delay payment obligations

---

*End of Appendix B*

*Agreement No. LIT-2026-001 | Version 7.3*
