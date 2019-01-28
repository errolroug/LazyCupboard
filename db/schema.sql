DROP DATABASE IF EXISTS lazyCupboard_db;

-- Create the database burgers_db and specify it for use.
CREATE DATABASE lazyCupboard_db;
USE lazyCupboard_db;


ALTER TABLE `lazycupboard_db`.`measurements` 
CHANGE COLUMN `createdAt` `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ;
ALTER TABLE `lazycupboard_db`.`measurements` 
CHANGE COLUMN `updatedAt` `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ;

ALTER TABLE `lazycupboard_db`.`ingredients` 
CHANGE COLUMN `createdAt` `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ;
ALTER TABLE `lazycupboard_db`.`ingredients` 
CHANGE COLUMN `updatedAt` `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ;

select * from ingredients;
select * from measurements;

