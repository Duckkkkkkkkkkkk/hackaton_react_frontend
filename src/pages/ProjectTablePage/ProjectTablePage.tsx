import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { fetchProjects, updateProject, Projects, User, createProject, deleteProject} from "../../api/projects/ProjectsApi";
import FieldSelector from "../../components/FieldSelector/FieldSelector";
import FormForProjects from "../../components/UniversalForm/FormForProjects";
import Pagination from "../../components/Pagination/Pagination";
import BreadCrumbs from "../../components/BreadCrumbs/BreadCrumbs";
import Snackbar, { SnackbarType } from "../../components/Snackbar/Snackbar";
import StatusManager from "../../components/StatusManager/StatusManager";

import { BsChevronUp, BsChevronDown } from "react-icons/bs";
import { RiseLoader } from "react-spinners";
import { useLogout } from "../../hooks/useLogout";
import { useDebounce } from "../../hooks/useDebounce";

import icon_search from "../../images/icons/icon_search.svg";
import icons_search_active from "../../images/icons/icon_search_hover.svg";
import icon_tasks from "../../images/icons/icon_tasks.svg";

import "../ProjectTablePage/ProjectTablePage.css";

const ProjectFields = [
  {
    name: "title",
    label: "Наименование проекта",
    placeholder: "Наименование проекта",
    type: "text",
  },
  {
    name: "status",
    label: "Статус",
    placeholder: "Выберите статус",
    type: "select",
    options: [
      { value: "COMPLETED", label: "Завершен" },
      { value: "INPROGRESS", label: "В процессе" },
      { value: "BACKLOG", label: "Бэклог" },
      { value: "CHECK", label: "Проверка" },
      { value: "CANCEL", label: "Отмена" },
    ],
  },
  {
    name: "start_date",
    label: "Дата начала",
    placeholder: "Начало",
    type: "text",
  },
  {
    name: "end_date",
    label: "Дата окончания",
    placeholder: "Конец",
    type: "text",
  },
  {
    name: "users",
    label: "Участники",
    placeholder: "Участники",
    type: "text",
  },
  {
    name: "comment",
    label: "Комментарий",
    placeholder: "Комментарий",
    type: "text",
  },
];

const statusTranslations: { [key: string]: string } = {
  COMPLETED: "Завершен",
  INPROGRESS: "В процессе",
  NOTSTARTED: "Не начато",
  CHECK: "Проверка",
  CANCEL: "Отмена",
};

const statusColors: { [key: string]: string } = {
  COMPLETED: "#8beba0",
  INPROGRESS: "#de8beb",
  NOTSTARTED: "#8bc8eb",
  CHECK: "#ebdc8b",
  CANCEL: "#EB9C8B",
};


const ProjectViewPage: React.FC = () => {
  useLogout();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const [activeSearchIcon, setActiveSearchIcon] = useState(icon_search);

  const [projects, setProjects] = useState<Projects[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [initialProjectData, setInitialProjectData] =
    useState<Partial<Projects> | null>(null);
  const sumPage = 5;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentProject, setCurrentProject] = useState<Projects | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchText, setSearchText] = useState<string>("");
  const [visibleFields, setVisibleFields] = useState<string[]>(
    ProjectFields.map((field) => field.name)
  );
  const [selectedProject, setSelectedProject] = useState<Projects | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [snackbar, setSnackbar] = useState<{
    type: SnackbarType;
    open: boolean;
  }>({ type: "successChange", open: false });

  const debouncedSearchText = useDebounce(searchText);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const userRole = localStorage.getItem("user_role");

  useLogout();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log("Видимые поля:", visibleFields);

        const fetchedProjects = await fetchProjects(
          "ALL",
          debouncedSearchText,
          sortField
            ? sortField + (sortOrder === "desc" ? "_desc" : "")
            : undefined
        );
        setProjects(fetchedProjects);
        console.log("Загруженные проекты:", fetchedProjects);
      } catch (err) {
        console.error("Ошибка при загрузке проектов:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sortField, sortOrder, debouncedSearchText]);

  useEffect(() => {
    if (location.pathname === "/project_view") {
      setSelectedProject(null);
    }
  }, [location]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSort = (fieldName: string) => {
    if (sortField === fieldName) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortField(fieldName);
      setSortOrder("asc");
    }
  };

  const sortedProjects = projects.slice().sort((a, b) => {
    if (sortField) {
      const aValue = a[sortField as keyof Projects] as unknown as string;
      const bValue = b[sortField as keyof Projects] as unknown as string;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
    }
    return 0;
  });

  const lastItem = currentPage * sumPage;
  const firstItem = lastItem - sumPage;
  const currentItems = sortedProjects.slice(firstItem, lastItem);

  const handleRowClick = (project: Projects) => {
    setSelectedProject(project);
    setInitialProjectData(project);
  };

  const handleCheckboxChange = (projectId: number) => {
    setSelectedProjects((prevSelected) =>
      prevSelected.includes(projectId)
        ? prevSelected.filter((id) => id !== projectId)
        : [...prevSelected, projectId]
    );
  };
  
  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedProjects.map(id => deleteProject(id)));
      // setProjects(projects.filter(project => !selectedProjects.includes(project.id)));
      setSelectedProjects([]);
      setSnackbar({ type: 'successChange', open: true });
    } catch (error) {
      console.error('Ошибка при удалении проектов:', error);
      setSnackbar({ type: 'successDelete', open: true });
    }
  };

  const handleCloseForm = () => {
    setSelectedProject(null);
    setInitialProjectData(null);
  };

  const handleSearchClick = () => {
    setSearchQuery(searchText);
    setCurrentPage(1);
  };

  const handleFormSubmit = async (updatedData: Partial<Projects>) => {
    if (selectedProject && selectedProject.id) {
      try {
        const dataToUpdate = {
          ...updatedData,
          users: updatedData.users?.map((user: User) => user.id),
        };
        await updateProject(selectedProject.id, updatedData);
        const updatedProjects = projects.map((project) =>
          project.id === selectedProject.id ? { ...project, ...updatedData } : project
        );
        setProjects(updatedProjects);
        handleCloseForm();
      } catch (error) {
        console.error('Ошибка при обновлении проекта:', error);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const renderFieldValue = (fieldName: string, value: any): React.ReactNode => {
    switch (fieldName) {
      case 'status':
        return (
          <span
            className="status-content"
            style={{
              backgroundColor:
                statusColors[(value as string) || ''] || '#000',
            }}
          >
            {statusTranslations[(value as string)] || value}
          </span>
        );
      case 'start_date':
      case 'end_date':
        return typeof value === 'string'
          ? new Date(value).toLocaleDateString()
          : '';
          case "users":
            if (Array.isArray(value)) {
              return value
                .map((user: { firstName?: string; lastName?: string }) => 
                  `${user.lastName || ""} ${user.firstName || ""}`
                )
                .filter((name) => name.trim() !== "")
                .join(", ");
            }
            return "";
      case 'comment':
        return value || '';
      default:
        return value?.toString() || '';
    }
  };

  const breadcrumbs = selectedProject && selectedProject.title
  ? [
      { name: "Проекты", path: "/project_view", onClick: handleCloseForm },
      { name: selectedProject.title, path: `/project_view/${selectedProject.id}` }
    ]
  : [{ name: "Проекты", path: "/project_view", onClick: handleCloseForm }];

  return (
    <div className="interns-table-page">
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      {selectedProject ? (
        <div className="form-container">
          {userRole === "CUSTOMER" && (
            <div className="task-border">
              <Link
                to={`/tasks?projectId=${selectedProject?.id}`}
                className="task-button"
              >
                <img src={icon_tasks} alt="Задача" className="task-icon" />
                <span className="task-text">Задачи по проектам</span>
              </Link>
            </div>
          )}
          <p className="control-panel_title" style={{ marginRight: "50%" }}>
              Проекты
          </p>
          <div className="modal-background">
            <div className="modal-content" style={{marginTop: "4vh"}}>
              <FormForProjects
                item={selectedProject}
                onSubmit={handleFormSubmit}
                fields={ProjectFields.map((field) => ({
                  ...field,
                  required: false,
                  type: field.name === "status" ? "select" : field.type,
                }))}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="control-panel">
            <p className="control-panel_title" style={{ marginRight: "50%" }}>
              Проекты
            </p>
            <div className="left_content">
              <FieldSelector
                fields={ProjectFields}
                visibleFields={visibleFields}
                onToggleField={(fieldName) =>
                  setVisibleFields((prevFields) =>
                    prevFields.includes(fieldName)
                      ? prevFields.filter((field) => field !== fieldName)
                      : [...prevFields, fieldName]
                  )
                }
              />
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Найти"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="search-input"
                />
                <img
                  src={activeSearchIcon}
                  alt="Искать"
                  className="search-icon"
                  onClick={handleSearchClick}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => {
                    setActiveSearchIcon(icons_search_active);
                  }}
                  onMouseLeave={() => {
                    setActiveSearchIcon(icon_search);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="project-table">
            {!projects.length ? (
              <div
                style={{
                  height: 400,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <RiseLoader loading={!projects.length} size={40} color="#7927E0" />
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        onChange={() => {
                          if (selectedProjects.length === projects.length) {
                            setSelectedProjects([]);
                          } else {
                            // setSelectedProjects(projects.map((project) => project.id));
                          }
                        }}
                        checked={selectedProjects.length === projects.length}
                      />
                    </th>
                    {ProjectFields.map(
                      (field) =>
                        visibleFields.includes(field.name) && (
                          <th
                            key={field.name}
                            onClick={() => handleSort(field.name)}
                            className={`sortable ${
                              sortField === field.name
                                ? sortOrder === "asc"
                                  ? "asc"
                                  : "desc"
                                : ""
                            }`}
                          >
                            <span className="header-label">
                              {field.label}
                              <span className="sort-icons">
                                {sortField === field.name &&
                                  sortOrder === "asc" && (
                                    <BsChevronUp className="sort-icon active" />
                                  )}
                                {sortField === field.name &&
                                  sortOrder === "desc" && (
                                    <BsChevronDown className="sort-icon active" />
                                  )}
                                {sortField !== field.name && (
                                  <BsChevronDown className="sort-icon default" />
                                )}
                              </span>
                            </span>
                          </th>
                        )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((project) => (
                    <tr key={project.id} onClick={() => handleRowClick(project)} style={{ cursor: 'pointer' }}>
                              {/* <td>
          <input
            type="checkbox"
            checked={selectedProjects.includes(project.id)}
            onChange={() => handleCheckboxChange(project.id)}
          />
        </td> */}
                      {ProjectFields.map((field) =>
                        visibleFields.includes(field.name) ? (
                          <td key={`${project.id}_${field.name}`}>
                            {renderFieldValue(field.name, project[field.name as keyof Projects])}
                          </td>
                        ) : null
                      )}
                              <td>
          <button onClick={() => handleRowClick(project)}>
            <i className="edit-icon">✏️</i>
          </button>
        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <Pagination
              currentPage={currentPage}
              itemsPerPage={sumPage}
              totalItems={projects.length}
              paginate={paginate}
            />
          </div>
        </>
      )}
      {snackbar.open && (
        <Snackbar type={snackbar.type} onClose={handleSnackbarClose} />
      )}
    </div>
  );
};

export default ProjectViewPage;