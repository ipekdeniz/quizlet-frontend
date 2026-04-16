import { NavLink } from 'react-router-dom';

const links = [
  { to: '/',          label: 'Dashboard', icon: 'bi-speedometer2', end: true },
  { to: '/questions', label: 'Questions', icon: 'bi-collection'             },
  { to: '/quizlets',  label: 'Quizlets',  icon: 'bi-journal-bookmark'       },
];

export default function Sidebar() {
  return (
    <aside className="kt-aside">
      {/* Logo */}
      <div className="kt-aside-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: 'linear-gradient(135deg, #009ef7 0%, #0063cc 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <i className="bi bi-lightning-charge-fill" style={{ color: '#fff', fontSize: 16 }} />
          </div>
          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px', lineHeight: 1.2 }}>
              QuizBuilder
            </div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, marginTop: 1 }}>
              Quiz Management
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="kt-aside-menu">
        <div className="kt-menu-section">Menu</div>
        <ul className="list-unstyled mb-0">
          {links.map(({ to, label, icon, end }) => (
            <li key={to} className="kt-menu-item">
              <NavLink to={to} end={end} className={({ isActive }) => isActive ? 'active' : ''}>
                <i className={`bi ${icon} menu-icon`} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="kt-aside-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="bi bi-person" style={{ color: '#9899ac', fontSize: 13 }} />
          </div>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
