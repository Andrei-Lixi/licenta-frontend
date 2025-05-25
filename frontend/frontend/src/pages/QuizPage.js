import React, { useEffect, useState } from 'react';
import BaraMeniu from "../components/BaraMeniu";
import { Button } from 'primereact/button';

const QuizPage = () => {
  const [quizList, setQuizList] = useState([]);

  useEffect(() => {
    fetch("/api/teacher/quiz/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include" // <- esențial pentru trimiterea cookie-ului
    })
    
      .then((res) => {
        if (!res.ok) {
          throw new Error("Nu s-au putut încărca quizurile");
        }
        return res.json();
      })
      .then((data) => setQuizList(data))
      .catch((err) => {
        console.error("Eroare la preluarea quizurilor:", err);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <BaraMeniu />
      <h1>Quizuri din baza de date</h1>
      {quizList.length > 0 ? (
        quizList.map((quiz, index) => (
          <div key={index} style={{ marginBottom: '2rem' }}>
            <h2>{quiz.title}</h2>
            {/* poți afișa și alte câmpuri aici */}
          </div>
        ))
      ) : (
        <p>Nu s-au găsit quizuri în baza de date.</p>
      )}
    </div>
  );
};

export default QuizPage;
