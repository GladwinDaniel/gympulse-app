import { useState } from 'react';
import { MUSCLE_GROUPS } from '../../data/exercisesData';
import { IoChevronDown } from 'react-icons/io5';
import './BodyAnatomyMap.css';

export default function BodyAnatomyMap({
  selectedMuscle = null,
  onSelectMuscle,
  exerciseCounts = {},
}) {
  const [view, setView] = useState('front'); // 'front' | 'back'
  const [hoveredMuscle, setHoveredMuscle] = useState(null);
  const [showDiagram, setShowDiagram] = useState(true);
  const [showQuickMuscles, setShowQuickMuscles] = useState(false);

  const activeMuscleData = selectedMuscle ? MUSCLE_GROUPS[selectedMuscle] : null;
  const hoveredMuscleData = hoveredMuscle ? MUSCLE_GROUPS[hoveredMuscle] : null;

  function handleMuscleClick(id) {
    if (selectedMuscle === id) {
      onSelectMuscle?.(null); // toggle off to show all
    } else {
      onSelectMuscle?.(id);
    }
  }

  function getMuscleClass(id) {
    const isSelected = selectedMuscle === id;
    const isHovered = hoveredMuscle === id;
    return `muscle-group ${isSelected ? 'is-selected' : ''} ${isHovered ? 'is-hovered' : ''}`;
  }

  return (
    <div className="anatomy-container">
      {/* View Switcher Header */}
      <div className="anatomy-controls">
        <div className="anatomy-view-toggles">
          <button
            type="button"
            className={`anatomy-toggle-btn ${view === 'front' ? 'active' : ''}`}
            onClick={() => {
              setView('front');
              setShowDiagram(true);
            }}
          >
            Front View
          </button>
          <button
            type="button"
            className={`anatomy-toggle-btn ${view === 'back' ? 'active' : ''}`}
            onClick={() => {
              setView('back');
              setShowDiagram(true);
            }}
          >
            Back View
          </button>
        </div>

        <div className="anatomy-right-toggles">
          <button
            type="button"
            className="anatomy-collapse-btn"
            onClick={() => setShowDiagram(!showDiagram)}
          >
            {showDiagram ? 'Hide Figure ▴' : 'Show Figure ▾'}
          </button>
          {selectedMuscle && (
            <button
              type="button"
              className="anatomy-reset-btn"
              onClick={() => onSelectMuscle?.(null)}
            >
              Reset ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Visual Anatomy Diagram */}
      {showDiagram && (
        <div className="anatomy-stage animate-fade-in">
        <div className="anatomy-svg-wrapper">
          <svg
            viewBox="0 0 320 540"
            className="anatomy-svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="glow-neon" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <radialGradient id="head-gradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2c304d" />
                <stop offset="100%" stopColor="#151728" />
              </radialGradient>
            </defs>

            {/* Base Body Silhouette Outline */}
            <g className="body-silhouette-base" opacity="0.4">
              {/* Head & Neck */}
              <circle cx="160" cy="38" r="26" fill="url(#head-gradient)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <path d="M152 64 L150 78 L170 78 L168 64 Z" fill="#20233c" />
            </g>

            {/* FRONT VIEW */}
            {view === 'front' && (
              <g className="anatomy-view-front">
                {/* Traps / Neck Connectors */}
                <path
                  d="M140 76 L150 76 L145 92 L128 94 Z"
                  className={getMuscleClass('shoulders')}
                  onClick={() => handleMuscleClick('shoulders')}
                  onMouseEnter={() => setHoveredMuscle('shoulders')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                />
                <path
                  d="M170 76 L180 76 L192 94 L175 92 Z"
                  className={getMuscleClass('shoulders')}
                  onClick={() => handleMuscleClick('shoulders')}
                  onMouseEnter={() => setHoveredMuscle('shoulders')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                />

                {/* DELTOIDS (Shoulders) */}
                {/* Left Shoulder */}
                <path
                  d="M116 90 C106 95, 96 112, 98 130 C104 136, 114 138, 120 126 C124 114, 124 100, 116 90 Z"
                  className={getMuscleClass('shoulders')}
                  onClick={() => handleMuscleClick('shoulders')}
                  onMouseEnter={() => setHoveredMuscle('shoulders')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Shoulders (Deltoids)</title>
                </path>
                {/* Right Shoulder */}
                <path
                  d="M204 90 C214 95, 224 112, 222 130 C216 136, 206 138, 200 126 C196 114, 196 100, 204 90 Z"
                  className={getMuscleClass('shoulders')}
                  onClick={() => handleMuscleClick('shoulders')}
                  onMouseEnter={() => setHoveredMuscle('shoulders')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Shoulders (Deltoids)</title>
                </path>

                {/* CHEST (Pectorals) */}
                {/* Left Pec */}
                <path
                  d="M125 98 C135 98, 154 99, 157 101 L157 142 C146 145, 128 143, 120 134 C116 122, 118 108, 125 98 Z"
                  className={getMuscleClass('chest')}
                  onClick={() => handleMuscleClick('chest')}
                  onMouseEnter={() => setHoveredMuscle('chest')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Chest (Left Pectoral)</title>
                </path>
                {/* Right Pec */}
                <path
                  d="M195 98 C185 98, 166 99, 163 101 L163 142 C174 145, 192 143, 200 134 C204 122, 202 108, 195 98 Z"
                  className={getMuscleClass('chest')}
                  onClick={() => handleMuscleClick('chest')}
                  onMouseEnter={() => setHoveredMuscle('chest')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Chest (Right Pectoral)</title>
                </path>

                {/* BICEPS */}
                {/* Left Bicep */}
                <path
                  d="M98 135 C92 145, 90 168, 96 182 C104 185, 114 180, 116 168 C118 152, 112 140, 98 135 Z"
                  className={getMuscleClass('biceps')}
                  onClick={() => handleMuscleClick('biceps')}
                  onMouseEnter={() => setHoveredMuscle('biceps')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Biceps</title>
                </path>
                {/* Right Bicep */}
                <path
                  d="M222 135 C228 145, 230 168, 224 182 C216 185, 206 180, 204 168 C202 152, 208 140, 222 135 Z"
                  className={getMuscleClass('biceps')}
                  onClick={() => handleMuscleClick('biceps')}
                  onMouseEnter={() => setHoveredMuscle('biceps')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Biceps</title>
                </path>

                {/* FOREARMS */}
                {/* Left Forearm */}
                <path
                  d="M94 188 C85 205, 78 228, 80 248 C86 252, 94 246, 100 236 C106 218, 108 200, 104 188 Z"
                  className={getMuscleClass('forearms')}
                  onClick={() => handleMuscleClick('forearms')}
                  onMouseEnter={() => setHoveredMuscle('forearms')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Forearms & Grip</title>
                </path>
                {/* Right Forearm */}
                <path
                  d="M226 188 C235 205, 242 228, 240 248 C234 252, 226 246, 220 236 C214 218, 212 200, 216 188 Z"
                  className={getMuscleClass('forearms')}
                  onClick={() => handleMuscleClick('forearms')}
                  onMouseEnter={() => setHoveredMuscle('forearms')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Forearms & Grip</title>
                </path>

                {/* ABS & CORE */}
                {/* Upper Abs */}
                <rect
                  x="142" y="148" width="16" height="18" rx="3"
                  className={getMuscleClass('abs-core')}
                  onClick={() => handleMuscleClick('abs-core')}
                  onMouseEnter={() => setHoveredMuscle('abs-core')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                />
                <rect
                  x="162" y="148" width="16" height="18" rx="3"
                  className={getMuscleClass('abs-core')}
                  onClick={() => handleMuscleClick('abs-core')}
                  onMouseEnter={() => setHoveredMuscle('abs-core')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                />

                {/* Mid Abs */}
                <rect
                  x="142" y="170" width="16" height="18" rx="3"
                  className={getMuscleClass('abs-core')}
                  onClick={() => handleMuscleClick('abs-core')}
                  onMouseEnter={() => setHoveredMuscle('abs-core')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                />
                <rect
                  x="162" y="170" width="16" height="18" rx="3"
                  className={getMuscleClass('abs-core')}
                  onClick={() => handleMuscleClick('abs-core')}
                  onMouseEnter={() => setHoveredMuscle('abs-core')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                />

                {/* Lower Abs */}
                <path
                  d="M142 192 L178 192 L168 214 L152 214 Z"
                  className={getMuscleClass('abs-core')}
                  onClick={() => handleMuscleClick('abs-core')}
                  onMouseEnter={() => setHoveredMuscle('abs-core')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                />

                {/* Obliques */}
                <path
                  d="M130 152 C134 165, 134 185, 138 206 L142 206 C140 185, 138 165, 136 150 Z"
                  className={getMuscleClass('abs-core')}
                  onClick={() => handleMuscleClick('abs-core')}
                  onMouseEnter={() => setHoveredMuscle('abs-core')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                />
                <path
                  d="M190 152 C186 165, 186 185, 182 206 L178 206 C180 185, 182 165, 184 150 Z"
                  className={getMuscleClass('abs-core')}
                  onClick={() => handleMuscleClick('abs-core')}
                  onMouseEnter={() => setHoveredMuscle('abs-core')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                />

                {/* QUADRICEPS (Legs Front) */}
                {/* Left Quad */}
                <path
                  d="M124 230 C120 255, 118 300, 126 345 C136 348, 146 345, 154 330 C156 295, 156 255, 152 230 Z"
                  className={getMuscleClass('quads')}
                  onClick={() => handleMuscleClick('quads')}
                  onMouseEnter={() => setHoveredMuscle('quads')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Quadriceps</title>
                </path>
                {/* Right Quad */}
                <path
                  d="M196 230 C200 255, 202 300, 194 345 C184 348, 174 345, 166 330 C164 295, 164 255, 168 230 Z"
                  className={getMuscleClass('quads')}
                  onClick={() => handleMuscleClick('quads')}
                  onMouseEnter={() => setHoveredMuscle('quads')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Quadriceps</title>
                </path>

                {/* CALVES / SHINS (Front) */}
                {/* Left Shin/Calf */}
                <path
                  d="M125 365 C120 385, 118 430, 126 470 C134 472, 142 468, 146 448 C148 420, 146 385, 142 365 Z"
                  className={getMuscleClass('calves')}
                  onClick={() => handleMuscleClick('calves')}
                  onMouseEnter={() => setHoveredMuscle('calves')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Calves & Tibialis</title>
                </path>
                {/* Right Shin/Calf */}
                <path
                  d="M195 365 C200 385, 202 430, 194 470 C186 472, 178 468, 174 448 C172 420, 174 385, 178 365 Z"
                  className={getMuscleClass('calves')}
                  onClick={() => handleMuscleClick('calves')}
                  onMouseEnter={() => setHoveredMuscle('calves')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Calves & Tibialis</title>
                </path>
              </g>
            )}

            {/* BACK VIEW */}
            {view === 'back' && (
              <g className="anatomy-view-back">
                {/* UPPER BACK & TRAPS */}
                <path
                  d="M160 76 L186 94 C178 116, 174 135, 160 142 C146 135, 142 116, 134 94 Z"
                  className={getMuscleClass('upper-back')}
                  onClick={() => handleMuscleClick('upper-back')}
                  onMouseEnter={() => setHoveredMuscle('upper-back')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Upper Back & Trapezius</title>
                </path>

                {/* REAR SHOULDERS */}
                <path
                  d="M116 90 C106 95, 98 112, 100 128 C106 132, 116 130, 122 120 C124 110, 124 98, 116 90 Z"
                  className={getMuscleClass('shoulders')}
                  onClick={() => handleMuscleClick('shoulders')}
                  onMouseEnter={() => setHoveredMuscle('shoulders')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                />
                <path
                  d="M204 90 C214 95, 222 112, 220 128 C214 132, 204 130, 198 120 C196 110, 196 98, 204 90 Z"
                  className={getMuscleClass('shoulders')}
                  onClick={() => handleMuscleClick('shoulders')}
                  onMouseEnter={() => setHoveredMuscle('shoulders')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                />

                {/* TRICEPS */}
                {/* Left Tricep */}
                <path
                  d="M96 132 C90 145, 88 170, 96 182 C104 185, 112 180, 114 168 C116 150, 110 138, 96 132 Z"
                  className={getMuscleClass('triceps')}
                  onClick={() => handleMuscleClick('triceps')}
                  onMouseEnter={() => setHoveredMuscle('triceps')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Triceps</title>
                </path>
                {/* Right Tricep */}
                <path
                  d="M224 132 C230 145, 232 170, 224 182 C216 185, 208 180, 206 168 C204 150, 210 138, 224 132 Z"
                  className={getMuscleClass('triceps')}
                  onClick={() => handleMuscleClick('triceps')}
                  onMouseEnter={() => setHoveredMuscle('triceps')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Triceps</title>
                </path>

                {/* LATS (Latissimus Dorsi) */}
                {/* Left Lat */}
                <path
                  d="M136 122 C126 136, 122 165, 134 192 L152 182 C148 160, 148 138, 144 122 Z"
                  className={getMuscleClass('lats')}
                  onClick={() => handleMuscleClick('lats')}
                  onMouseEnter={() => setHoveredMuscle('lats')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Lats (Left)</title>
                </path>
                {/* Right Lat */}
                <path
                  d="M184 122 C194 136, 198 165, 186 192 L168 182 C172 160, 172 138, 176 122 Z"
                  className={getMuscleClass('lats')}
                  onClick={() => handleMuscleClick('lats')}
                  onMouseEnter={() => setHoveredMuscle('lats')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Lats (Right)</title>
                </path>

                {/* LOWER BACK (Erector Spinae) */}
                <path
                  d="M148 184 L172 184 L168 222 L152 222 Z"
                  className={getMuscleClass('lower-back')}
                  onClick={() => handleMuscleClick('lower-back')}
                  onMouseEnter={() => setHoveredMuscle('lower-back')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Lower Back</title>
                </path>

                {/* GLUTES */}
                {/* Left Glute */}
                <path
                  d="M126 226 C120 242, 124 272, 142 278 C154 280, 158 268, 158 245 L158 226 Z"
                  className={getMuscleClass('glutes')}
                  onClick={() => handleMuscleClick('glutes')}
                  onMouseEnter={() => setHoveredMuscle('glutes')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Gluteus Maximus (Left)</title>
                </path>
                {/* Right Glute */}
                <path
                  d="M194 226 C200 242, 196 272, 178 278 C166 280, 162 268, 162 245 L162 226 Z"
                  className={getMuscleClass('glutes')}
                  onClick={() => handleMuscleClick('glutes')}
                  onMouseEnter={() => setHoveredMuscle('glutes')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Gluteus Maximus (Right)</title>
                </path>

                {/* HAMSTRINGS */}
                {/* Left Hamstring */}
                <path
                  d="M125 284 C120 305, 120 338, 128 355 C138 358, 148 355, 154 340 C156 315, 156 290, 152 284 Z"
                  className={getMuscleClass('hamstrings')}
                  onClick={() => handleMuscleClick('hamstrings')}
                  onMouseEnter={() => setHoveredMuscle('hamstrings')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Hamstrings</title>
                </path>
                {/* Right Hamstring */}
                <path
                  d="M195 284 C200 305, 200 338, 192 355 C182 358, 172 355, 166 340 C164 315, 164 290, 168 284 Z"
                  className={getMuscleClass('hamstrings')}
                  onClick={() => handleMuscleClick('hamstrings')}
                  onMouseEnter={() => setHoveredMuscle('hamstrings')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Hamstrings</title>
                </path>

                {/* CALVES (Back View - Gastrocnemius) */}
                {/* Left Calf */}
                <path
                  d="M124 366 C116 388, 114 430, 124 466 C134 470, 144 465, 146 440 C150 410, 148 385, 142 366 Z"
                  className={getMuscleClass('calves')}
                  onClick={() => handleMuscleClick('calves')}
                  onMouseEnter={() => setHoveredMuscle('calves')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Calves</title>
                </path>
                {/* Right Calf */}
                <path
                  d="M196 366 C204 388, 206 430, 196 466 C186 470, 176 465, 174 440 C170 410, 172 385, 178 366 Z"
                  className={getMuscleClass('calves')}
                  onClick={() => handleMuscleClick('calves')}
                  onMouseEnter={() => setHoveredMuscle('calves')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                >
                  <title>Calves</title>
                </path>
              </g>
            )}
          </svg>
        </div>

        {/* Selected / Hovered Muscle Dynamic Callout Banner */}
        <div className="anatomy-info-banner">
          {activeMuscleData || hoveredMuscleData ? (
            <div className="muscle-callout-card">
              <div className="muscle-callout-header">
                <span
                  className="muscle-color-dot"
                  style={{ background: (activeMuscleData || hoveredMuscleData).color }}
                />
                <h4 className="muscle-callout-title">
                  {(activeMuscleData || hoveredMuscleData).name}
                </h4>
                {selectedMuscle && (
                  <span className="muscle-active-badge">Selected</span>
                )}
              </div>
              <p className="muscle-callout-desc">
                {(activeMuscleData || hoveredMuscleData).description}
              </p>
              <div className="muscle-callout-meta">
                <span className="muscle-count-pill">
                  {exerciseCounts[(activeMuscleData || hoveredMuscleData).id] || 0} Exercises Available
                </span>
                <span className="muscle-hint">
                  {selectedMuscle === (activeMuscleData || hoveredMuscleData).id
                    ? 'Click again to view all exercises'
                    : 'Click muscle to filter exercises below'}
                </span>
              </div>
            </div>
          ) : (
            <div className="muscle-callout-card empty">
              <span className="muscle-callout-prompt">
                👉 Click any muscle on the body to highlight workouts, or explore all exercises below.
              </span>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Collapsed quick muscle selector */}
      <div className={`anatomy-quick-selector ${showQuickMuscles ? 'is-open' : ''}`}>
        <button
          type="button"
          className="anatomy-quick-trigger"
          aria-expanded={showQuickMuscles}
          onClick={() => setShowQuickMuscles(previous => !previous)}
        >
          <span>
            <strong>Quick Select Muscle</strong>
            <small>{selectedMuscle ? MUSCLE_GROUPS[selectedMuscle]?.name : 'All muscles'}</small>
          </span>
          <IoChevronDown />
        </button>

        {showQuickMuscles && <div className="anatomy-chips-list animate-fade-in">
          <button
            type="button"
            className={`anatomy-chip ${selectedMuscle === null ? 'active' : ''}`}
            onClick={() => {
              onSelectMuscle?.(null);
              setShowQuickMuscles(false);
            }}
          >
            All Muscles ({Object.values(exerciseCounts).reduce((a, b) => a + b, 0)})
          </button>
          {Object.values(MUSCLE_GROUPS).map((m) => {
            const count = exerciseCounts[m.id] || 0;
            return (
              <button
                key={m.id}
                type="button"
                className={`anatomy-chip ${selectedMuscle === m.id ? 'active' : ''}`}
                onClick={() => {
                  handleMuscleClick(m.id);
                  setShowQuickMuscles(false);
                }}
              >
                <span className="chip-dot" style={{ background: m.color }} />
                <span>{m.name.split(' ')[0]}</span>
                <span className="chip-count">({count})</span>
              </button>
            );
          })}
        </div>}
      </div>
    </div>
  );
}
