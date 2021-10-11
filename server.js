const { SectionVerticalAlignAttributes } = require('docx');
const express = require('express');
const inquirer = require("inquirer");
const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require('mysql2');

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'For@project1!',
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
            default:
                console.log('Please Select an option.') ;
        }
    })
}

const getEmployees = function() {
    const sql = 'SELECT * FROM employees';
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
    const sql = 'SELECT * FROM roles';
    db.query(sql, (err, rows) => {
        if(err) {
            console.log('Database empty');
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
        })
    })
    
};

const addRole = function() {
    db.query('SELECT title FROM roles', (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }
        const roles = rows;
    })
}
//     inquirer
//     .prompt([
//         {
//             type: 'input',
//             message: 'Please enter the name of the new role',
//             name: 'name',
//             validate: answerInput => {
//                 if(answerInput) {
//                     return true;
//                 } else {
//                     console.log('Please Enter the name of the new role!');
//                     return false;
//                 }
//             }
//         },
//         {
//             type: 'input',
//             message: 'Please enter the salary amount for this role.',
//             name: 'salary',
//             validate: salaryInput => {
//                 if(salaryInput) {
//                     return true;
//                 } else {
//                     console.log('Please enter a salary amount!');
//                     return false;
//                 }
//             }
//         },
//         {
//             type: 'list',
//             message: 'Please select which department this belongs to.',
//             name: 'dept_name',
//             choices: roles
//         }
//     ])
//     .then(data => {
//         const sql = 'INSERT INTO roles (title, salary, department_id) VALUES(?)';
//         console.log(data)
//         // db.query(sql, (err, rows) => {
//         // if(err) {
//         //     console.log('Database empty');
//         //     return;
//         // }
//         // console.table(rows);
//         // });
//     })  
// };

// const addEmployee = function(employee) {
//     const sql = 'INSERT INTO employees(first_name, last_name, role_id)'+
//                 'VALUES(?,?,?';
//     const params = employee;
//     db.query(sql, params, (err, rows) => {
//         if(err) {
//             console.log('Database empty');
//             return;
//         }
//         console.json({
//             message: 'success'
//         });
//     });
// };


// app.get('/employees', (req, res) => {
//     const sql = 'SELECT * FROM employees';

//     db.query(sql, (err, rows) => {
//         if(err) {
//             res.status(500).json({error: err.message});
//             return;
//         }
//         res.json({
//             message: 'success',
//             data: rows
//         });
//     });
// });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

initialize();

module.exports = db;