import React, { useEffect, useState, useRef } from 'react';
import Quiz from '../components/Quiz';
import BaraMeniu from "../components/BaraMeniu";
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import 'primereact/resources/themes/saga-blue/theme.css'; // sau orice altă temă
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [toDeleteIndex, setToDeleteIndex] = useState(null);

  useEffect(() => {
    const savedCourses = JSON.parse(localStorage.getItem("courses")) || [];
    const quizzesOnly = savedCourses.filter(c => c.type === "quiz");
    setQuizzes(quizzesOnly);
  }, []);

  const handleDeleteConfirmed = async () => {
  if (toDeleteIndex === null) return;

  const savedCourses = JSON.parse(localStorage.getItem("courses")) || [];
  const globalIndex = getQuizGlobalIndex(toDeleteIndex);
  const quizToDelete = savedCourses[globalIndex];

  if (!quizToDelete?.id) {
    alert("Quiz-ul nu are un ID valid pentru a fi șters din baza de date.");
    return;
  }

  try {
    const response = await fetch(`/api/teacher/quiz/remove/${quizToDelete.id}`, {
      method: "DELETE", // Sau "POST", în funcție de API-ul tău
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Eroare la ștergerea din baza de date.");
    }

    // Ștergere din localStorage și actualizare UI
    const newCourses = savedCourses.filter((_, i) => i !== globalIndex);
    localStorage.setItem("courses", JSON.stringify(newCourses));

    const newQuizzes = quizzes.filter((_, i) => i !== toDeleteIndex);
    setQuizzes(newQuizzes);
    setToDeleteIndex(null);

  } catch (error) {
    console.error("Eroare la ștergere:", error);
    alert("A apărut o problemă la ștergerea quizului din baza de date.");
  }
};


  const confirmDelete = (index) => {
    setToDeleteIndex(index);
    confirmDialog({
      message: 'Ești sigur că vrei să ștergi acest quiz?',
      header: 'Confirmare',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Da',
      rejectLabel: 'Nu',
      accept: handleDeleteConfirmed,
    });
  };

  const getQuizGlobalIndex = (quizIndex) => {
    const allCourses = JSON.parse(localStorage.getItem("courses")) || [];
    let count = -1;
    for (let i = 0; i < allCourses.length; i++) {
      if (allCourses[i].type === "quiz") {
        count++;
        if (count === quizIndex) return i;
      }
    }
    return -1;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <BaraMeniu />
      <h1 className="text-3xl font-bold mb-6 text-center">Quiz-uri disponibile</h1>

      <ConfirmDialog />

      {quizzes.length === 0 ? (
        <p className="text-center text-gray-500">Nu există quiz-uri salvate.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz, index) => (
            <div key={index} className="relative bg-white p-6 rounded-2xl shadow-md">
              {/* X în colț dreapta sus */}
              <Button
                icon="pi pi-times"
                severity="danger"
                className="absolute top-2 right-2 p-button-rounded p-button-text"
                onClick={() => confirmDelete(index)}
                tooltip="Șterge quiz"
                aria-label="Șterge quiz"
              />
              <h2 className="text-xl font-semibold mb-4">{quiz.title}</h2>
              <Quiz questions={quiz.questions} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
