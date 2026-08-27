const fs = require('fs');

let rules = fs.readFileSync('firestore.rules', 'utf8');
rules = rules.replace(/match \/settings\/\{settingId\} \{\s*allow read, write: if true;/g, 'match /settings/{settingId} {\n      allow read, write: if isAdmin();');
rules = rules.replace(/match \/ai_workers\/\{workerId\} \{\s*allow read, write: if true;/g, 'match /ai_workers/{workerId} {\n      allow read, write: if isAdmin();');
rules = rules.replace(/match \/ai_tasks\/\{taskId\} \{\s*allow read, write: if true;/g, 'match /ai_tasks/{taskId} {\n      allow read, write: if isAdmin();');
rules = rules.replace(/match \/ai_approvals\/\{approvalId\} \{\s*allow read, write: if true;/g, 'match /ai_approvals/{approvalId} {\n      allow read, write: if isAdmin();');
rules = rules.replace(/match \/ai_activity\/\{activityId\} \{\s*allow read, write: if true;/g, 'match /ai_activity/{activityId} {\n      allow read, write: if isAdmin();');
rules = rules.replace(/match \/ai_rules\/\{ruleId\} \{\s*allow read, write: if true;/g, 'match /ai_rules/{ruleId} {\n      allow read, write: if isAdmin();');
rules = rules.replace(/match \/ai_automations\/\{automationId\} \{\s*allow read, write: if true;/g, 'match /ai_automations/{automationId} {\n      allow read, write: if isAdmin();');

fs.writeFileSync('firestore.rules', rules);
