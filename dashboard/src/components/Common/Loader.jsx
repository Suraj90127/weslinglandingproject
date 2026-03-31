const Loader = ({ size = 'medium', fullScreen = false }) => {
    const sizeClasses = {
      small: 'w-6 h-6',
      medium: 'w-10 h-10',
      large: 'w-16 h-16'
    };
  
    if (fullScreen) {
      return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`}></div>
        </div>
      );
    }
  
    return (
      <div className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`}></div>
    );
  };
  
  export default Loader;