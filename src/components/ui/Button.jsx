import './Button.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full',
    loading && 'btn-loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading && <span className="btn-spinner"></span>}
      {!loading && Icon && iconPosition === 'left' && <Icon className="btn-icon" />}
      <span className="btn-text">{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className="btn-icon" />}
    </button>
  );
}
