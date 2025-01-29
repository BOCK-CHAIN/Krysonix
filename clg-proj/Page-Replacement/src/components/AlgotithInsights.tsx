import React from "react";
import { motion } from "framer-motion";

interface AlgorithmInsightsProps {
  algorithm: string;
}

const AlgorithmInsights: React.FC<AlgorithmInsightsProps> = ({ algorithm }) => {
  const insights = {
    lru: {
      title: "Least Recently Used (LRU)",
      description: (
        <>
          LRU replaces the page that hasn't been used for the{" "}
          <span className="font-bold text-blue-400">longest period of time</span>. 
          It assumes that pages used recently are more likely to be accessed again soon. 
          This approach is effective in scenarios with 
          <span className="font-bold text-green-400"> predictable access patterns</span>.
        </>
      ),
      pros: [
        "Good approximation to optimal replacement",
        "Widely used due to its effectiveness",
      ],
      cons: [
        "Requires hardware or software support for tracking usage",
        "Implementation can be resource-intensive",
      ],
      useCase: "Frequently used in operating systems for cache management.",
    },
    mru: {
      title: "Most Recently Used (MRU)",
      description: (
        <>
          MRU replaces the page that was{" "}
          <span className="font-bold text-blue-400">most recently used</span>. 
          It assumes that the most recently used page will not be needed again soon. 
          This works well in systems where older data is more valuable.
        </>
      ),
      pros: ["Simple implementation", "Effective in specialized scenarios"],
      cons: [
        "Generally performs worse than LRU",
        "Not suitable for sequential data access patterns",
      ],
      useCase: "Works well in certain database systems with temporal data.",
    },
    fifo: {
      title: "First-In-First-Out (FIFO)",
      description: (
        <>
          FIFO replaces the{" "}
          <span className="font-bold text-blue-400">oldest page</span>. 
          This is straightforward but may lead to suboptimal performance in {" "}
          <span className="font-bold text-red-400">Belady's anomaly</span>, 
          where adding more frames increases page faults.
        </>
      ),
      pros: ["Easy to implement", "Low overhead"],
      cons: ["Ignores page usage frequency", "Can perform poorly in practice"],
      useCase: "Often used in simple systems or as a baseline comparison.",
    },
    optimal: {
      title: "Optimal Page Replacement",
      description: (
        <>
          The Optimal algorithm replaces the page that will not be used for the{" "}
          <span className="font-bold text-blue-400">longest time</span> in the future. 
          While it provides the best performance, it is not feasible without {" "}
          <span className="font-bold text-red-400">prior knowledge</span> of future access.
        </>
      ),
      pros: ["Guarantees minimum page faults", "Useful as a benchmark"],
      cons: ["Impractical in real-world scenarios", "Relies on perfect foresight"],
      useCase: "Used for theoretical analysis and comparison.",
    },
  };

  const currentInsight = insights[algorithm as keyof typeof insights];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 p-6 rounded-lg shadow-lg text-white"
    >
      <h2 className="text-3xl font-bold mb-4">{currentInsight.title}</h2>
      <p className="mb-4 text-lg">{currentInsight.description}</p>
      <h3 className="text-2xl font-semibold mb-2">Pros:</h3>
      <ul className="list-disc list-inside mb-4 space-y-2">
        {currentInsight.pros.map((pro, index) => (
          <li key={index} className="text-green-400">
            {pro}
          </li>
        ))}
      </ul>
      <h3 className="text-2xl font-semibold mb-2">Cons:</h3>
      <ul className="list-disc list-inside space-y-2">
        {currentInsight.cons.map((con, index) => (
          <li key={index} className="text-red-400">
            {con}
          </li>
        ))}
      </ul>
      <h3 className="text-2xl font-semibold mt-4">Use Case:</h3>
      <p className="mt-2 text-blue-300">{currentInsight.useCase}</p>
    </motion.div>
  );
};

export default AlgorithmInsights;
