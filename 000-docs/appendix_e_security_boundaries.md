# APPENDIX E: SECURITY BOUNDARIES

**Agreement No.:** LIT-2026-001
**Version:** 7.3
**Date:** January 16, 2026

*This Appendix is incorporated into and forms part of the Services Agreement between Intent Solutions and Lit Protocol dated January 16, 2026.*

---

## E.1 SECURITY POSTURE

### Nature of Deliverables
Skills are provided as **developer productivity tools**. They generate code patterns and assist with development tasks. They are **not** security products or services.

### Security-Related Skills
The following Skills have **security scope limitations** (marked with * in Appendix A):

| Skill | Limitation |
|-------|------------|
| PKP DEX Aggregator | MEV protection patterns are best-effort; cannot guarantee MEV elimination |
| MEV Protection | Flashbots patterns reduce but do not eliminate MEV exposure |
| Lit Action Security Auditor | Provides checklists and patterns; not a security audit |
| Private Transaction Builder | Privacy depends on third-party services; not guaranteed |

---

## E.2 SECURITY SCOPE

### What IS Included

| Category | Description |
|----------|-------------|
| Secure coding practices | Code follows industry-standard secure coding guidelines |
| Input validation patterns | Basic validation and sanitization patterns in generated code |
| Credential handling | Skills handle Client-provided credentials securely during development |
| Output encoding | Proper encoding in generated code to prevent injection vulnerabilities |
| Error handling | Appropriate error handling that does not leak sensitive information |
| Documentation | Security considerations documented where applicable |

### What IS NOT Included

| Category | Description | Alternative |
|----------|-------------|-------------|
| Penetration testing | Active security testing of generated code | Engage security firm |
| Security auditing | Comprehensive security review | Engage audit firm |
| Vulnerability management | Ongoing vulnerability monitoring | Maintenance agreement |
| Incident response | Response to security incidents | Separate agreement |
| Compliance certifications | SOC 2, PCI-DSS, HIPAA, etc. | Compliance consultant |
| Guaranteed security outcomes | Warranty that code is "secure" | Not available |

---

## E.3 SECURITY DISCLAIMERS

> **IMPORTANT:** Read these disclaimers carefully. By executing this Agreement, Client acknowledges and accepts these limitations.

### Disclaimer 1: No Security Guarantee
Security-related Skills assist developers but **DO NOT guarantee security**. The Skills provide patterns and best practices; actual security depends on proper implementation, deployment, and ongoing maintenance.

### Disclaimer 2: MEV Protection Limitations
MEV protection patterns reduce exposure but **CANNOT eliminate MEV risk**. Malicious actors may develop new MEV extraction techniques. Complete MEV protection is not technically possible in public blockchain environments.

### Disclaimer 3: Transaction Privacy Limitations
Transaction privacy depends on **third-party services and network conditions**. Privacy cannot be guaranteed. Private mempool services may have their own vulnerabilities, may be discontinued, or may not provide absolute privacy.

### Disclaimer 4: Independent Review Required
Users **MUST conduct independent security reviews** before deploying generated code to production. Provider does not review final implementations or deployment configurations.

### Disclaimer 5: Professional Audit Recommended
**Professional audit services are recommended** for production deployments, particularly for applications handling significant value or sensitive data.

### Disclaimer 6: Pattern-Only Nature
Skills marked with * provide **patterns only**—not tested, audited security implementations. Client is responsible for validating patterns against their specific security requirements.

---

## E.4 SHARED RESPONSIBILITY MODEL

### Provider Responsibilities

| Area | Responsibility |
|------|---------------|
| Skill development | Develop Skills per specifications |
| Documentation | Document security considerations |
| Defect remediation | Fix Defects during Warranty Period |
| Secure development | Follow secure development practices |
| Credential protection | Protect Client credentials during engagement |

### Client Responsibilities

| Area | Responsibility |
|------|---------------|
| SDK stability | Maintain stable SDK without security regressions |
| Testnet security | Ensure testnet environment is appropriate for testing |
| Production decisions | Make all production deployment decisions |
| Security audits | Conduct security audits before production deployment |
| Vulnerability management | Monitor and patch vulnerabilities in production |
| Compliance | Ensure compliance with applicable regulations |
| Access control | Control access to deployed skills and credentials |
| User education | Educate end users on security limitations |

---

## E.5 DATA HANDLING

### During Engagement

| Category | Policy |
|----------|--------|
| Data access | Provider accesses only data necessary for the work |
| Test data | Should be anonymized or synthetic when possible |
| Production data | Accessed only when explicitly authorized in writing |
| Credential storage | Stored securely using industry-standard encryption |
| Data transmission | Transmitted via encrypted channels (HTTPS, SSH) |

### After Engagement

| Category | Policy |
|----------|--------|
| Data deletion | Provider deletes or returns Client data upon request |
| Retention | No Client data retained beyond project completion |
| Credentials | Revoked or returned per Client instructions |
| Backups | Automated backups destroyed within 30 days of completion |

### Data Breach
If Provider becomes aware of unauthorized access to Client data:
1. Provider notifies Client within 24 hours
2. Provider cooperates with Client's incident response
3. Provider preserves relevant evidence
4. Provider assists with regulatory notifications if required

---

## E.6 COMPLIANCE

### No Compliance Certifications
No specific compliance frameworks are included in this engagement. Provider does not hold, and is not certifying compliance with:
- SOC 2 (Type I or Type II)
- ISO 27001
- PCI-DSS
- HIPAA
- GDPR (as a processor)
- Any other compliance framework

### Compliance Support Available
If compliance support is needed, discuss as a potential scope addition via Change Order.

### Client's Compliance Obligations
Client is solely responsible for:
- Determining applicable compliance requirements
- Implementing appropriate controls
- Achieving and maintaining certifications
- Regulatory notifications and reporting

---

## E.7 INCIDENT NOTIFICATION

### Provider's Obligations
If Provider becomes aware of a potential security incident affecting Client data or systems during the engagement, Provider will:

| Step | Timing |
|------|--------|
| Notify Client | Within 24 hours of discovery |
| Provide details | To the extent known |
| Cooperate with investigation | As reasonably requested |
| Preserve evidence | As feasible and legal |
| Support remediation | As agreed |

### Limitations
This incident notification obligation:
- Applies only during the engagement period
- Does not constitute ongoing security monitoring
- Does not create liability for undetected incidents
- Ends upon completion of the engagement

### Post-Engagement
After engagement completion, Provider has no ongoing obligation to:
- Monitor for security incidents
- Notify Client of vulnerabilities discovered later
- Provide security updates or patches

These services are available via a Maintenance Agreement (Appendix F).

---

## E.8 SECURITY ACKNOWLEDGMENT

> **CLIENT ACKNOWLEDGMENT:** By executing this Agreement, Client acknowledges that:
>
> 1. Skills are **developer productivity tools**, NOT security products
> 2. Client is **solely responsible** for security audits of production deployments
> 3. Provider bears **no liability** for security incidents arising from Skill-generated code
> 4. **Professional security audits** are recommended before production deployment
> 5. Security-related Skills provide **patterns only**, not guaranteed security implementations

---

## E.9 SECURITY BEST PRACTICES

### Recommendations for Client

Provider recommends Client implement the following before production deployment:

| Category | Recommendation |
|----------|----------------|
| Code review | Conduct security-focused code review of generated code |
| Static analysis | Run static analysis security tools |
| Dynamic testing | Perform dynamic security testing |
| Penetration testing | Engage professional penetration testers |
| Key management | Implement robust key management practices |
| Access controls | Implement principle of least privilege |
| Monitoring | Deploy security monitoring and alerting |
| Incident response | Develop incident response procedures |
| Regular audits | Schedule regular security audits |

### Resources
- [OWASP Smart Contract Top 10](https://owasp.org/www-project-smart-contract-top-10/)
- [Lit Protocol Security Best Practices](https://developer.litprotocol.com/)
- Industry-standard security audit firms

---

*End of Appendix E*

*Agreement No. LIT-2026-001 | Version 7.3*
