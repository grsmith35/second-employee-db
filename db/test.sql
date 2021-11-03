SELECT employees.id, first_name, last_name, roles.title as Title, roles.salary, departments.dept_name as Department, managers.manager_name AS manager
FROM employees
LEFT JOIN roles on employees.role_id = roles.id
LEFT JOIN departments on roles.department_id = departments.id
LEFT JOIN managers on employees.manager_id = managers.id;

SELECT title, roles.id, departments.dept_name AS department, salary
from roles
LEFT JOIN departments ON roles.department_id = departments.id;