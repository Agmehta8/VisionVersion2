import React from "react";
import VisionOpeningSequence from "./VisionOpeningSequence";

export default function App() {
  return (
    <VisionOpeningSequence
      onComplete={() => {
        alert("Opening sequence complete. Replace this later.");
      }}
    />
  );
}
