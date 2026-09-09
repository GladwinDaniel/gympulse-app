import { NavLink } from 'react-router-dom';
import { IoHome, IoBarbell, IoNutrition, IoPerson, IoQrCode } from 'react-icons/io5';
import './BottomNav.css';

const memberNavItems = [
  { path: '/member', icon: IoHome, label: 'Home', end: true },
  { path: '/member/workouts', icon: IoBarbell, label: 'Workouts' },
  { path: '/member/scan', icon: IoQrCode, label: 'Scan' },
  { path: '/member/diet', icon: IoNutrition, label: 'Diet' },
  { path: '/member/profile', icon: IoPerson, label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" id="member-bottom-nav">
      {memberNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.end}
          className={({ isActive }) =>
            `bottom-nav-item ${isActive ? 'bottom-nav-active' : ''}`
          }
        >
          <item.icon className="bottom-nav-icon" />
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
