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



const USER_ROLE = {
  NONE: 0,
  TEACHER: 2,
  STUDENT: 3,
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

  const { token, getRol } = useAuthToken();


  const [lessonsFromDB, setLessonsFromDB] = useState([]);


  const classOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `Clasa ${i + 1}`,
    value: i + 1,
  })).concat({ label: "Facultate", value: "facultate" });

  const domainOptions = [
    { label: "Matematica", value: "matematica" },
    { label: "Fizica", value: "fizica" },
    { label: "Romana", value: "romana" },
    { label: "Chimie", value: "chimie" },
  ];

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
        setUserRole(USER_ROLE.STUDENT);
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

  const handleAddLesson = async () => {
    try {
      const payload = {
        name: courseTitle,
        class: selectedClassForm,
        domain: selectedDomainForm,
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
  
      // Resetare și localStorage
      const newLesson = {
        id: Date.now(),
        title: courseTitle,
        type: "curs",
        class: selectedClassForm,
        domain: selectedDomainForm,
      };
      const existingCourses = JSON.parse(localStorage.getItem("courses")) || [];
      existingCourses.push(newLesson);
      localStorage.setItem("courses", JSON.stringify(existingCourses));
  
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
    const payload = {
      name: courseTitle,
      class: selectedClassForm,
      domain: selectedDomainForm,
      questions: quizQuestions,
    };

    // 🔸 1. Trimite la server
    const response = await fetch('/api/teacher/quiz/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json().catch(() => ({}));
    console.log("Payload trimis:", payload);
    console.log("Status răspuns:", response.status);
    console.log("Răspuns server:", responseData);

    if (!response.ok) throw new Error('Eroare la adăugare');

    // ✅ 2. Salvează local în localStorage
    const newQuiz = {
  id: responseData.id, // ✅ ID-ul real de la backend
  title: courseTitle,
  type: "quiz",
  class: selectedClassForm,
  domain: selectedDomainForm,
  questions: quizQuestions,
};


    const existingCourses = JSON.parse(localStorage.getItem("courses")) || [];
    existingCourses.push(newQuiz);
    localStorage.setItem("courses", JSON.stringify(existingCourses));

    // 🔔 Feedback
    toast.current.show({
      severity: 'success',
      summary: 'Quiz adăugat',
      detail: `Quizul "${courseTitle}" a fost adăugat cu succes.`,
      life: 3000,
    });

    resetForm();
    setShowForm(false);

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
  

  /*const handleAddCourse = () => {
    const newCourse = {
      id: Date.now(),
      title: courseTitle,
      type: courseType,
      class: selectedClassForm,
      domain: selectedDomainForm,
      questions: quizQuestions,
    };

    const existingCourses = JSON.parse(localStorage.getItem("courses")) || [];
    existingCourses.push(newCourse);
    localStorage.setItem("courses", JSON.stringify(existingCourses));

    toast.current.show({
      severity: 'success',
      summary: courseType === "quiz" ? 'Quiz adăugat!' : 'Curs adăugat!',
      detail: `${courseType === "quiz" ? "Quizul" : "Cursul"} "${courseTitle}" a fost adăugat cu succes.`,
      life: 3000
    });

    setShowForm(false);
    setCourseTitle("");
    setSelectedClassForm(null);
    setSelectedDomainForm(null);
    setCourseType(null);
    setQuizQuestions([]);
    setCoursesUpdated(prev => !prev);

    if (courseType === "quiz") {
      navigate("/QuizPage", { state: { quizData: newCourse } });
    }
  };  */

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

  const CourseList = ({ selectedClass, selectedDomain, courses }) => {
    console.log("courses primit:", courses);
    if (!Array.isArray(courses)) {
      return <p>Eroare: lecțiile nu sunt în formatul așteptat.</p>;
    }
  
    const filteredCourses = courses.filter(
      (course) => String(course.class) === String(selectedClass) && course.domain === selectedDomain
    );

    
  
    if (!selectedClass || !selectedDomain) {
      return <p>Selectează o clasă și un domeniu pentru a vedea lecțiile.</p>;
    }
  
    return (
      <div>
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course, index) => (
            <Card key={index} title={course.name}>
             
            </Card>
          ))
        ) : (
          <p>Nu sunt lecții disponibile momentan.</p>
        )}
      </div>
    );
  };
  

  
  
  

  return (
    <div>
      <BaraMeniu />
      <Toast ref={toast} />

      <h1 className="p-text-center">
        {userRole === USER_ROLE.TEACHER && "Bun venit, domnule/doamnă profesor"}
        {userRole === USER_ROLE.STUDENT && "Bun venit pe calea învățării, elevule"}
        {userRole === USER_ROLE.NONE && "Bun venit pe calea învățării, persoană anonimă"}
      </h1>

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
            courseTypeFilter={null}
            courses={lessonsFromDB}
          />

          </Card>
        </div>
      )}

      {userRole === USER_ROLE.TEACHER && (
        <>
          <Button
            label="+"
            className="p-button-rounded p-button-primary"
            style={{ position: "fixed", bottom: 20, left: 20 }}
            onClick={() => setShowForm(true)}
          />
          <Dialog
            header="Adaugă un curs"
            visible={showForm}
            style={{ width: '50vw' }}
            onHide={() => setShowForm(false)}
          >
            <InputText
              placeholder="Titlul cursului"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              className="p-mb-2 p-inputtext-sm"
              style={{ width: '100%' }}
            />
            <Dropdown
              value={courseType}
              options={[{ label: "Quiz", value: "quiz" }, { label: "Curs", value: "curs" }]}
              onChange={(e) => setCourseType(e.value)}
              placeholder="Tipul"
              className="p-mb-2"
            />
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
            {courseType === "quiz" && (
              <>
                <Button label="Adaugă Întrebare" onClick={handleAddQuestion} className="p-button-sm p-button-secondary p-mb-3" />
                {quizQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="p-mb-3">
                    <InputText
                      placeholder={`Întrebarea ${qIdx + 1}`}
                      value={q.question}
                      onChange={(e) => updateQuestion(qIdx, 'question', e.target.value)}
                      className="p-mb-2"
                      style={{ width: '100%' }}
                    />
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="p-field-radiobutton p-mb-1">
                        <input
                          type="radio"
                          name={`correct-${qIdx}`}
                          checked={q.correct === oIdx}
                          onChange={() => updateQuestion(qIdx, 'correct', oIdx)}
                          style={{ marginRight: '5px' }}
                        />
                        <InputText
                          placeholder={`Opțiunea ${oIdx + 1}`}
                          value={opt}
                          onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                          style={{ width: '80%' }}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </>
            )}
            <Button
             label={courseType === "quiz" ? "Salvează Quiz" : "Adaugă Curs"}
             onClick={courseType === "quiz" ? handleAddQuiz : handleAddLesson}
              className="p-button-success"
              />

          </Dialog>
        </>
      )}
    </div>
  );
};

export default CoursePage;
