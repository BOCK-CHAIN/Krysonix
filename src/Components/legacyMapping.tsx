import React from "react";

interface Legacy {
  lastUpdated: string;
  content: string[];
  sections: {
    title: string;
    subsections: {
      subtitle: string;
      content?: string;
      bullets?: string[];
    }[];
  }[];
}

const LegacyMapping = ({ legacy }: { legacy: Legacy }) => {
  return legacy.sections.map((section, index) => (
    <section key={index} className="mb-8 ml-1 md:ml-4">
      <h2 className="mb-4 text-3xl font-bold text-white">
        {index + 1}. {section.title}
      </h2>
      {section.subsections.map((sub, subIndex) => (
        <div key={subIndex} className="mb-4 ml-2 md:ml-6">
          <h3 className="mb-2 text-xl font-semibold text-gray-400">
            {index + 1}.{subIndex + 1} {sub.subtitle}
          </h3>
          <p className="ml-2 leading-relaxed text-gray-300 md:ml-6">
            {sub.content}
          </p>
          {sub.bullets && sub.bullets.length > 0 && (
            <ul className="ml-3 mt-2 list-disc space-y-1 pl-6 text-gray-400 md:ml-6">
              {sub.bullets.map((bullet, bulletIndex) => (
                <li key={bulletIndex}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  ));
};

export default LegacyMapping;
