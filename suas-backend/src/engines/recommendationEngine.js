class RecommendationEngine {
    static generate(issues) {
        return issues.map(issue => {
            let recommendation = "";
            let priority = "";

            // Custom logic based on issue type and message
            switch (issue.type) {
                case 'Accessibility':
                    recommendation = this.getAccessibilityFix(issue);
                    priority = "High";
                    break;
                case 'Usability':
                    recommendation = this.getUsabilityFix(issue);
                    priority = "Medium";
                    break;
                case 'Visual Consistency':
                    recommendation = this.getVisualFix(issue);
                    priority = "Low";
                    break;
                default:
                    recommendation = "Review the element to follow standard UI guidelines.";
                    priority = "Low";
            }

            return {
                ...issue,
                suggestedFix: recommendation,
                actionPriority: priority
            };
        });
    }

    static getAccessibilityFix(issue) {
        if (issue.message.includes("alt attribute")) {
            return "Add a meaningful 'alt' text to the <img> tag so screen readers can describe it to visually impaired users.";
        }
        if (issue.message.includes("aria-label")) {
            return "Provide an 'aria-label' to this interactive element to explain its purpose to assistive technologies.";
        }
        return "Ensure this element meets WCAG 2.1 accessibility standards.";
    }

    static getUsabilityFix(issue) {
        if (issue.message.includes("unique ID")) {
            return "Assign a unique 'id' attribute to the input and link it with a corresponding <label for='...'> to improve click targets.";
        }
        return "Improve the interactive flow of this component to reduce user cognitive load.";
    }

    static getVisualFix(issue) {
        if (issue.message.includes("Empty button")) {
            return "Ensure buttons have visible text or a clear icon with a tooltip to guide the user.";
        }
        return "Maintain consistent margins and padding according to your design system.";
    }
}

module.exports = RecommendationEngine;