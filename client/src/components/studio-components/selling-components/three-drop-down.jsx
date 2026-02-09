/* eslint-disable react/prop-types */
import { Edit, Trash2 } from "react-feather";

const ThreeDotsDropdown = ({ isOpen, onClose, position, onEdit, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1001]" onClick={onClose}>
      <div
        className="absolute bg-[#2A2A2A] rounded-xl shadow-lg py-2 min-w-[150px] border border-[#404040]"
        style={{
          top: position.y,
          left: position.x,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onEdit}
          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3A3A3A] transition-colors flex items-center gap-2"
        >
          <Edit size={14} />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#3A3A3A] transition-colors flex items-center gap-2"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default ThreeDotsDropdown;