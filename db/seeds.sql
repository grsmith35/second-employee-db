INSERT INTO departments (dept_name)
VALUES
('HR'),
('IT'),
('Operations'),
('Finance'),
('Sales');

INSERT INTO roles(title, salary, department_id)
VALUES
('HR manager', 90000, 1),
('Director of IT', 80000, 2),
('Chief of Operations', 115000, 3),
('CEO', 150000, 3),
('Branch Manager', 55000, 3),
('CFO', 90000, 4),
('Sales Manager', 85000, 5),
('Sales Associate', 50000, 5);

INSERT INTO employees(first_name, last_name, role_id)
VALUES
('John', 'Snow', 1),
('Jonny', 'white', 3),
('super', 'man', 4),
('bat', 'man', 5),
('iron', 'man', 2),
('robert', 'barathian', 6),
('Robb', 'Stark', 7),
('Khal', 'Drogo', 8);