const Popup = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    // my backdrop
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      {/* popup box */}
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // prevents from closing when clicking inside
      >
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl font-bold transition-all"
          >
            ×
          </button>
        </div>

        {/* the content */}
        {children}
      </div>
    </div>
  );
};

export default Popup;