import React, { useState, useEffect } from 'react';
import './styles/ProfileAdminForm.css'
import { getUserProfile, updateUserProfile, getCompetencies } from '../../api/profile/ProfileApi';
import { UserProfile, UserProfileUpdate } from '../../api/profile/interfaces/dto.profile';
import SaveButton from '../SaveButton/SaveButton';
import EditPasswordButton from '../EditPasswordButton/EditPasswordButton';
import Snackbar, { SnackbarType } from '../Snackbar/Snackbar';
import icon_select from "../../images/icons/icon_down_form.svg";

const AdminForm: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [login, setLogin] = useState('');
  const [position, setPosition] = useState('');
  const [competencies, setCompetencies] = useState('');
  const [email, setEmail] = useState('');
  const [snackbarType, setSnackbarType] = useState<SnackbarType | null>(null);
  
  const [allCompetencies, setAllCompetencies] = useState<{ id: number, text: string }[]>([]);
  const [filteredCompetencies, setFilteredCompetencies] = useState<{ id: number, text: string }[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const profileData = await getUserProfile();
      setProfile(profileData);
      setOriginalProfile(profileData);
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setMiddleName(profile.middleName || '');
      setLastName(profile.lastName || '');
      setLogin(profile.login || '');
      setPosition(profile.position || '');
      setCompetencies(profile.competencies.map((comp: any) => comp.text).join(', ') || '');
      setEmail(profile.email || '');
    }
  }, [profile]);

  useEffect(() => {
    const fetchCompetencies = async () => {
      const competencyList = await getCompetencies();
      if (competencyList) {
        setAllCompetencies(competencyList);
        setFilteredCompetencies(competencyList);
      }
    };
    fetchCompetencies();
  }, []);

  const handleSave = async () => {
    if (!profile) return;

    const updatedFields: Partial<UserProfileUpdate> = {};
    if (lastName && lastName !== originalProfile?.lastName) {
      updatedFields.lastName = lastName;
    }
    if (firstName && firstName !== originalProfile?.firstName) {
      updatedFields.firstName = firstName;
    }
    if (middleName && middleName !== originalProfile?.middleName) {
      updatedFields.middleName = middleName;
    }
    if (login && login !== originalProfile?.login) {
      updatedFields.login = login;
    }
    if (position && position !== originalProfile?.position) {
      updatedFields.position = position;
    }
    if (competencies && competencies !== originalProfile?.competencies.map((comp: any) => comp.text).join(', ')) {
      updatedFields.competencies = competencies;
    }
    if (email && email !== originalProfile?.email) {
      updatedFields.email = email;
    }

    if (Object.keys(updatedFields).length > 0) {
      try {
        const updatedProfile = await updateUserProfile(updatedFields);
        if (updatedProfile) {
          setProfile(updatedProfile);
          setOriginalProfile(updatedProfile);
          setSnackbarType('successChange');
        }
      } catch (error) {
        setSnackbarType('errorSendingData');
      }
    }
  };

  const handleCompetencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCompetencies(value);
  
    const lastEnteredCompetency = value.split(',').pop()?.trim() || ''; // Берём последнее введённое слово после запятой
    const filtered = allCompetencies.filter((comp) =>
      comp.text.toLowerCase().startsWith(lastEnteredCompetency.toLowerCase())
    );
    setFilteredCompetencies(filtered);
    setShowDropdown(true);
  };
  
  const handleSelectCompetency = (compText: string) => {
    // Разделяем строку компетенций по запятым, убираем лишние пробелы
    let currentCompetencies = competencies.split(',').map(c => c.trim()).filter(Boolean);
  
    // Проверяем, что новая компетенция не дублирует уже введённые
    if (!currentCompetencies.includes(compText)) {
      // Если текущая строка заканчивается на запятую, добавляем новую компетенцию
      if (competencies.trim().endsWith(',')) {
        currentCompetencies.push(compText); // Добавляем новую компетенцию
      } else {
        currentCompetencies[currentCompetencies.length - 1] = compText; // Заменяем последнюю компетенцию
      }
      setCompetencies(currentCompetencies.join(', ')); // Добавляем запятую после новой компетенции
    }
  
    setShowDropdown(false);
  };
  
  
  return (
  <div className="forma">
    <div className="profile-header">
      <h1 className='profile-title'>Личный кабинет</h1>
      <SaveButton onSave={handleSave} />
    </div>
    <div className="profile">
        <div className="profile-form-group">
          <div className="profile-form">
            <p className='profile-form-title'>Фамилия</p>
            <input 
              type="email"
              className="profile-form-control"
              placeholder="Фамилия"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              />
          </div>
          <div className="profile-form">
            <p className='profile-form-title'>Имя</p>
            <input 
              type="email"
              className="profile-form-control"
              placeholder="Имя"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              />
          </div>
          <div className="profile-form">
            <p className='profile-form-title'>Отчество</p>
            <input 
              type="email"
              className="profile-form-control"
              placeholder="Отчество"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              required
              />
          </div>
          <div className="profile-form">
          <p className='profile-form-title'>Логин</p>
          <input 
            type="text"
            className="profile-form-control"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </div>
        <div className="profile-form">
          <p className='profile-form-title'>Пароль</p>
          <EditPasswordButton />
        </div>
        <div className="profile-form stack-name-container">
            <p className='profile-form-title'>Стек</p>
            <input 
              type="text"
              className="profile-form-control"
              placeholder="Стек"
              value={competencies}
              onChange={handleCompetencyChange}
              required 
            />
            <img
              src={icon_select}
              alt="select"
              className="profile-icon-select"
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <ul className="dropdown-competencies stack-name-dropdown">
                {filteredCompetencies.map((comp) => (
                  <li key={comp.id} onClick={() => handleSelectCompetency(comp.text)}>
                    {comp.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="profile-form">
            <p className='profile-form-title'>Email</p>
            <input 
              type="email"
              className="profile-form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              />
          </div>
        </div>
      </div>
      {snackbarType && (
        <Snackbar 
          type={snackbarType} 
          onClose={() => setSnackbarType(null)} 
        />
      )}
  </div>
  );
};

export default AdminForm;