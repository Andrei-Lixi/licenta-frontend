import React, { useEffect, useState } from 'react';
import Quiz from '../components/Quiz';
import BaraMeniu from "../components/BaraMeniu";
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';



const QuizPage = () => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('/api/public/quiz_question');
        if (!response.ok) throw new Error('Eroare la încărcarea quizului');

        const data = await response.json();
        setQuiz({ title: "Quiz public", questions: data });
      } catch (error) {
        console.error("Eroare la fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleAnswerChange = (questionId, answerIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const submitAnswers = async () => {
    if (!quiz || !quiz.questions.length) {
      alert("Quizul nu este încărcat.");
      return;
    }

    const quizId = quiz.questions[0].quizId; // presupunem că toate au același quizId

    try {
      const response = await fetch(`/api/quiz/attempt/${quizId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) throw new Error('Eroare la trimiterea răspunsurilor');

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Eroare la trimiterea răspunsurilor");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <BaraMeniu />
      <div
        className="flex-1 overflow-y-auto p-6 pt-[500px]"
        style={{
          backgroundImage: 'url(/images/quiz.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center mt-8 text-white">
          Quiz disponibil
        </h1>

        {loading ? (
          <p className="text-xl text-center text-white">Se încarcă...</p>
        ) : !quiz ? (
          <p className="text-3xl font-bold mb-6 text-center mt-8 text-white">
            Nu există quiz disponibil.
          </p>
        ) : (
          <div className="max-w-2xl mx-auto px-4 py-12">
            <Quiz questions={quiz.questions} answers={answers} onAnswerChange={handleAnswerChange} />

            <button
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
              onClick={submitAnswers}
              disabled={Object.keys(answers).length !== quiz.questions.length}
            >
              Trimite răspunsurile
            </button>

           {result && (
  <Card
    title="Rezultat Quiz"
    className="max-w-md mx-auto mt-6 p-6"
    style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#f0f0f0', borderRadius: '16px' }}
  >
    <div className="flex flex-col gap-6 items-center">
      <div className="flex gap-4 w-full justify-center">
        <Tag
          severity="success"
          value={`✔ Corecte: ${result.correctAnswers}`}
          icon="pi pi-check"
          style={{ fontSize: '1.1rem', padding: '1rem 1.5rem' }}
          rounded
        />
        <Tag
          severity="info"
          value={`📋 Total: ${result.totalQuestions}`}
          style={{ fontSize: '1.1rem', padding: '1rem 1.5rem' }}
          rounded
        />
      </div>

      <div className="w-full">
        <h3 className="mb-2" style={{ color: '#fff' }}>
          Scor procentual: {result.scorePercent}%
        </h3>
        <ProgressBar
          value={result.scorePercent}
          showValue={false}
          style={{
            height: '25px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.2)',
          }}
          className="progressbar-custom"
        />
      </div>
    </div>
  </Card>
)}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
