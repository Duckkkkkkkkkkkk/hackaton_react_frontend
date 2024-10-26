import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, updateOrganization } from '../../api/profile/ProfileApi';
import { UserProfile, OrganizationUpdate, ContactPerson, UserProfileUpdate } from '../../api/profile/interfaces/dto.profile';
import './styles/ProfileForm.css';
import SaveButton from '../SaveButton/SaveButton';
import EditPasswordButton from '../EditPasswordButton/EditPasswordButton';
import Snackbar, { SnackbarType } from '../Snackbar/Snackbar';

const CustomerForm: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [organization, setOrganization] = useState<OrganizationUpdate | null>(null);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfileUpdate>>({});
  const [editedOrganization, setEditedOrganization] = useState<Partial<OrganizationUpdate>>({});
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);
  const [originalOrganization, setOriginalOrganization] = useState<OrganizationUpdate | null>(null);
  const [snackbarType, setSnackbarType] = useState<SnackbarType | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
        setOriginalProfile(profileData);
        
        if (profileData?.organization) {
          setOrganization(profileData.organization);
          setOriginalOrganization(profileData.organization);
        }
  
        if (profileData) {
          setEditedProfile({
            login: profileData.login,
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
  
    fetchProfile();
  }, []);  

  useEffect(() => {
    if (organization) {
      setEditedOrganization({
        id: organization.id,
        title: organization.title,
        ogrn: organization.ogrn,
        inn: organization.inn,
        kpp: organization.kpp,
        okpo: organization.okpo,
        legal_address: organization.legal_address,
        actual_address: organization.actual_address,
        bank_requisites: organization.bank_requisites,
        contact_data: organization.contact_data,
        executive_office: organization.executive_office,
      });
    }
  }, [organization]);

  // const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   setFullName(e.target.value);
  // };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleOrganizationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedOrganization(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const updatedProfileFields: Partial<UserProfileUpdate> = {};
    const updatedOrganizationFields: Partial<OrganizationUpdate> = {};
    
    if (originalProfile?.login !== editedProfile.login) {
      updatedProfileFields.login = editedProfile.login;
    }
    
    if (editedOrganization.title !== originalOrganization?.title) {
      updatedOrganizationFields.title = editedOrganization.title;
    }
    if (editedOrganization.ogrn !== originalOrganization?.ogrn) {
      updatedOrganizationFields.ogrn = editedOrganization.ogrn;
    }
    if (editedOrganization.inn !== originalOrganization?.inn) {
      updatedOrganizationFields.inn = editedOrganization.inn;
    }
    if (editedOrganization.kpp !== originalOrganization?.kpp) {
      updatedOrganizationFields.kpp = editedOrganization.kpp;
    }
    if (editedOrganization.okpo !== originalOrganization?.okpo) {
      updatedOrganizationFields.okpo = editedOrganization.okpo;
    }
    if (editedOrganization.legal_address !== originalOrganization?.legal_address) {
      updatedOrganizationFields.legal_address = editedOrganization.legal_address;
    }
    if (editedOrganization.actual_address !== originalOrganization?.actual_address) {
      updatedOrganizationFields.actual_address = editedOrganization.actual_address;
    }
    if (editedOrganization.bank_requisites !== originalOrganization?.bank_requisites) {
      updatedOrganizationFields.bank_requisites = editedOrganization.bank_requisites;
    }
    if (editedOrganization.contact_data !== originalOrganization?.contact_data) {
      updatedOrganizationFields.contact_data = editedOrganization.contact_data;
    }
    if (editedOrganization.executive_office !== originalOrganization?.executive_office) {
      updatedOrganizationFields.executive_office = editedOrganization.executive_office;
    }
  
    try {
      if (Object.keys(updatedProfileFields).length > 0) {
        const updatedProfile = await updateUserProfile(updatedProfileFields);
        if (updatedProfile) {
          setProfile(updatedProfile);
          setOriginalProfile(updatedProfile);
        }
      }
  
      if (Object.keys(updatedOrganizationFields).length > 0 && organization?.id) {
        const updatedOrganization = await updateOrganization(organization.id, updatedOrganizationFields);
        if (updatedOrganization) {
          setOrganization(updatedOrganization);
          setOriginalOrganization(updatedOrganization);
        }
      }
      setSnackbarType('successChange');
    } catch (error) {
      console.error('Ошибка при обновлении данных', error);
      setSnackbarType('errorSendingData');
    }
  };  
  
  const handleCloseSnackbar = () => {
    setSnackbarType(null);
  };

  if (!profile) {
    return <div>Загрузка...</div>;
  }

  return (
  <div className="forma">
    <div className="profile-header">
      <h1 className='profile-title'>Личный кабинет</h1>
      <SaveButton onSave={handleSave} />
    </div>
    <div className="user-profile">
      <div className="user-form-group">
        <div className="user-form">
          <p className='user-form-title'>Наименование</p>
          <input 
            type="text"
            className="user-form-control read-only"
            placeholder="Наименование"
            value={organization?.title || ''}
            readOnly
          />
        </div>
        <div className="user-form">
          <p className='user-form-title'>Логин</p>
          <input 
            type="text"
            className="user-form-control"
            placeholder="Логин"
            name="login"
            value={editedProfile.login || ''}
            onChange={handleProfileChange}
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
          <p className='user-form-title'>Юр. адрес</p>
          <textarea 
            className="user-form-control wide"
            placeholder="Юр. адрес"
            value={editedOrganization.legal_address || ''}
            name="legal_address"
            onChange={handleOrganizationChange}
            required
          />
        </div>
        <div className="user-form">
          <p className='user-form-title'>Физ. адрес</p>
          <textarea 
            className="user-form-control wide"
            placeholder="Физ. адрес"
            value={editedOrganization.actual_address || ''}
            name="actual_address"
            onChange={handleOrganizationChange}
            required
          />
        </div>
        <div className="user-form">
          <p className='user-form-title'>ИНН</p>
          <input 
            type="text"
            className="user-form-control"
            placeholder="ИНН"
            value={editedOrganization.inn || ''}
            name="inn"
            onChange={handleOrganizationChange}
            required
          />
        </div>
        <div className="user-form">
          <p className='user-form-title'>ОГРН</p>
          <textarea 
            className="user-form-control wide"
            placeholder="ОГРН"
            value={editedOrganization.ogrn || ''}
            name="ogrn"
            onChange={handleOrganizationChange}
            required
          />
        </div>
        <div className="user-form">
          <p className='user-form-title'>ОКПО</p>
          <textarea 
            className="user-form-control wide"
            placeholder="ОКПО"
            value={editedOrganization.okpo || ''}
            name="okpo"
            onChange={handleOrganizationChange}
            required
          />
        </div>
        <div className="user-form">
          <p className='user-form-title'>Банковские реквизиты</p>
          <textarea 
            className="user-form-control wide"
            placeholder="Банковские реквизиты"
            value={editedOrganization.bank_requisites || ''}
            name="bank_requisites"
            onChange={handleOrganizationChange}
            required
          />
        </div>
        <div className="user-form">
          <p className='user-form-title'>Контакты</p>
          <textarea 
            className="user-form-control wide"
            placeholder="Контакты"
            value={editedOrganization.contact_data || ''}
            name="contact_data"
            onChange={handleOrganizationChange}
            required
          />
        </div>
        <div className="user-form">
          <p className='user-form-title'>Контактное лицо</p>
          <textarea 
            className="user-form-control read-only wide"
            placeholder="Контактное лицо"
            value={`${profile.lastName || ''} ${profile.firstName || ''} ${profile.middleName || ''}`}
            readOnly
          />
        </div>
        <div className="user-form">
          <p className='user-form-title'>Исполнительный орган</p>
          <textarea 
            className="user-form-control wide"
            placeholder="Исполнительный орган"
            value={editedOrganization.executive_office || ''}
            name="executive_office"
            onChange={handleOrganizationChange}
            required
          />
        </div>
      </div>
    </div>
    {snackbarType && (
        <Snackbar
          type={snackbarType}
          onClose={handleCloseSnackbar}
        />
      )}
  </div>
  );
};

export default CustomerForm;
