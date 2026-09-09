import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { DEMO_MEMBERS } from '../../data/demoData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import {
  IoChatbubbles,
  IoSend,
  IoSearch,
  IoPerson,
  IoTime,
  IoCheckmarkCircle
} from 'react-icons/io5';
import { formatDate, timeAgo } from '../../utils/dateUtils';
import toast from 'react-hot-toast';
import './MessagesPage.css';

export default function StaffMessagesPage() {
  const { userProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const preselectedMemberId = searchParams.get('to');

  const [members, setMembers] = useState(DEMO_MEMBERS.filter(m => m.isActive));
  const [selectedMember, setSelectedMember] = useState(
    preselectedMemberId ? DEMO_MEMBERS.find(m => m.uid === preselectedMemberId) : null
  );
  const [memberSearch, setMemberSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sentMessages, setSentMessages] = useState(() => {
    return JSON.parse(localStorage.getItem('gympulse_sent_messages') || '[]');
  });

  // Try to load real members from Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'member'));
      const unsub = onSnapshot(q, (snap) => {
        if (!snap.empty) {
          setMembers(snap.docs.map(d => ({ uid: d.id, ...d.data() })).filter(m => m.isActive));
        }
      }, () => {});
      return () => unsub();
    } catch {}
  }, []);

  const filteredMembers = members.filter(m =>
    m.name?.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.email?.toLowerCase().includes(memberSearch.toLowerCase())
  );

  async function handleSend() {
    if (!selectedMember) { toast.error('Select a member'); return; }
    if (!subject.trim()) { toast.error('Subject is required'); return; }
    if (!body.trim()) { toast.error('Message body is required'); return; }

    setSending(true);
    const message = {
      fromStaffId: userProfile?.uid || 'demo-staff-1',
      fromStaffName: userProfile?.name || 'Staff',
      toMemberId: selectedMember.uid,
      toMemberName: selectedMember.name,
      subject: subject.trim(),
      body: body.trim(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, 'messages'), {
        ...message,
        createdAt: serverTimestamp(),
      });
      toast.success(`Message sent to ${selectedMember.name}`);
    } catch {
      // Save locally for demo
      const updated = [{ id: 'msg-' + Date.now(), ...message }, ...sentMessages];
      setSentMessages(updated);
      localStorage.setItem('gympulse_sent_messages', JSON.stringify(updated));
      toast.success(`Message sent to ${selectedMember.name} (demo)`);
    }

    setSubject('');
    setBody('');
    setSending(false);
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Messages</h1>
        <p className="page-subtitle">Send messages to members</p>
      </div>

      <div className="msg-layout">
        {/* Member Selector */}
        <Card className="msg-selector" padding="md">
          <h3 className="msg-selector-title">Select Member</h3>
          <Input
            id="msg-search"
            icon={IoSearch}
            placeholder="Search members..."
            value={memberSearch}
            onChange={e => setMemberSearch(e.target.value)}
          />
          <div className="msg-member-list">
            {filteredMembers.map(m => (
              <button
                key={m.uid}
                className={`msg-member-item ${selectedMember?.uid === m.uid ? 'msg-member-active' : ''}`}
                onClick={() => setSelectedMember(m)}
              >
                <div className="msg-member-avatar" style={{
                  background: selectedMember?.uid === m.uid ? 'var(--gradient-primary)' : 'var(--bg-glass)'
                }}>
                  {m.name?.charAt(0)}
                </div>
                <div className="msg-member-info">
                  <span className="msg-member-name">{m.name}</span>
                  <span className="msg-member-email">{m.email}</span>
                </div>
                {m.membershipType === 'pt' && <Badge variant="primary" size="sm">PT</Badge>}
              </button>
            ))}
          </div>
        </Card>

        {/* Compose */}
        <div className="msg-compose">
          {selectedMember ? (
            <Card className="msg-compose-card" padding="md">
              <div className="msg-compose-to">
                <span>To:</span>
                <Badge variant="primary">{selectedMember.name}</Badge>
              </div>
              <Input
                id="msg-subject"
                label="Subject"
                placeholder="e.g., Upcoming session update"
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />
              <Input
                id="msg-body"
                label="Message"
                placeholder="Type your message..."
                value={body}
                onChange={e => setBody(e.target.value)}
                isTextarea
                rows={5}
              />
              <Button
                variant="primary"
                fullWidth
                icon={IoSend}
                loading={sending}
                onClick={handleSend}
              >
                Send Message
              </Button>
            </Card>
          ) : (
            <EmptyState
              icon={IoChatbubbles}
              title="Select a member"
              description="Choose a member from the list to compose a message"
            />
          )}

          {/* Sent History */}
          {sentMessages.length > 0 && (
            <div className="msg-sent-history">
              <h3 className="msg-sent-title">Recently Sent</h3>
              <div className="msg-sent-list stagger-children">
                {sentMessages.slice(0, 10).map(msg => (
                  <Card key={msg.id} className="msg-sent-item" padding="sm">
                    <div className="msg-sent-info">
                      <span className="msg-sent-to">To: {msg.toMemberName}</span>
                      <span className="msg-sent-subject">{msg.subject}</span>
                    </div>
                    <span className="msg-sent-time">{timeAgo(msg.createdAt)}</span>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
