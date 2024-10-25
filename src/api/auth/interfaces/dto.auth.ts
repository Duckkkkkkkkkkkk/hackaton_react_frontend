export interface LoginResponse {
    access_token: string;
    id: number;
    firstName: string | null;
    lastName: string | null;
    middleName: string | null;
    role: string;
    login: string;
    email: string;
    phone: string | null;
    telegram: string | null;
    direction: string | null;
    status: string;
    study_group: string | null;
    plans: string | null;
    about: string | null;
    portfolio: string | null;
    note: string | null;
    inn: string | null;
    snils: string | null;
    birthday: string | null;
    passport_data: string | null;
    registration_address: string | null;
    living_address: string | null;
    requisites: string | null;
    npd_reference: string | null;
    competencies: any[];
    internships: any[];
    organization: string | null;
    own_projects: any[];
    projects: any[];
    review_tasks: any[];
    tasks: any[];
  }
  