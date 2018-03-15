create database if not exists plannerdb;

use plannerdb;

create table if not exists plannerdb.sessions (
  id int primary key auto_increment,
  sessionName varchar(20),
  sessionDate date,
  sessionTime time,
  description text,
  typeOfSession text,
  userid varchar(50)
);

