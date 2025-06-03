import React from 'react';
import { Dropdown } from 'primereact/dropdown';

const DomainList = ({ setDomain, selectedClass }) => {
  const domains = {
    'Clasa 0': ['Limba Română', 'Matematică', 'Științe', 'Arte'],
    'Clasa 1': ['Limba Română', 'Matematică', 'Științe', 'Desen'],
    'Clasa 2': ['Limba Română', 'Matematică', 'Engleză', 'Fizică'],
    'Liceu': ['Matematică', 'Fizică', 'Chimie', 'Istorie', 'Limba Engleză'],
    'Facultate': ['Matematică', 'Fizică', 'Chimie', 'Informatica'],
  };

  return (
    <Dropdown options={domains[selectedClass] || []} onChange={(e) => setDomain(e.value)} placeholder="Selectează un domeniu" />
  );
};

export default DomainList;
