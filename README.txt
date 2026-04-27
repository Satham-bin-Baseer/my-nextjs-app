


npm install
node -v (selected version must past the node 18+)
npm install mysql2 (if not installed)
npm i antd
npm i react-hot-toast
npm run dev


configure your DB username and password in the .env file

Run the below Queries in Phpmyadmin:
------------------------------------

CREATE DATABASE myapp;

CREATE TABLE `myapp`.`users` (`id` TINYINT NOT NULL AUTO_INCREMENT , `username` VARCHAR(50) NOT NULL , `password` VARCHAR(30) NOT NULL , `emp_id` INT NOT NULL , `status` TINYINT NOT NULL DEFAULT '1' , PRIMARY KEY (`id`));

ALTER TABLE `myapp`.`users` ADD `role_id` INT NOT NULL AFTER `emp_id`;

CREATE TABLE `myapp`.`employees` (`id` INT NOT NULL AUTO_INCREMENT , `emp_name` VARCHAR(100) NOT NULL , `emp_dob` DATE NOT NULL , `emp_join_date` DATE NOT NULL , `emp_role` TINYINT NOT NULL , `status` TINYINT NOT NULL DEFAULT '1' , PRIMARY KEY (`id`));

CREATE TABLE `myapp`.`roles` (`id` INT NOT NULL AUTO_INCREMENT , `role_name` VARCHAR(80) NOT NULL , `status` TINYINT NOT NULL DEFAULT '1' , PRIMARY KEY (`id`));

ALTER TABLE `myapp`.`users` CHANGE `emp_id` `emp_id` VARCHAR(50) NOT NULL;

ALTER TABLE `myapp`.`employees` ADD CONSTRAINT fk_role_name FOREIGN KEY (emp_role) REFERENCES users(id);

ALTER TABLE `myapp`.`employees` ADD `emp_gender` VARCHAR(10) NULL AFTER `emp_dob`;

ALTER TABLE `myapp`.`users` CHANGE `password` `password` VARCHAR(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `myapp`.`users` DROP `role_id`;

CREATE TABLE `myapp`.`user_menus` (`id` INT NOT NULL AUTO_INCREMENT , `menu_name` VARCHAR(35) NOT NULL , `status` TINYINT NOT NULL DEFAULT '1' , PRIMARY KEY (`id`));

ALTER TABLE `myapp`.`user_menus` CHANGE `menu_name` `menuname_key` VARCHAR(35) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

CREATE TABLE `myapp`.`usermenu_permissions` (`id` INT NOT NULL AUTO_INCREMENT , `role_id` INT NOT NULL , `menu_key` INT NOT NULL , `action_name` INT NOT NULL , `status` INT NOT NULL DEFAULT '1' , PRIMARY KEY (`id`));

ALTER TABLE `myapp`.`usermenu_permissions` CHANGE `action_name` `action_id` INT NOT NULL;






Project Details:
*Api routes used so backend included in this simple NextJs web application
*MySQL used as database
*Typescript used for to prevent runtime errors
*TS utility types and index signatures concepts covered in this application
*Modules permission made, if the user have the permission the module will display
*CRUD performed and data linked across all menus
*antd library used for UI development
*useContext hook used
