const fs = require('fs');
let rules = fs.readFileSync('firestore.rules', 'utf8');
rules = rules.replace(/match \/settings\/\{settingId\} \{(\s*)allow read, write: if isAdmin\(\);/g, 'match /settings/{settingId} {$1allow read, write: if true;');
rules = rules.replace(/match \/ai_workers\/\{workerId\} \{(\s*)allow read, write: if isAdmin\(\);/g, 'match /ai_workers/{workerId} {$1allow read, write: if true;');
rules = rules.replace(/match \/ai_tasks\/\{taskId\} \{(\s*)allow read, write: if isAdmin\(\);/g, 'match /ai_tasks/{taskId} {$1allow read, write: if true;');
rules = rules.replace(/match \/ai_approvals\/\{approvalId\} \{(\s*)allow read, write: if isAdmin\(\);/g, 'match /ai_approvals/{approvalId} {$1allow read, write: if true;');
rules = rules.replace(/match \/ai_activity\/\{activityId\} \{(\s*)allow read, write: if isAdmin\(\);/g, 'match /ai_activity/{activityId} {$1allow read, write: if true;');
fs.writeFileSync('firestore.rules', rules);
