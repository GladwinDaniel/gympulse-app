import { Outlet } from 'react-router-dom';
import BottomNav from '../../components/ui/BottomNav';
import InstallPrompt from '../../components/InstallPrompt';
import './MemberLayout.css';

export default function MemberLayout() {
  return (
    <div className="member-layout">
      <main className="member-content">
        <Outlet />
      </main>
      <InstallPrompt />
      <BottomNav />
    </div>
  );
}
