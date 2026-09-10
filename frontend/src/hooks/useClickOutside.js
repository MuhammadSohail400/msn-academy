import { useEffect } from 'react';

// Click-outside listener for dropdowns/modals — pass a ref and a callback
export default function useClickOutside(ref, onOutsideClick) {
  useEffect(() => {
    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick(event);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, onOutsideClick]);
}
