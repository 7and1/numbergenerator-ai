"use client";

import { ComboGenerator } from "@/components/generator/ComboGenerator";
import { GeneratorErrorBoundary } from "@/components/error";

export default function ComboPageContent() {
  return (
    <GeneratorErrorBoundary
      toolName="Combination Generator"
      onReset={() => {
        window.location.reload();
      }}
    >
      <ComboGenerator />
    </GeneratorErrorBoundary>
  );
}
