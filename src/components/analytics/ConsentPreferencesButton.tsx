"use client";

interface ConsentPreferencesButtonProps {
  className?: string;
  children: React.ReactNode;
}

export default function ConsentPreferencesButton({
  className,
  children,
}: ConsentPreferencesButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        window.dispatchEvent(new CustomEvent("fenice:open-consent-preferences"));
      }}
    >
      {children}
    </button>
  );
}

