# auto-generating-UI-based-modeling-language

Problem: 
Implement a web service with responsive UI elements that are auto-generated based on a meta-language defined in a Json Schema. The application will be developed as a small web-server that given a schema definition file will automatically produce the appropriate UI elements ( e.g., forms) while also performing the necessary syntax and semantic validations.

Finished:
1. Read the JSON Schema
2. Create the buttons based on the requirments of the properties
3. Create elements for the cases:
    a. String / Integer -> input type="text"
    b. Boolean -> input type="checkBox"
    c. Enum -> drop-down list
    d. $ref -> creates "add" button for nested dialog
    e. oneOf -> creates "add" button for each case
4. Cancel button works for the base and nested dialog
5. Can have two or more nested dialogs
6. Submit button for base dialogs and Done button for nested dialogs
7. Validate the input from the user 
8. Import JSON Schema

Not Finished
1. Show the input from the user in tha base dialogs
2. Multiple items creation
3. Export the form into a JSON file
