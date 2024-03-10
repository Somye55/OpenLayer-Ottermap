// components/Popup.tsx
import React from 'react';

const Popup = React.forwardRef<HTMLDivElement, {}>((_, ref) => {
 return (
    <div ref={ref} className="popup">
      <style jsx>{`
        .popup {
          background-color: #8e181880;
          padding: 10px;
          border: 1px solid black;
          border-radius: 5px;
          display: block;
          position: absolute;
          top: 10px;
          z-index: 1000
        }
      `}</style>
    </div>
 );
});

Popup.displayName = 'Popup';

export default Popup;
