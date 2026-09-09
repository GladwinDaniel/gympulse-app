import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import {
  IoMegaphone,
  IoAdd,
  IoTrash,
  IoTime
} from 'react-icons/io5';
import { formatDate } from '../../utils/dateUtils';
import toast from 'react-hot-toast';
import './NoticesPage.css';

export default function NoticesPage() {
  const { userProfile } = useAuth();
  const [notices, setNotices] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(q, (snap) => {
        setNotices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (err) => {
        console.warn('Firestore notices fetch warning:', err);
      });
      return () => unsub();
    } catch (err) {
      console.warn('Firestore notices query error:', err);
    }
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) { toast.error('Title is required'); return; }

    setLoading(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        const imageRef = ref(storage, `featured-posters/${Date.now()}-${imageFile.name}`);
        const uploaded = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(uploaded.ref);
      }
      await addDoc(collection(db, 'notices'), {
        title: title.trim(),
        content: content.trim(),
        imageUrl,
        isFeatured,
        postedBy: userProfile.uid,
        postedByName: userProfile.name,
        isPinned: false,
        createdAt: serverTimestamp()
      });
      toast.success('Notice posted!');
      setTitle('');
      setContent('');
      setImageFile(null);
      setImagePreview('');
      setIsFeatured(true);
      setShowCreate(false);
    } catch {
      // Keep a local image preview available when Firebase is not configured.
      const newNotice = {
        id: 'demo-notice-' + Date.now(),
        title: title.trim(),
        content: content.trim(),
        imageUrl: imagePreview || null,
        isFeatured,
        postedByName: userProfile?.name || 'Staff',
        isPinned: false,
        createdAt: new Date()
      };
      setNotices(prev => [newNotice, ...prev]);
      toast.success('Notice posted (demo mode)!');
      setTitle('');
      setContent('');
      setImageFile(null);
      setImagePreview('');
      setIsFeatured(true);
      setShowCreate(false);
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }

  async function handleDelete(noticeId) {
    if (!window.confirm('Delete this notice?')) return;
    try {
      await deleteDoc(doc(db, 'notices', noticeId));
      toast.success('Notice deleted');
    } catch {
      setNotices(prev => prev.filter(n => n.id !== noticeId));
      toast.success('Notice deleted (demo mode)');
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">Notices</h1>
            <p className="page-subtitle">Post announcements for members</p>
          </div>
          <Button icon={IoAdd} onClick={() => setShowCreate(true)}>
            Post Notice
          </Button>
        </div>
      </div>

      {notices.length === 0 ? (
        <EmptyState
          icon={IoMegaphone}
          title="No notices posted"
          description="Post a notice to announce something to all members"
          action={
            <Button variant="primary" icon={IoAdd} onClick={() => setShowCreate(true)}>
              Post First Notice
            </Button>
          }
        />
      ) : (
        <div className="notices-list stagger-children">
          {notices.map((notice) => (
            <Card key={notice.id} className="notice-item" padding="lg">
              <div className="notice-item-header">
                <h3 className="notice-item-title">{notice.title}</h3>
                <button
                  className="notice-delete-btn"
                  onClick={() => handleDelete(notice.id)}
                  aria-label="Delete notice"
                >
                  <IoTrash />
                </button>
              </div>
              {notice.content && (
                <p className="notice-item-content">{notice.content}</p>
              )}
              {notice.imageUrl && <img src={notice.imageUrl} alt="" className="notice-item-image" />}
              <div className="notice-item-meta">
                <span className="notice-item-time">
                  <IoTime />
                  {formatDate(notice.createdAt, 'MMM d, h:mm a', 'Just now')}
                </span>
                <span className="notice-item-author">
                  by {notice.postedByName || 'Staff'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Notice Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Post a Notice"
      >
        <form onSubmit={handleCreate} className="create-notice-form">
          <Input
            id="notice-title"
            label="Title"
            placeholder="e.g. Gym closed on Sunday"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label className="notice-image-picker">
            <span>Featured poster image</span>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} alt="Poster preview" />}
          </label>
          <label className="notice-featured-toggle">
            <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} />
            <span>Show this as the featured poster on the member home</span>
          </label>
          <Input
            id="notice-content"
            label="Content (optional)"
            type="textarea"
            placeholder="Add more details..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
            <Button variant="ghost" onClick={() => setShowCreate(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Post Notice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
