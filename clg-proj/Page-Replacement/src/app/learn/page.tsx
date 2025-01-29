"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AlgorithmResult from "@/components/AlgorithmResult";
import AlgorithmInsights from "@/components/AlgotithInsights";
import axios from "axios";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const PageReplacementSimulator = () => {
  const [refString, setRefString] = useState<string>("1 0 2 0 2 0 3 2 4");
  const [frames, setFrames] = useState<string>("3");
  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<any>({});
  const [selectedAlgo, setSelectedAlgo] = useState<string>("lru");
  const [showResults, setShowResults] = useState<boolean>(false);

  const algorithms = ["lru", "mru", "fifo", "optimal"];

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (refString.length === 0 || frames.length === 0) {
      setError("Please fill all the fields");
      return;
    }

    try {
      const res = await axios.post("/api/algo", {
        refString,
        frames,
        algo: selectedAlgo,
      });
      setResults({ ...results, [selectedAlgo]: res.data });
      setShowResults(true);
    } catch (error) {
      setError("An error occurred while processing the request");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen font-sans flex bg-gray-900 text-gray-100"
    >
      <div className="w-1/2 px-8 pt-2 flex h-screen flex-col justify-center items-center">
        <motion.form
          onSubmit={submitHandler}
          onChange={() => setError("")}
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="bg-gray-800 p-10 rounded-lg shadow-2xl"
        >
          <h1 className="text-4xl font-extrabold mb-8 text-center text-white flex items-center justify-center">
            <Sparkles className="mr-2" />
            Page Replacement Algorithms
          </h1>
          <Input
            type="string"
            pattern="^[\d\s]+$"
            value={refString}
            onChange={(e) => setRefString(e.target.value)}
            placeholder="Enter Reference String e.g : 1 0 2 0 2 0 3 2 4"
            className="mb-6 p-4 border border-gray-600 rounded w-full text-xl bg-gray-700 text-gray-100"
          />
          <Input
            type="string"
            pattern="^[1-9]\d*$"
            placeholder="Enter Number of Frames e.g : 3"
            value={frames}
            onChange={(e) => setFrames(e.target.value)}
            className="mb-6 p-4 border border-gray-600 rounded w-full text-xl bg-gray-700 text-gray-100"
          />
          <div className="flex justify-between mb-6">
            {algorithms.map((algo) => (
              <Button
                key={algo}
                type="button"
                onClick={() => {
                  setSelectedAlgo(algo);
                  setShowResults(false);
                }}
                className={cn(
                  "px-4 py-2 rounded",
                  selectedAlgo === algo
                    ? "bg-blue-600 text-white hover:bg-blue-800"
                    : "bg-gray-600 text-gray-200 hover:bg-gray-500"
                )}
              >
                {algo.toUpperCase()}
              </Button>
            ))}
          </div>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded w-full text-xl transition duration-300"
          >
            Calculate
          </Button>
          {error && <p className="text-red-400 mt-6 text-xl">{error}</p>}
        </motion.form>
      </div>
      <div className="w-1/2 px-8 pt-2 min-h-screen overflow-y-auto no-scrollbar flex flex-col justify-center ">
        {showResults && results[selectedAlgo] ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AlgorithmResult
              result={results[selectedAlgo]}
              algorithm={selectedAlgo}
            />
          </motion.div>
        ) : (
          <AlgorithmInsights algorithm={selectedAlgo} />
        )}
      </div>
    </motion.div>
  );
};

export default PageReplacementSimulator;
