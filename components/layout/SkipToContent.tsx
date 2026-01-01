"use client";

export default function SkipToContent() {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const target = document.getElementById("main-content");
      target?.focus();
    }
  };

  return (
    <a
      href="#main-content"
      className="skip-to-content"
      onKeyDown={handleKeyDown}
    >
      Skip to main content
    </a>
  );
}
