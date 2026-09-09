import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import {
  IoChatbubbles,
  IoMail,
  IoMailOpen,
  IoTime,
  IoPerson
} from 'react-icons/io5';
import { formatDate, timeAgo } from '../../utils/dateUtils';
import toast from 'react-hot-toast';
import './MessagesPage.css';

export default function MemberMessagesPage() {
  const { userProfile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Load real messages for current member
  useEffect(() => {
    if (!userProfile?.uid) return;
    try {
      const q = query(
        collection(db, 'messages'),
        where('toMemberId', '==', userProfile.uid),
        orderBy('createdAt', 'desc')
      );
      const unsub = onSnapshot(q, (snap) => {
        setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (err) => {
        console.warn('Firestore member messages warning:', err);
      });
      return () => unsub();
    } catch {}
  }, [userProfile?.uid]);

  function openMessage(msg) {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      // Mark as read
      try {
        updateDoc(doc(db, 'messages', msg.id), { isRead: true });
      } catch {}
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
    }
  }

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <h1 className="page-title">Messages</h1>
          {unreadCount > 0 && (
            <Badge variant="danger">{unreadCount} new</Badge>
          )}
        </div>
        <p className="page-subtitle">Messages from gym staff</p>
      </div>

      {messages.length === 0 ? (
        <EmptyState
          icon={IoChatbubbles}
          title="No messages"
          description="Messages from staff will appear here"
        />
      ) : (
        <div className="mm-list stagger-children">
          {messages.map(msg => (
            <Card
              key={msg.id}
              className={`mm-message-card ${!msg.isRead ? 'mm-unread' : ''}`}
              padding="md"
              onClick={() => openMessage(msg)}
            >
              <div className="mm-message-icon">
                {msg.isRead ? <IoMailOpen /> : <IoMail />}
              </div>
              <div className="mm-message-content">
                <div className="mm-message-header">
                  <span className="mm-message-from">
                    <IoPerson /> {msg.fromStaffName}
                  </span>
                  <span className="mm-message-time">{timeAgo(msg.createdAt)}</span>
                </div>
                <h4 className="mm-message-subject">{msg.subject}</h4>
                <p className="mm-message-preview">{msg.body?.slice(0, 80)}...</p>
              </div>
              {!msg.isRead && <div className="mm-unread-dot" />}
            </Card>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      <Modal
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title={selectedMessage?.subject || 'Message'}
        size="lg"
      >
        {selectedMessage && (
          <div className="mm-detail">
            <div className="mm-detail-meta">
              <span className="mm-detail-from">
                <IoPerson /> {selectedMessage.fromStaffName}
              </span>
              <span className="mm-detail-time">
                <IoTime /> {formatDate(selectedMessage.createdAt, 'EEEE, MMM d, h:mm a')}
              </span>
            </div>
            <div className="mm-detail-body">
              {selectedMessage.body?.split('\n').map((line, i) => (
                <p key={i}>{line || <br />}</p>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
