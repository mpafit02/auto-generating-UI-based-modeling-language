# auto-generating-UI-based-modeling-language

Finished:
1. Read JSON Schema 
2. Creates the buttons based on the requirments of the properties
3. Create elements for the cases:
    a. String / Integer -> input type="text"
    b. Boolean -> input type="checkBox"
    c. Enum -> drop-down list
    d. $ref -> creates "add" button for nested dialog
    e. oneOf -> creates "add" button for each case
4. Cancel button works for the base and nested dialog

Not Finished
1. Submit button for base dialogs and Done button for nested dialogs
2. Validate the input from the user 
3. Check if it works for two or more nested dialogs

