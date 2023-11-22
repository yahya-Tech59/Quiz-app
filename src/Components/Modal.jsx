import React from "react";

export const Modal = () => {
  return (
    <div className="modal-container isOpen">
      <div className="modal-content">
        <h2>Congrats</h2>
        <p>You Answered n questions correctly</p>
        <button className="close-btn">Play Again</button>
      </div>
    </div>
  );
};
