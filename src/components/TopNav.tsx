import { useEffect, useState } from 'react';
import { CartIcon, GearIcon, HelpIcon, HamburgerIcon } from '@/lib/icons';
import { NavDrawer } from '@/components/NavDrawer';
import dcOneLogo from '@/assets/dc-one-logo.png';

type Panel = 'cart' | 'settings' | 'help' | 'profile' | null;

const settingsLinks = [
  'User management',
  'Billing and subscriptions',
  'Identity and access',
];

const helpLinks = [
  'AI Assist',
  "What's new",
  'User guide',
  'API guide',
  'Knowledge base',
  'Contact us',
];

interface Environment {
  id: string;
  name: string;
  productCount: number;
}

const ENVIRONMENTS: Environment[] = [
  { id: 'production', name: 'ACME — Production', productCount: 2 },
  { id: 'test', name: 'ACME — Test', productCount: 1 },
  { id: 'eu-dev', name: 'ACME EU — Dev', productCount: 2 },
];

export function TopNav({ cartCount = 3 }: { cartCount?: number }) {
  const [active, setActive] = useState<Panel>(null);
  const [currentEnvId, setCurrentEnvId] = useState('production');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggle = (panel: Exclude<Panel, null>) =>
    setActive((cur) => (cur === panel ? null : panel));
  const close = () => setActive(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header className="topnav" role="banner">
        <div className="topnav-left">
          <button
            className="topnav-hamburger topnav-icon-btn"
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            aria-controls="nav-drawer"
            onClick={() => setDrawerOpen((o) => !o)}
          >
            <HamburgerIcon />
          </button>
          <img className="topnav-logo" src={dcOneLogo} alt="DigiCert ONE" />
        </div>

        <div className="topnav-right">
          {/* Cart */}
          <div className="topnav-item">
            <button
              className="topnav-icon-btn"
              aria-label="Open cart"
              aria-expanded={active === 'cart'}
              onClick={() => toggle('cart')}
            >
              <CartIcon />
              {cartCount > 0 && <span className="topnav-cart-badge" aria-hidden="true">{cartCount}</span>}
            </button>
            <span className="topnav-tooltip" role="tooltip">Cart</span>
            {active === 'cart' && (
              <div className="topnav-dropdown" role="dialog" aria-label="Cart">
                <div className="dd-header">Cart</div>
                <hr className="dd-divider" />
                <div className="dd-section">
                  <div className="dd-empty">Your cart is empty.</div>
                  <button className="dd-cart-continue" onClick={close}>Continue shopping</button>
                </div>
              </div>
            )}
          </div>

          {/* Settings / Help / Profile collapse into the drawer on mobile */}
          <div className="topnav-hide-mobile">
          {/* Settings */}
          <div className="topnav-item">
            <button
              className="topnav-icon-btn"
              aria-label="Settings"
              aria-expanded={active === 'settings'}
              onClick={() => toggle('settings')}
            >
              <GearIcon />
            </button>
            <span className="topnav-tooltip" role="tooltip">Settings</span>
            {active === 'settings' && (
              <div className="topnav-dropdown" role="menu" aria-label="Settings menu">
                <div className="dd-header">Settings</div>
                <hr className="dd-divider" />
                <div className="dd-section">
                  {settingsLinks.map((label) => (
                    <button key={label} className="dd-item" role="menuitem" onClick={close}>{label}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Help */}
          <div className="topnav-item">
            <button
              className="topnav-icon-btn"
              aria-label="Help"
              aria-expanded={active === 'help'}
              onClick={() => toggle('help')}
            >
              <HelpIcon />
            </button>
            <span className="topnav-tooltip" role="tooltip">Need help?</span>
            {active === 'help' && (
              <div className="topnav-dropdown" role="menu" aria-label="Help menu">
                <div className="dd-header">Need help?</div>
                <hr className="dd-divider" />
                <div className="dd-section">
                  {helpLinks.map((label) => (
                    <button key={label} className="dd-item" role="menuitem" onClick={close}>{label}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="topnav-item">
            <button
              className="topnav-avatar"
              aria-label="User profile"
              aria-expanded={active === 'profile'}
              onClick={() => toggle('profile')}
            >
              D
            </button>
            <span className="topnav-tooltip" role="tooltip">Profile</span>
            {active === 'profile' && (
              <div className="topnav-dropdown" role="menu" aria-label="User profile menu">
                <div className="dd-user">
                  <div className="dd-user-name">Deepika Chauhan</div>
                  <div className="dd-user-meta">dchauhan</div>
                  <div className="dd-user-meta">d.chauhan@example.com</div>
                  <div className="dd-user-meta">Acme Corp</div>
                </div>
                <hr className="dd-divider" />
                <div className="dd-envs">
                  <div className="dd-envs-label">Environments</div>
                  {ENVIRONMENTS.map((env) => {
                    const isCurrent = env.id === currentEnvId;
                    return (
                      <button
                        key={env.id}
                        type="button"
                        role="menuitem"
                        className={`dd-env-row ${isCurrent ? 'current' : ''}`}
                        aria-current={isCurrent ? 'true' : undefined}
                        onClick={() => {
                          setCurrentEnvId(env.id);
                          close();
                        }}
                      >
                        <span className="dd-env-avatar" aria-hidden="true">{env.name.charAt(0)}</span>
                        <span className="dd-env-text">
                          <span className="dd-env-name">{env.name}</span>
                          <span className="dd-env-sub">
                            {env.productCount} connected {env.productCount === 1 ? 'product' : 'products'}
                          </span>
                        </span>
                        <span className={`dd-env-action ${isCurrent ? 'primary' : ''}`}>
                          {isCurrent ? 'Manage' : 'Switch to'}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <hr className="dd-divider" />
                <div className="dd-section">
                  <button className="dd-item" role="menuitem" onClick={close}>View all environments</button>
                  <button className="dd-item" role="menuitem" onClick={close}>View my profile</button>
                </div>
                <hr className="dd-divider" />
                <div className="dd-section">
                  <button className="dd-item destructive" role="menuitem" onClick={close}>Sign out</button>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </header>

      {active && <div className="topnav-backdrop" onClick={close} aria-hidden="true" />}

      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
