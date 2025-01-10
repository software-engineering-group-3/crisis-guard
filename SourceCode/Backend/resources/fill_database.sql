-- TYPE_PLACE data
INSERT INTO TYPE_PLACE (type_place_id, type_place_name) VALUES 
(1, 'Hospital'), -- Hospital
(2, 'Fire station'), -- Fire Station
(3, 'Police Station'), -- Police Station
(4, 'Shelter'), -- Shelter
(5, 'School'); -- School


-- COUNTRY data
INSERT INTO COUNTRY (ISO) VALUES 
(840), -- USA
(826), -- UK
(276); -- Germany

-- CITY data
INSERT INTO CITY (name, post_num) VALUES 
('New York', 10001),
('London', 20001),
('Berlin', 30001),
('Paris', 40001);

-- STREET data
INSERT INTO STREET (name_street, post_num) VALUES 
('Broadway', 10001),
('Oxford Street', 20001),
('Unter den Linden', 30001),
('Main Street', 10001);

-- TYPE_USER data
INSERT INTO TYPE_USER (usr_type_id) VALUES 
('ADMIN'),
('RESCUER'),
('CITIZEN'),
('COORDINATOR');

-- PLACE data
INSERT INTO PLACE (coords, house_num, type_place_id, post_num, name_street) VALUES 
('40.7128, -74.0060', 123, 1, 10001, 'Broadway'),
('51.5074, -0.1278', 456, 2, 20001, 'Oxford Street'),
('52.5200, 13.4050', 789, 3, 30001, 'Unter den Linden'),
('40.7589, -73.9851', 321, 4, 10001, 'Main Street');

-- DESC_PLACE data
INSERT INTO DESC_PLACE (work_time_start, description, work_time_end, coords) VALUES 
('2024-01-01 08:00:00', 'Main City Hospital', '2024-01-01 20:00:00', '40.7128, -74.0060'),
('2024-01-01 00:00:00', 'Central Fire Station', '2024-01-01 23:59:59', '51.5074, -0.1278'),
('2024-01-01 07:00:00', 'Police HQ', '2024-01-01 19:00:00', '52.5200, 13.4050');

-- APP_USER data
INSERT INTO APP_USER (name, surname, house_num, email, phone, usr_id, coords, usr_type_id, name_street) VALUES 
('John', 'Doe', 123, 'john@email.com', '123-456-7890', 1, '40.7128, -74.0060', 'ADMIN', 'Broadway'),
('Jane', 'Smith', 456, 'jane@email.com', '234-567-8901', 2, '51.5074, -0.1278', 'RESCUER', 'Oxford Street'),
('Mark', 'Johnson', 789, 'mark@email.com', '345-678-9012', 3, '52.5200, 13.4050', 'CITIZEN', 'Unter den Linden');

-------------------------------------------------
-- TYPE_DISASTER data - Changed to all uppercase to maintain consistency
INSERT INTO TYPE_DISASTER (type_dis_id) VALUES 
('FLOOD'),
('FIRE'),
('EARTHQUAKE'),
('STORM');

-- ACTION data - Updated to match TYPE_DISASTER case
INSERT INTO ACTION (action_name, type_dis_id) VALUES 
('Evacuate', 'FLOOD'),
('Water Deployment', 'FIRE'),
('Search and Rescue', 'EARTHQUAKE'),
('Shelter Setup', 'STORM');

-- DISASTER data - Updated to match TYPE_DISASTER case
INSERT INTO DISASTER (time_end, time_start, severity, area_size, coords, type_dis_id) VALUES 
('2024-01-02', '2024-01-01', 3, 1000, '40.7128, -74.0060', 'FLOOD'),
('2024-02-02', '2024-02-01', 4, 500, '51.5074, -0.1278', 'FIRE'),
('2024-03-02', '2024-03-01', 5, 2000, '52.5200, 13.4050', 'EARTHQUAKE');

-- NEED data - Updated to match TYPE_DISASTER case
INSERT INTO NEED (resource, time_start, coords, type_dis_id) VALUES 
('Water Supplies', '2024-01-01', '40.7128, -74.0060', 'FLOOD'),
('Medical Supplies', '2024-02-01', '51.5074, -0.1278', 'FIRE'),
('Emergency Food', '2024-03-01', '52.5200, 13.4050', 'EARTHQUAKE');

-- EQUIPMENT data - Updated to match TYPE_DISASTER case
INSERT INTO EQUIPMENT (equip_name, type_dis_id, coords) VALUES 
('Water Pump', 'FLOOD', '40.7128, -74.0060'),
('Fire Engine', 'FIRE', '51.5074, -0.1278'),
('Rescue Gear', 'EARTHQUAKE', '52.5200, 13.4050');

-- REPORT data - Updated to match TYPE_DISASTER case
INSERT INTO REPORT (report_severity, desc_report, photo, usr_id, time_start, coords, type_dis_id) VALUES 
(4, 'Severe flooding in downtown area', 'flood1.jpg', 1, '2024-01-01', '40.7128, -74.0060', 'FLOOD'),
(3, 'Building fire on main street', 'fire1.jpg', 2, '2024-02-01', '51.5074, -0.1278', 'FIRE'),
(5, 'Major earthquake damage', 'quake1.jpg', 3, '2024-03-01', '52.5200, 13.4050', 'EARTHQUAKE');