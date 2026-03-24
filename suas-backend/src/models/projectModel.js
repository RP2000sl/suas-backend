const { poolPromise } = require('../config/db');

class ProjectModel {
    static async saveAnalysis(projectName, scores, issues) {
        try {
            const pool = await poolPromise;
            
            // 1. Save Main Project & Scores
            const projectResult = await pool.request()
                .input('name', projectName)
                .input('totalScore', scores.total)
                .input('accScore', scores.breakdown.accessibility)
                .input('visScore', scores.breakdown.visual)
                .input('navScore', scores.breakdown.navigation)
                .query(`
                    INSERT INTO Projects (ProjectName, TotalScore, AccessibilityScore, VisualScore, NavigationScore, CreatedAt)
                    OUTPUT INSERTED.ID
                    VALUES (@name, @totalScore, @accScore, @visScore, @navScore, GETDATE())
                `);

            const projectId = projectResult.recordset[0].ID;

            // 2. Save Individual Issues
            for (let issue of issues) {
                await pool.request()
                    .input('pId', projectId)
                    .input('type', issue.type)
                    .input('severity', issue.severity)
                    .input('msg', issue.message)
                    .input('rec', issue.recommendation)
                    .query(`
                        INSERT INTO Issues (ProjectID, IssueType, Severity, Message, Recommendation)
                        VALUES (@pId, @type, @severity, @msg, @rec)
                    `);
            }

            return projectId;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProjectModel;