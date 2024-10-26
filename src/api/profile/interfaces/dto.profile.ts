export interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    login: string;
    direction: string;
    position: string;
    phone: string;
    telegram: string;
    email: string;
    role: string;
    status: string;
    study_group: string;
    plans: string;
    about: string;
    portfolio: string;
    note: string;
    inn: string;
    snils: string;
    birthday: string;
    passport_data: string;
    registration_address: string;
    living_address: string;
    requisites: string;
    npd_reference: string;
    internships: Internship[];
    competencies: { id: number; text: string }[];
    tasks: Task[];
    projects: Project[];
    organization: Organization;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    is_done: boolean;
    project_id: number;
    comment?: string;
    reviewer_id?: number;
    executor_id: number;
    status: string;
    hours: number;
}

export interface Project {
    id: number;
    title: string;
}

export interface Internship {
    id: string;
    status: string;
    start_date: string;
    end_date: string;
}

export interface UserProfileUpdate {
    [key: string]: any;
    firstName?: string;
    lastName?: string;
    middleName?: string;
    login?: string;
    position?: string;
    email?: string;
    competencies?: string;
    phone?: string;
    telegram?: string;
    study_group?: string;
    inn?: string;
    snils?: string;
    birthday?: string;
    passport_data?: string;
    registration_address?: string;
    living_address?: string;
    requisites?: string;
    npd_reference?: string;
    organization?: Organization;
}

export interface ContactPerson {
    firstName?: string | null;
    lastName?: string | null;
    middleName?: string | null;
}  

export interface Organization {
    id: number;
    title: string;
    legal_address: string;
    actual_address: string;
    inn: string;
    kpp: string;
    ogrn: string;
    okpo: string;
    bank_requisites: string;
    executive_office: string;
    contact_data: string;
    contact_person: ContactPerson;
}
  
export interface OrganizationUpdate {
    id: number;
    title?: string;
    ogrn?: string;
    inn?: string;
    kpp?: string;
    okpo?: string;
    legal_address?: string;
    actual_address?: string;
    bank_requisites?: string;
    contact_data?: string;
    executive_office?: string;
    contact_person?: ContactPerson;
}

  