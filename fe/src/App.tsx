import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    characteristics: '',
    interests: '',
    age: '',
    gender: '',
    formality: 'informal',
    diff: 'easy'
    
  });

  const [savedPersons, setSavedPersons] = useState<Array<any>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/person', formData);
      if (response.data.success) {
        alert('Person saved successfully!');
        setSavedPersons([...savedPersons, formData]); // Add the new person
        setFormData({
          name: '',
          characteristics: '',
          interests: '',
          age: '',
          gender: '',
          formality: 'informal',
          diff: 'easy'
        });
      }
    } catch (error) {
      console.error('Error details:', error); 
      alert('Error saving person');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="App">
      <h1>Conversation Starter</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Characteristics (separate by /):</label>
          <input
            type="text"
            name="characteristics"
            value={formData.characteristics}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Interests (separate by /):</label>
          <input
            type="text"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="text"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Gender:</label>
          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Formality:</label>
          <select name="formality" value={formData.formality} onChange={handleChange}>
            <option value="formal">Formal</option>
            <option value="informal">Informal</option>
          </select>
        </div>
        <div>
          <label>Difficulty:</label>
          <select name="diff" value={formData.diff} onChange={handleChange}>
            <option value="easy">Easy</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button type="submit">Save Person</button>
    </form>
    <div className="saved-persons">
      <h2>Saved Persons</h2>
      <div className="persons-grid">
        {savedPersons.map((person, index) => (
          <div key={index} className="person-card">
            <h3>{person.name}</h3>
            <p>Age: {person.age}</p>
            <p>Gender: {person.gender}</p>
            <p>Characteristics: {person.characteristics}</p>
            <p>Interests: {person.interests}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
  ); 
}

export default App;