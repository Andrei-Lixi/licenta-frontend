import React from 'react';

const CourseList = ({ selectedClass, selectedDomain }) => {
  const courses = {
    'Clasa 1': {
      'Matematică': ['Adunare și scădere', 'Împărțire'],
      'Limba Română': ['Alfabetul', 'Cuvinte și propoziții'],
    },
    'Liceu': {
      'Matematică': ['Algebră', 'Geometrie', 'Trigonometrie'],
      'Fizică': ['Mecanica', 'Termodinamică'],
    },
    // alte cursuri pentru fiecare clasă și domeniu
  };

  return (
    <div>
      <h3>Cursuri pentru {selectedClass} - {selectedDomain}</h3>
      <ul>
        {courses[selectedClass]?.[selectedDomain]?.map((course, index) => (
          <li key={index}>{course}</li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
