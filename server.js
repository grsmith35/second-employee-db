const express = require('express');
const inquirer = require("inquirer");
const PORT = process.env.PORT || 3007;
const app = express();
const mysql = require('mysql2');

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'G3tfucked1!',
        database: 'company'
    },
    console.log('Connected to the company database.')
)

const initialize = function(){
    inquirer
    .prompt({
        type: 'list',
        message: 'Please select an option.',
        name: 'action',
        choices: ['View all departments', 'View all roles', 'View all Employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
    })
    .then(({action}) => {
        console.log(action);
        switch(action) {
            case 'View all departments':
                getDeparments();
                break;
            case 'View all roles':
                getRoles();
                break;
            case 'View all Employees':
                getEmployees();
                break;
            case 'Add a department':
                addDeparment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmpRole();
                break;
            default:
                console.log('Please Select an option.') ;
        }
    })
}

const getEmployees = function() {
    const sql = 'SELECT employees.id, first_name, last_name, roles.title as Title, roles.salary, departments.dept_name as Department, managers.manager_name AS manager FROM employees LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN departments on roles.department_id = departments.id LEFT JOIN managers on employees.manager_id = managers.id;';
    db.query(sql, (err, rows) => {
        if(err) {
            console.log('Database empty');
            return;
        }
        console.table(rows);
    });
    initialize();
};

const getDeparments = function() {
    const sql = 'SELECT * FROM departments';
    db.query(sql, (err, rows) => {
        if(err) {
            console.log('Database empty');
            return;
        }
        console.table(rows);
    });
    initialize();
};

const getRoles = function() {
    const sql = 'SELECT title, roles.id, departments.dept_name AS department, salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id;';
    db.query(sql, (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }
        console.table(rows);
    });
    initialize();
};

const addDeparment = function() {
    inquirer
    .prompt([
        {
        type: 'input',
        message: 'Please enter the name of the department',
        name: 'answer',
        validate: answerInput => {
            if(answerInput) {
                return true;
            } else {
                console.log('Please Enter a department name');
                return false;
            }
        }
    }])
    .then(answer => {
        const params = answer.answer;
        console.log(params);
        const sql = 'INSERT INTO departments (dept_name) VALUES(?)';
        db.query(sql, params, (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }
        console.table(rows);
        initialize();
        })
    })
};

const addRole = function() {
    inquirer
    .prompt([
        {
            type: 'input',
            message: 'Please enter the name of the new role',
            name: 'name',
            validate: answerInput => {
                if(answerInput) {
                    return true;
                } else {
                    console.log('Please Enter the name of the new role!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            message: 'Please enter the salary amount for this role.',
            name: 'salary',
            validate: salaryInput => {                 
                if(salaryInput) {
                    return true;
                } else {
                    console.log('Please enter a salary amount!');
                    return false;
                }
            }
        },
        {
            type: 'list',
            message: 'Please select which department this belongs to.',
            name: 'dept_name',
            choices:['HR', 'IT', 'Operations', 'Finance', 'Sales']
        }
    ])     
    .then(data => {
        const dpt_id = 'SELECT id FROM departments WHERE dept_name =?'
        const params = [data.dept_name];
        let newId = 0; 
        delete data.dept_name;
        db.query(dpt_id, params, (err, rows) => {
            newId = rows[0].id;
            data.dept_id = newId;
            console.log(data);
            const sql = 'INSERT INTO roles (title, salary, department_id) VALUES(?,?,?)';
            const newParams = [data.name, data.salary, data.dept_id]
            console.log(newParams)
            db.query(sql, newParams, (err, rows) => {
                if(err) {
                    console.log(err);
                }
                console.table(rows);   
                initialize();       
            });
        })
    })  
};

const addEmployee = function() {
    inquirer
    .prompt([
        {
            type: "input",
            message: "Please enter employees first name.",
            name: "first_name",
            validate: nameInput => {
                if(nameInput) {
                    return true;
                } else {
                    console.log("Please enter a valid employees name.");
                    return false;
                }
            }
        },
        {
            type: "input",
            message: "Please enter employees last name.",
            name: "last_name",
            validate: lastName => {
                if(lastName) {
                    return true;
                } else {
                    console.log("Please enter employees last name!");
                    return false;
                }
            }
        },
        {
            type: 'list',
            message: 'Please select their new role.',
            name: 'role',
            choices: ['HR manager', 'Director of IT', 'Chief of Operations', 'CEO', 'Branch Manager', 'CFO', 'Sales Manager', 'Sales Associate']
        }
    ])
    .then(data => {
        const findRole = data.role;
        const roleSql = 'SELECT id FROM roles WHERE title = ?';
        delete data.role;
        db.query(roleSql, findRole, (err, rows) => {
            if(err) {
                console.log('There was an issue finding this role.');
            }
            const theId = rows[0].id;
            data.role_id = theId;
            const sql = 'INSERT INTO employees (first_name, last_name, role_id) VALUES(?,?,?)';
            const params = [data.first_name, data.last_name, data.role_id];
            db.query(sql, params, (err, rows) => {
                if(err) {
                    console.log(err)
                }
                console.table(rows)
                initialize();
            })
        })
    })
};

const updateEmpRole = function() {
    const rolesSql = 'SELECT title FROM roles';
    let roles = [];
    db.query(rolesSql, (err, rows) => {
        if(err) {
            console.log(err);
        }
        for (r in rows) {
            roles.push(rows[r].title);
        }
        inquirer
        .prompt([
            {
                type: 'input',
                message: 'Please enter the employee number you wish to update.',
                name: 'empNum',
                validate: numInput => {
                    if(numInput > 0) {
                        return true;
                    } else {
                        console.log('Please enter a valid employee number!');
                        return false;
                    }
                }
            },
            {
                type: 'list',
                message: 'Please select their new role.',
                name: 'newRole',
                choices: roles
            }
        ])
        .then(data => {
            db.query('SELECT id FROM roles WHERE title = ?', data.newRole, (err, rows) => {
                if(err) {
                    console.log(err)
                }
    
                const newID = rows[0].id;
                console.log(newID);
                console.log(data.empNumb);
                const params = [newID, data.empNum]
                const updateSql = 'UPDATE employees SET role_id = ? WHERE id = ?';
                db.query(updateSql, params, (err, rows) => {
                    if(err) {
                        console.log(err);
                    }
                    console.log(rows);
                    initialize();
                })
            })
        })
    })
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

initialize();

module.exports = db;