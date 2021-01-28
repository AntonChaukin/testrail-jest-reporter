class ReporterError extends Error {
    constructor(message) {
        super(message);
        this.name = "Testrail Jest Reporter Error";
    }
}

module.exports = ReporterError;