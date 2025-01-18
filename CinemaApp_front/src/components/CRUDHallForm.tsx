import React, { useState } from 'react';
import api from '../services/api';

interface Hall {
  id?: string;
  name: string;
  seats: any[];
  screenings?: any[];
}

interface CRUDHallFormProps {
  editingHall?: Hall | null;
  onHallsUpdated: () => void;
}

const CRUDHallForm: React.FC<CRUDHallFormProps> = ({ editingHall, onHallsUpdated }) => {
  const [hall, setHall] = useState<Hall>(
    editingHall || {
      name: '',
      seats: [],
      screenings: [],
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHall({ ...hall, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const confirmed = window.confirm(
      editingHall
        ? 'Are you sure you want to update this hall?'
        : 'Are you sure you want to add this hall?'
    );
  
    if (!confirmed) return;
  
    try {
      const response = editingHall
        ? await api.put(`/Hall/${editingHall.id}`, hall)
        : await api.post('/Hall', hall);
  
      if (response.status === 200 || response.status === 201) {
        alert(editingHall ? 'Hall has been updated!' : 'Hall has been added!');
        setHall({ name: '', seats: [], screenings: [] });
        onHallsUpdated();
      } else {
        alert('An error occurred while processing the hall.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the hall.');
    }
  };
  

  return (
    <div className="crud-hall-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Hall Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={hall.name}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">
          {editingHall ? 'Update Hall' : 'Add Hall'}
        </button>
      </form>
    </div>
  );
};

export default CRUDHallForm;
