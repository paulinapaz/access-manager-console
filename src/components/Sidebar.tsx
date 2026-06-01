import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDownIcon, ChevronUpIcon, ExpandPanelIcon, CollapsePanelIcon } from '@/lib/icons';

interface NavItem {
  to: string;
  label: string;
}

interface NavSectionData {
  id: string;
  title: string;
  items: NavItem[];
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const sections: NavSectionData[] = [
    {
      id: 'directory',
      title: 'Directory',
      items: [
        { to: '/users', label: 'Users' },
        { to: '/service-users', label: 'Service users' },
        { to: '/groups', label: 'Groups' },
      ],
    },
    {
      id: 'access',
      title: 'Access Controls',
      items: [
        { to: '/roles', label: 'Roles' },
        { to: '/assignments', label: 'Assignments' },
      ],
    },
  ];

  return (
    <aside className={`spoke ${collapsed ? 'collapsed' : ''}`}>
      <div className="spoke-clip">
        <div className="spoke-inner">
          <div className="spoke-header">
            <h2 className="spoke-title">Access Manager</h2>
          </div>

          <div className="spoke-scroll">
            <nav aria-label="Access Manager navigation">
              {sections.map((section, i) => (
                <NavSection key={section.id} section={section} defaultOpen={i === 0} />
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="spoke-toggle-wrap">
        <button
          type="button"
          className="spoke-toggle"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          aria-controls="spoke-panel"
        >
          {collapsed ? <ExpandPanelIcon /> : <CollapsePanelIcon />}
        </button>
        <span className="spoke-tooltip" role="tooltip" aria-hidden="true">
          {collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        </span>
      </div>
    </aside>
  );
}

function NavSection({ section, defaultOpen }: { section: NavSectionData; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const sectionId = `spoke-section-${section.id}`;

  return (
    <div className="spoke-section">
      <button
        type="button"
        className="spoke-section-header"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={sectionId}
      >
        <span className="spoke-section-title">{section.title}</span>
        {open
          ? <ChevronUpIcon className="icon spoke-section-caret" />
          : <ChevronDownIcon className="icon spoke-section-caret" />}
      </button>

      <div id={sectionId} className="spoke-section-items" data-open={open}>
        {section.items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end
            className={({ isActive }) => `spoke-link ${isActive ? 'active' : ''}`}
          >
            <span className="spoke-link-label">{it.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
