CREATE TABLE TYPE_PLACE (
  type_place_id INT NOT NULL,
  type_place_name VARCHAR(255) NOT NULL,
  PRIMARY KEY (type_place_id)
);

CREATE TABLE TYPE_DISASTER (
  type_dis_id VARCHAR(255) NOT NULL,
  PRIMARY KEY (type_dis_id)
);

CREATE TABLE COUNTRY (
  ISO INT NOT NULL,
  PRIMARY KEY (ISO)
);

CREATE TABLE CITY (
  name VARCHAR(255) NOT NULL,
  post_num INT NOT NULL,
  PRIMARY KEY (post_num)
);

CREATE TABLE STREET (
  name_street VARCHAR(255) NOT NULL,
  post_num INT NOT NULL,
  PRIMARY KEY (name_street, post_num),
  FOREIGN KEY (post_num) REFERENCES CITY(post_num)
);

CREATE TABLE TYPE_USER (
  usr_type_id VARCHAR(255) NOT NULL,
  PRIMARY KEY (usr_type_id)
);

CREATE TABLE ACTION (
  action_name VARCHAR(255) NOT NULL,
  type_dis_id VARCHAR(255) NOT NULL,
  PRIMARY KEY (action_name, type_dis_id),
  FOREIGN KEY (type_dis_id) REFERENCES TYPE_DISASTER(type_dis_id)
);

CREATE TABLE PLACE (
  coords VARCHAR(255) NOT NULL,
  house_num INT,
  type_place_id INT,
  post_num INT,
  name_street VARCHAR(255),
  PRIMARY KEY (coords),
  FOREIGN KEY (type_place_id) REFERENCES TYPE_PLACE(type_place_id),
  FOREIGN KEY (post_num) REFERENCES CITY(post_num),
  FOREIGN KEY (name_street, post_num) REFERENCES STREET(name_street, post_num)
);

CREATE TABLE DISASTER (
  time_end DATE NOT NULL,
  time_start DATE NOT NULL,
  severity INT NOT NULL,
  area_size INT NOT NULL,
  coords VARCHAR(255) NOT NULL,
  type_dis_id VARCHAR(255) NOT NULL,
  PRIMARY KEY (time_start, coords, type_dis_id),
  FOREIGN KEY (coords) REFERENCES PLACE(coords),
  FOREIGN KEY (type_dis_id) REFERENCES TYPE_DISASTER(type_dis_id)
);

CREATE TABLE DESC_PLACE (
  work_time_start DATE NOT NULL,
  description VARCHAR(255) NOT NULL,
  work_time_end DATE NOT NULL,
  coords VARCHAR(255) NOT NULL,
  PRIMARY KEY (coords),
  FOREIGN KEY (coords) REFERENCES PLACE(coords)
);

CREATE TABLE NEED (
  resource VARCHAR(255) NOT NULL,
  time_start DATE NOT NULL,
  coords VARCHAR(255) NOT NULL,
  type_dis_id VARCHAR(255) NOT NULL,
  PRIMARY KEY (resource, time_start, coords, type_dis_id),
  FOREIGN KEY (time_start, coords, type_dis_id) REFERENCES DISASTER(time_start, coords, type_dis_id)
);

CREATE TABLE EQUIPMENT (
  equip_name VARCHAR(255) NOT NULL,
  type_dis_id VARCHAR(255) NOT NULL,
  coords VARCHAR(255) NOT NULL,
  PRIMARY KEY (equip_name, type_dis_id, coords),
  FOREIGN KEY (type_dis_id) REFERENCES TYPE_DISASTER(type_dis_id),
  FOREIGN KEY (coords) REFERENCES PLACE(coords)
);

CREATE TABLE APP_USER (
  name VARCHAR(255) NOT NULL,
  surname VARCHAR(255) NOT NULL,
  house_num INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  usr_id INT NOT NULL,
  coords VARCHAR(255) NOT NULL,
  usr_type_id VARCHAR(255) NOT NULL,
  name_street VARCHAR(255) NOT NULL,
  post_num INT NOT NULL,
  PRIMARY KEY (usr_id),
  FOREIGN KEY (coords) REFERENCES PLACE(coords),
  FOREIGN KEY (usr_type_id) REFERENCES TYPE_USER(usr_type_id),
  FOREIGN KEY (name_street, post_num) REFERENCES STREET(name_street, post_num)
);

CREATE TABLE REPORT (
  report_severity INT NOT NULL,
  desc_report VARCHAR(255) NOT NULL,
  photo VARCHAR(255) NOT NULL,
  usr_id INT NOT NULL,
  time_start DATE NOT NULL,
  coords VARCHAR(255) NOT NULL,
  type_dis_id VARCHAR(255) NOT NULL,
  PRIMARY KEY (usr_id, time_start, coords, type_dis_id),
  FOREIGN KEY (usr_id) REFERENCES APP_USER(usr_id),
  FOREIGN KEY (time_start, coords, type_dis_id) REFERENCES DISASTER(time_start, coords, type_dis_id)
);