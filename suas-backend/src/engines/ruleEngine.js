class RuleEngine {
    static analyze(extractedData) {
        const findings = {
            issues: [],
            stats: {
                totalElements: 0,
                passedRules: 0,
                failedRules: 0
            }
        };

        extractedData.forEach(file => {
            file.elements.forEach(el => {
                findings.stats.totalElements++;

                // --- RULE 1: Accessibility - Missing Alt Text ---
                if (el.tag === 'img') {
                    if (!el.attributes.alt || el.attributes.alt.trim() === "") {
                        findings.issues.push({
                            file: file.fileName,
                            type: 'Accessibility',
                            severity: 'High',
                            message: `Image source "${el.attributes.src}" missing alt attribute.`,
                            recommendation: "Add a descriptive 'alt' attribute for screen readers."
                        });
                        findings.stats.failedRules++;
                    } else {
                        findings.stats.passedRules++;
                    }
                }

                // --- RULE 2: Form Usability - Missing Input IDs ---
                if (el.tag === 'input') {
                    if (!el.attributes.id) {
                        findings.issues.push({
                            file: file.fileName,
                            type: 'Usability',
                            severity: 'Medium',
                            message: `Input type "${el.attributes.type}" missing unique ID.`,
                            recommendation: "Assign a unique ID to link with a <label> element."
                        });
                        findings.stats.failedRules++;
                    } else {
                        findings.stats.passedRules++;
                    }
                }

                // --- RULE 3: Visual Consistency - Empty Buttons ---
                if (el.tag === 'button' && el.text.length === 0 && !el.attributes['aria-label']) {
                    findings.issues.push({
                        file: file.fileName,
                        type: 'Visual Consistency',
                        severity: 'Low',
                        message: "Empty button detected without an aria-label.",
                        recommendation: "Add button text or an 'aria-label' for clarity."
                    });
                    findings.stats.failedRules++;
                }
            });
        });

        return findings;
    }
}

module.exports = RuleEngine;