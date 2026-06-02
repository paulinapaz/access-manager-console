import { Navigate, Route, Routes } from 'react-router-dom';
import { TopNav } from '@/components/TopNav';
import { Sidebar } from '@/components/Sidebar';
import { Toaster } from '@/components/Toaster';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { UsersPage } from '@/pages/UsersPage';
import { ServiceUsersPage } from '@/pages/ServiceUsersPage';
import { GroupsPage } from '@/pages/GroupsPage';
import { RolesPage } from '@/pages/RolesPage';
import { ScopesPage } from '@/pages/ScopesPage';
import { AssignmentsPage } from '@/pages/AssignmentsPage';

export default function App() {
  return (
    <>
      <TopNav />
      <div id="app">
        <Sidebar />
        <main className="main">
          <Routes>
            <Route path="/" element={<Navigate to="/users" replace />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/service-users" element={<ServiceUsersPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/scopes" element={<ScopesPage />} />
            <Route path="/assignments" element={<AssignmentsPage />} />
            <Route path="*" element={<Navigate to="/users" replace />} />
          </Routes>
        </main>
      </div>
      <Toaster />
      <ConfirmDialog />
    </>
  );
}
