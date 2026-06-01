import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  AssignmentsIcon,
  GroupsIcon,
  ServiceUserIcon,
  UsersIcon,
} from '@/lib/icons';
import dcOneLogo from '@/assets/dc-one-logo.png';
import type { ReactNode } from 'react';

interface DrawerLink {
  to: string;
  label: string;
  icon: ReactNode;
}

const settingsLinks = ['User management', 'Billing and subscriptions', 'Identity and access'];
const helpLinks = ['AI Assist', "What's new", 'User guide', 'API guide', 'Knowledge base', 'Contact us'];

export function NavDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const directory: DrawerLink[] = [
    { to: '/users', label: 'Users', icon: <UsersIcon /> },
    { to: '/service-users', label: 'Service users', icon: <ServiceUserIcon /> },
    { to: '/groups', label: 'Groups', icon: <GroupsIcon /> },
  ];
  const access: DrawerLink[] = [
    { to: '/roles', label: 'Roles', icon: <AssignmentsIcon /> },
    { to: '/assignments', label: 'Assignments', icon: <AssignmentsIcon /> },
  ];

  return (
    <>
      <div
        className={`drawer-backdrop ${open ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        id="nav-drawer"
        className={`drawer ${open ? 'open' : ''}`}
        aria-hidden={!open}
        aria-label="Navigation menu"
      >
        <div className="drawer-header">
          <img className="topnav-logo" src={dcOneLogo} alt="DigiCert ONE" />
          <button className="drawer-close" onClick={onClose} aria-label="Close navigation menu">×</button>
        </div>

        <div className="drawer-body">
          <DrawerSection title="Directory" links={directory} onNavigate={onClose} />
          <DrawerSection title="Access Controls" links={access} onNavigate={onClose} />

          <hr className="drawer-divider" />
          <div className="drawer-group-label">Settings</div>
          {settingsLinks.map((label) => (
            <button key={label} className="drawer-item" onClick={onClose}>{label}</button>
          ))}

          <hr className="drawer-divider" />
          <div className="drawer-group-label">Need help?</div>
          {helpLinks.map((label) => (
            <button key={label} className="drawer-item" onClick={onClose}>{label}</button>
          ))}

          <hr className="drawer-divider" />
          <div className="drawer-user">
            <div className="spoke-avatar">D</div>
            <div>
              <div className="drawer-user-name">Deepika Chauhan</div>
              <div className="drawer-user-meta">d.chauhan@example.com</div>
            </div>
          </div>
          <button className="drawer-item destructive" onClick={onClose}>Sign out</button>
        </div>
      </aside>
    </>
  );
}

function DrawerSection({
  title,
  links,
  onNavigate,
}: {
  title: string;
  links: DrawerLink[];
  onNavigate: () => void;
}) {
  return (
    <div className="drawer-nav-section">
      <div className="drawer-group-label">{title}</div>
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end
          onClick={onNavigate}
          className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`}
        >
          {l.icon}
          <span className="drawer-link-label">{l.label}</span>
        </NavLink>
      ))}
    </div>
  );
}
