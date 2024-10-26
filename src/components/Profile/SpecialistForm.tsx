import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../../api/profile/ProfileApi';
import { UserProfile, Internship, UserProfileUpdate } from '../../api/profile/interfaces/dto.profile';

import './styles/ProfileForm.css';
import SaveButton from '../SaveButton/SaveButton';
import EditPasswordButton from '../EditPasswordButton/EditPasswordButton';
import Snackbar, { SnackbarType } from '../Snackbar/Snackbar';

const phoneNumberPattern = /^\+7\d{10}$/;

const SpecialistForm: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formValues, setFormValues] = useState({
    fullName: '',
    login: '',
    position: '',
    studyGroup: '',
    email: '',
    contact: '',
    portfolio: '',
    plans: '',
    projects: '',
    tasks: '',
    note: '',
    inn: '',
    snils: '',
    birthday: '',
    passportData: '',
    registrationAddress: '',
    livingAddress: '',
    requisites: '',
    npdReference: '',
    competencies: ''
  });
  const [phoneError, setPhoneError] = useState<string>('');
  const [snackbarType, setSnackbarType] = useState<SnackbarType | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const profileData = await getUserProfile();
      setProfile(profileData);
      if (profileData) {
        const { phone, telegram } = parseContacts(`${profileData.phone || ''}, ${profileData.telegram || ''}`);
        setFormValues({
          fullName: `${profileData.lastName || ''} ${profileData.firstName || ''} ${profileData.middleName || ''}`,
          login: profileData.login || '',
          position: profileData.position || '',
          studyGroup: profileData.study_group || '',
          email: profileData.email || '',
          contact: `${phone}, ${telegram}`,
          portfolio: profileData.portfolio || '',
          plans: profileData.plans || '',
          projects: profileData.projects ? profileData.projects.map(p => p.title).join(', ') : '',
          tasks: profileData.tasks ? profileData.tasks.map(t => t.title).join(', ') : '',
          note: profileData.note || '',
          inn: profileData.inn || '',
          snils: profileData.snils || '',
          birthday: profileData.birthday || '',
          passportData: profileData.passport_data || '',
          registrationAddress: profileData.registration_address || '',
          livingAddress: profileData.living_address || '',
          requisites: profileData.requisites || '',
          npdReference: profileData.npd_reference || '',
          competencies: profileData.competencies.map(c => c.text).join(', ')
        });
      }
    };

    fetchProfile();
  }, []);

  const parseContacts = (contactString: string) => {
    const contactParts = contactString.trim().split(', ');
    return {
      phone: contactParts[0] || '',
      telegram: contactParts[1] || '',
    };
  };

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    return phoneNumberPattern.test(phoneNumber);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({ ...prevValues, [name]: value }));
  };

  const handleSave = async () => {
    if (!profile) return;

    const updatedFields: Partial<UserProfileUpdate> = {};

    const { phone, telegram } = parseContacts(formValues.contact);

    if (!validatePhoneNumber(phone)) {
      setPhoneError('Номер телефона должен начинаться с +7 и содержать 10 цифр');
      return;
    } else {
      setPhoneError('');
    }

    if (phone !== profile.phone) updatedFields.phone = phone;
    if (telegram !== profile.telegram) updatedFields.telegram = telegram;
    if (formValues.login !== profile.login) updatedFields.login = formValues.login;
    if (formValues.studyGroup !== profile.study_group) updatedFields.study_group = formValues.studyGroup;
    if (formValues.inn !== profile.inn) updatedFields.inn = formValues.inn;
    if (formValues.snils !== profile.snils) updatedFields.snils = formValues.snils;
    if (formValues.birthday !== profile.birthday) updatedFields.birthday = formValues.birthday;
    if (formValues.passportData !== profile.passport_data) updatedFields.passport_data = formValues.passportData;
    if (formValues.registrationAddress !== profile.registration_address) updatedFields.registration_address = formValues.registrationAddress;
    if (formValues.livingAddress !== profile.living_address) updatedFields.living_address = formValues.livingAddress;
    if (formValues.requisites !== profile.requisites) updatedFields.requisites = formValues.requisites;
    if (formValues.npdReference !== profile.npd_reference) updatedFields.npd_reference = formValues.npdReference;

    for (const key in updatedFields) {
      if (Object.prototype.hasOwnProperty.call(updatedFields, key)) {
        if (updatedFields[key as keyof UserProfileUpdate] === '') {
          delete updatedFields[key as keyof UserProfileUpdate];
        }
      }
    }

    try {
      if (Object.keys(updatedFields).length > 0) {
        const updatedProfile = await updateUserProfile(updatedFields);
        if (updatedProfile) {
          setProfile(updatedProfile);
          setSnackbarType('successChange');
        }
      }
    } catch (error) {
      setSnackbarType('errorSendingData');
    }
  };

  const closeSnackbar = () => {
    setSnackbarType(null);
  };

  if (!profile) {
    return <div></div>;
  }
  
  const isPracticeStatus = profile.status === 'PRACTICE';

  const formatFullName = () => {
    const { lastName, firstName, middleName } = profile;
    return `${lastName || ''} ${firstName || ''} ${middleName || ''}`;
  };

  const getStatusText = () => {
    switch (profile.status) {
      case 'PRACTICE':
        return 'Практика';
      case 'INTERNSHIP':
        return 'Стажировка';
      case 'SPECIALIST':
        return 'Специалист';
      default:
        return 'Не указан';
    }
  };

  const getStatusClass = (status: string | undefined): string => {
    switch (status) {
      case 'Завершено-актив':
        return 'status-active';
      case 'В процессе':
        return 'status-in-process';
      case 'Завершено-плохо':
        return 'status-bad';
      case 'Специалист':
        return 'status-specialist';
      default:
        return 'status-default';
    }
  };

  const getLatestInternship = (): Internship | undefined => {
    if (!profile.internships || profile.internships.length === 0) {
      return ;
    }
    else { 
      return profile.internships.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())[0];
    }
  };

  const latestInternship = getLatestInternship();

  return (
  <div className="forma">
    <div className="profile-header">
      <h1 className='profile-title'>Личный кабинет</h1>
      <SaveButton onSave={handleSave} />
    </div>
    <div className="user-profile">
      <div className="user-form-group">
        <div className="user-form">
          <p className='user-form-title'>ФИО</p>
          <input 
            type="text"
            className="user-form-control read-only"
            placeholder="ФИО"
            value={formatFullName()}
            readOnly
          />
        </div>
        <div className="user-form">
            <p className='user-form-title'>Статус</p>
            <div className="user-control">
              <p className={`user-form-status ${getStatusClass(latestInternship ? latestInternship.status : 'Не указано')}`}>
                {latestInternship ? latestInternship.status : 'Не указано'}
              </p>
            </div>
          </div>
        <div className="user-form">
          <p className='user-form-title'>Логин</p>
          <input 
            type="text"
            className="user-form-control"
            placeholder="Логин"
            value={formValues.login}
            onChange={handleInputChange}
            name="login"
            required
          />
        </div>
        <div className="user-form">
          <p className='user-form-title'>Пароль</p>
          <div className="edit-profile-button">
            <EditPasswordButton />
          </div>
        </div>
        <div className="user-form">
          <p className='user-form-title'>Стадия</p>
          <input 
            type="text"
            className="user-form-control read-only"
            placeholder="Стадия"
            value={getStatusText()}
            readOnly
          />
        </div>
        <div className="user-form">
          <p className='user-form-title'>Дата начала</p>
          <input 
            type="date"
            className="user-form-control read-only"
            value={latestInternship ? latestInternship.start_date : ''}
            readOnly
          />
        </div>
        <div className="user-form"> 
          <p className='user-form-title'>Дата окончания</p>
          <input 
            type="date"
            className="user-form-control read-only"
            value={latestInternship ? latestInternship.end_date : ''}
            readOnly
          />
        </div>
        <div className="user-form">
          <p className='user-form-title'>Телефон, Telegram</p>
          {phoneError && <p className="phone-error-message">{phoneError}</p>}
          <input 
            type="text"
            className="user-form-control"
            placeholder="Телефон"
            value={formValues.contact}
            onChange={handleInputChange}
            name="contact"
            required
          />
        </div>
        <div className="user-form">
          <p className='user-form-title'>Профиль</p>
          <input 
            type="text"
            className="user-form-control read-only"
            placeholder="Профиль"
            value={profile.direction}
            readOnly
          />
        </div>
        <div className="user-form">
          <p className='user-form-title'>Компетенции</p>
          <textarea 
            className="user-form-control read-only wide"
            placeholder="Компетенции"
            value={formValues.competencies}
            readOnly
          />
        </div>
        <div className="user-form">
          <p className='user-form-title'>Образование</p>
          <input 
            type="text"
            className="user-form-control"
            placeholder="Образование"
            value={formValues.studyGroup}
            onChange={handleInputChange}
            name="studyGroup"
            required
          />
        </div>
        <div className="user-form">
          <p className='user-form-title'>Портфолио</p>
          <textarea 
            className="user-form-control read-only wide"
            placeholder="Портфолио"
            value={profile.portfolio}
            readOnly
          />
        </div>
        <div className="user-form">
          <p className='user-form-title'>Вектор развития</p>
          <textarea 
            className="user-form-control read-only wide"
            placeholder="Вектор развития"
            value={profile.plans}
            readOnly
          />
        </div>
        <div className="user-form">
          <p className='user-form-title'>Проект</p>
          <textarea 
            className="user-form-control read-only wide"
            placeholder="Проект"
            value={formValues.projects}
            readOnly
          />
        </div>
        <div className="user-form">
          <p className='user-form-title'>Текущее задание</p>
          <textarea 
            className="user-form-control read-only wide"
            placeholder="Текущее задание"
            value={formValues.tasks}
            readOnly
          />
        </div>
        <div className="user-form">
          <p className='user-form-title'>Комментарий</p>
          <textarea 
            className="user-form-control read-only wide"
            placeholder="Комментарий"
            value={profile.note}
            readOnly
          />
        </div>

        {!isPracticeStatus && (
          <>
            <div className="user-form">
              <p className='user-form-title'>ИНН</p>
              <input 
                type="text"
                className="user-form-control"
                placeholder="ИНН"
                value={formValues.inn}
                onChange={handleInputChange}
                name="inn"
                required
              />
            </div>
            <div className="user-form">
              <p className='user-form-title'>СНИЛС</p>
              <input 
                type="text"
                className="user-form-control"
                placeholder="СНИЛС"
                value={formValues.snils}
                onChange={handleInputChange}
                name="snils"
                required
              />
            </div>
            <div className="user-form">
              <p className='user-form-title'>Дата рождения</p>
              <input 
                type="date"
                className="user-form-control"
                value={formValues.birthday}
                onChange={handleInputChange}
                name='birthday'
                required
              />
            </div>
            <div className="user-form">
              <p className='user-form-title'>Паспортные данные</p>
              <textarea 
                className="user-form-control wide"
                placeholder="Паспортные данные"
                value={formValues.passportData}
                onChange={handleInputChange}
                name="passportData"
                required
              />
            </div>
            <div className="user-form">
              <p className='user-form-title'>Адрес регистрации</p>
              <textarea 
                className="user-form-control wide"
                placeholder="Адрес регистрации"
                value={formValues.registrationAddress}
                name='registrationAddress'
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="user-form">
              <p className='user-form-title'>Адрес проживания</p>
              <textarea 
                className="user-form-control wide"
                placeholder="Адрес проживания"
                value={formValues.livingAddress}
                name='livingAddress'
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="user-form">
              <p className='user-form-title'>Почта</p>
              <input 
                type="email"
                className="user-form-control"
                placeholder="Почта"
                value={formValues.email}
                name='email'
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="user-form">
              <p className='user-form-title'>Реквизиты</p>
              <textarea 
                className="user-form-control wide"
                placeholder="Реквизиты"
                value={formValues.requisites}
                name='requisites'
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="user-form">
              <p className='user-form-title'>Справка НПД</p>
              <textarea 
                className="user-form-control wide"
                placeholder="Справка НПД"
                value={formValues.npdReference}
                name='npdReference'
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        )}
      </div>
    </div>
    {snackbarType && (
        <Snackbar type={snackbarType} onClose={closeSnackbar} />
      )}
  </div>
  );
};

export default SpecialistForm;