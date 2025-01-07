import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import logo from './logo.png';

interface ApiResponse {
  success: boolean;
}

interface StarterResponse {
  starter: string;
}

interface Person {
  id: string;
  name: string;
  characteristics: string;
  interests: string;
  age: string;
  gender: string;
  relation: string;
  formality: string;
  diff: string;
}

interface FormErrors {
  name: string;
  characteristics: string;
  interests: string;
  age: string;
  gender: string;
  relation: string;
}

const AppBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleUpgrade = () => {
    window.location.href = '/upgrade';
  };

  return (
    <div className="app-bar">
      <div className="app-bar-left">
        <img src="/logo.png" alt="Logo" />
      </div>
      <button className="upgrade-button" onClick={handleUpgrade}>
        Upgrade
      </button>
      <div>
        <button 
          className="menu-button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
        <div className={`dropdown-menu ${isMenuOpen ? 'active' : ''}`}>
          <div>Menu Item 1</div>
          <div>Menu Item 2</div>
          <div>Menu Item 3</div>
        </div>
      </div>
    </div>
  );
};

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

  const [savedPersons, setSavedPersons] = useState<Person[]>([]);
  const [starters, setStarters] = useState<{[key: string]: string}>({});
  const [user, setUser] = useState<any>(null);
  const [uniqueRelations, setUniqueRelations] = useState<Set<string>>(new Set());
  const [isLandingPage, setIsLandingPage] = useState(true);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [selectedRelation, setSelectedRelation] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: '',
    characteristics: '',
    interests: '',
    age: '',
    gender: '',
    relation: ''
  });

  const generateStarter = async (person: Person) => {
    try {
      const response = await axios.post<StarterResponse>('http://localhost:5000/api/conversation-starter', person);
      setStarters({
        ...starters,
        [person.id]: response.data.starter
      });
    } catch (error) {
      console.error('Error generating conversation starter:', error);
      alert('Error generating conversation starter');
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {
      name: '',
      characteristics: '',
      interests: '',
      age: '',
      gender: '',
      relation: ''
    };
    
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.characteristics.trim()) {
      errors.characteristics = 'Characteristics are required';
      isValid = false;
    }

    if (!formData.interests.trim()) {
      errors.interests = 'Interests are required';
      isValid = false;
    }

    if (!formData.age) {
      errors.age = 'Age is required';
      isValid = false;
    } else if (parseInt(formData.age) <= 0) {
      errors.age = 'Age must be a positive number';
      isValid = false;
    }

    if (!formData.gender) {
      errors.gender = 'Gender is required';
      isValid = false;
    }

    if (!formData.relation.trim()) {
      errors.relation = 'Relation is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post<ApiResponse>('http://localhost:5000/api/person', formData);
      if (response.data.success) {
        const newPerson = {
          ...formData,
          id: Date.now().toString()
        };
        setUniqueRelations(prev => new Set([...prev, formData.relation]));
        setSavedPersons([...savedPersons, newPerson]);
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
        setFormErrors({
          name: '',
          characteristics: '',
          interests: '',
          age: '',
          gender: '',
          relation: ''
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

  const handleSignIn = () => {
    setIsLandingPage(false);
  };

  const handleCreateAccount = () => {
    setIsLandingPage(false);
  };

  const handleRelationClick = (relation: string) => {
    setSelectedRelation(relation);
  };

  const handleBackClick = () => {
    setSelectedRelation(null);
  };

  if (isLandingPage) {
    return (
      <div className="landing-page">
        <h1>Welcome to Conversation Starter</h1>
        <div className="landing-buttons">
          <button onClick={handleSignIn}>Sign In</button>
          <button onClick={handleCreateAccount}>Create Account</button>
        </div>
      </div>
    );
  }

  if (isCreatingAccount) {
    return (
      <div className="create-account-page">
        <h1>Create Your Account</h1>
        <form className="create-account-form">
          <button onClick={() => setIsLandingPage(false)}>Create Account</button>
        </form>
      </div>
    );
  }

  return (
    <>
      <AppBar />
      <div className="App">
        <div className="app-content">
          {user && (
            <div>
              <p>Welcome, {user.displayName}!</p>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          )}
          <div className="conversation-starter-header">
            <h1>Add People to Your Database</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={formErrors.name ? 'error' : ''}
              />
              {formErrors.name && <span className="error-message">{formErrors.name}</span>}
            </div>
            <div>
              <label>Characteristics (separate by /):</label>
              <input
                type="text"
                name="characteristics"
                value={formData.characteristics}
                onChange={handleChange}
                className={formErrors.characteristics ? 'error' : ''}
              />
              {formErrors.characteristics && <span className="error-message">{formErrors.characteristics}</span>}
            </div>
            <div>
              <label>Interests (separate by /):</label>
              <input
                type="text"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                className={formErrors.interests ? 'error' : ''}
              />
              {formErrors.interests && <span className="error-message">{formErrors.interests}</span>}
            </div>
            <div>
              <label>Age:</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={formErrors.age ? 'error' : ''}
              />
              {formErrors.age && <span className="error-message">{formErrors.age}</span>}
            </div>
            <div>
              <label>Gender:</label>
              <select 
                name="gender" 
                value={formData.gender} 
                onChange={handleChange}
                className={formErrors.gender ? 'error' : ''}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {formErrors.gender && <span className="error-message">{formErrors.gender}</span>}
            </div>
            <div>
              <label>Relation:</label>
              <select 
                name="relation" 
                value={formData.relation} 
                onChange={handleChange}
                className={formErrors.relation ? 'error' : ''}
              >
                <option value="">Select or type a relation</option>
                {Array.from(uniqueRelations).map(relation => (
                  <option key={relation} value={relation}>{relation}</option>
                ))}
              </select>
              <input
                type="text"
                name="relation"
                value={formData.relation}
                onChange={handleChange}
                placeholder="Or type a new relation"
                style={{ marginTop: '5px' }}
                className={formErrors.relation ? 'error' : ''}
              />
              {formErrors.relation && <span className="error-message">{formErrors.relation}</span>}
              {!uniqueRelations.has(formData.relation) && formData.relation && (
                <small>New relation will be added</small>
              )}
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
            <h2>Saved Persons by Relation</h2>
            
            {selectedRelation ? (
              <div className="relation-detail-view">
                <button className="back-button" onClick={handleBackClick}>
                  ← Back to Relations
                </button>
                <h3>{selectedRelation}</h3>
                <div className="persons-grid">
                  {savedPersons
                    .filter(person => person.relation === selectedRelation)
                    .map((person) => (
                      <div key={person.id} className="person-card">
                        <h4>{person.name}</h4>
                        <p>Age: {person.age}</p>
                        <p>Gender: {person.gender}</p>
                        <p>Characteristics: {person.characteristics}</p>
                        <p>Interests: {person.interests}</p>
                        <button onClick={() => generateStarter(person)}>
                          Generate Conversation Starter
                        </button>
                        {starters[person.id] && (
                          <p className="conversation-starter">
                            {starters[person.id]}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="relations-grid">
                {[...uniqueRelations].map(relation => (
                  <button
                    key={relation}
                    className="relation-button"
                    onClick={() => handleRelationClick(relation)}
                  >
                    <h3>{relation}</h3>
                    <p>{savedPersons.filter(person => person.relation === relation).length} people</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  ); 
}

export default App;