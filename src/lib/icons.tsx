import type { ReactNode, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 18, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const UsersIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

export const ServiceUserIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </Svg>
);

export const GroupsIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

export const AssignmentsIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </Svg>
);

export const PlusIcon = (p: IconProps) => (
  <Svg {...p} size={p.size ?? 16} strokeWidth={2.5}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </Svg>
);

export const RefreshIcon = (p: IconProps) => (
  <Svg {...p} size={p.size ?? 16}>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
  </Svg>
);

export const SearchIcon = (p: IconProps) => (
  <Svg {...p} size={p.size ?? 16} className="icon icon-search">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Svg>
);

export const MoreIcon = (p: IconProps) => (
  <Svg {...p} size={p.size ?? 16}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </Svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p} size={p.size ?? 12}>
    <polyline points="6 9 12 15 18 9" />
  </Svg>
);

export const ChevronUpIcon = (p: IconProps) => (
  <Svg {...p} size={p.size ?? 12}>
    <polyline points="18 15 12 9 6 15" />
  </Svg>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <Svg {...p} size={p.size ?? 16}>
    <polyline points="15 18 9 12 15 6" />
  </Svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Svg {...p} size={p.size ?? 16}>
    <polyline points="9 18 15 12 9 6" />
  </Svg>
);

/* Panel-toggle glyphs matching platform-navigation-shell's expand.svg / collapse.svg.
   Fixed-colour by design (a pane with a small in/out arrow). */
export const ExpandPanelIcon = ({ size = 16, ...rest }: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="icon" {...rest}>
    <path d="M0 4C0 1.79086 1.79086 0 4 0H14C15.1046 0 16 0.895431 16 2V14C16 15.1046 15.1046 16 14 16H4C1.79086 16 0 14.2091 0 12V4Z" fill="#F9FAFB" />
    <path d="M14 0.5C14.8284 0.5 15.5 1.17157 15.5 2V14C15.5 14.8284 14.8284 15.5 14 15.5H4.5V0.5H14Z" stroke="#757D82" />
    <mask id="expand-panel-mask" fill="white">
      <path d="M0 2C0 0.895431 0.895431 0 2 0H9.33333V16H2C0.895429 16 0 15.1046 0 14V2Z" />
    </mask>
    <path d="M-1 2C-1 0.343146 0.343146 -1 2 -1H9.33333V1H2C1.44772 1 1 1.44772 1 2H-1ZM9.33333 17H2C0.343146 17 -1 15.6569 -1 14H1C1 14.5523 1.44772 15 2 15H9.33333V17ZM2 17C0.343146 17 -1 15.6569 -1 14V2C-1 0.343146 0.343146 -1 2 -1V1C1.44772 1 1 1.44772 1 2V14C1 14.5523 1.44772 15 2 15V17ZM2 15M9.33333 0V16V0" fill="#757D82" mask="url(#expand-panel-mask)" />
    <path d="M8.5 9.44363V6.55594L11 7.9993L8.5 9.44363Z" fill="#757D82" stroke="#757D82" />
  </svg>
);

export const CollapsePanelIcon = ({ size = 16, ...rest }: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="icon" {...rest}>
    <path d="M0 4C0 1.79086 1.79086 0 4 0H14C15.1046 0 16 0.895431 16 2V14C16 15.1046 15.1046 16 14 16H4C1.79086 16 0 14.2091 0 12V4Z" fill="#F9FAFB" />
    <path d="M14 0.5C14.8284 0.5 15.5 1.17157 15.5 2V14C15.5 14.8284 14.8284 15.5 14 15.5H4.5V0.5H14Z" stroke="#757D82" />
    <mask id="collapse-panel-mask" fill="white">
      <path d="M0 2C0 0.895431 0.895431 0 2 0H9.33333V16H2C0.895429 16 0 15.1046 0 14V2Z" />
    </mask>
    <path d="M-1 2C-1 0.343146 0.343146 -1 2 -1H9.33333V1H2C1.44772 1 1 1.44772 1 2H-1ZM9.33333 17H2C0.343146 17 -1 15.6569 -1 14H1C1 14.5523 1.44772 15 2 15H9.33333V17ZM2 17C0.343146 17 -1 15.6569 -1 14V2C-1 0.343146 0.343146 -1 2 -1V1C1.44772 1 1 1.44772 1 2V14C1 14.5523 1.44772 15 2 15V17ZM2 15M9.33333 0V16V0" fill="#757D82" mask="url(#collapse-panel-mask)" />
    <path d="M10.1667 9.44363V6.55594L7.66666 7.9993L10.1667 9.44363Z" fill="#757D82" stroke="#757D82" />
  </svg>
);

export const CartIcon = (p: IconProps) => (
  <Svg {...p} size={p.size ?? 20}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </Svg>
);

export const GearIcon = (p: IconProps) => (
  <Svg {...p} size={p.size ?? 20}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Svg>
);

export const HelpIcon = (p: IconProps) => (
  <Svg {...p} size={p.size ?? 20}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </Svg>
);

export const HamburgerIcon = (p: IconProps) => (
  <Svg {...p} size={p.size ?? 20}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </Svg>
);
