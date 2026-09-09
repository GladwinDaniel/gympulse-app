import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import { IoFitness, IoLogOut, IoTime } from 'react-icons/io5';

export default function PendingApprovalPage() {
  const { userProfile, logout } = useAuth();

  return (
    <main className="pending-page">
      <section className="pending-card" aria-live="polite">
        <div className="pending-icon"><IoTime /></div>
        <p className="pending-kicker"><IoFitness /> GymPulse</p>
        <h1>Waiting for approval</h1>
        <p>
          Thanks for signing up{userProfile?.name ? `, ${userProfile.name}` : ''}. A staff member needs to approve your account before you can access the gym app.
        </p>
        <p className="pending-note">Keep this page open. It will update automatically after staff approval.</p>
        <Button variant="outline" icon={IoLogOut} onClick={logout}>Sign out</Button>
      </section>
    </main>
  );
}
