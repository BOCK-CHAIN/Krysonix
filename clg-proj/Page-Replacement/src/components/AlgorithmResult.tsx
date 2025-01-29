import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight } from 'lucide-react';

interface AlgorithmResultProps {
  result: any;
  algorithm: string;
}

const AlgorithmResult: React.FC<AlgorithmResultProps> = ({ result, algorithm }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 p-6 rounded-lg shadow-2xl mt-8 text-gray-100"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-white">
        {algorithm.toUpperCase()} Result
      </h2>
      <div className="mb-4 text-center">
        <p className="text-lg">
          Frame Size: <span className="font-semibold">{result.frameCount}</span>
        </p>
        <p className="text-lg">
          Number of References: <span className="font-semibold">{result.refArr.length}</span>
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="px-2 py-1 border-b border-gray-600">Step</th>
              <th className="px-2 py-1 border-b border-gray-600">Page</th>
              <th className="px-2 py-1 border-b border-gray-600">Frames</th>
              <th className="px-2 py-1 border-b border-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {result.result.map((step: any, i: number) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <td className="px-2 py-1 border-b border-gray-700 text-center">{step.step}</td>
                <td className="px-2 py-1 border-b border-gray-700 text-center">{step.page}</td>
                <td className="px-2 py-1 border-b border-gray-700">
                  <div className="flex justify-center space-x-2">
                    {step.frames.map((frame: any, j: number) => (
                      <div
                        key={j}
                        className={cn(
                          "w-8 h-8 flex items-center justify-center rounded",
                          step.faultIdx === j ? "bg-red-500 text-white" : "bg-gray-700",
                          step.hitIdx === j ? "bg-green-500 text-white" : ""
                        )}
                      >
                        {frame}
                      </div>
                    ))}
                  </div>
                  {step.replacedNumber !== null && (
                    <div className="flex items-center justify-center mt-1 text-yellow-400">
                      <span>{step.replacedNumber}</span>
                      <ArrowRight className="w-4 h-4 mx-1" />
                      <span>{step.page}</span>
                    </div>
                  )}
                </td>
                <td className="px-2 py-1 border-b border-gray-700 text-center">
                  {step.hitIdx !== -1 ? (
                    <span className="text-green-500">Hit</span>
                  ) : (
                    <span className="text-red-500">Fault</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 text-center">
        <div className="p-2 bg-gray-700 rounded">
          <div className="text-green-400">Total Hits</div>
          <div className="text-2xl font-bold">{result.result[result.result.length - 1].hits}</div>
        </div>
        <div className="p-2 bg-gray-700 rounded">
          <div className="text-red-400">Total Faults</div>
          <div className="text-2xl font-bold">{result.result[result.result.length - 1].faults}</div>
        </div>
        <div className="p-2 bg-gray-700 rounded">
          <div className="text-green-400">Hit Rate</div>
          <div className="text-2xl font-bold">
            {((result.result[result.result.length - 1].hits / result.refArr.length) * 100).toFixed(2)}%
          </div>
        </div>
        <div className="p-2 bg-gray-700 rounded">
          <div className="text-red-400">Fault Rate</div>
          <div className="text-2xl font-bold">
            {((result.result[result.result.length - 1].faults / result.refArr.length) * 100).toFixed(2)}%
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AlgorithmResult;

