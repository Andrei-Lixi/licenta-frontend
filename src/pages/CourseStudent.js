import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';

import { useLocation, useNavigate } from 'react-router-dom';
import BaraMeniu from "../components/BaraMeniu";
import { Toast } from 'primereact/toast';
import { useAuthToken } from '../hooks/useAuthToken';

const CourseStudent = () => {
  const toast = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const accesType = location.state?.acces || "demo";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [teacherLessons, setTeacherLessons] = useState([]);

  const { token } = useAuthToken();

  const classOptions = [
    { label: "Clasa 5", value: 5 },
    { label: "Clasa 6", value: 6 },
    { label: "Clasa 7", value: 7 },
    { label: "Clasa 8", value: 8 },
  ];

  const domainOptions = [
    { label: "Matematica", value: "math" },
    { label: "Chimie", value: "chemistry" },
    { label: "Fizica", value: "physics" },
  ];

  const gradeMap = {
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
  };



  
  useEffect(() => {
    const fetchAllLessons = async () => {
      try {
        const idsResponse = await fetch('/api/public/lessons');
        if (!idsResponse.ok) throw new Error("Eroare la preluarea id-urilor lecțiilor");

        const lessonsData = await idsResponse.json();
        if (!Array.isArray(lessonsData)) throw new Error("Format invalid pentru lecții");

        const lessonIds = lessonsData.map(lesson => lesson.id);

        const lessons = [];

        for (const id of lessonIds) {
          const res = await fetch(`/api/public/lesson/get/${id}`);
          if (!res.ok) continue;

          const lessonData = await res.json();

          // Adaugă views, likes, dislikes (presupunem că vin din backend)
          lessons.push({
            id,
            name: lessonData.name,
            field: lessonData.field,
            grade: lessonData.grade,
            filename: lessonData.filename,
            teacherName: lessonData.teacherUser?.name || "N/A",
            views: lessonData.views || 0,
            likes: lessonData.likes || 0,
            dislikes: lessonData.dislikes || 0,
          });
        }

        setTeacherLessons(lessons);
      } catch (error) {
        console.error("Eroare la preluarea lecțiilor:", error);
        toast.current?.show({
          severity: 'error',
          summary: 'Eroare',
          detail: 'Nu s-au putut încărca lecțiile.',
          life: 3000,
        });
        setTeacherLessons([]);
      }
    };

    fetchAllLessons();
  }, []);

  const filteredLessons = teacherLessons.filter(
    (lesson) => lesson.grade === gradeMap[selectedClass] && lesson.field === selectedDomain
  );

  // Funcție generică pentru POST la like/dislike/view
  const postAction = async (lessonId, action) => {
    try {
      const res = await fetch(`/api/lesson/${action === 'view' ? 'view' : lessonId + '/' + action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Adaugă token dacă este necesar
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) throw new Error(`Failed to ${action}`);

      if (action === 'view') {
        // În cazul view, răspunsul este lecția actualizată
        const updatedLesson = await res.json();
        setTeacherLessons(prevLessons =>
          prevLessons.map(l => (l.id === updatedLesson.id ? { ...l, views: updatedLesson.views } : l))
        );
      } else {
        // Like/Dislike: nu returnează lecția, așa că incrementăm local
        setTeacherLessons(prevLessons =>
          prevLessons.map(l => {
            if (l.id === lessonId) {
              if (action === 'like') return { ...l, likes: l.likes + 1 };
              if (action === 'dislike') return { ...l, dislikes: l.dislikes + 1 };
            }
            return l;
          })
        );
      }
    } catch (error) {
      console.error(error);
      toast.current?.show({
        severity: 'error',
        summary: 'Eroare',
        detail: `Nu s-a putut efectua acțiunea ${action}`,
        life: 3000,
      });
    }
  };


  const addView = async (lessonId) => {
  try {
    const res = await fetch(`/api/lesson/view/${lessonId}`, {
      method: 'GET',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!res.ok) throw new Error("Failed to add view");
    const updatedLesson = await res.json();
    setTeacherLessons(prevLessons =>
      prevLessons.map(l => l.id === updatedLesson.id ? { ...l, views: updatedLesson.views } : l)
    );
  } catch (error) {
    console.error(error);
    toast.current?.show({
      severity: 'error',
      summary: 'Eroare',
      detail: 'Nu s-a putut actualiza vizualizarea lecției',
      life: 3000,
    });
  }
};


  const handleView = async (lesson) => {
    await postAction(lesson.id, 'view');
    window.open(`http://localhost:8741/uploads/${lesson.filename}`, '_blank');
  };

  const handleLike = (lesson) => {
    postAction(lesson.id, 'like');
  };

  const handleDislike = (lesson) => {
    postAction(lesson.id, 'dislike');
  };

  if (accesType === "premium" && !isLoggedIn) {
    return (
      <div className="p-d-flex p-jc-center p-ai-center" style={{ height: "100vh", flexDirection: 'column' }}>
        <Card style={{ width: '60%', padding: '2rem', textAlign: 'center' }}>
          <h2>Trebuie să fii conectat pentru a accesa secțiunea premium.</h2>
        </Card>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button label="Încearcă demo" onClick={() => navigate("/CoursePage", { state: { acces: "demo" } })} />
          <Button label="Logare" onClick={() => navigate("/Register")} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundImage: 'url(/images/sala.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      width: '100%',
    }}>
      <BaraMeniu />
      <Toast ref={toast} />

      <h1 className="p-text-center">Bun venit pe calea învățării, elevule</h1>

      <div className="p-d-flex p-jc-center p-mb-4">
        <Card>
          <Dropdown
            value={selectedClass}
            options={classOptions}
            onChange={(e) => setSelectedClass(e.value)}
            placeholder="Selectează Clasa"
            className="p-mb-2"
          />
        </Card>
      </div>

      {selectedClass && (
        <div className="p-d-flex p-jc-center p-mb-4">
          <Card title="Selectează un domeniu">
            <Dropdown
              value={selectedDomain}
              options={domainOptions}
              onChange={(e) => setSelectedDomain(e.value)}
              placeholder="Selectează Domeniu"
              className="p-mb-2"
            />
          </Card>
        </div>
      )}

      {selectedClass && selectedDomain && (
        <div className="p-d-flex p-jc-center p-mb-4" style={{ width: '80%', margin: 'auto' }}>
          <Card title="Lecții disponibile">
            {filteredLessons.length > 0 ? (
              filteredLessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  style={{
                    marginBottom: '1rem',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    padding: '1rem',
                  }}
                >
                  <h3 style={{ margin: 0, textTransform: 'capitalize' }}>{lesson.name}</h3>
                  <p><strong>Profesor:</strong> {lesson.teacherName}</p>
                  

                  <Button
                    label="Vezi lecția"
                    icon="pi pi-eye"
                    className="p-button-link"
                    onClick={async () => {
                      handleView(lesson);
                      await addView(lesson.id);
                    }}

                    style={{ marginRight: '1rem' }}
                  />
                  <Button
                    label="Like"
                    icon="pi pi-thumbs-up"
                    className="p-button-success"
                    onClick={() => handleLike(lesson)}
                    style={{ marginRight: '1rem' }}
                  />
                  <Button
                    label="Dislike"
                    icon="pi pi-thumbs-down"
                    className="p-button-danger"
                    onClick={() => handleDislike(lesson)}
                  />
                </Card>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#777', fontStyle: 'italic' }}>
                Nu sunt lecții disponibile pentru clasa și domeniul selectat.
              </p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default CourseStudent;
