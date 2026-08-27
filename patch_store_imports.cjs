const fs = require('fs');
let content = fs.readFileSync('src/Store.tsx', 'utf8');

const imports = `
import AdminSecurityLayout from './pages/admin/security/AdminSecurityLayout';
import AdminSecurityDashboard from './pages/admin/security/AdminSecurityDashboard';
import AdminSecurityActivity from './pages/admin/security/AdminSecurityActivity';
import AdminSecuritySessions from './pages/admin/security/AdminSecuritySessions';
import AdminSecurityAuditLog from './pages/admin/security/AdminSecurityAuditLog';
import AdminSecurityPermissions from './pages/admin/security/AdminSecurityPermissions';
import AdminSecurityApi from './pages/admin/security/AdminSecurityApi';
import AdminSecurityIntegrations from './pages/admin/security/AdminSecurityIntegrations';
import AdminSecuritySystemHealth from './pages/admin/security/AdminSecuritySystemHealth';
import AdminSecurityBackups from './pages/admin/security/AdminSecurityBackups';
import AdminSecurityRecovery from './pages/admin/security/AdminSecurityRecovery';
import AdminSecurityAiSafety from './pages/admin/security/AdminSecurityAiSafety';
import AdminSecurityAlerts from './pages/admin/security/AdminSecurityAlerts';
`;

content = content.replace("import AdminLogin from './pages/admin/AdminLogin';", 
"import AdminLogin from './pages/admin/AdminLogin';\\n" + imports);

fs.writeFileSync('src/Store.tsx', content);

