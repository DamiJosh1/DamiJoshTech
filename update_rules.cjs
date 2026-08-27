const fs = require('fs');

let rules = fs.readFileSync('firestore.rules', 'utf8');

const aiRules = `
    match /settings/{settingId} {
      allow read, write: if isAdmin();
    }
    match /ai_workers/{workerId} {
      allow read, write: if isAdmin();
    }
    match /ai_tasks/{taskId} {
      allow read, write: if isAdmin();
    }
    match /ai_approvals/{approvalId} {
      allow read, write: if isAdmin();
    }
    match /ai_activity/{activityId} {
      allow read, write: if isAdmin();
    }
    match /ai_rules/{ruleId} {
      allow read, write: if isAdmin();
    }
    match /ai_automations/{automationId} {
      allow read, write: if isAdmin();
    }
`;

rules = rules.replace(/  }\n}/, `  }\n${aiRules}}`);

fs.writeFileSync('firestore.rules', rules);
