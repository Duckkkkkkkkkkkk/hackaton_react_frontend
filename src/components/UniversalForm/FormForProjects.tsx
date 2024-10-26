import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask-next";
import { Projects, fetchUsers } from "../../api/projects/ProjectsApi";
// import { fetchProjectTitles } from "../../api/projectTasks/TaskApi";
import "../UniversalForm/UniversalForm.css";
import icon_check from "../../images/icons/icon_check.svg";
import icon_select from "../../images/icons/icon_down_form.svg";
import StatusManager from "../StatusManager/StatusManager";
import {
  User,
  fetchProject,
} from "../../api/user/userApi";

import "./UniversalForm.css"

interface FormForProjectsProps {
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

const FormForProjects: React.FC<FormForProjectsProps> = ({
  item,
  onSubmit,
  fields,
}) => {
  const [formState, setFormState] = useState<any>({});
  const [projectTitles, setProjectTitles] = useState<string[]>([]);
  const [filteredProjectTitles, setFilteredProjectTitles] = useState<string[]>(
    []
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const userRole = localStorage.getItem("user_role");
  const isAdmin = userRole === "ADMIN";

  // useEffect(() => {
  //   fetchProjectTitles().then((titles) => {
  //     setProjectTitles(titles);
  //     setFilteredProjectTitles(titles);
  //     console.log(titles);
  //   });
  // }, []);

  useEffect(() => {
    fetchUsers().then((fetchedUsers) => setUsers(fetchedUsers));
  }, []);

  useEffect(() => {
    if (item) {
      const initialState = { ...item };
      fields.forEach((field) => {
        if (field.name === "users" && Array.isArray(initialState[field.name])) {
          const selectedUserObjects = initialState[field.name];
          setSelectedUsers(selectedUserObjects);
          initialState[field.name] = selectedUserObjects
            .map((user: any) => user.lastName)
            .join(", ");
        }
        if (field.name.endsWith("_date") && initialState[field.name]) {
          initialState[field.name] = formatDate(initialState[field.name]);
        }
        if (field.name === "project_title" && initialState.project?.title) {
          initialState[field.name] = initialState.project.title;
        }
      });
      setFormState(initialState);
    } else {
      const initialState: any = {};
      fields.forEach((field) => {
        if (field.name === "status") {
          initialState[field.name] = "INTERNSHIP";
        } else if (field.name !== "id") {
          initialState[field.name] = "";
        }
      });
      setFormState(initialState);
    }
  }, [item, fields]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormState((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "project_title") {
      const filteredTitles = value
        ? projectTitles.filter((title) =>
            title.toLowerCase().includes(value.toLowerCase())
          )
        : projectTitles;
      setFilteredProjectTitles(filteredTitles);
      setIsDropdownOpen(true);
    }
  };

  const handleStatusChange = (newStatus: {
    value: string;
    label: string;
    color: string;
  }) => {
    setFormState((prevState: any) => ({
      ...prevState,
      status: newStatus.value,
    }));
  };

  const toggleUserSelection = (user: User) => {
    setSelectedUsers((prevSelected) => {
      const isAlreadySelected = prevSelected.find((u) => u.id === user.id);
      if (isAlreadySelected) {
        return prevSelected.filter((u) => u.id !== user.id);
      } else {
        return [...prevSelected, user];
      }
    });
  };

  const selectedUserNames = selectedUsers.map((user) => `${user.lastName} ${user.firstName}`).join(", ");

  const handleUserDropdownClick = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleProjectSelect = (title: string) => {
    setFormState((prevState: any) => ({
      ...prevState,
      project_title: title,
    }));
    setFilteredProjectTitles([]);
    setIsDropdownOpen(false);
  };

  const handleIconClick = () => {
    if (filteredProjectTitles.length === 0) {
      setFilteredProjectTitles(projectTitles);
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const preparedData: any = { ...formState };

    Object.keys(preparedData).forEach((key) => {
      if (key.endsWith("_date")) {
        if (preparedData[key]) {
          preparedData[key] = parseDate(preparedData[key]);
        } else {
          delete preparedData[key];
        }
      }
    });
    preparedData.users = selectedUsers.map(user => user.id);
    console.log("Подготовленные данные для отправки:", preparedData);
    onSubmit(preparedData);
  };

  const isFieldEditable = (fieldName: string) => {
    const url = new URL(window.location.href);
    const pathname = url.pathname;
    const searchParams = new URLSearchParams(url.search);

    const isProjectViewPage = pathname.includes("/project_view");
    const isTaskTablePage = pathname.includes("/tasks");
    const isEditMode = searchParams.get("edit") === "true";

    if (isProjectViewPage) {
      if (userRole === "SPECIALIST") {
        return fieldName === "comment";
      } else if (userRole === "CUSTOMER") {
        return ["description", "technical_task", "comment"].includes(fieldName);
      }
    }
    if (isTaskTablePage) {
      if (userRole === "CUSTOMER") {
        if (isEditMode) {
          return ["title", "comment"].includes(fieldName);
        }
      }
    }
    return true;
  };

  const [projects, setProjects] = useState<Projects[]>([]);
  const [showUserList, setShowUserList] = useState(false);

  useEffect(() => {
    if (userRole === "ADMIN") {
      fetchUsers().then((fetchedUsers) => {
        setUsers(fetchedUsers);
      });
    }
  }, []);

  // useEffect(() => {
  //   fetchProject().then((fetchedUsers) => {
  //     setProjects(fetchedUsers);
  //   });
  // }, []);

  const isEditMode = () => {
    return !!item;
  };
  return (
    <div className="universal-form">
      <form
        onSubmit={handleSubmit}
        className={
          userRole === "CUSTOMER" && window.location.pathname === "/project_view" && isEditMode()
            ? "form-task-row"
            : isEditMode()
            ? "form-row"
            : "form-column"
        }
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
                ) : field.type === "text" && field.name === "users" ? (
                  <div className="project-name-container">
                    <input
                      type="text"
                      name={field.name}
                      placeholder="Выберите пользователей"
                      value={selectedUserNames}
                      onChange={handleChange}
                      required={field.required || false}
                      onClick={handleUserDropdownClick}
                      disabled={!isFieldEditable(field.name)}
                      className={
                        !isFieldEditable(field.name) ? "non-editable" : ""
                      }
                    />
                    <img
                      src={icon_select}
                      alt="select"
                      className="icon-select"
                      onClick={handleUserDropdownClick}
                    />
                    {isUserDropdownOpen && (
                      <ul className="user-dropdown">
                        {users.map((user) => (
                          <li key={user.id} className="user-item">
                            <label>
                              <input
                                type="checkbox"
                                checked={selectedUsers.some((u) => u.id === user.id)}
                                onChange={() => toggleUserSelection(user)}
                                className="user-checkbox"
                              />
                              {user.lastName} {user.firstName}
                            </label>
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
      </form>
    </div>
  );
};

export default FormForProjects;