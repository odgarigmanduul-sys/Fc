import React from 'react';
import { motion } from 'motion/react';

interface DuoMascotProps {
  mood: "idle" | "correct" | "wrong" | "combo" | "excited";
  speechBubble?: string;
  className?: string;
  size?: number;
}

export default function DuoMascot({ mood, speechBubble, className = "", size = 96 }: DuoMascotProps) {
  // Define colors & wings behavior depending on the mood
  const isCrying = mood === "wrong";
  const isDancing = mood === "correct" || mood === "combo" || mood === "excited";

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Speech Bubble */}
      {speechBubble && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative mb-3.5 max-w-[260px] bg-white border-2 border-gray-200 px-4 py-2.5 rounded-2xl shadow-sm text-center"
        >
          <p className="text-[11px] font-extrabold text-gray-700 leading-relaxed m-0">
            {speechBubble}
          </p>
          {/* Arrow indicator */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-4 overflow-hidden pointer-events-none">
            <div className="w-2.5 h-2.5 bg-white border-b-2 border-r-2 border-gray-200 rotate-45 mx-auto -translate-y-1.5" />
          </div>
        </motion.div>
      )}

      {/* SVG Canvas for Duo the Owl */}
      <motion.div
        animate={
          isDancing 
            ? { y: [0, -12, 0], rotate: [0, -5, 5, -5, 0] } 
            : isCrying 
              ? { x: [-2, 2, -2, 2, 0] }
              : { y: [0, -2, 0] }
        }
        transition={
          isDancing 
            ? { repeat: Infinity, duration: 1.2, ease: "easeInOut" } 
            : isCrying 
              ? { repeat: 3, duration: 0.15 }
              : { repeat: Infinity, duration: 3, ease: "easeInOut" }
        }
        className="relative"
        style={{ width: size, height: size }}
      >
        {/* Shadow floor */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-2 bg-gray-200/80 rounded-full blur-[1px]" />

        {/* Duo SVG Body */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full select-none"
        >
          {/* LEGS (Feet) */}
          <motion.g
            animate={isDancing ? { rotate: [0, 15, -15, 0] } : {}}
            transition={{ repeat: Infinity, duration: 0.6 }}
            transform-origin="50px 85px"
          >
            {/* Left Foot */}
            <path d="M 32 80 C 28 80, 24 85, 28 90 C 32 95, 38 90, 38 85 Z" fill="#ff9600" stroke="#d47300" strokeWidth="1.5" />
            {/* Right Foot */}
            <path d="M 68 80 C 72 80, 76 85, 72 90 C 68 95, 62 90, 62 85 Z" fill="#ff9600" stroke="#d47300" strokeWidth="1.5" />
          </motion.g>

          {/* MAIN BODY (Green Egg Shape) */}
          <ellipse cx="50" cy="50" rx="35" ry="36" fill="#78e11a" stroke="#4da000" strokeWidth="2.5" />

          {/* TUMMY PLUMAGE PATCH (Soft pale yellow/green heart patch) */}
          <path d="M 35 55 C 35 40, 65 40, 65 55 C 65 74, 35 74, 35 55 Z" fill="#c3f542" opacity="0.9" />
          
          {/* Tummy feather design chevrons */}
          <path d="M 45 56 L 50 61 L 55 56" fill="none" stroke="#78e11a" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 41 64 L 50 72 L 59 64" fill="none" stroke="#78e11a" strokeWidth="2.5" strokeLinecap="round" />

          {/* LEFT EYE COMPLEX */}
          <g transform="translate(32, 35)">
            {/* Huge white circle */}
            <circle cx="0" cy="0" r="14" fill="white" stroke="#4da000" strokeWidth="1.5" />
            
            {/* Pupil */}
            {isCrying ? (
              // Crying downward arcs
              <path d="M -8 -2 A 8 8 0 0 1 8 -2" fill="none" stroke="#2a6600" strokeWidth="3" strokeLinecap="round" />
            ) : (
              // Happy / Normal pupil
              <g>
                <circle cx="0" cy="1" r="7" fill="#2a6600" />
                {/* Glint light sparkle */}
                <circle cx="-3" cy="-2" r="2.5" fill="white" />
              </g>
            )}
          </g>

          {/* RIGHT EYE COMPLEX */}
          <g transform="translate(68, 35)">
            {/* Huge white circle */}
            <circle cx="0" cy="0" r="14" fill="white" stroke="#4da000" strokeWidth="1.5" />
            
            {/* Pupil */}
            {isCrying ? (
              // Crying downward arcs
              <path d="M -8 -2 A 8 8 0 0 1 8 -2" fill="none" stroke="#2a6600" strokeWidth="3" strokeLinecap="round" />
            ) : (
              // Happy / Normal pupil
              <g>
                <circle cx="0" cy="1" r="7" fill="#2a6600" />
                {/* Glint light sparkle */}
                <circle cx="-3" cy="-2" r="2.5" fill="white" />
              </g>
            )}
          </g>

          {/* CUTE CHEEKS (Rosy blushes when happy/excited) */}
          {isDancing && (
            <g>
              <ellipse cx="22" cy="46" rx="4" ry="2" fill="#ff4b4b" opacity="0.5" />
              <ellipse cx="78" cy="46" rx="4" ry="2" fill="#ff4b4b" opacity="0.5" />
            </g>
          )}

          {/* TEARS EFFECT (when crying) */}
          {isCrying && (
            <g>
              {/* Left Eye Tear */}
              <motion.path 
                animate={{ y: [0, 4, 8, 12], opacity: [1, 1, 0.8, 0] }}
                transition={{ repeat: Infinity, duration: 1.3, ease: "easeIn" }}
                d="M 32 46 C 30 52, 34 52, 32 56 C 31 58, 33 58, 32 46" 
                fill="#1cb0f6" 
              />
              {/* Right Eye Tear */}
              <motion.path 
                animate={{ y: [0, 3, 7, 11], opacity: [1, 1, 0.8, 0] }}
                transition={{ repeat: Infinity, duration: 1.1, ease: "easeIn", delay: 0.2 }}
                d="M 68 46 C 66 52, 70 52, 68 56 C 67 58, 69 58, 68 46" 
                fill="#1cb0f6" 
              />
            </g>
          )}

          {/* BEAK (Cute orange diamond) */}
          <motion.polygon 
            points="50,42 56,48 50,58 44,48" 
            fill="#ff9600" 
            stroke="#d47300" 
            strokeWidth="1.5"
            animate={isDancing ? { scale: [1, 1.15, 1] } : {}}
            transition={{ repeat: Infinity, duration: 0.8 }}
            transform-origin="50px 48px"
          />

          {/* LEFT WING */}
          <motion.g
            animate={
              isDancing 
                ? { rotate: [0, -40, 15, 0] } 
                : isCrying 
                  ? { rotate: [0, -10, 0] }
                  : { rotate: [0, -5, 0] }
            }
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            transform-origin="20px 45px"
          >
            {/* Wing Path */}
            <path d="M 20 40 C 5 45, 10 65, 20 60 C 23 58, 24 45, 20 40" fill="#78e11a" stroke="#4da000" strokeWidth="2" />
          </motion.g>

          {/* RIGHT WING */}
          <motion.g
            animate={
              isDancing 
                ? { rotate: [0, 40, -15, 0] } 
                : isCrying 
                  ? { rotate: [0, 10, 0] }
                  : { rotate: [0, 5, 0] }
            }
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            transform-origin="80px 45px"
          >
            {/* Wing Path */}
            <path d="M 80 40 C 95 45, 90 65, 80 60 C 77 58, 76 45, 80 40" fill="#78e11a" stroke="#4da000" strokeWidth="2" />
          </motion.g>
        </svg>

        {/* Dynamic floating sparkles for correct combo action */}
        {isDancing && (
          <div className="absolute inset-0 pointer-events-none">
            <span className="absolute -top-3 -left-2 text-md select-none animate-ping">✨</span>
            <span className="absolute -top-2 -right-3 text-xs select-none animate-pulse">⭐</span>
            <span className="absolute -bottom-1 -left-3 text-xs select-none animate-bounce">🎈</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
