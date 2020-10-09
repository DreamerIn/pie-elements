/** NOTE: teacherInstructions, studentInstructions, rationale & scoringType
 * functionalities are not defined yet - the value for those can belong to
 * model or to configure
 */
export default {
  model: {
    visibleToStudent: true,
    halfScoring: false,
    scales: []
  },
  configuration: {
    answerChoiceCount: 0,
    addChoiceButton: { settings: true, label: 'Add a Choice' },
    choiceMode: { settings: true, label: 'Response Type' },
    choicePrefix: { settings: true, label: 'Choice Labels' },
    deleteChoice: { settings: true },
    feedback: { settings: true, label: 'Feedback' },
    prompt: { settings: true, label: 'Prompt' },
    lockChoiceOrder: { settings: true, label: 'Lock Choice Order' },
    partialScoring: { settings: false, label: 'Allow Partial Scoring' },
    rationale: { settings: true, label: 'Rationale' },
    scoringType: { settings: false, label: 'Scoring Type' },
    studentInstructions: { settings: false, label: 'Student Instructions' },
    teacherInstructions: { settings: true, label: 'Teacher Instructions' }
  }
};
