import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import logo from './assets/HelperLogo.png';

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
        <img src={logo} alt="Logo" />
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
          <div>      
            <button className="upgrade-button" onClick={handleUpgrade}>
            Upgrade
            </button>
          </div>
          <div>
            <button className="upgrade-button" onClick={handleUpgrade}>
            Settings
            </button>
          </div>
          <div>
            <button className="upgrade-button" onClick={handleUpgrade}>
            Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function App(): JSX.Element {
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

  const [personalPersons, setPersonalPersons] = useState<Person[]>([]);
  const [professionalPersons, setProfessionalPersons] = useState<Person[]>([]);
  const [personalRelations, setPersonalRelations] = useState<Set<string>>(new Set());
  const [professionalRelations, setProfessionalRelations] = useState<Set<string>>(new Set());
  const [starters, setStarters] = useState<{[key: string]: string}>({});
  const [user, setUser] = useState<any>(null);
  const [isHomePage, setIsHomePage] = useState(false);
  const [currentBizPage, setCurrentBizPage] = useState<string>('main');
  const [selectedRelation, setSelectedRelation] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: '',
    characteristics: '',
    interests: '',
    age: '',
    gender: '',
    relation: ''
  });
  const [isPersonalMode, setIsPersonalMode] = useState(true);

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

        if (isPersonalMode) {
          setPersonalPersons([...personalPersons, newPerson]);
          setPersonalRelations(prev => new Set([...prev, formData.relation]));
        } else {
          setProfessionalPersons([...professionalPersons, newPerson]);
          setProfessionalRelations(prev => new Set([...prev, formData.relation]));
        }

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

  const handleNavigation = (page: string) => {
    setCurrentBizPage(page);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignOut = async () => {
    try {
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSignIn = () => {
    setIsHomePage(true);
  };

  const handleCreateAccount = () => {
    setIsHomePage(true);
  };

  const handleRelationClick = (relation: string) => {
    setSelectedRelation(relation);
  };

  const handleBackClick = () => {
    setSelectedRelation(null);
  };

  const ClientListPage = () => (
    <div className="biz-page">
      <button className="back-button" onClick={() => handleNavigation('main')}>
        ← Back
      </button>
      <h1>Client List Management</h1>
    </div>
  );

  const PeopleDBPage = () => (
    <><div className="biz-page">
      <button className="back-button" onClick={() => handleNavigation('main')}>
        ← Back
      </button>
    </div><div className="App">
        <div className="app-content">
          {user && (
            <div>
              <p>Welcome, {user.displayName}!</p>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          )}
          <div className="conversation-starter-header">
            <h1>Add to Your Professional People Database</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={formErrors.name ? 'error' : ''} />
              {formErrors.name && <span className="error-message">{formErrors.name}</span>}
            </div>
            <div>
              <label>Characteristics (separate by /):</label>
              <input
                type="text"
                name="characteristics"
                value={formData.characteristics}
                onChange={handleChange}
                className={formErrors.characteristics ? 'error' : ''} />
              {formErrors.characteristics && <span className="error-message">{formErrors.characteristics}</span>}
            </div>
            <div>
              <label>Interests (separate by /):</label>
              <input
                type="text"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                className={formErrors.interests ? 'error' : ''} />
              {formErrors.interests && <span className="error-message">{formErrors.interests}</span>}
            </div>
            <div>
              <label>Age:</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={formErrors.age ? 'error' : ''} />
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
                {Array.from(professionalRelations).map(relation => (
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
                className={formErrors.relation ? 'error' : ''} />
              {formErrors.relation && <span className="error-message">{formErrors.relation}</span>}
              {!professionalRelations.has(formData.relation) && formData.relation && (
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
                  {professionalPersons
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
                {[...professionalRelations].map(relation => (
                  <button
                    key={relation}
                    className="relation-button"
                    onClick={() => handleRelationClick(relation)}
                  >
                    <h3>{relation}</h3>
                    <p>{professionalPersons.filter(person => person.relation === relation).length} people</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div></>
  );

  const EmailSignaturePage = () => (
    <div className="biz-page">
      <button className="back-button" onClick={() => handleNavigation('main')}>
        ← Back
      </button>
      <h1>Email Signature Creator</h1>
    </div>
  );

  const MessageTemplatesPage = () => (
    <div className="biz-page">
      <button className="back-button" onClick={() => handleNavigation('main')}>
        ← Back
      </button>
      <h1>Message to Alumni/Recruiters Generator</h1>
    </div>
  );

  if (!isHomePage) {
    return (
      <div className="landing-page">
        <h1>Welcome to Conversation Starter</h1>
        <div className="landing-buttons">
          <button onClick={() => setIsHomePage(true)}>Sign In</button>
          <button onClick={() => setIsHomePage(true)}>Create Account</button>
        </div>
      </div>
    );
  }

  const currentPersons = isPersonalMode ? personalPersons : professionalPersons;
  const currentRelations = isPersonalMode ? personalRelations : professionalRelations;

  return (
    <>
      <AppBar />
      <div className="mode-toggle">
        <button 
          className={`toggle-button ${isPersonalMode ? 'active' : ''}`}
          onClick={() => setIsPersonalMode(true)}
        >
          Personal
        </button>
        <button 
          className={`toggle-button ${!isPersonalMode ? 'active' : ''}`}
          onClick={() => setIsPersonalMode(false)}
        >
          Business
        </button>
      </div>
      {isPersonalMode ? (
        <div className="App">
          <div className="app-content">
            {user && (
              <div>
                <p>Welcome, {user.displayName}!</p>
                <button onClick={handleSignOut}>Sign Out</button>
              </div>
            )}
            <div className="conversation-starter-header">
              <h1>Add to Your Personal People Database</h1>
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
                  {Array.from(personalRelations).map(relation => (
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
                {!personalRelations.has(formData.relation) && formData.relation && (
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
                    {personalPersons
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
                  {[...personalRelations].map(relation => (
                    <button
                      key={relation}
                      className="relation-button"
                      onClick={() => handleRelationClick(relation)}
                    >
                      <h3>{relation}</h3>
                      <p>{personalPersons.filter(person => person.relation === relation).length} people</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {!isPersonalMode && (
            <div className="App">
              <div className="app-content">
                {currentBizPage === 'main' ? (
                  <>
                    <div className="conversation-starter-header">
                      <h1>What Do You Need Done</h1>
                    </div>
                    <button className="select-biz" onClick={() => setCurrentBizPage('clients')}>
                      Create/Manage a Client List
                    </button>
                    <button className="select-biz" onClick={() => setCurrentBizPage('database')}>
                      Manage Your Professional People Database            
                    </button>
                    <button className="select-biz" onClick={() => setCurrentBizPage('email')}>
                      Create an Email Signature
                    </button>
                    <button className="select-biz" onClick={() => setCurrentBizPage('templates')}>
                      Message Generator to Recruiter/Alumni               
                    </button>
                  </>
                ) : (
                  <>
                    {currentBizPage === 'clients' && <ClientListPage />}
                    {currentBizPage === 'database' && <PeopleDBPage />}
                    {currentBizPage === 'email' && <EmailSignaturePage />}
                    {currentBizPage === 'templates' && <MessageTemplatesPage />}
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
export default App;