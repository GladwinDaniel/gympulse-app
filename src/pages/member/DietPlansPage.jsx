import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PREDEFINED_DIET_PLANS, DEMO_PT_DIET_PLANS, DEMO_CUSTOM_DIET_PLANS } from '../../data/dietData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import TabBar from '../../components/ui/TabBar';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import {
  IoNutrition,
  IoAdd,
  IoFlame,
  IoStar,
  IoTime,
  IoTrash,
  IoEye,
  IoCreateOutline
} from 'react-icons/io5';
import { formatDate } from '../../utils/dateUtils';
import toast from 'react-hot-toast';
import './DietPlansPage.css';

const tabs = [
  { key: 'predefined', label: 'Predefined' },
  { key: 'custom', label: 'My Plans' },
  { key: 'pt', label: 'From Trainer' },
];

export default function DietPlansPage() {
  const { isPTMember } = useAuth();
  const [activeTab, setActiveTab] = useState('predefined');
  const [customPlans, setCustomPlans] = useState(() => DEMO_CUSTOM_DIET_PLANS.map(plan => ({ ...plan, source: 'member' })));
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  // Create form state
  const [newName, setNewName] = useState('');
  const [newCalories, setNewCalories] = useState('');
  const [newMeals, setNewMeals] = useState([
    { time: '8:00 AM', type: 'Breakfast', items: '' },
    { time: '1:00 PM', type: 'Lunch', items: '' },
    { time: '7:30 PM', type: 'Dinner', items: '' },
  ]);

  function handleCreate() {
    if (!newName.trim()) { toast.error('Name is required'); return; }
    const plan = {
      id: editingPlan?.id || 'custom-diet-' + Date.now(),
      name: newName.trim(),
      goal: 'Custom',
      calories: newCalories || '—',
      meals: newMeals.filter(m => m.items.trim()).map(m => ({
        ...m,
        items: m.items.split(',').map(i => i.trim()).filter(Boolean)
      })),
      source: 'member',
      createdAt: new Date(),
    };
    setCustomPlans(prev => editingPlan
      ? prev.map(item => item.id === editingPlan.id ? plan : item)
      : [plan, ...prev]);
    setNewName('');
    setNewCalories('');
    setNewMeals([
      { time: '8:00 AM', type: 'Breakfast', items: '' },
      { time: '1:00 PM', type: 'Lunch', items: '' },
      { time: '7:30 PM', type: 'Dinner', items: '' },
    ]);
    setEditingPlan(null);
    setShowCreate(false);
    toast.success(editingPlan ? 'Diet plan updated!' : 'Diet plan created!');
  }

  function handleDeleteCustom(id) {
    if (!window.confirm('Delete this diet plan?')) return;
    setCustomPlans(prev => prev.filter(p => p.id !== id));
    toast.success('Plan deleted');
  }

  function openPlanEditor(plan, copy = false) {
    setEditingPlan(copy ? null : plan);
    setNewName(copy ? `${plan.name} (My Copy)` : plan.name);
    setNewCalories(plan.calories || '');
    setNewMeals((plan.meals || []).map(meal => ({
      ...meal,
      items: Array.isArray(meal.items) ? meal.items.join(', ') : meal.items || ''
    })));
    setSelectedPlan(null);
    setShowCreate(true);
  }

  function updateMeal(index, field, value) {
    setNewMeals(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m));
  }

  function addMealSlot() {
    setNewMeals(prev => [...prev, { time: '', type: 'Snack', items: '' }]);
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Diet Plans</h1>
        <p className="page-subtitle">Your meal plans and nutrition</p>
      </div>

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Predefined Tab */}
      {activeTab === 'predefined' && (
        <div className="dp-tab-content animate-fade-in">
          <div className="dp-plans-grid stagger-children">
            {PREDEFINED_DIET_PLANS.map(plan => (
              <Card key={plan.id} className="dp-plan-card" padding="none" onClick={() => setSelectedPlan(plan)}>
                <div className="dp-plan-header" style={{ background: plan.gradient }}>
                  <IoNutrition className="dp-plan-icon" />
                  <Badge variant="default" size="sm">{plan.calories}</Badge>
                </div>
                <div className="dp-plan-body">
                  <h4 className="dp-plan-name">{plan.name}</h4>
                  <p className="dp-plan-goal">{plan.goal}</p>
                  <div className="dp-plan-meta">
                    <span><IoFlame /> {plan.meals.length} meals</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Custom Plans Tab */}
      {activeTab === 'custom' && (
        <div className="dp-tab-content animate-fade-in">
          <Button variant="primary" icon={IoAdd} onClick={() => setShowCreate(true)} className="dp-create-btn">
            Create Diet Plan
          </Button>
          {customPlans.length === 0 ? (
            <EmptyState
              icon={IoNutrition}
              title="No custom plans"
              description="Create your own meal plan tailored to your goals"
            />
          ) : (
            <div className="dp-plans-list stagger-children">
              {customPlans.map(plan => (
                <Card key={plan.id} className="dp-custom-card" padding="md">
                  <div className="dp-custom-info" onClick={() => setSelectedPlan(plan)}>
                    <h4>{plan.name}</h4>
                    <div className="dp-custom-meta">
                      <Badge variant="default" size="sm">{plan.calories}</Badge>
                      <Badge variant="default" size="sm">{plan.meals?.length || 0} meals</Badge>
                      <span className="dp-custom-date">
                        <IoTime /> {formatDate(plan.createdAt, 'MMM d')}
                      </span>
                    </div>
                  </div>
                  <button className="dp-custom-delete" onClick={() => handleDeleteCustom(plan.id)}>
                    <IoTrash />
                  </button>
                  <Button size="sm" variant="ghost" icon={IoCreateOutline} onClick={() => openPlanEditor(plan)}>
                    Edit
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PT Plans Tab */}
      {activeTab === 'pt' && (
        <div className="dp-tab-content animate-fade-in">
          {!isPTMember ? (
            <EmptyState
              icon={IoStar}
              title="PT Members Only"
              description="Exclusive diet plans from your personal trainer are available with PT membership."
            />
          ) : DEMO_PT_DIET_PLANS.length === 0 ? (
            <EmptyState
              icon={IoNutrition}
              title="No trainer diet plans"
              description="Your trainer hasn't assigned any diet plans yet."
            />
          ) : (
            <div className="dp-plans-list stagger-children">
              {DEMO_PT_DIET_PLANS.map(plan => (
                <Card key={plan.id} className="dp-pt-card" padding="md" glow="primary" onClick={() => setSelectedPlan(plan)}>
                  <div className="dp-pt-badge"><IoStar /> From {plan.trainerName}</div>
                  <h4 className="dp-pt-name">{plan.name}</h4>
                  <div className="dp-custom-meta">
                    <Badge variant="primary" size="sm">{plan.calories}</Badge>
                    <Badge variant="default" size="sm">{plan.meals.length} meals</Badge>
                    <span className="dp-custom-date">
                      Until {formatDate(plan.validTo, 'MMM d')}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Diet Plan Detail Modal */}
      <Modal
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        title={selectedPlan?.name || 'Diet Plan'}
        size="lg"
      >
        {selectedPlan && (
          <div className="dp-detail">
            <div className="dp-detail-header">
              <Badge variant="primary">{selectedPlan.calories}</Badge>
              {selectedPlan.goal && <Badge variant="default">{selectedPlan.goal}</Badge>}
            </div>
            <div className="dp-meals-list">
              {selectedPlan.meals?.map((meal, idx) => (
                <div key={idx} className="dp-meal-item">
                  <div className="dp-meal-time">
                    <span className="dp-meal-clock">{meal.time}</span>
                    <span className="dp-meal-type">{meal.type}</span>
                  </div>
                  <ul className="dp-meal-items">
                    {(Array.isArray(meal.items) ? meal.items : [meal.items]).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {!selectedPlan.trainerName && (
              <Button
                variant="primary"
                icon={IoCreateOutline}
                onClick={() => openPlanEditor(selectedPlan, !selectedPlan.source)}
              >
                {selectedPlan.source === 'member' ? 'Edit Plan' : 'Customize a Copy'}
              </Button>
            )}
          </div>
        )}
      </Modal>

      {/* Create Diet Plan Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
            title={editingPlan ? 'Edit Diet Plan' : 'Create Diet Plan'}
        size="lg"
      >
        <div className="dp-create-form">
          <Input
            id="diet-name"
            label="Plan Name"
            placeholder="e.g., My Veggie Plan"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <Input
            id="diet-calories"
            label="Estimated Calories (optional)"
            placeholder="e.g., ~1,800 kcal"
            value={newCalories}
            onChange={e => setNewCalories(e.target.value)}
          />
          <div className="dp-meals-form">
            <label className="dp-form-label">Meals</label>
            {newMeals.map((meal, idx) => (
              <div key={idx} className="dp-meal-row">
                <Input
                  id={`meal-time-${idx}`}
                  placeholder="Time"
                  value={meal.time}
                  onChange={e => updateMeal(idx, 'time', e.target.value)}
                />
                <Input
                  id={`meal-type-${idx}`}
                  placeholder="Type"
                  value={meal.type}
                  onChange={e => updateMeal(idx, 'type', e.target.value)}
                />
                <Input
                  id={`meal-items-${idx}`}
                  placeholder="Items (comma separated)"
                  value={meal.items}
                  onChange={e => updateMeal(idx, 'items', e.target.value)}
                />
              </div>
            ))}
            <Button variant="ghost" size="sm" icon={IoAdd} onClick={addMealSlot}>
              Add Meal Slot
            </Button>
          </div>
          <Button variant="primary" fullWidth icon={IoAdd} onClick={handleCreate}>
            {editingPlan ? 'Update Plan' : 'Create Plan'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
