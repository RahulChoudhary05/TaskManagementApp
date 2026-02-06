'use client';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  icon = null,
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 transform hover:scale-[1.02] shadow-md hover:shadow-lg';
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 focus:ring-purple-200 disabled:opacity-50',
    secondary: 'bg-white border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 focus:ring-purple-200 disabled:opacity-50',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 focus:ring-red-200 disabled:opacity-50',
    outline: 'bg-transparent border-2 border-purple-600 text-purple-600 hover:bg-purple-50 focus:ring-purple-200 disabled:opacity-50',
    ghost: 'bg-transparent text-gray-700 hover:bg-purple-50 focus:ring-purple-200 disabled:opacity-50',
    gradient: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 focus:ring-purple-200 disabled:opacity-50',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
      )}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
