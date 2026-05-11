import { Navigate, Route, Routes } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Toaster } from '@/components/Toaster';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { UsersPage } from '@/pages/UsersPage';
import { ServiceUsersPage } from '@/pages/ServiceUsersPage';
import { GroupsPage } from '@/pages/GroupsPage';
import { AssignmentsPage } from '@/pages/AssignmentsPage';

export default function App() {
  return (
    <>
      <div id="app">
        <Sidebar />
        <main className="main">
          <Routes>
            <Route path="/" element={<Navigate to="/users" replace />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/service-users" element={<ServiceUsersPage />} />
            <Route path="/groups" element={<GroupsPage />} />
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
