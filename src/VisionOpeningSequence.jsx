import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ONBOARDING_STORAGE_KEY = "vision.hasCompletedOpeningSequence";

function ChevronRightIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function HeartIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.8 4.6c-1.8-1.7-4.7-1.6-6.4.3L12 7.5 9.6 4.9C7.9 3 5 2.9 3.2 4.6 1.3 6.4 1.3 9.3 3.1 11.2L12 20l8.9-8.8c1.8-1.9 1.8-4.8-.1-6.6z" />
    </svg>
  );
}

function ShieldCheckIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v5c0 4.6-2.9 8.7-7 10-4.1-1.3-7-5.4-7-10V6l7-3z" />
      <path d="M8.8 12.1l2.1 2.1 4.5-4.8" />
    </svg>
  );
}

function AdaptIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 7h8.5a4.5 4.5 0 010 9H9" />
      <path d="M7 7l3-3" />
      <path d="M7 7l3 3" />
      <path d="M17 17l-3 3" />
      <path d="M17 17l-3-3" />
    </svg>
  );
}

const screens = [
  {
    id: "welcome",
    eyebrow: "Vision",
    icon: HeartIcon,
    title: "A guided space for your care journey",
    body: "Vision asks gentle questions to better understand your experience, your care, and what matters most to you.",
    cta: "Continue",
  },
  {
    id: "control",
    eyebrow: "You are in control",
    icon: ShieldCheckIcon,
    title: "Move at your own pace",
    body: "There are no right or wrong answers. You can skip any question, pause, or stop at any time.",
    cta: "I understand",
  },
  {
    id: "expect",
    eyebrow: "What to expect",
    icon: AdaptIcon,
    title: "A conversation that adapts to you",
    body: "Some questions may feel simple. Others may feel more personal. Vision will adjust based on how you answer.",
    cta: "Start",
  },
];

function getNextIndex(currentIndex) {
  return Math.min(currentIndex + 1, screens.length - 1);
}

function getBackIndex(currentIndex) {
  return Math.max(currentIndex - 1, 0);
}

function safeReadOnboardingComplete() {
  try {
    return window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function safeWriteOnboardingComplete() {
  try {
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
  } catch {}
}

export default function VisionOpeningSequence({ onComplete }) {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [hasCompletedOpening, setHasCompletedOpening] = useState(false);

  useEffect(() => {
    setHasCompletedOpening(safeReadOnboardingComplete());
  }, []);

  const screen = screens[index];
  const Icon = screen.icon;
  const isFinalScreen = index === screens.length - 1;

  const animationProps = useMemo(
    () =>
      prefersReducedMotion
        ? { initial: false, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
        : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } },
    [prefersReducedMotion]
  );

  const completeOpening = () => {
    safeWriteOnboardingComplete();
    setHasCompletedOpening(true);
    if (typeof onComplete === "function") onComplete();
  };

  const next = () => {
    if (isFinalScreen) return completeOpening();
    setIndex(getNextIndex);
  };

  const back = () => setIndex(getBackIndex);

  if (hasCompletedOpening) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-[#aeb2cf] p-4">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-xl font-semibold mb-2">Welcome back</h2>
          <p className="text-sm mb-4">Continue your conversation</p>
          <button
            onClick={onComplete}
            className="bg-[#6f68a9] text-white px-4 py-2 rounded-full"
          >
            Continue
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#aeb2cf] p-4">
      <motion.div
        key={screen.id}
        {...animationProps}
        className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full"
      >
        <div className="flex items-center gap-3 mb-4">
          <Icon className="h-5 w-5 text-[#62599e]" />
          <p className="text-sm font-semibold text-[#62599e] uppercase">
            {screen.eyebrow}
          </p>
        </div>

        <h2 className="text-xl font-semibold">{screen.title}</h2>
        <p className="mt-2 text-sm">{screen.body}</p>

        <div className="mt-4 flex justify-between items-center">
          <button onClick={back} disabled={index === 0}>
            Back
          </button>

          <div className="flex gap-1">
            {screens.map((_, i) => (
              <div
                key={i}
                className={`h-2 ${
                  i === index ? "w-6 bg-purple-500" : "w-2 bg-gray-300"
                } rounded-full`}
              />
            ))}
          </div>

          <button onClick={next}>{screen.cta}</button>
        </div>
      </motion.div>
    </main>
  );
}
