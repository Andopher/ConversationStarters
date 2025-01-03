import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

interface ApiResponse {
  success: boolean;
}

interface StarterResponse {
  starter: string;
}

function App() {
  const [formData, setFormData] = useState({
    name: '',
    characteristics: '',
    interests: '',
    age: '',
    gender: '',
    relation: '',
    formality: 'informal',
    diff: 'easy'
    
  });

  const [savedPersons, setSavedPersons] = useState<Array<any>>([]);
    const [starters, setStarters] = useState<{[key: number]: string}>({});
  const [user, setUser] = useState<any>(null);

  const generateStarter = async (person: any, index: number) => {
    try {
      const response = await axios.post<StarterResponse>('http://localhost:5000/api/conversation-starter', person);
      setStarters({
        ...starters,
        [index]: response.data.starter
      });
    } catch (error) {
      console.error('Error generating conversation starter:', error);
      alert('Error generating conversation starter');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<ApiResponse>('http://localhost:5000/api/person', formData);
      if (response.data.success) {
        alert('Person saved successfully!');
        setSavedPersons([...savedPersons, formData]); // Add the new person
        setFormData({
          name: '',
          characteristics: '',
          interests: '',
          age: '',
          gender: '',
          relation: '',
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

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="App">
      {!user ? (
        <div>
          <h1>Sign in to save your data</h1>
          <div className="google-sign-in">
            <button onClick={signInWithGoogle}>Sign in with Google</button>
          </div>
        </div>
      ) : (
        <div>
          <p>Welcome, {user.displayName}!</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      )}
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
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label>Relation:</label>
          <input
            type="text"
            name="relation"
            value={formData.relation}
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
            <option value="medium">Medium</option>
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
            <p>Relation: {person.relation}</p>
            <p>Characteristics: {person.characteristics}</p>
            <p>Interests: {person.interests}</p>
            <button onClick={() => generateStarter(person, index)}>
              Generate Conversation Starter
            </button>
            {starters[index] && (
              <p className="conversation-starter">
                {starters[index]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
  ); 
}

export default App;