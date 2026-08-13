import React, { useState, useEffect } from 'react';

/**
 * Custom typing animation component with configurable speed, delay, and word loops.
 */
export default function TypingAnimation({ words, speed = 80, delay = 1500 }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const currentWord = words[wordIndex];
    
    // Determine speed depending on writing or deleting
    const timerSpeed = isDeleting ? speed / 2 : speed;

    const handleType = () => {
      if (!isDeleting) {
        // Typing letters
        setCharIndex((prev) => prev + 1);
        
        // Word completed, prepare to delete after delay
        if (charIndex === currentWord.length) {
          setIsDeleting(true);
        }
      } else {
        // Erasing letters
        setCharIndex((prev) => prev - 1);

        // Word erased, jump to next word
        if (charIndex === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    };

    // Delay at word completion
    let timeoutId;
    if (charIndex === currentWord.length && !isDeleting) {
      timeoutId = setTimeout(() => {
        setIsDeleting(true);
      }, delay);
    } else {
      timeoutId = setTimeout(handleType, timerSpeed);
    }

    return () => clearTimeout(timeoutId);
  }, [charIndex, isDeleting, wordIndex, words, speed, delay]);

  return (
    <span className="text-accent font-semibold inline-block min-h-[1.5em]">
      {words && words.length > 0 ? words[wordIndex].substring(0, charIndex) : ''}
      <span className="animate-pulse ml-0.5 border-r-2 border-accent h-[1em] inline-block align-middle"></span>
    </span>
  );
}
