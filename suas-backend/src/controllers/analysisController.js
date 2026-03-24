const ExtractionEngine = require('../engines/extractionEngine');
const RuleEngine = require('../engines/ruleEngine');
const ScoringEngine = require('../engines/scoringEngine');
const ProjectModel = require('../models/projectModel');

exports.uploadAndAnalyze = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a ZIP file." });
        }

        const projectName = req.body.projectName || "Untitled Project";

        // 1. Step: UI Extraction (HTML/CSS parsing)
        const extractedData = ExtractionEngine.extractFromZip(req.file.buffer);

        // 2. Step: Rule-Based Analysis (Heuristics check)
        const findings = RuleEngine.analyze(extractedData);

        // 3. Step: Scoring (Weighted calculation)
        const scores = ScoringEngine.calculate(findings);

        // 4. Step: Database Persistence (Save to MS SQL)
        const projectId = await ProjectModel.saveAnalysis(
            projectName, 
            scores, 
            findings.issues
        );

        // 5. Final Response to Frontend (Next.js)
        res.status(200).json({
            success: true,
            projectId: projectId,
            projectName: projectName,
            overallScore: scores.total,
            breakdown: scores.breakdown,
            issues: findings.issues,
            stats: findings.stats
        });

    } catch (error) {
        console.error("Analysis Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "An error occurred during analysis.",
            error: error.message 
        });
    }
};

// Past analysis results ganna function eka
exports.getHistory = async (req, res) => {
    try {
        const history = await ProjectModel.getAllProjects(); // Meka model eke liyanna ona
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch history" });
    }
};