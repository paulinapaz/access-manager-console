import { NavLink } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import {
  AssignmentsIcon,
  GroupsIcon,
  ServiceUserIcon,
  UsersIcon,
} from '@/lib/icons';
import type { ReactNode } from 'react';

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  count: number;
}

export function Sidebar() {
  const userCount = useStore((s) => s.users.length);
  const serviceUserCount = useStore((s) => s.serviceUsers.length);
  const groupCount = useStore((s) => s.groups.length);
  const assignmentCount = useStore((s) => s.assignments.length);

  const directory: NavItem[] = [
    { to: '/users', label: 'Users', icon: <UsersIcon />, count: userCount },
    { to: '/service-users', label: 'Service users', icon: <ServiceUserIcon />, count: serviceUserCount },
    { to: '/groups', label: 'Groups', icon: <GroupsIcon />, count: groupCount },
  ];
  const access: NavItem[] = [
    { to: '/assignments', label: 'Assignments', icon: <AssignmentsIcon />, count: assignmentCount },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">AM</div>
        <div className="brand-text">
          <div className="brand-title">Access Manager</div>
          <div className="brand-sub">Acme Corporation</div>
        </div>
      </div>

      <nav className="nav">
        <NavSection title="Directory" items={directory} />
        <NavSection title="Access Controls" items={access} />
      </nav>

      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="avatar">PP</div>
          <div>
            <div className="user-chip-name">Paulina Paz</div>
            <div className="user-chip-role">Account Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavSection({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      <div className="nav-section-title">{title}</div>
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          {it.icon}
          <span>{it.label}</span>
          <span className="badge">{it.count}</span>
        </NavLink>
      ))}
    </div>
  );
}
