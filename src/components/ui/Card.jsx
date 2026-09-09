import './Card.css';

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  hover = true,
  glow = '',
  onClick,
  className = '',
  ...props
}) {
  const classes = [
    'card',
    `card-${variant}`,
    `card-pad-${padding}`,
    hover && 'card-hover',
    glow && `card-glow-${glow}`,
    onClick && 'card-clickable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );
}
