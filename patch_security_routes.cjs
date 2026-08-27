const fs = require('fs');

let content = fs.readFileSync('src/Store.tsx', 'utf8');

const imports = `
import AdminSecurityLayout from './pages/admin/security/AdminSecurityLayout.tsx';
import AdminSecurityDashboard from './pages/admin/security/AdminSecurityDashboard.tsx';
import AdminSecurityActivity from './pages/admin/security/AdminSecurityActivity.tsx';
import AdminSecuritySessions from './pages/admin/security/AdminSecuritySessions.tsx';
import AdminSecurityAuditLog from './pages/admin/security/AdminSecurityAuditLog.tsx';
import AdminSecurityPermissions from './pages/admin/security/AdminSecurityPermissions.tsx';
import AdminSecurityApi from './pages/admin/security/AdminSecurityApi.tsx';
import AdminSecurityIntegrations from './pages/admin/security/AdminSecurityIntegrations.tsx';
import AdminSecuritySystemHealth from './pages/admin/security/AdminSecuritySystemHealth.tsx';
import AdminSecurityBackups from './pages/admin/security/AdminSecurityBackups.tsx';
import AdminSecurityRecovery from './pages/admin/security/AdminSecurityRecovery.tsx';
import AdminSecurityAiSafety from './pages/admin/security/AdminSecurityAiSafety.tsx';
import AdminSecurityAlerts from './pages/admin/security/AdminSecurityAlerts.tsx';
`;

const routes = `
            <Route path="security" element={<AdminSecurityLayout />}>
              <Route index element={<AdminSecurityDashboard />} />
              <Route path="activity" element={<AdminSecurityActivity />} />
              <Route path="sessions" element={<AdminSecuritySessions />} />
              <Route path="audit-log" element={<AdminSecurityAuditLog />} />
              <Route path="permissions" element={<AdminSecurityPermissions />} />
              <Route path="api" element={<AdminSecurityApi />} />
              <Route path="integrations" element={<AdminSecurityIntegrations />} />
              <Route path="system-health" element={<AdminSecuritySystemHealth />} />
              <Route path="backups" element={<AdminSecurityBackups />} />
              <Route path="recovery" element={<AdminSecurityRecovery />} />
              <Route path="ai-safety" element={<AdminSecurityAiSafety />} />
              <Route path="alerts" element={<AdminSecurityAlerts />} />
            </Route>
`;

content = content.replace("import AdminFinanceAi from './pages/admin/finance/AdminFinanceAi.tsx';", 
"import AdminFinanceAi from './pages/admin/finance/AdminFinanceAi.tsx';\\n" + imports);

content = content.replace('</Route>',
routes + '            </Route>');

fs.writeFileSync('src/Store.tsx', content);

