import React, { useEffect, useState } from 'react';
import Quiz from '../components/Quiz';
import BaraMeniu from "../components/BaraMeniu";

const QuizPage = () => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/public/quiz_question');
      if (!response.ok) throw new Error('Eroare la încărcarea quizului');

      const data = await response.json();
      console.log("Întrebări primite:", data);
      setQuiz({ title: "Quiz public", questions: data }); // 👈️ împachetăm întrebările ca un „quiz”
    } catch (error) {
      console.error("Eroare la fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchQuizzes();
}, []);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <BaraMeniu />

      <div className="flex-1 overflow-y-auto p-6 pt-[500px]"
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


            
            <Quiz questions={quiz.questions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
