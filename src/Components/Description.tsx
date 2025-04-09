import { ChevronDown, ChevronUp } from "~/Components/Icons/Chevron";
import { useState } from "react";

// Utility to auto-link URLs and preserve formatting
const FormattedText = ({ text }: { text: string }) => {
  // Match only clearly separated URLs (with boundary)
  const urlRegex = /\bhttps?:\/\/[^\s]+/g;

  // Split using a capture group to keep the URLs in the result
  const parts = text.split(urlRegex);
  const matches = text.match(urlRegex);

  const result: React.ReactNode[] = [];

  parts.forEach((part, index) => {
    result.push(<span key={`text-${index}`}>{part}</span>);
    if (matches && matches[index]) {
      result.push(
        <a
          key={`link-${index}`}
          href={matches[index]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 underline break-words"
        >
          {matches[index]}
        </a>
      );
    }
  });

  return <div className="whitespace-pre-wrap break-words text-gray-400">{result}</div>;
};


export default function Description({
  text,
  border,
  clampLines = 3,
}: {
  text: string;
  border?: boolean;
  clampLines?: number; 
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  if (!text || text.trim().length === 0) return null;

  return (
    <div className="w-full">
      {border && <div className="border-b border-gray-200 mb-2" />}
      <div className="text-left text-sm font-semibold text-gray-400 relative">
        <div className={!isExpanded ? `line-clamp-${clampLines}` : ""}>
          <FormattedText text={text} />
        </div>

        <button
          onClick={toggleExpand}
          className="mt-2 flex items-center text-xs text-gray-500 hover:underline"
        >
          {isExpanded ? "Show less" : "Show more"}
          <span className="ml-1">
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </span>
        </button>
      </div>
    </div>
  );
}
