Software Engineering

2024/2025

Crisis Guard

Documentation

Group: Group 3
Leader: Juraj Velimirović
Teacher: izv. prof. dr. sc. Vlado Sruk


1. Documentation Change Log
Rev.	Change Description	Authors	Date
0.1	Initial draft of functional requirements and use cases	Borna Čović	23.10.2024.


2. Project Assignment Description
Crisis Guard is a web application designed for crisis management. It offers secure login via OAuth 2.0 with Google and integrates with OpenStreetMap to display pins indicating reports and resources. The application fetches information on green areas, shelters, and essential resources such as sandbags, food, and water.
Key Features:
•	Notifications:
o	Implemented via Firebase Cloud Messaging and email notifications.
•	Database Management:
o	Utilizes PostgreSQL for storing user data, reports, safety measures, and report locations.
Purpose:
Humanitarian organizations can view information about citizens' needs, such as accommodation, food, or medical assistance. This enables them to plan and coordinate their activities effectively during crisis situations. The application allows adding information about available resources and aid actions, improving cooperation between humanitarian organizations and authorities to better coordinate relief efforts and optimize resources.
Authorities have access to all submissions through the app. Editors can review, approve, or reject submissions, analyze situations, link similar reports, and suggest additional resources or measures. Authorities can also generate statistical reports that include the number of reports, types of disasters, and the effectiveness of crisis responses.



3. Software Specification
3.1. Functional Requirements
User Roles and Permissions:
1.	Regular Users (Not Signed In):
o	View the map and existing reports.
o	Create reports anonymously.
o	See the list of reports.
2.	Signed-In Users:
o	All capabilities of regular users.
o	Receive notifications via Firebase Cloud Messaging and email.
3.	Emergency Services:
o	All capabilities of signed-in users.
o	Create privileged (priority) reports.
4.	Editors:
o	All capabilities of emergency services.
o	Remove and modify reports.
o	Link similar reports.
________________________________________
3.1.1. Use Cases
Use Case UC1: View Map and Reports
•	Actor: Regular User
•	Goal: View the map with pins indicating reports and resources.
•	Preconditions: None.
•	Basic Flow:
1.	User opens the application.
2.	System displays a map using OpenStreetMap.
3.	Pins representing reports and resources are visible.
•	Postconditions: User can view details by clicking on pins.
