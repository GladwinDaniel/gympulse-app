import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import {
  IoPeople,
  IoSearch,
  IoFilter,
  IoChatbubbles,
  IoBarbell,
  IoBan,
  IoCheckmarkCircle,
  IoChevronForward,
  IoPersonAdd,
  IoEllipsisVertical
} from 'react-icons/io5';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { DEMO_MEMBERS } from '../../data/demoData';
import './MembersListPage.css';

export default function MembersListPage() {
  const navigate = useNavigate();
  const [members, setMembers] = useState(DEMO_MEMBERS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, active, inactive, pt
  const [selectedMember, setSelectedMember] = useState(null);
  const [actionModal, setActionModal] = useState(false);

  useEffect(() => {
    try {
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'member')
      );

      const unsub = onSnapshot(q, (snap) => {
        if (!snap.empty) {
          setMembers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
        }
      }, () => {
        // Keep DEMO_MEMBERS
      });

      return () => unsub();
    } catch {
      // Keep DEMO_MEMBERS
    }
  }, []);

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.phone?.includes(search);

    const matchesFilter = filter === 'all' ? true :
      filter === 'pending' ? m.isApproved === false :
      filter === 'active' ? m.isActive :
      filter === 'inactive' ? !m.isActive :
      filter === 'pt' ? m.membershipType === 'pt' : true;

    return matchesSearch && matchesFilter;
  });

  async function toggleMemberStatus(member) {
    try {
      await updateDoc(doc(db, 'users', member.uid), {
        isActive: !member.isActive
      });
      toast.success(member.isActive ? 'Member deactivated' : 'Member reactivated');
      setActionModal(false);
    } catch {
      // Update in local demo state
      setMembers(prev => prev.map(m => m.uid === member.uid ? { ...m, isActive: !m.isActive } : m));
      toast.success(member.isActive ? 'Member deactivated (demo)' : 'Member reactivated (demo)');
      setActionModal(false);
    }
  }

  async function approveMember(member) {
    try {
      await updateDoc(doc(db, 'users', member.uid), { isApproved: true });
      toast.success(`${member.name} approved`);
    } catch {
      setMembers(prev => prev.map(m => m.uid === member.uid ? { ...m, isApproved: true } : m));
      toast.success(`${member.name} approved (demo)`);
    }
    setActionModal(false);
  }

  async function togglePTStatus(member) {
    try {
      await updateDoc(doc(db, 'users', member.uid), {
        membershipType: member.membershipType === 'pt' ? 'regular' : 'pt'
      });
      toast.success(
        member.membershipType === 'pt' ? 'PT status removed' : 'PT status assigned'
      );
      setActionModal(false);
    } catch {
      // Update in local demo state
      const newType = member.membershipType === 'pt' ? 'regular' : 'pt';
      setMembers(prev => prev.map(m => m.uid === member.uid ? { ...m, membershipType: newType } : m));
      toast.success(
        member.membershipType === 'pt' ? 'PT status removed (demo)' : 'PT status assigned (demo)'
      );
      setActionModal(false);
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Members</h1>
        <p className="page-subtitle">{members.length} total members</p>
      </div>

      {/* Search & Filter */}
      <div className="members-toolbar">
        <div className="members-search">
          <Input
            id="member-search"
            icon={IoSearch}
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="members-filters">
          {['all', 'pending', 'active', 'inactive', 'pt'].map((f) => (
            <button
              key={f}
              className={`filter-chip ${filter === f ? 'filter-chip-active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f === 'pt' ? 'PT' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Members List */}
      {filteredMembers.length === 0 ? (
        <EmptyState
          icon={IoPeople}
          title="No members found"
          description={search ? 'Try a different search term' : 'No members registered yet'}
        />
      ) : (
        <div className="members-list stagger-children">
          {filteredMembers.map((member) => (
            <Card
              key={member.uid}
              className="member-row"
              padding="md"
              onClick={() => {
                setSelectedMember(member);
                setActionModal(true);
              }}
            >
              <div className="member-avatar" style={{
                background: member.isActive ? 'var(--gradient-primary)' : 'var(--bg-glass)'
              }}>
                {member.name?.charAt(0) || '?'}
              </div>
              <div className="member-info">
                <span className="member-name">{member.name}</span>
                <span className="member-email">{member.email}</span>
              </div>
              <div className="member-badges">
                {member.membershipType === 'pt' && (
                  <Badge variant="primary" size="sm">PT</Badge>
                )}
                {member.isApproved === false && (
                  <Badge variant="warning" size="sm" dot>Pending</Badge>
                )}
                <Badge
                  variant={member.isActive ? 'success' : 'danger'}
                  size="sm"
                  dot
                >
                  {member.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <IoChevronForward className="member-arrow" />
            </Card>
          ))}
        </div>
      )}

      {/* Member Actions Modal */}
      <Modal
        isOpen={actionModal}
        onClose={() => setActionModal(false)}
        title={selectedMember?.name || 'Member'}
      >
        {selectedMember && (
          <div className="member-actions-modal">
            <div className="member-modal-info">
              <p><strong>Email:</strong> {selectedMember.email}</p>
              <p><strong>Phone:</strong> {selectedMember.phone || 'N/A'}</p>
              <p>
                <strong>Type:</strong>{' '}
                <Badge variant={selectedMember.membershipType === 'pt' ? 'primary' : 'default'} size="sm">
                  {selectedMember.membershipType === 'pt' ? 'PT Member' : 'Regular'}
                </Badge>
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <Badge variant={selectedMember.isActive ? 'success' : 'danger'} size="sm" dot>
                  {selectedMember.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </p>
              {selectedMember.isApproved === false && (
                <p>
                  <strong>Access:</strong>{' '}
                  <Badge variant="warning" size="sm" dot>Waiting for approval</Badge>
                </p>
              )}
            </div>

            <div className="member-modal-actions">
              {selectedMember.isApproved === false && (
                <Button
                  fullWidth
                  variant="success"
                  icon={IoCheckmarkCircle}
                  onClick={() => approveMember(selectedMember)}
                >
                  Approve Member
                </Button>
              )}
              <Button
                fullWidth
                variant="primary"
                icon={IoChatbubbles}
                onClick={() => {
                  setActionModal(false);
                  navigate(`/staff/messages?to=${selectedMember.uid}`);
                }}
              >
                Send Message
              </Button>

              <Button
                fullWidth
                variant="secondary"
                icon={IoBarbell}
                onClick={() => {
                  setActionModal(false);
                  navigate(`/staff/plans/assign?member=${selectedMember.uid}`);
                }}
              >
                Assign Plan
              </Button>

              <Button
                fullWidth
                variant="outline"
                icon={selectedMember.membershipType === 'pt' ? IoBan : IoCheckmarkCircle}
                onClick={() => togglePTStatus(selectedMember)}
              >
                {selectedMember.membershipType === 'pt' ? 'Remove PT Status' : 'Assign PT Status'}
              </Button>

              <Button
                fullWidth
                variant={selectedMember.isActive ? 'danger' : 'success'}
                icon={selectedMember.isActive ? IoBan : IoCheckmarkCircle}
                onClick={() => toggleMemberStatus(selectedMember)}
              >
                {selectedMember.isActive ? 'Deactivate Member' : 'Reactivate Member'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
