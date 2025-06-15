import React, { useState, useEffect } from "react";
import { ListBox } from "primereact/listbox";
import { Button } from "primereact/button";

const Quiz = ({ questions, answers, onAnswerChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!questions || questions.length === 0) {
    return <p>Acest quiz nu are întrebări disponibile.</p>;
  }

  const currentQuestion = questions[currentIndex];

  const options = currentQuestion.possibleAnswers.map((ans, i) => ({
    label: ans,
    value: i,
  }));

  const itemTemplate = (option) => {
    if (answers[currentQuestion.id] === undefined) return option.label;

    if (option.value === currentQuestion.correctAnswerIndex) {
      return (
        <span style={{ color: "green", fontWeight: "bold" }}>
          {option.label}
        </span>
      );
    }

    if (
      option.value === answers[currentQuestion.id] &&
      answers[currentQuestion.id] !== currentQuestion.correctAnswerIndex
    ) {
      return (
        <span style={{ color: "red", fontWeight: "bold" }}>
          {option.label}
        </span>
      );
    }

    return <span>{option.label}</span>;
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div
      style={{
        width: "320px",
        padding: "20px",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <h3 style={{ color: "#ddd" }}>
        Întrebarea {currentIndex + 1} din {questions.length}
      </h3>
      <p style={{ color: "#fff", fontWeight: "500", fontSize: "1.25rem" }}>
        {currentQuestion.question}
      </p>

      <ListBox
        options={options}
        value={answers[currentQuestion.id]}
        onChange={(e) => onAnswerChange(currentQuestion.id, e.value)}
        itemTemplate={itemTemplate}
        multiple={false}
        style={{ width: "100%" }}
      />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          label="Înapoi"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-button-secondary"
        />
        <Button
          label={currentIndex === questions.length - 1 ? "Finalizare" : "Următoarea"}
          onClick={handleNext}
          disabled={answers[currentQuestion.id] === undefined}
          className="p-button-primary"
        />
      </div>
    </div>
  );
};

export default Quiz;
