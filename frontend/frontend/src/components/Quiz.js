import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";

const Quiz = ({ questions }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answers, setAnswers] = useState({});

    const handleNext = () => {
        setAnswers({ ...answers, [currentQuestion]: selectedAnswer });
        setSelectedAnswer(null);
        setCurrentQuestion((prev) => prev + 1);
    };

    const handlePrevious = () => {
        setSelectedAnswer(answers[currentQuestion - 1] || null);
        setCurrentQuestion((prev) => prev - 1);
    };

    if (!questions || questions.length === 0) {
        return <p>No questions available</p>;
    }

    return (
        <Card title={`Question ${currentQuestion + 1}`} className="p-4">
            <p>{questions[currentQuestion].q}</p>
            <br></br>
            <div className="p-field-radiobutton">
                {Object.keys(questions[currentQuestion])
                    .filter((key) => key.startsWith("a"))
                    .map((key, index) => (
                        <div key={index} className="p-field-radiobutton">
                            <RadioButton
                                inputId={key}
                                name="answer"
                                value={questions[currentQuestion][key]}
                                onChange={(e) => setSelectedAnswer(e.value)}
                                checked={selectedAnswer === questions[currentQuestion][key]}
                            />
                            <label htmlFor={key}>{questions[currentQuestion][key]}</label>
                            <br></br>
                            <br></br>
                            
                        </div>
                    ))}
            </div>
            <div className="flex justify-content-between mt-3">
                <br></br>
                <Button label="Previous" onClick={handlePrevious} disabled={currentQuestion === 0} />
                {currentQuestion < questions.length - 1 ? (
                    <Button label="Next" onClick={handleNext} disabled={!selectedAnswer} />
                ) : (
                    <Button label="Submit" disabled={!selectedAnswer} />
                )}
            </div>
        </Card>
    );
};

export default Quiz;
