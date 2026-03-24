class ScoringEngine {
    static calculate(findings) {
        // Default scores
        let scores = {
            accessibility: 100,
            visual: 100,
            navigation: 100
        };

        // Penalties based on issues found in RuleEngine
        findings.issues.forEach(issue => {
            let penalty = 0;
            if (issue.severity === 'High') penalty = 15;
            else if (issue.severity === 'Medium') penalty = 10;
            else if (issue.severity === 'Low') penalty = 5;

            if (issue.type === 'Accessibility') {
                scores.accessibility -= penalty;
            } else if (issue.type === 'Visual Consistency') {
                scores.visual -= penalty;
            } else if (issue.type === 'Usability' || issue.type === 'Navigation') {
                scores.navigation -= penalty;
            }
        });

        // Ensure scores don't go below 0
        const finalAccessibility = Math.max(scores.accessibility, 0);
        const finalVisual = Math.max(scores.visual, 0);
        const finalNavigation = Math.max(scores.navigation, 0);

        // Final Weighted Score
        const totalScore = Math.round(
            (finalAccessibility * 0.4) + 
            (finalVisual * 0.3) + 
            (finalNavigation * 0.3)
        );

        return {
            total: totalScore,
            breakdown: {
                accessibility: finalAccessibility,
                visual: finalVisual,
                navigation: finalNavigation
            }
        };
    }
}

module.exports = ScoringEngine;