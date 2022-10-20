USE store_db;
INSERT INTO department (name) VALUES ('Service');
INSERT INTO department (name) VALUES ('Sales');
INSERT INTO department (name) VALUES ('Accounting');
INSERT INTO department (name) VALUES ('HR');

INSERT INTO role (title, salary, department_id) VALUES ('Director', 110000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Salesman', 70000, 2);
INSERT INTO role (title, salary, department_id) VALUES ('Accountant', 90000, 3);
INSERT INTO role (title, salary, department_id) VALUES ('HR Employee', 60000, 4);
INSERT INTO role (title, salary, department_id) VALUES ('HR Manager', 850000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Tinker', 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Sally', 'Smith', 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Craig', 'Paul', 2, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Xander', 'Leszkowiat', 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Emily', 'Lumberjack', 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Nathan', 'Wrong', 4, 5);

