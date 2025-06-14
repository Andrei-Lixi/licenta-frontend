import React, { useState } from "react";
import { ListBox } from "primereact/listbox";
import { Button } from "primereact/button";

const Quiz = ({ questions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!questions || questions.length === 0) {
    return <p>Acest quiz nu are întrebări disponibile.</p>;
  }

  const currentQuestion = questions[currentIndex];

  const handleAnswerSelect = (e) => {
    if (!showAnswer) {
      setSelectedAnswer(e.value);
      setShowAnswer(true);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowAnswer(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("Ai terminat quiz-ul!");
    }
  };

  const options = currentQuestion.possibleAnswers.map((ans, idx) => ({
    label: ans,
    value: idx,
  }));

  const itemTemplate = (option) => {
    if (!showAnswer) return option.label;

    if (option.value === currentQuestion.correctAnswerIndex) {
      return <span style={{ color: "green", fontWeight: "bold" }}>{option.label}</span>;
    }

    if (option.value === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswerIndex) {
      return <span style={{ color: "red", fontWeight: "bold" }}>{option.label}</span>;
    }

    return <span>{option.label}</span>;
  };

  return (
    <div
  style={{
    width: "320px",
    padding: "20px",
    marginBottom: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.05)", // puțin transparent
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  }}
>

      <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#ddd' }}>
  Întrebarea {currentIndex + 1} din {questions.length}
</h3>
      <p
  style={{
    fontSize: '1.25rem',
    fontWeight: '500',
    color: '#fff',
    marginBottom: '0.5rem',
    textAlign: 'center',
  }}
>
  {currentQuestion.question}
</p>

      <ListBox
        options={options}
        value={selectedAnswer}
        onChange={handleAnswerSelect}
        itemTemplate={itemTemplate}
        multiple={false}
        disabled={showAnswer}
        style={{ width: "100%" }}
      />

      <Button
        label={currentIndex === questions.length - 1 ? "Finalizare" : "Următoarea"}
        onClick={handleNext}
        disabled={!showAnswer}
        className="mt-3"
      />
    </div>
  );
};

export default Quiz;
