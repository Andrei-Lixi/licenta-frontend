import React, { useState } from 'react';
import { Button } from 'primereact/button';

const Quiz = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleOptionSelect = (optionIdx) => {
    if (showCorrect) return;
    setSelectedOption(optionIdx);
  };

  const handleNext = () => {
    if (!showCorrect) {
      setShowCorrect(true); // Afișează răspunsul corect
    } else {
      // Trecem la următoarea întrebare sau terminăm
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setShowCorrect(false);
      } else {
        setFinished(true);
      }
    }
  };

  if (finished) {
    return <p className="text-center font-semibold text-green-700">Ai terminat quiz-ul! 🎉</p>;
  }

  const question = questions[currentQuestion];
  const correctIndex = question.correct;

  return (
    <div className="mb-6">
      <p className="font-semibold mb-4">{currentQuestion + 1}. {question.question}</p>

      {question.options.map((opt, idx) => {
        const isSelected = selectedOption === idx;
        const isCorrect = idx === correctIndex;

        let optionStyle = "block p-2 border rounded-lg cursor-pointer mb-2";
        if (showCorrect) {
          if (isCorrect) {
            optionStyle += " bg-green-100 border-green-400 text-green-800";
          } else if (isSelected && !isCorrect) {
            optionStyle += " bg-red-100 border-red-400 text-red-700";
          } else {
            optionStyle += " border-gray-300";
          }
        } else if (isSelected) {
          optionStyle += " bg-blue-100 border-blue-400";
        } else {
          optionStyle += " border-gray-300";
        }

        return (
          <label key={idx} className={optionStyle}>
            <input
              type="radio"
              name="option"
              value={idx}
              checked={isSelected}
              onChange={() => handleOptionSelect(idx)}
              className="mr-2"
              disabled={showCorrect}
            />
            {opt}
          </label>
        );
      })}

      {showCorrect && (
        <p className="mt-2 text-sm text-blue-700">
          Răspunsul corect: <strong>{question.options[correctIndex]}</strong>
        </p>
      )}

      <Button
  label={showCorrect ? 'Următoarea întrebare' : 'Afișează răspunsul corect'}
  icon={showCorrect ? 'pi pi-arrow-right' : 'pi pi-check'}
  onClick={handleNext}
  disabled={selectedOption === null && !showCorrect}
  className="mt-4"
  severity={showCorrect ? 'info' : 'success'}
/>

    </div>
  );
};

export default Quiz;
