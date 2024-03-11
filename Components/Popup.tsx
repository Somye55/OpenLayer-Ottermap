// Import React for creating components
import React from 'react';

const Popup = React.forwardRef<HTMLDivElement, {}>((_, ref) => {
 // Return a div with a class of "popup" and a style block for styling
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

// Set the display name for the Popup component
Popup.displayName = 'Popup';

export default Popup;
