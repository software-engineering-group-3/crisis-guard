package com.crisisguard.crisisguard.config;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import jakarta.annotation.PostConstruct;

@Configuration
@EnableWebSecurity
public class DatabaseInitializer {

    private final JdbcClient jdbcClient;

    public DatabaseInitializer(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    @PostConstruct
    public void initializeDatabase() {
        // Check if the database is already initialized
        // If so, skip the initialization process

        var report_metadata = jdbcClient.sql("SELECT * FROM information_schema.tables WHERE table_name = 'report'")
                .query().listOfRows();

        if (!report_metadata.isEmpty()) {
            System.out.println("Database already initialized");
            return;
        }

        // Insert sample places

        String sqlScriptCreate = null;
        String sqlScriptFill = null;
        try {

            sqlScriptCreate = new String(Files.readAllBytes(Paths.get(".\\resources\\database_sql.sql")));
            sqlScriptFill = new String(Files.readAllBytes(Paths.get(".\\resources\\fill_database.sql")));
            System.out.println("Strings loaded successflly\n");
        } catch (Exception e) {
            // Ignore if file already exists
            System.out.println("Failed to load strings: " + e.getMessage());
        }
        try {
            if (sqlScriptCreate != null && sqlScriptFill != null) {
                System.out.println("Filling the database...");
                createTables(sqlScriptCreate, jdbcClient);
                System.out.println("Database created");
                insertData(sqlScriptFill, jdbcClient);
                System.out.println("Database filled");
                // jdbcClient.sql(sqlScriptFill).update();
                Map<String, Object> result = null;
                // result = jdbcClient.sql("SELECT * FROM TYPE_PLACE WHERE type_place_id = 1")
                //                                         .query()
                //                                         .singleRow();
                System.out.println("Fetched TYPE_PLACE data: " + result);

            }
        } catch (Exception e) {
            System.out.println("Failed to fetch TYPE_PLACE data: " + e.getMessage());
            // Ignore if file already exists
        }


        // More insert statements for sample data
    }

    public void createTables(String sqlContent, JdbcClient jdbcClient) {
    // Split the SQL content into individual CREATE TABLE statements
        String[] tableCreationStatements = sqlContent.split(";\\s*(?=CREATE TABLE)");
    
    // Trim each statement and remove any leading/trailing whitespace
        for (String statement : tableCreationStatements) {
            String trimmedStatement = statement.trim();
            
            // Skip empty statements
            if (!trimmedStatement.isEmpty()) {
                // Ensure the statement ends with a semicolon if it doesn't already
                if (!trimmedStatement.endsWith(";")) {
                    trimmedStatement += ";";
                }
                
                // Execute the CREATE TABLE statement
                try {
                    jdbcClient.sql(trimmedStatement).update();

                    System.out.println("Successfully created table: " + 
                        extractTableName(trimmedStatement));
                } catch (Exception e) {
                    System.err.println("Error creating table: \n\n" + 
                        trimmedStatement + "\n\n");
                    // e.printStackTrace();
                }
            }
        }
    }
    public void insertData(String sqlContent, JdbcClient jdbcClient) {
        // Split the SQL content into individual INSERT INTO statements
        String[] insertStatements = sqlContent.split(";\\s*(?=INSERT INTO)");
        
        // Trim each statement and remove any leading/trailing whitespace
        for (String statement : insertStatements) {
            String trimmedStatement = statement.trim();

            // Skip empty statements
            if (!trimmedStatement.isEmpty()) {
                // Ensure the statement ends with a semicolon if it doesn't already
                if (!trimmedStatement.endsWith(";")) {
                    trimmedStatement += ";";
                }
                
                // Extract table name
                String tableName = extractTableNameInsert(trimmedStatement);
                
                // Execute the INSERT INTO statement
                try {
                    jdbcClient.sql(trimmedStatement).update();
                    System.out.println("Successfully inserted data into table: " + tableName);
                } catch (Exception e) {
                    System.out.println("Error inserting data into table: " + tableName);
                    System.err.println(trimmedStatement + "\n---------------------------");

                    e.printStackTrace();
                }
            }
        }
    }
    
    // Helper method to extract table name from INSERT INTO statement
    private String extractTableNameInsert(String statement) {
        // Use regex to find the table name after INSERT INTO
        Pattern pattern = Pattern.compile("INSERT\\s+INTO\\s+(\\w+)", 
            Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(statement);
        
        if (matcher.find()) {
            return matcher.group(1);
        }
        return "Unknown Table";
    }

// Helper method to extract table name from CREATE TABLE statement
    private String extractTableName(String statement) {
        // Use regex to find the table name after CREATE TABLE
        Pattern pattern = Pattern.compile("CREATE\\s+TABLE\\s+(\\w+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(statement);
        
        if (matcher.find()) {
            return matcher.group(1);
        }
        return "Unknown Table";
    }
        
}
