import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { useLocation, useNavigate } from 'react-router-dom';
import BaraMeniu from "../components/BaraMeniu";
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { useAuthToken } from '../hooks/useAuthToken';
import { FileUpload } from 'primereact/fileupload';



const USER_ROLE = {
  TEACHER: 2,
};

const CoursePage = () => {
  const toast = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const accesType = location.state?.acces || "demo";

  const [userRole, setUserRole] = useState(USER_ROLE.NONE);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
const [showForm, setShowForm] = useState(false);
  const [courseType, setCourseType] = useState(null);
  const [selectedClassForm, setSelectedClassForm] = useState(null);
  const [selectedDomainForm, setSelectedDomainForm] = useState(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [coursesUpdated, setCoursesUpdated] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [teacherLessons, setTeacherLessons] = useState([]);
const [currentQuizName, setCurrentQuizName] = useState('');

  const { token, getRol } = useAuthToken();
const [currentQuizId, setCurrentQuizId] = useState(null);
const [newQuestion, setNewQuestion] = useState('');
const [newOptions, setNewOptions] = useState(['', '', '', '']);
const [newCorrectIndex, setNewCorrectIndex] = useState(0);

  const [lessonsFromDB, setLessonsFromDB] = useState([]);



  const fetchLessonStats = async (lessonId) => {
  try {
    const response = await fetch(`/api/lesson/${lessonId}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    const stats = await response.json();
    return stats;
  } catch (error) {
    console.error(error);
    return { views: 0, likes: 0, dislikes: 0 }; // fallback
  }
};


  const classOptions = Array.from({ length: 4 }, (_, i) => ({
    label: `Clasa ${i + 5}`,
    value: i + 5,
  }));

  const domainOptions = [
    { label: "Matematica", value: "math" },
    { label: "Chimie", value: "chemistry" },
    { label: "Fizica", value: "physics" },
    
  ];

  const fetchTeacherLessons = async () => {
  try {
    const response = await fetch('/api/teacher/lessons', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Eroare la preluarea lecțiilor');

    const data = await response.json();

    // Pentru fiecare lecție, adaugă stats
    const lessonsWithStats = await Promise.all(data.map(async lesson => {
      const stats = await fetchLessonStats(lesson.id);
      return {
        ...lesson,
        stats,
      };
    }));

    setTeacherLessons(lessonsWithStats);

  } catch (error) {
    console.error("Eroare la preluarea lecțiilor:", error);
    toast.current?.show({
      severity: 'error',
      summary: 'Eroare',
      detail: 'Nu s-au putut încărca lecțiile profesorului.',
      life: 3000,
    });
  }
};



const handleFileUpload = async (event, lessonId) => {
  const file = event.files[0];

  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`/api/teacher/lesson/file/add/${lessonId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) throw new Error("Upload failed");

    toast.current.show({
      severity: 'success',
      summary: 'Succes',
      detail: 'Fișier încărcat cu succes.',
      life: 3000,
    });

    // Actualizare lista lecțiilor după upload
    await fetchTeacherLessons();

  } catch (err) {
    toast.current.show({
      severity: 'error',
      summary: 'Eroare',
      detail: 'Fișierul nu a putut fi încărcat.',
      life: 3000,
    });
  }
};






useEffect(() => {
  if (userRole === USER_ROLE.TEACHER && token) {
    fetchTeacherLessons();
    
  }
}, [userRole, token]);


  // ✅ Verificare robustă a rolurilor
  useEffect(() => {
    if (token) {
      const roleFromToken = getRol();
  
      // Normalizează: array sau string
      const role = Array.isArray(roleFromToken) ? roleFromToken[0] : roleFromToken;
  
      console.log("Rol detectat:", role);
  
      if (role === "ROLE_TEACHER") {
        setUserRole(USER_ROLE.TEACHER);
      } else if (role === "ROLE_USER") { // <-- contul de student
        navigate("/CourseStudent");
      } else if (role === "ROLE_ADMIN") {
         navigate("/Admin");  // Redirecționează adminul către pagina /admin
        }
      else {
        setUserRole(USER_ROLE.NONE);
      }
  
      setIsLoggedIn(true);
    }
  }, [token]);
  

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch('/api/public/lesson/get/4');
        const data = await response.json();
        
    
        // Dacă există un obiect cu câmpul 'name', creează o listă de lecții
        if (data && data.name) {
          const lessons = [
            { name: data.name, class: 1, domain: 'matematica' },
            // Poți adăuga mai multe lecții manual, dacă sunt disponibile
            
          ];
          setLessonsFromDB(lessons);
        } 
        if (data?.error === 'Quiz not found') {
             return; 
          }

        else {
          console.error("Răspuns invalid:", data);
          
          setLessonsFromDB([]);  // Fallback în caz de răspuns invalid
        }
      } catch (error) {
        console.error("Eroare la fetch:", error);
        setLessonsFromDB([]);  // Fallback în caz de eroare
      }
    };
    
    
    
    
  
    fetchLessons();
  }, []);
  
  
  

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


  const handleAddQuizQuestion = async () => {
  if (!newQuestion.trim() || newOptions.some(opt => !opt.trim())) {
    toast.current.show({
      severity: 'warn',
      summary: 'Date incomplete',
      detail: 'Completează toate câmpurile întrebării și răspunsurilor.',
      life: 3000,
    });
    return;
  }

  try {
    const payload = {
      question: newQuestion,
      possibleAnswers: newOptions,
      correctAnswerIndex: newCorrectIndex,
    };

    const response = await fetch(`/api/teacher/quiz_question/add/${currentQuizId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Eroare la adăugarea întrebării');

    toast.current.show({
      severity: 'success',
      summary: 'Întrebare adăugată',
      detail: 'Întrebarea a fost adăugată cu succes.',
      life: 3000,
    });

    // Reset formular
    setNewQuestion('');
    setNewOptions(['', '', '', '']);
    setNewCorrectIndex(0);

    // Opțional: actualizează lista lecțiilor sau quiz-urilor dacă vrei

  } catch (error) {
    toast.current.show({
      severity: 'error',
      summary: 'Eroare',
      detail: 'Întrebarea nu a putut fi adăugată.',
      life: 3000,
    });
  }
};



  const handleAddLesson = async () => {
  try {
    const classMap = {
      5: "five",
      6: "six",
      7: "seven",
      8: "eight",
    };

    const payload = {
      name: courseTitle,
      grade: classMap[selectedClassForm],
      field: selectedDomainForm,
    };

    const response = await fetch('/api/teacher/lesson/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Eroare la adăugarea lecției');

    toast.current.show({
      severity: 'success',
      summary: 'Lecție adăugată',
      detail: `Lecția "${courseTitle}" a fost adăugată cu succes.`,
      life: 3000,
    });

    // Actualizez lecțiile imediat
    await fetchTeacherLessons(); // ← forțez actualizarea din server

    setShowForm(false);
    resetForm();

  } catch (error) {
    console.error(error);
    toast.current.show({
      severity: 'error',
      summary: 'Eroare',
      detail: 'Nu s-a putut adăuga lecția.',
      life: 3000,
    });
  }
};

  
  const handleAddQuiz = async () => {
  if (!courseTitle) {
    toast.current.show({
      severity: 'warn',
      summary: 'Titlu lipsă',
      detail: 'Completează titlul quizului.',
      life: 3000,
    });
    return;
  }

  try {
    const createQuizResponse = await fetch('/api/teacher/quiz/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name: courseTitle }),
    });

    if (!createQuizResponse.ok) throw new Error('Eroare la crearea quizului');

    const createQuizData = await createQuizResponse.json();

    const quizId = createQuizData.id;
    if (!quizId) throw new Error('ID quiz invalid primit de la server');

    setCurrentQuizId(quizId);
    setCurrentQuizName(courseTitle);  // Salvezi și numele quizului

    toast.current.show({
      severity: 'success',
      summary: 'Quiz adăugat',
      detail: `Quizul "${courseTitle}" a fost creat cu succes. Introdu prima întrebare.`,
      life: 3000,
    });

    setCourseTitle('');
    // nu inchidem dialogul, ca sa adaugam intrebare

  } catch (error) {
    console.error(error);
    toast.current.show({
      severity: 'error',
      summary: 'Eroare',
      detail: 'Quizul nu a putut fi adăugat.',
      life: 3000,
    });
  }
};


  
  
  const resetForm = () => {
    setCourseTitle("");
    setSelectedClassForm(null);
    setSelectedDomainForm(null);
    setCourseType(null);
    setQuizQuestions([]);
    setCoursesUpdated(prev => !prev);
  };
  

 

  const handleDeleteCourse = (indexToDelete) => {
    const existingCourses = JSON.parse(localStorage.getItem("courses")) || [];
    const updatedCourses = existingCourses.filter((_, index) => index !== indexToDelete);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
    setCoursesUpdated(prev => !prev);
  };

  const handleAddQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      { question: '', options: ['', '', '', ''], correct: 0 }
    ]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...quizQuestions];
    updated[index][field] = value;
    setQuizQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...quizQuestions];
    updated[qIndex].options[oIndex] = value;
    setQuizQuestions(updated);
  };

  const CourseList = ({ selectedClass, selectedDomain, courses, token, onDeleteSuccess }) => {
  const toast = useRef(null);

  const handleDelete = async (courseId) => {
    try {
      const response = await fetch(`/api/teacher/lesson/remove/${courseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Eroare la ștergerea cursului');
      toast.current?.show({
        severity: 'success',
        summary: 'Succes',
        detail: 'Cursul a fost șters',
        life: 2000,
      });
      onDeleteSuccess();
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Eroare',
        detail: 'Nu s-a putut șterge cursul.',
        life: 3000,
      });
    }
  };

  const classMapping = {
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
  };

  const filteredCourses = courses.filter(
    (course) =>
      classMapping[course.grade] === selectedClass &&
      course.field === selectedDomain
  );

  return (
    <div>
      <Toast ref={toast} />
      {filteredCourses.length > 0 ? (
        filteredCourses.map((course) => (
          <div className="bubble-container">
  {filteredCourses.length > 0 ? (
    <div className="bubble-grid">
      {filteredCourses.map((course) => (
        <div className="course-bubble" key={course.id}>
          <h3>{course.name}</h3>
          <p>Clasa: {classMapping[course.grade]}</p>
          <p>Domeniu: {course.field}</p>
          <div className="bubble-actions">
            <FileUpload
              name="file"
              customUpload
              uploadHandler={(e) => handleFileUpload(e, course.id)}
              maxFileSize={10000000}
              mode="basic"
              chooseLabel="Upload"
              auto
            />
            <Button
              icon="pi pi-trash"
              className="p-button-rounded p-button-danger p-button-sm"
              onClick={() => handleDelete(course.id)}
            />
          </div>
          <p>Vizualizări: {course.stats?.views || 0}</p>
          <p>Like-uri: {course.stats?.likes || 0}</p>
          <p>Dislike-uri: {course.stats?.dislikes || 0}</p>

        </div>
      ))}
    </div>
  ) : (
    <p>Nu sunt lecții disponibile momentan.</p>
  )}
</div>

        ))
      ) : (
        <p style={{ textAlign: 'center', color: '#777', fontStyle: 'italic' }}>
          Nu sunt lecții disponibile momentan.
        </p>
      )}
    </div>
  );
};





  

  
  
  

  return (
  <div
    style={{
      backgroundImage: 'url(/images/home.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      width: '100%',
    }}
  >
    <BaraMeniu />
    <Toast ref={toast} />

    <h1 className="text-3xl font-bold mb-6 text-center mt-8">
      Bun venit, doamna/domnule profesor
    </h1>

    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '2rem',
      }}
    >
      {/* Coloana 1: Adăugare Lecție */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <Button
          label="Adaugă Lecție"
          className="p-button-lg p-button-primary"
          onClick={() => {
            setCourseType("curs");
            setShowForm(true);
          }}
        />
      </div>

      {/* Coloana 2: Selectare clasă, domeniu și cursuri */}
      <div style={{ flex: 1 }}>
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
          <div className="p-d-flex p-jc-center p-mb-4">
            <Card title="Cursuri disponibile">
              <CourseList
                key={coursesUpdated}
                selectedClass={selectedClass}
                selectedDomain={selectedDomain}
                courses={teacherLessons}
                token={token}
                onDeleteSuccess={fetchTeacherLessons}
              />
            </Card>
          </div>
        )}
        



        
      </div>

      

      {/* Coloana 3: Adăugare Quiz */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <Button
          label="Adaugă Quiz"
          className="p-button-lg p-button-secondary"
          onClick={() => {
            setCourseType("quiz");
            setShowForm(true);
          }}
        />

        {currentQuizId && (
  <div
    className="question-bubble"
    style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}
  >
    
    <p>
      <strong>
        Introdu o întrebare, cele 4 răspunsuri și selectează răspunsul corect la quizul "{currentQuizName}":
      </strong>
    </p>

    <InputText
      placeholder="Întrebare"
      value={newQuestion}
      onChange={(e) => setNewQuestion(e.target.value)}
      style={{ width: '100%', marginBottom: '0.5rem' }}
    />

    {newOptions.map((opt, idx) => (
      <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
        <input
          type="radio"
          name="correctAnswer"
          checked={newCorrectIndex === idx}
          onChange={() => setNewCorrectIndex(idx)}
          style={{ marginRight: '0.5rem' }}
        />
        <InputText
          placeholder={`Opțiunea ${idx + 1}`}
          value={opt}
          onChange={(e) => {
            const updated = [...newOptions];
            updated[idx] = e.target.value;
            setNewOptions(updated);
          }}
          style={{ flex: 1 }}
        />
      </div>
    ))}

    <Button label="Adaugă Întrebare" onClick={handleAddQuizQuestion} />
  </div>
)}


        
      </div>
      

    </div>

    {/* Dialog comun pentru lecție sau quiz */}
    <Dialog
      header={`Adaugă ${courseType === "quiz" ? "Quiz" : "Lecție"}`}
      visible={showForm}
      style={{ width: '50vw' }}
      onHide={() => setShowForm(false)}
    >
      <InputText
        placeholder={`Titlul ${courseType === "quiz" ? "quizului" : "lecției"}`}
        value={courseTitle}
        onChange={(e) => setCourseTitle(e.target.value)}
        className="p-mb-2 p-inputtext-sm"
        style={{ width: '100%' }}
      />
      {courseType === "curs" && (
        <>
          <Dropdown
            value={selectedClassForm}
            options={classOptions}
            onChange={(e) => setSelectedClassForm(e.value)}
            placeholder="Clasa"
            className="p-mb-2"
          />
          <Dropdown
            value={selectedDomainForm}
            options={domainOptions}
            onChange={(e) => setSelectedDomainForm(e.value)}
            placeholder="Domeniu"
            className="p-mb-2"
          />
        </>
      )}
      {courseType === "quiz" && (
  <p>Introduceți titlul lecției aferente testului.</p>
)}
      <Button
        label={courseType === "quiz" ? "Salvează Quiz" : "Adaugă Lecție"}
        onClick={courseType === "quiz" ? handleAddQuiz : handleAddLesson}
        className="p-button-success"
      />
    </Dialog>
  </div>



);

  
};

export default CoursePage;
