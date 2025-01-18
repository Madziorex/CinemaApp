const Button: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}> = ({ children, onClick, className, disabled }) => (
  <button onClick={onClick} className={className} disabled={disabled}>
    {children}
  </button>
);

export default Button;
