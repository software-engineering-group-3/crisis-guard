# Software Engineering

## 2024/2025

# Crisis Guard

## Documentation

**Group:** Group 3  
**Leader:** Juraj Velimirović  
**Teacher:** izv. prof. dr. sc. Vlado Sruk  

---

## 1. Documentation Change Log

| Rev. | Change Description                              | Authors        | Date        |
|------|------------------------------------------------|----------------|-------------|
| 0.1  | Initial draft of functional requirements and use cases | Borna Čović    | 23.10.2024  |

---

## 2. Project Assignment Description

Crisis Guard is a web application designed for crisis management. It offers secure login via OAuth 2.0 with Google and integrates with OpenStreetMap to display pins indicating reports and resources. The application fetches information on green areas, shelters, and essential resources such as sandbags, food, and water.

### Key Features:
- **Notifications:**
  - Implemented via Firebase Cloud Messaging and email notifications.
- **Database Management:**
  - Utilizes PostgreSQL for storing user data, reports, safety measures, and report locations.

### Purpose:
Humanitarian organizations can view information about citizens' needs, such as accommodation, food, or medical assistance. This enables them to plan and coordinate their activities effectively during crisis situations. The application allows adding information about available resources and aid actions, improving cooperation between humanitarian organizations and authorities to better coordinate relief efforts and optimize resources. Authorities have access to all submissions through the app. Editors can review, approve, or reject submissions, analyze situations, link similar reports, and suggest additional resources or measures. Authorities can also generate statistical reports that include the number of reports, types of disasters, and the effectiveness of crisis responses.

---

## 3. Software Specification  

### 3.1. Functional Requirements  

**User Roles and Permissions:**    

1. **Unsigned Users:**    
   - **Report Incidents:** Submit disaster details (type, location, description, photos, coordinates, etc.) without an account.  
   - **Access to Map:** View the map with pins indicating reports, resources, and shelters.   

2. **Citizens:**  
   - **OAuth 2.0 Login:** Sign up and log in using Google.  
   - **Report Incidents:** Submit disaster details (type, location, description, photos, coordinates, etc.). 
   - **Track Report Status:** Monitor status updates (e.g., Submitted, In Progress, Resolved).   
   - **Push Notifications:** System sends push notifications through Firebase Cloud Messaging for signed-in users.   
   - **Email Messages:** System sends email alerts to users.   
   - **Access to Map:** View the map with pins indicating reports, resources, and shelters.   

3. **Authorities:**   
   - **OAuth 2.0 Login:** Log in with Google for secure, role-based access.   
   - **Incident Management:** Approve/reject reports, categorize, prioritize, and link similar incidents.   
   - **Issue Alerts:** Send safety warnings and resource updates to citizens.   
   - **Data and Reporting:** Dashboard with incident stats and export data.   
   - **Resource Allocation:** Manage and coordinate resources with humanitarian organizations.   
   - **Access to Map:** View the map with pins indicating reports, resources, and shelters.   

4. **Humanitarian Organizations:** 
   - **OAuth 2.0 Login:** Register and log in with Google for role-specific access.   
   - **View Needs:** Access reports indicating citizens’ specific needs (shelter, food, medical assistance).   
   - **Resource Tracking:** Update availability of resources (e.g., Available, Full, Out of Stock).   
   - **Coordination:** Collaborate with authorities on response actions, add resources, and monitor incident areas.   
   - **Shelters:** Add information about shelters.   
   - **Access to Map:** View the map with pins indicating reports, resources, and shelters.   

---

### 3.1.1. Use Cases

**Use Case UC1: View Map and Reports**  
- **Actor:** Regular User  
- **Goal:** View the map with pins indicating reports and resources.  
- **Preconditions:** None.  
- **Basic Flow:**
  1. User opens the application.
  2. System displays a map using OpenStreetMap.
  3. Pins representing reports and resources are visible.  
- **Postconditions:** User can view details by clicking on pins.

**Use Case UC2: Report an Incident**
- **Actor:** Unsigned User or Citizen
- **Goal:**: Submit details about a disaster incident.
- **Preconditions:** User is on the application's reporting page.
- **Basic Flow:**
   1. User navigates to the "Report Incident" section.
   2. User selects the type of disaster from a predefined list.
   3. User enters the location manually or via geolocation.
   4. User provides a description and uploads any relevant photos.
   5. User submits the report.
   6. System acknowledges receipt and provides a reference number.
- **Postconditions:** The incident report is stored in the database pending review.

**Use Case UC3: Sign Up and Log In via OAuth 2.0**
- **Actor:** Citizen, Authority, or Humanitarian Organization
- **Goal:**: Securely log in to the application using Google OAuth 2.0.
- **Preconditions:** User has a valid Google account.
- **Basic Flow:**
User clicks on "Sign Up" or "Log In" with Google.
System redirects to Google's OAuth 2.0 authentication page.
User enters Google credentials and grants necessary permissions.
System authenticates the user and retrieves profile information.
User is redirected back to the application with appropriate role access.
- **Postconditions:** User is logged in and can access role-specific features.

**Use Case UC4: Track Report Status**
- **Actor:**: Citizen
- **Goal:**: Monitor the status of submitted incident reports.
- **Preconditions:** User is logged in and has submitted a report.
- **Basic Flow:**
User navigates to the "My Reports" section.
System displays a list of reports submitted by the user.
User selects a report to view detailed status updates.
- **Postconditions:** User stays informed about the progress of their reports.

**Use Case UC5: Receive Push Notifications**
- **Actor:**: Citizen
- **Goal:**: Receive real-time alerts and updates via push notifications.
- **Preconditions:** User is logged in and has enabled notifications.
- **Basic Flow:**
An incident update or safety alert is issued by authorities.
System sends a push notification through Firebase Cloud Messaging.
User receives the notification on their device.
- **Postconditions:** User is promptly informed about critical updates.

**Use Case UC6: Manage Incident Reports**
- **Actor:**: Authority
- **Goal:**: Review, approve, or reject submitted incident reports.
- **Preconditions:** Authority is logged in with appropriate permissions.
- **Basic Flow:**
Authority accesses the "Incident Management" dashboard.
System displays pending incident reports.
Authority reviews the details and any attached media.
Authority approves, rejects, or requests additional information.
Authority categorizes and prioritizes the incident.
- **Postconditions:** Incident reports are updated, and actions are recorded.

**Use Case UC7: Issue Safety Alerts**
- **Actor:**: Authority
- **Goal:**: Send safety warnings and updates to citizens.
- **Preconditions:** Authority is logged in and has identified a critical situation.
- **Basic Flow:**
Authority navigates to the "Alerts" section.
Authority composes a new safety alert message.
Authority selects the target area or audience.
Authority sends the alert.
System disseminates the alert via push notifications and email.
- **Postconditions:** Citizens receive timely safety information.

**Use Case UC8: Generate Statistical Reports**
- **Actor:**: Authority
- **Goal:**: Access analytics and generate reports on incidents and responses.
- **Preconditions:** Authority is logged in.
- **Basic Flow:**
Authority accesses the "Analytics" dashboard.
Authority selects parameters (date range, incident types).
System generates visual charts and data summaries.
Authority exports the report in the desired format (PDF, CSV).
- **Postconditions:** Authority obtains data to inform decision-making.

**Use Case UC9: Update Resource Availability**
- **Actor:**: Humanitarian Organization
- **Goal:**: Manage and update the status of resources like food and medical supplies.
- **Preconditions:** Organization is logged in with resource management permissions.
- **Basic Flow:**
Organization accesses the "Resource Management" section.
System displays current resource listings.
Organization updates statuses (e.g., Available, Low Stock, Out of Stock).
Organization adds new resources if applicable.
System saves the updates and reflects changes on the map.
- **Postconditions:** Resource information is current and accurate for users.

**Use Case UC10: Add Shelter Information**
- **Actor:**: Humanitarian Organization
- **Goal:**: Provide details about available shelters.
- **Preconditions:** Organization is logged in.
- **Basic Flow:**
Organization navigates to the "Shelters" section.
Organization clicks on "Add New Shelter."
Organization inputs shelter details (name, location, capacity, facilities).
Organization submits the information.
System validates and updates the map with the new shelter.
- **Postconditions:** Shelter becomes visible to users seeking accommodation.

**Use Case UC11: Coordinate Response Actions**
- **Actor:**: Humanitarian Organization and Authority
- **Goal:**: Collaborate on planning and executing crisis response efforts.
- **Preconditions:** Both parties are logged in.
- **Basic Flow:**
Authority shares response plans or requests via the platform.
Organization reviews and acknowledges tasks.
Both parties communicate through the system's messaging feature.
Organization updates task statuses upon completion.
- **Postconditions:** Improved coordination leads to efficient crisis management.

**Use Case UC12: Link Similar Incidents**
- **Actor:**: Authority
- **Goal:**: Group related incident reports to streamline management.
- **Preconditions:** Authority is reviewing incident reports.
- **Basic Flow:**
Authority identifies reports with similar details.
Authority selects multiple reports.
Authority uses the "Link Reports" function.
System creates a grouped incident cluster.
- **Postconditions:** Linked incidents are managed collectively.

**Use Case UC13: Receive Email Alerts**
- **Actor:**: Citizen
- **Goal:**: Get important updates via email.
- **Preconditions:** User has a registered email address and has opted in for emails.
- **Basic Flow:**
System triggers an email alert based on new incidents or updates.
Email is sent to the user's registered address.
User opens the email to read the details.
- **Postconditions:** User stays informed even when not using the app.

**Use Case UC14: Access Resource Needs Reports**
- **Actor:**: Humanitarian Organization
- **Goal:**: View reports indicating citizens' specific needs.
- **Preconditions:** Organization is logged in.
- **Basic Flow:**
Organization accesses the "Needs Reports" section.
System displays reports filtered by type (shelter, food, medical).
Organization reviews details to plan resource allocation.
- **Postconditions:** Organization can prioritize aid delivery based on actual needs.

**Use Case UC15: Update Personal Profile**
- **Actor:**: Citizen, Authority, or Humanitarian Organization
- **Goal:**: Manage personal or organizational profile information.
- **Preconditions:** User is logged in.
- **Basic Flow:**
User navigates to "Profile Settings."
User updates information such as contact details or notification preferences.
User saves changes.
System confirms and updates the profile.
- **Postconditions:** User's profile information is current.

**Use Case UC16: Search and Filter Map Data**
- **Actor:**: Unsigned User or Citizen
- **Goal:**: Find specific reports or resources on the map using search and filters.
- **Preconditions:** User is viewing the map.
- **Basic Flow:**
User enters keywords into the search bar or selects filters (e.g., disaster type).
System updates the map to show only relevant pins.
User clicks on pins for more information.
- **Postconditions:** User efficiently locates desired information.

**Use Case UC17: Export Data**
- **Actor:**: Authority or Humanitarian Organization
- **Goal:**: Export incident or resource data for offline analysis.
- **Preconditions:** User is logged in with appropriate permissions.
- **Basic Flow:**
User navigates to the "Data Export" section.
User selects data categories and formats.
User initiates the export process.
System compiles and provides the data file for download.
- **Postconditions:** User obtains data for external use.

**Use Case UC18: Provide Feedback or Suggestions**
- **Actor:**: Citizen
- **Goal:**: Submit feedback about the application or suggest improvements.
- **Preconditions:** User is using the application.
- **Basic Flow:**
User accesses the "Feedback" section.
User fills out the feedback form with comments or suggestions.
User submits the form.
System acknowledges receipt.
- **Postconditions:** Feedback is recorded for review by the development team.

**Use Case UC19: System Maintenance Notifications**
- **Actor:**: System
- **Goal:**: Notify users about scheduled maintenance or downtime.
- **Preconditions:** Maintenance is scheduled.
- **Basic Flow:**
System schedules a notification to be sent.
Users receive an alert via push notification or email.
- **Postconditions:** Users are informed to anticipate service interruptions.

**Use Case UC20: Emergency Contact Integration**
- **Actor:**: Citizen
- **Goal:**: Access or update emergency contact information.
- **Preconditions:** User is logged in.
- **Basic Flow:**
User navigates to the "Emergency Contacts" section.
User views or edits contact details.
User saves any updates.
- **Postconditions:** Emergency contacts are available for quick reference during crises.
