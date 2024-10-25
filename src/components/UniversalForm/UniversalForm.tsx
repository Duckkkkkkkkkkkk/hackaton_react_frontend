import React, { useState, useEffect } from "react";
// import InputMask from "react-input-mask-next";
// import { Project, fetchUsers } from "../../api/projectTasks/api";
// import { fetchProjectTitles } from "../../api/projectTasks/TaskApi";
// import "./UniversalForm.css";
// import icon_check from "../../images/icons/icon_check.svg";
// import icon_select from "../../images/icons/icon_down_form.svg";
// import StatusManager from "../StatusManager/StatusManager";
// import {
//   Competencies,
//   Competency,
//   User,
//   fetchCompetency,
//   fetchProject,
// } from "../../api/userTasks/userApi";
// import { Organization, fetchOrganization } from "../../api/customersTasks/api";

interface UniversalFormProps {
  item: any | null;
  onSubmit: (item: any) => void;
  fields: {
    name: string;
    label?: string;
    placeholder: string;
    type: string;
    required?: boolean;
    options?: { value: string; label: string; color?: string }[];
  }[];
}

const parseDate = (dateString: string): string => {
  const [day, month, year] = dateString
    .split("-")
    .map((num) => parseInt(num, 10));
  if (!day || !month || !year) return "";

  const date = new Date(year, month - 1, day);
  return date.toISOString();
};

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const UniversalForm: React.FC<UniversalFormProps> = ({
  item,
  onSubmit,
  fields,
}) => {
  // const [formState, setFormState] = useState<any>({});
  // const [projectTitles, setProjectTitles] = useState<string[]>([]);
  // const [filteredProjectTitles, setFilteredProjectTitles] = useState<string[]>(
  //   []
  // );
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  // const userRole = localStorage.getItem("user_role");
  // const isAdmin = userRole === "ADMIN";

  // useEffect(() => {
  //   fetchProjectTitles().then((titles) => {
  //     setProjectTitles(titles);
  //     setFilteredProjectTitles(titles);
  //     console.log(titles);
  //   });
  // }, []);

  // useEffect(() => {
  //   if (item) {
  //     const initialState = { ...item };
  //     fields.forEach((field) => {
  //       if (field.name === "users" && Array.isArray(initialState[field.name])) {
  //         const selectedUserObjects = initialState[field.name];
  //         setSelectedUsers(selectedUserObjects);
  //         initialState[field.name] = selectedUserObjects
  //           .map((user: any) => user.lastName)
  //           .join(", ");
  //       }
  //       if (field.name.endsWith("_date") && initialState[field.name]) {
  //         initialState[field.name] = formatDate(initialState[field.name]);
  //       }
  //       if (field.name === "project_title" && initialState.project?.title) {
  //         initialState[field.name] = initialState.project.title;
  //       }
  //       if (field.name === "text" && initialState[field.name]) {
  //         setSelectedCompetencies(
  //           initialState[field.name].split(", ").filter(Boolean)
  //         );
  //       }
  //       if (field.name === "contact_person") {
  //         if (
  //           field.placeholder === "Контактноелицо2" &&
  //           initialState[field.name]
  //         ) {
  //           const contactPerson = initialState[field.name];
  //           if (contactPerson && contactPerson.id) {
  //             setSelectedContactPerson(contactPerson);
  //             initialState[field.name] = contactPerson.lastName;
  //             console.log("контактное лицо:", contactPerson);
  //           } else {
  //             console.log("не получилось", initialState[field.name]);
  //           }
  //         }
  //       }
  //       if (field.name === "organization") {
  //         if (field.placeholder === "Организация" && initialState[field.name]) {
  //           const organization = initialState[field.name];
  //           if (organization) {
  //             setSelectedOrganization(organization);
  //             initialState[field.name] = organization.title;
  //             initialState.organization_input = organization.title;

  //             console.log("Организация:", organization);
  //           } else {
  //             console.log(
  //               "Не удалось загрузить организацию",
  //               initialState[field.name]
  //             );
  //           }
  //         }
  //       }
  //     });

  //     setFormState(initialState);
  //   }
  // }, [item, fields]);

  // const handleChange = (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  //   >
  // ) => {
  //   const { name, value } = e.target;
  //   setFormState((prevState: any) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));

  //   if (name === "project_title") {
  //     const filteredTitles = value
  //       ? projectTitles.filter((title) =>
  //           title.toLowerCase().includes(value.toLowerCase())
  //         )
  //       : projectTitles;
  //     setFilteredProjectTitles(filteredTitles);
  //     setIsDropdownOpen(true);
  //   }
  // };

  // const handleStatusChange = (newStatus: {
  //   value: string;
  //   label: string;
  //   color: string;
  // }) => {
  //   setFormState((prevState: any) => ({
  //     ...prevState,
  //     status: newStatus.value,
  //   }));
  // };

  // const handleProjectSelect = (title: string) => {
  //   setFormState((prevState: any) => ({
  //     ...prevState,
  //     project_title: title,
  //   }));
  //   setFilteredProjectTitles([]);
  //   setIsDropdownOpen(false);
  // };

  // const handleIconClick = () => {
  //   if (filteredProjectTitles.length === 0) {
  //     setFilteredProjectTitles(projectTitles);
  //   }
  //   setIsDropdownOpen(!isDropdownOpen);
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const preparedData: any = { ...formState };

  //   Object.keys(preparedData).forEach((key) => {
  //     if (key.endsWith("_date")) {
  //       if (preparedData[key]) {
  //         preparedData[key] = parseDate(preparedData[key]);
  //       } else {
  //         delete preparedData[key];
  //       }
  //     }
  //   });

  //   console.log("Выбранные компетенции перед отправкой:", selectedCompetencies);
  //   preparedData.text = selectedCompetencies.join(", ");
  //   preparedData.users = selectedUsers.map((user) => user.id);
  //   if (preparedData.contact_person && selectedContactPerson) {
  //     const contactField = fields.find(
  //       (field) => field.name === "contact_person"
  //     );
  //     if (contactField?.placeholder === "Контактноелицо2") {
  //       preparedData.contact_person = selectedContactPerson.id || null;
  //     } else if (contactField?.placeholder === "Контактное лицо") {
  //       preparedData.contact_person = formState.contact_person;
  //     }
  //   }

  //   if (preparedData.organization && selectedOrganization) {
  //     const organizationField = fields.find(
  //       (field) => field.name === "organization"
  //     );
  //     if (organizationField?.placeholder === "Организация") {
  //       preparedData.organization = selectedOrganization.id || null;
  //     }
  //   }
  //   console.log("Подготовленные данные для отправки:");
  //   console.log(preparedData);
  //   onSubmit(preparedData);
  // };

  // const isFieldEditable = (fieldName: string) => {
  //   const url = new URL(window.location.href);
  //   const pathname = url.pathname;
  //   const searchParams = new URLSearchParams(url.search);

  //   const isProjectViewPage = pathname.includes("/project_view");
  //   const isTaskTablePage = pathname.includes("/tasks");
  //   const isEditMode = searchParams.get("edit") === "true";

  //   if (isProjectViewPage) {
  //     if (userRole === "SPECIALIST") {
  //       return fieldName === "comment";
  //     } else if (userRole === "CUSTOMER") {
  //       return ["description", "technical_task", "comment"].includes(fieldName);
  //     }
  //   }
  //   if (isTaskTablePage) {
  //     if (userRole === "CUSTOMER") {
  //       if (isEditMode) {
  //         return ["title", "comment"].includes(fieldName);
  //       }
  //     }
  //   }
  //   return true;
  // };

  // const [users, setUsers] = useState<User[]>([]);
  // const [projects, setProjects] = useState<Project[]>([]);
  // const [organization, setOrganization] = useState<Organization[]>([]);
  // const [showUserList, setShowUserList] = useState(false);

  // useEffect(() => {
  //   if (userRole === "ADMIN") {
  //     fetchUsers().then((fetchedUsers) => {
  //       setUsers(fetchedUsers);
  //     });
  //   }
  // }, []);
  // useEffect(() => {
  //   if (userRole === "ADMIN") {
  //     fetchOrganization().then((fetchedUsers) => {
  //       setOrganization(fetchedUsers);
  //     });
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchProject().then((fetchedUsers) => {
  //     setProjects(fetchedUsers);
  //   });
  // }, []);
  // const removeUser = (userId: number) => {
  //   setSelectedUsers((prevUsers) =>
  //     prevUsers.filter((user) => user.id !== userId)
  //   );

  //   setFormState((prevState: any) => {
  //     const currentUsers = Array.isArray(prevState.users)
  //       ? prevState.users
  //       : [];

  //     return {
  //       ...prevState,
  //       users: currentUsers.filter((id: number) => id !== userId),
  //     };
  //   });
  // };

  // const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const userId = e.target.value;
  //   const selectedUser = users.find((user) => user.id === parseInt(userId, 10));
  //   if (selectedUser) {
  //     setSelectedUsers((prevUsers) => [...prevUsers, selectedUser]);
  //     setFormState((prevState: { users: string[] }) => {
  //       const currentUserIds = selectedUsers.map((user) => user.id);
  //       return {
  //         ...prevState,
  //         users: [...currentUserIds, selectedUser.id],
  //         user_input: "",
  //       };
  //     });
  //   }
  //   setShowUserList(false);
  // };

  // const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const input = e.target.value;
  //   setFormState((prevState: any) => ({
  //     ...prevState,
  //     user_input: input,
  //   }));

  //   const matchedUsers = users.filter((user) =>
  //     user.lastName?.toLowerCase().includes(input.toLowerCase())
  //   );

  //   setShowUserList(matchedUsers.length > 0);
  // };

  // const [competencies, setCompetencies] = useState<string[]>([]);
  // const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>(
  //   []
  // );
  // const [competencyInput, setCompetencyInput] = useState<string>("");
  // const [showCompetencyList, setShowCompetencyList] = useState<boolean>(false);
  // useEffect(() => {
  //   if (item) {
  //     const initialState = { ...item };

  //     fields.forEach((field) => {
  //       if (field.name === "text" && initialState.competencies) {
  //         const existingCompetencies = initialState.competencies.map(
  //           (competency: any) => competency.text
  //         );

  //         setSelectedCompetencies((prev) => {
  //           const allCompetencies = [...prev, ...existingCompetencies];
  //           return Array.from(new Set(allCompetencies));
  //         });
  //       }
  //     });
  //     setFormState(initialState);
  //   }
  // }, [item, fields]);

  // useEffect(() => {
  //   fetchCompetency().then((fetchedCompetencies: Competencies[]) => {
  //     const competencyNames = fetchedCompetencies
  //       .map((competency) => competency.text)
  //       .filter((name): name is string => !!name);
  //     setCompetencies(competencyNames);
  //   });
  // }, []);

  // const handleCompetencyInputChange = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const input = e.target.value;
  //   setCompetencyInput(input);

  //   const matchedCompetencies = competencies.filter((competency) =>
  //     competency.toLowerCase().includes(input.toLowerCase())
  //   );

  //   if (
  //     input &&
  //     !selectedCompetencies.includes(input) &&
  //     !competencies.includes(input)
  //   ) {
  //     setCompetencies((prev) => [...prev, input]);
  //   }

  //   const newMatchedCompetencies = [...matchedCompetencies, input];
  //   setShowCompetencyList(newMatchedCompetencies.length > 0);
  // };

  // const handleCompetencySelect = (competency: string) => {
  //   if (!selectedCompetencies.includes(competency)) {
  //     setSelectedCompetencies((prev) => [...prev, competency]);
  //   }
  //   setCompetencyInput("");
  //   setShowCompetencyList(false);
  // };

  // const removeCompetency = (competency: string) => {
  //   setSelectedCompetencies((prevCompetencies) =>
  //     prevCompetencies.filter((selected) => selected !== competency)
  //   );

  //   setFormState((prevState: any) => {
  //     const currentCompetencies = Array.isArray(prevState.text)
  //       ? prevState.text.split(", ").filter(Boolean)
  //       : [];

  //     return {
  //       ...prevState,
  //       text: currentCompetencies
  //         .filter((comp: string) => comp !== competency)
  //         .join(", "),
  //     };
  //   });
  // };
  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault();
  //     if (competencyInput) {
  //       handleCompetencySelect(competencyInput);
  //     }
  //   }
  // };

  // const [selectedContactPerson, setSelectedContactPerson] =
  //   useState<User | null>(null);
  // const [showContactPersonList, setShowContactPersonList] = useState(false);
  // const handleContactPersonChange = (userId: number) => {
  //   const selectedUser = users.find((user) => user.id === userId);
  //   if (selectedUser) {
  //     setSelectedContactPerson(selectedUser);
  //     setFormState((prevState: any) => ({
  //       ...prevState,
  //       contact_person: selectedUser.id,
  //       contact_person_input: "",
  //     }));
  //   }
  //   setShowContactPersonList(false);
  // };

  // const [selectedOrganization, setSelectedOrganization] =
  //   useState<Organization | null>(null);
  // const [showOrganizationList, setShowOrganizationList] = useState(false);
  // const handleOrganizationChange = (organizationId: number) => {
  //   const selectedOrganization = organization.find(
  //     (organization) => organization.id === organizationId
  //   );
  //   if (selectedOrganization) {
  //     setSelectedOrganization(selectedOrganization);
  //     setFormState((prevState: any) => ({
  //       ...prevState,
  //       organization: selectedOrganization.id,
  //       organization_input: "",
  //     }));
  //   }
  //   setShowOrganizationList(false);
  // };


  // const isEditMode = () => {
  //   return !!item;
  // };
  return (
    <div className="universal-form">
      {/* <form
        onSubmit={handleSubmit}
        className={isEditMode() ? "form-row" : "form-column"}
      >
        <div className="form_content">
          {fields
            .filter((field) => field.name !== "id")
            .map((field) => (
              <div key={field.name} className="form_group">
                <label>{field.label}</label>
                {field.type === "select" && field.name === "status" ? (
                  <StatusManager
                    status={formState.status || ""}
                    onStatusChange={handleStatusChange}
                    disabled={!isFieldEditable(field.name)}
                  />
                ) : field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formState[field.name] || ""}
                    onChange={handleChange}
                    disabled={!isFieldEditable(field.name)}
                    className={
                      !isFieldEditable(field.name) ? "non-editable" : ""
                    }
                  >
                    <option value="">{field.placeholder}</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.name === "users" ? (
                  <div className="user-input">
                    <div className="custom-menu-container">
                      <input
                        value={formState.user_input || ""}
                        onChange={handleUserInputChange}
                        placeholder="Введите фамилию участника"
                        className="contact_person_input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowUserList(!showUserList)}
                        className="user-select-button"
                      >
                        <img
                          src={icon_select}
                          alt="Выбор участника"
                          width="15px"
                        />
                      </button>
                      {showUserList && (
                        <ul className="custom-list-dropdown">
                          {users
                            .filter(
                              (user) =>
                                user.lastName &&
                                user.lastName
                                  .toLowerCase()
                                  .includes(
                                    formState.user_input?.toLowerCase() || ""
                                  )
                            )
                            .map((user) => (
                              <li
                                key={user.id}
                                onClick={() =>
                                  handleUserChange({
                                    target: { value: user.id.toString() },
                                  } as any)
                                }
                              >
                                {user.lastName}
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                    {selectedUsers.length > 0 && (
                      <div className="selected-list">
                        {selectedUsers.map((user) => (
                          <span key={user.id} className="selected-list_span">
                            {user.lastName}
                            <button onClick={() => removeUser(user.id)}>
                              &nbsp; ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : field.name === "contact_person" &&
                  field.placeholder === "Контактноелицо2" ? (
                  <div className="user-input">
                    <div className="custom-menu-container">
                      <input
                        className="contact_person_input"
                        value={formState.contact_person_input || ""}
                        onChange={(e) => {
                          setFormState({
                            ...formState,
                            contact_person_input: e.target.value,
                          });
                          setShowContactPersonList(true);
                        }}
                        onFocus={() => {
                          setShowContactPersonList(true);
                        }}
                        placeholder="Введите фамилию контактного лица"
                        disabled={!isFieldEditable(field.name)}
                      />
                      <button
                        type="button"
                        className="user-select-button"
                        onClick={() =>
                          setShowContactPersonList(!showContactPersonList)
                        }
                      >
                        <img
                          src={icon_select}
                          alt="Выбор контактного лица"
                          width="15px"
                        />
                      </button>
                      {showContactPersonList && (
                        <ul className="custom-list-dropdown">
                          {users
                            .filter((user) =>
                              user.lastName
                                ?.toLowerCase()
                                .includes(
                                  formState.contact_person_input?.toLowerCase() ||
                                    ""
                                )
                            )
                            .map((user) => (
                              <li
                                key={user.id}
                                onClick={() =>
                                  handleContactPersonChange(user.id)
                                }
                              >
                                {user.lastName}
                              </li>
                            ))}
                        </ul>
                      )}
                      {selectedContactPerson && (
                        <div className="selected-list">
                          <span className="selected-list_span">
                            {selectedContactPerson.lastName}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedContactPerson(null);
                                setFormState((prevState: any) => ({
                                  ...prevState,
                                  contact_person: null,
                                  contact_person_input: "",
                                }));
                              }}
                            >
                              &nbsp; ×
                            </button>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : field.name === "organization" ? (
                  <div className="user-input">
                    <div className="custom-menu-container">
                      <input
                        className="contact_person_input"
                        value={formState.organization_input || ""}
                        onChange={(e) => {
                          setFormState({
                            ...formState,
                            organization_input: e.target.value,
                          });
                          setShowOrganizationList(true);
                        }}
                        onFocus={() => {
                          setShowOrganizationList(true);
                        }}
                        placeholder="Введите фамилию контактного лица"
                        disabled={!isFieldEditable(field.name)}
                      />
                      <button
                        type="button"
                        className="user-select-button"
                        onClick={() =>
                          setShowOrganizationList(!showOrganizationList)
                        }
                      >
                        <img
                          src={icon_select}
                          alt="Выбор контактного лица"
                          width="15px"
                        />
                      </button>
                      {showOrganizationList && (
                        <ul className="custom-list-dropdown">
                          {organization
                            .filter((user) =>
                              user.title
                                ?.toLowerCase()
                                .includes(
                                  formState.organization_input?.toLowerCase() ||
                                    ""
                                )
                            )
                            .map((user) => (
                              <li
                                key={user.id}
                                onClick={() =>
                                  handleOrganizationChange(user.id)
                                }
                              >
                                {user.title}
                              </li>
                            ))}
                        </ul>
                      )}
                      {selectedOrganization && (
                        <div className="selected-list">
                          <span className="selected-list_span">
                            {selectedOrganization.title}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOrganization(null);
                                setFormState((prevState: any) => ({
                                  ...prevState,
                                  organization: null,
                                  organization_input: "",
                                }));
                              }}
                            >
                              &nbsp; ×
                            </button>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : field.name === "text" ? (
                  <div className="competency-input">
                    <div className="custom-menu-container">
                      <input
                        value={competencyInput}
                        onChange={handleCompetencyInputChange}
                        placeholder="Введите название компетенции"
                        className={
                          !isFieldEditable(field.name) ? "non-editable" : ""
                        }
                        onKeyDown={handleKeyDown}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCompetencyList(!showCompetencyList)
                        }
                        className="user-select-button"
                      >
                        <img
                          src={icon_select}
                          alt="Выбор компетенции"
                          width="15px"
                        />
                      </button>
                      {showCompetencyList && (
                        <ul className="custom-list-dropdown">
                          {competencies
                            .filter((competency) =>
                              competency
                                .toLowerCase()
                                .includes(competencyInput.toLowerCase())
                            )
                            .map((competency) => (
                              <li
                                key={competency}
                                onClick={() =>
                                  handleCompetencySelect(competency)
                                }
                              >
                                {competency}
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                    {selectedCompetencies.length > 0 && (
                      <div className="selected-list">
                        {selectedCompetencies.map((competency) => (
                          <span key={competency} className="selected-list_span">
                            {competency}
                            <button
                              onClick={() => removeCompetency(competency)}
                            >
                              &nbsp; ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : field.type === "text" && field.name === "project_title" ? (
                  <div className="project-name-container">
                    <input
                      type="text"
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formState[field.name]}
                      onChange={handleChange}
                      required={field.required || false}
                      disabled={!isFieldEditable(field.name)}
                      className={
                        !isFieldEditable(field.name) ? "non-editable" : ""
                      }
                    />
                    <img
                      src={icon_select}
                      alt="select"
                      className="icon-select"
                      onClick={handleIconClick}
                    />
                    {isDropdownOpen && filteredProjectTitles.length > 0 && (
                      <ul className="project-name-dropdown">
                        {filteredProjectTitles.map((title) => (
                          <li
                            key={title}
                            onClick={() => handleProjectSelect(title)}
                          >
                            {title}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : field.type === "text" && field.name.endsWith("_date") ? (
                  <InputMask
                    mask="99-99-9999"
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formState[field.name] || ""}
                    onChange={handleChange}
                    required={field.required || false}
                    disabled={!isFieldEditable(field.name)}
                    className={
                      !isFieldEditable(field.name) ? "non-editable" : ""
                    }
                  />
                ) : field.type === "text" && field.name === "phone" ? (
                  <InputMask
                    mask="8 (999) 999-99-99"
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formState[field.name] || ""}
                    onChange={handleChange}
                    required={field.required || false}
                    disabled={!isFieldEditable(field.name)}
                    className={
                      !isFieldEditable(field.name) ? "non-editable" : ""
                    }
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formState[field.name] || ""}
                    onChange={handleChange}
                    required={field.required || false}
                    disabled={!isFieldEditable(field.name)}
                    className={
                      !isFieldEditable(field.name) ? "non-editable" : ""
                    }
                  />
                )}
              </div>
            ))}
          {userRole === "CUSTOMER" &&
            window.location.pathname.includes("/edit-project") && (
              <>
                <div className="form_group">
                  <label>Описание</label>
                  <input
                    name="description"
                    placeholder="Описание"
                    value={formState.description || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="form_group">
                  <label>Техническое задание</label>
                  <input
                    name="technical_task"
                    placeholder="Техническое задание"
                    value={formState.technical_task || ""}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
        </div>
        <div className="btnContainer">
          <button className="btnTableAdd" type="submit">
            <img src={icon_check} alt="Сохранить" />
            &nbsp; Сохранить
          </button>
        </div>
      </form> */}
    </div>
  );
};

export default UniversalForm;