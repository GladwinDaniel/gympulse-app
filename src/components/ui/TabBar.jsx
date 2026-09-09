import './TabBar.css';

export default function TabBar({ tabs, activeTab, onTabChange }) {
  return (
    <div className="tab-bar">
      {tabs.map((tab) => {
        const id = tab.id || tab.key;
        return (
          <button
            key={id}
            className={`tab-item ${activeTab === id ? 'tab-active' : ''}`}
            onClick={() => onTabChange(id)}
          >
            {tab.icon && <tab.icon className="tab-icon" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="tab-count">{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
