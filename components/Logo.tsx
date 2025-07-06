export default function Logo({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <div className={`${className} relative`}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer hexagon */}
        <path
          d="M16 2L26 8V24L16 30L6 24V8L16 2Z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="animate-pulse"
        />

        {/* Inner circle */}
        <circle
          cx="16"
          cy="16"
          r="6"
          fill="currentColor"
          className="animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />

        {/* Small dots */}
        <circle
          cx="16"
          cy="8"
          r="1"
          fill="currentColor"
          className="animate-ping"
          style={{ animationDelay: "1s" }}
        />
        <circle
          cx="24"
          cy="12"
          r="1"
          fill="currentColor"
          className="animate-ping"
          style={{ animationDelay: "1.2s" }}
        />
        <circle
          cx="24"
          cy="20"
          r="1"
          fill="currentColor"
          className="animate-ping"
          style={{ animationDelay: "1.4s" }}
        />
        <circle
          cx="16"
          cy="24"
          r="1"
          fill="currentColor"
          className="animate-ping"
          style={{ animationDelay: "1.6s" }}
        />
        <circle
          cx="8"
          cy="20"
          r="1"
          fill="currentColor"
          className="animate-ping"
          style={{ animationDelay: "1.8s" }}
        />
        <circle
          cx="8"
          cy="12"
          r="1"
          fill="currentColor"
          className="animate-ping"
          style={{ animationDelay: "2s" }}
        />
      </svg>
    </div>
  );
}
