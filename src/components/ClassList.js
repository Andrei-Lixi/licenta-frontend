import React from 'react';
import { ListBox } from 'primereact/listbox';
import { Card } from 'primereact/card';

const ClassList = ({ setClass }) => {
  const classes = ['Clasa 0', 'Clasa 1', 'Clasa 2', 'Clasa 3', 'Clasa 4', 'Clasa 5', 'Clasa 6', 'Clasa 7', 'Clasa 8', 'Liceu', 'Facultate'];

  // Funcția pentru a gestiona selectarea clasei
  const onClassSelect = (e) => {
    setClass(e.value);
  };

  return (
    <div className="p-d-flex p-jc-center p-mb-4">
      <Card title="Selectează o Clasă" className="w-full md:w-14rem">
        <ListBox 
          options={classes} 
          onChange={onClassSelect} 
          className="w-full" 
          placeholder="Alege clasa"
          style={{ maxHeight: '200px', overflowY: 'auto' }} // Stiluri pentru scroll
        />
      </Card>
    </div>
  );
};

export default ClassList;
