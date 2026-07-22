"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { epdsQuestions, mockEPDSHistory } from "@/lib/mock-data/epds";

export default function EPDSPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(10).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [showHistory, setShowHistory] = useState(true);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    if (currentQuestion < 9) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 300);
    }
  };

  const handleSubmit = () => {
    setShowResult(true);
    setShowHistory(false);
  };

  const totalScore = answers.reduce<number>((sum, val) => sum + (val ?? 0), 0);
  const allAnswered = answers.every((a) => a !== null);

  const getScoreMessage = (score: number) => {
    if (score < 10) return { level: "Low risk", color: "text-accent-600", bg: "bg-accent-50", message: "Your score suggests you're coping well. Keep up the good work!" };
    if (score < 13) return { level: "Moderate risk", color: "text-sunshine-600", bg: "bg-sunshine-50", message: "Your score suggests you may benefit from speaking with a counselor. Consider booking a session." };
    return { level: "High risk", color: "text-red-600", bg: "bg-red-50", message: "Your score suggests you need support. Please speak with a counselor as soon as possible." };
  };

  if (showResult) {
    const result = getScoreMessage(totalScore);
    return (
      <div>
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-warm-gray-900">EPDS Results</h1>
        </div>
        <Card className={`max-w-lg mx-auto ${result.bg}`}>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white flex items-center justify-center shadow-sm">
              <span className={`text-3xl font-bold ${result.color}`}>{totalScore}</span>
            </div>
            <p className="text-sm text-warm-gray-500 mb-2">out of 30</p>
            <h2 className={`font-heading text-xl font-bold ${result.color} mb-3`}>{result.level}</h2>
            <p className="text-warm-gray-600 mb-6">{result.message}</p>
            {totalScore >= 10 && (
              <Button variant="primary" onClick={() => window.location.href = "/mother/booking"}>
                Book a Counselor Session
              </Button>
            )}
            <Button
              variant="ghost"
              className="mt-3"
              onClick={() => {
                setShowResult(false);
                setShowHistory(true);
                setCurrentQuestion(0);
                setAnswers(new Array(10).fill(null));
              }}
            >
              Back to History
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!showHistory) {
    const question = epdsQuestions[currentQuestion];
    return (
      <div>
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-warm-gray-900">EPDS Screening</h1>
          <p className="text-sm text-warm-gray-500">
            Edinburgh Postnatal Depression Scale - Question {currentQuestion + 1} of 10
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-warm-gray-200 rounded-full h-2 mb-8 max-w-lg mx-auto">
          <div
            className="bg-gradient-to-r from-primary-400 to-secondary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / 10) * 100}%` }}
          />
        </div>

        <Card className="max-w-lg mx-auto">
          <h2 className="font-heading text-lg font-bold text-warm-gray-800 mb-6">
            {question.question}
          </h2>
          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.label}
                onClick={() => handleAnswer(option.value)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                  answers[currentQuestion] === option.value
                    ? "border-primary-500 bg-primary-50"
                    : "border-warm-gray-100 hover:border-warm-gray-200"
                }`}
              >
                <span className="text-sm text-warm-gray-700">{option.label}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-6 pt-4 border-t border-warm-gray-100">
            <Button
              variant="ghost"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            {currentQuestion === 9 && allAnswered && (
              <Button onClick={handleSubmit}>
                Submit Screening
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-warm-gray-900">EPDS Screening</h1>
          <p className="text-sm text-warm-gray-500">
            Edinburgh Postnatal Depression Scale - track your mental health over time
          </p>
        </div>
        <Button onClick={() => setShowHistory(false)}>
          Take New Screening
        </Button>
      </div>

      {/* Score History Chart */}
      <Card className="mb-6">
        <h2 className="font-heading text-lg font-bold text-warm-gray-800 mb-4">Score History</h2>
        <div className="flex items-end gap-4 h-48">
          {mockEPDSHistory.slice().reverse().map((result) => {
            const height = (result.score / 30) * 100;
            const color = result.score >= 13 ? "bg-red-400" : result.score >= 10 ? "bg-sunshine-400" : "bg-accent-400";
            return (
              <div key={result.id} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-xs font-bold text-warm-gray-700 mb-1">{result.score}</span>
                <div
                  className={`w-full rounded-t-lg ${color} transition-all`}
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-warm-gray-500 mt-2">{result.date.slice(5)}</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-4 pt-4 border-t border-warm-gray-100 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-accent-400" /> Low risk (&lt;10)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-sunshine-400" /> Moderate (10-12)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-400" /> High risk (13+)</span>
        </div>
      </Card>

      {/* History List */}
      <Card>
        <h2 className="font-heading text-lg font-bold text-warm-gray-800 mb-4">Past Results</h2>
        <div className="space-y-3">
          {mockEPDSHistory.map((result) => {
            const scoreInfo = getScoreMessage(result.score);
            return (
              <div key={result.id} className="flex items-center justify-between py-3 border-b border-warm-gray-50 last:border-0">
                <div>
                  <p className="font-medium text-warm-gray-800">{result.date}</p>
                  <p className={`text-sm font-semibold ${scoreInfo.color}`}>{scoreInfo.level}</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${scoreInfo.bg}`}>
                  <span className={`font-bold ${scoreInfo.color}`}>{result.score}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
