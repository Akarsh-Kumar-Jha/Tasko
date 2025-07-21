import React from "react";

function Modal({ isOpen, onClose, inputs, setInputs, onSubmit }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleInputChange = (index, value) => {
    const updatedInputs = [...inputs];
    updatedInputs[index] = value;
    setInputs(updatedInputs);
  };

  const handleAddInput = () => {
    setInputs([...inputs, ""]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-[#111827] border border-white/10 p-8 rounded-2xl shadow-xl text-white animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-pink-500 text-transparent bg-clip-text">
            ✨ Add Subtasks With AI
          </h2>
          <button
            onClick={onClose}
            className="text-white cursor-pointer hover:text-red-400 transition"
          >
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {inputs.map((input, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={input}
                required
                placeholder={`Subtask ${index + 1}`}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={handleAddInput}
                className="px-4 py-2 cursor-pointer rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 transition shadow-md"
              >
                +
              </button>
            </div>
          ))}

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold shadow-lg transition"
            >
              🚀 Generate
            </button>
          </div>
        </form>
      </div>

      {/* Custom Animation */}
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.4s ease-out forwards;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Modal;
