import './LoadingSpinner.css';

export default function LoadingSpinner({ fullScreen = false, size = 'md', text = '' }) {
  if (fullScreen) {
    return (
      <div className="spinner-fullscreen">
        <div className="spinner-wrapper">
          <div className={`spinner spinner-${size}`}>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          {text && <p className="spinner-text">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="spinner-inline">
      <div className={`spinner spinner-${size}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}
