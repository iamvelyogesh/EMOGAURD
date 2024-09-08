import React from 'react';

const Modal = ({ image, onToggle }) => {
  return (
    <div className="modal-overlay" onClick={onToggle}>
      <div className="modal-content">
        <img src={`data:image/png;base64,${image}`} alt="Expanded Image" />
      </div>
    </div>
  );
};

export default Modal;
