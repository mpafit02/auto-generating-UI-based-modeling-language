// General Variables
var json = undefined;
var active = false;
var hasEnum = false;
var hasAdditionalProperties = false;
var hasUniqueItems = false;
var file = "";
var objectName = "";
var returnContent = "";
var modalLayout = "";
var idCounter = 0;
var inputCounter = 0;
var selectCounter = 0;
var zIndex = 1400;
var minItems = Number.MIN_VALUE;
var minProperties = Number.MIN_VALUE;
var minProperties = Number.MAX_VALUE;
var minimum = Number.MIN_VALUE;
var maximum = Number.MAX_VALUE;
var items = [];
var oneOfCases = [];
var selectCases = [];
var required = [];
var nestedModal = [];
var output = {};
var outputData = {};

// Upload File
function uploadFile() {
    var x = document.getElementById("myFile");
    var txt = "";
    if ('files' in x) {
        file = x.files[0];
        if (file.type == "application/json") {
            txt += "<br><p><strong>Upload file: </strong></p>";
            txt += "<i class='fa fa-file-text-o'style='font-size:30px; color:white;'></i>";
            if ('name' in file) {
                txt += "  " + file.name + "<br>";
            }
            txt += "<button id='upload-btn' class='btn btn-primary float-right'>Upload</button>";
        } else {
            txt += "<br><div style='color:#ff2045'>This file type is not correct! Upload a JSON file.</div>";
        }
    } else {
        if (x.value != "") {
            txt += "The files property is not supported by your browser!";
            txt += "<br>The path of the selected file: " + x.value; // If the browser does not support the files property, it will return the path of the selected file instead. 
        }
    }
    document.getElementById("upload-part").innerHTML = txt;
    document.getElementById("upload-btn").addEventListener("click", function () {
        createPage();
        $("#upload-card").hide();
    });
}

// Create Page
function createPage() {
    $(document).ready(function () {
        json = $.ajax({
            url: file.name,
            dataType: "json",
            type: "get",
            cache: false,
            success: function (json) {
                document.getElementById("app").innerHTML =
                    `
                <nav class="navbar bg-dark fixed-top top-nav">
                <div class="navbar-brand mb-0 h1 text-light">${json.description}</div>
                <button type="button" class='btn btn-primary btn-sm float-right' id="dwn-btn">Save</button>
                </nav>
                <div id="sidebar">
                    <button type='button' class='btn btn-dark' data-toggle='modal' data-target='#Properties-modal'>Properties</button>
                </div>  
                </div>
                <main class='main'>
                ${BaseModal("Properties", json.properties)}
                ${modalLayout}
                </main>
            `;
                // -------------------------------Methods------------------------------------
                // for (var i = 0; i < json.required.length; i++) {
                //     buttonBaseFunction(json.required[i]);
                // }

                // // Function for buttons in Base Dialogs
                // function buttonBaseFunction(id) {
                //     (function () {
                //         var btn = id + '-btn';
                //         var dialog = id + '-dialog';
                //         var cancel = id + '-cancel';
                //         var formDialog = document.getElementById(dialog);
                //         // Creat
                //         document.getElementById(btn).addEventListener('click', function () {
                //             formDialog.showModal();
                //         });

                //         // Cancel
                //         document.getElementById(cancel).addEventListener('click', function () {
                //             unckeckRadioButtons();
                //             formDialog.close();
                //         });

                //         // Submit
                //         $(formDialog).submit(function () {
                //             outputData = output;
                //             $(id).serializeObject();
                //             alert(id + " Submitted");
                //         });
                //     })();
                // }

                // Check for key press actions in nested modal
                // for (var i = 0; i < nestedModal.length; i++) {
                //     buttonNestedFunction(nestedModal[i]);
                // }

                // Function for buttons in Nested Dialogs
                //  function buttonNestedFunction(id) {
                //     (function () {
                //         var done = id + '-done';
                //         var modal = id + '-modal';
                //         var form = id + '-form';
                //         // Done
                //         document.getElementById(done).addEventListener('click', function () {

                //             //////////////////////NOT WORKING//////////////////////////////////
                //             // $(form).validate({
                //             //     invalidHandler: function(event, validator) {
                //             //       // 'this' refers to the form
                //             //       var errors = validator.numberOfInvalids();
                //             //       if (errors) {
                //             //         var message = errors == 1
                //             //           ? 'You missed 1 field. It has been highlighted'
                //             //           : 'You missed ' + errors + ' fields. They have been highlighted';
                //             //         $("div.error span").html(message);
                //             //         $("div.error").show();
                //             //       } else {
                //             //         $("div.error").hide();
                //             //       }
                //             //     }
                //             //   });

                //             $('#' + id).on('input', function() {
                //                 var input=$(this);
                //                 var is_name=input.val();
                //                 if(is_name){input.removeClass("invalid").addClass("valid");}
                //                 else{input.removeClass("valid").addClass("invalid");}
                //             });

                // $("#returnContent").html(returnContent);
                //             $('#' + modal).modal('hide');
                //         });
                //     })();
                // }

                //Check for key press actions in nested modal
                for (var i = 0; i < nestedModal.length; i++) {
                    buttonNestedFunction(nestedModal[i]);
                }

                // Function for submit buttons in Nested Modal
                function buttonNestedFunction(id) {
                    var modal = id + '-modal';
                    var formid = id + '-form';
                    var btn = id + '-btn';
                    'use strict';
                    document.getElementById(btn).addEventListener("click", function () {
                        var form = document.getElementById(formid);
                        if (form.checkValidity() === false) {
                            event.preventDefault();
                            event.stopPropagation();
                        } else {
                            $('#' + modal).modal('hide');
                        }
                        form.classList.add('was-validated');
                    });
                }

                // Display the dialog which is selected in oneOf case
                $("input").on("click", function () {
                    var id = $("input:checked").val();
                    returnContent = id;
                    $('.reveal-' + id).show().css({
                        'opacity': '1',
                        'max-height': 'inherit',
                        'overflow': 'visible'
                    });
                    for (i in selectCases) {
                        var other = $('#select-' + selectCases[i]).val();
                        if (other != id) {
                            $('.reveal-' + other).show().css({
                                'opacity': '0',
                                'max-height': '0',
                                'overflow': 'hidden'
                            });
                        }
                    }
                });

                // Start file download.
                document.getElementById("dwn-btn").addEventListener("click", function () {
                    var filename = "data.json";
                    download(filename, outputData);
                }, false);

                // Download Form Data
                function download(filename, outputData) {
                    var element = document.createElement('a');
                    element.setAttribute('href', "data:" + "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(outputData)));
                    element.setAttribute('download', filename);
                    element.style.display = 'none';
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                }

                // Upper Case First Character
                function upperCaseFirst(string) {
                    return string.charAt(0).toUpperCase() + string.slice(1);
                }

                //---------------------------DIALOGS--------------------------

                // Base Modal
                function BaseModal(id, path) {
                    var layout;
                    // Modal
                    layout = "<div class='modal fade' id='" + id + "-modal' role='dialog' style'z-index:" + zIndex + "'>";
                    layout += "<div class='modal-dialog'>";
                    layout += "<div class='modal-content'>";
                    // Header
                    layout += "<div class='modal-header'>";
                    layout += "<h5 class='modal-title'>" + id + "</h5></div>";
                    // Body         
                    // action='/action_page.php' method='POST'
                    var formid = id + "-form";
                    layout += "<form id='" + formid + "' class='needs-validation' novalidate>";
                    layout += "<div class='modal-body'>" + create(path, formid) + "</div>";
                    // Footer
                    layout += "<div class='modal-footer'>";
                    layout += "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>";
                    layout += "<button type='submit' class='btn btn-primary' form='" + formid + "'>Submit</button>";
                    layout += "</div></form></div></div></div>";
                    return layout;
                }

                // Nested Dialog
                function NestedModal(id, path) {
                    var layout;
                    // Modal
                    layout = "<div class='modal fade' id='" + id + "-modal' role='dialog' style'z-index:" + zIndex + "'>";
                    layout += "<div class='modal-dialog'>";
                    layout += "<div class='modal-content'>";
                    // Header
                    layout += "<div class='modal-header'>";
                    layout += "<h5 class='modal-title'>" + id + "</h5></div>";
                    // Body         
                    // action='/action_page.php' method='POST'
                    var formid = id + "-form";
                    layout += "<form id='" + formid + "' class='needs-validation' novalidate>";
                    layout += "<div class='modal-body'>" + create(path, formid) + "</div>";
                    // Footer
                    layout += "<div class='modal-footer'>";
                    layout += "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>";
                    // layout += "<button type='submit' class='btn btn-primary' form='" + formid + "'>Create " + upperCaseFirst(id) + "</button>";
                    layout += "<button type='button' id='" + id + "-btn' class='btn btn-primary'>Create " + upperCaseFirst(id) + "</button>";
                    layout += "</div></form></div></div></div>";
                    return layout;
                }

                // Select Dialog
                function SelectModal(id, data) {
                    var layout = "";
                    var title = "";
                    // Modal
                    layout = "<div class='modal fade' id='" + id + "-modal' role='dialog' style'z-index:" + zIndex + "'>";
                    layout += "<div class='modal-dialog'>";
                    layout += "<div class='modal-content'>";
                    // Header
                    layout += "<div class='modal-header'>";
                    layout += "<h5 class='modal-title'>" + id + "</h5></div>";
                    // Body         
                    // action='/action_page.php' method='POST'
                    layout += "<div class='modal-body'>";
                    var formid = id + "-select-form";
                    layout += "<form id='" + formid + "' class='needs-validation' novalidate>";
                    for (i in data) {
                        var ref = data[i].$ref;
                        var path = json;
                        var keywords = ref.substring(2, ref.length).split("/");
                        for (i in keywords) {
                            title = keywords[i];
                            path = path[keywords[i]];
                        }
                        layout += "<label class='radio-container'><h5>" + title + "</h5><input id='select-" + title + "' type='radio' name='oneOf' value='" + title + "'><span class='radio-checkmark'></span></label>";
                        selectCases.push(title);
                        layout += "<div class='reveal-" + title + "' style='opacity:0; max-height: 0; overflow: hidden;'>";
                        layout += create(path, formid);
                        layout += "</div>";
                    }
                    layout += "</div>";
                    // Footer
                    layout += "<div class='modal-footer'>";
                    layout += "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>";
                    layout += "<button type='submit' class='btn btn-primary' form='" + formid + "'>Create " + upperCaseFirst(id) + "</button>";
                    // layout += "<button type='submit' class='btn btn-primary' form='" + formid + "'>Create " + upperCaseFirst(id) + "</button>";  
                    layout += "</div></form></div></div></div>";
                    return layout;
                }

                //------------------------------Element Creation----------------------------

                // Create Elements
                function create(data, formid) {
                    var layout = "";
                    // Find the keys and the values
                    var key = Object.keys(data);
                    var val = Object.values(data);
                    for (i in key) {
                        // Check if there is enum, minItems, minProperties, minimum, maximum in the val array
                        var temp = Object.keys(val[i]);
                        for (j in temp) {
                            if (temp[j] === "enum") {
                                hasEnum = true;
                            }
                            if (temp[j] === "minItems") {
                                minItems = Object.values(val[i])[j];
                            }
                            if (temp[j] === "minProperties") {
                                minProperties = Object.values(val[i])[j];
                            }
                            if (temp[j] === "maxProperties") {
                                maxProperties = Object.values(val[i])[j];
                            }
                            if (temp[j] === "minimum") {
                                minimum = Object.values(val[i])[j];
                            }
                            if (temp[j] === "maximum") {
                                maximum = Object.values(val[i])[j];
                            }
                        }
                        // ----------------Cases----------------
                        if (key[i] === "id" && typeof val[i] != "object") { // id
                            var path = json;
                            var id = "";
                            var keywords = val[i].substring(2, val[i].length).split("/");
                            for (i in keywords) {
                                id = keywords[i];
                                path = path[keywords[i]];
                            }
                            output[id] = path;
                        } else if (key[i] === "required") { // required
                            required = val[i];
                        } else if (key[i] === "uniqueItems") { // uniqueItems
                            hasUniqueItems = val[i];
                        } else if (key[i] === "additionalProperties") { // additionalProperties
                            hasAdditionalProperties = val[i];
                        } else if (key[i] === "items") { // items
                            layout += create(val[i], formid);
                        } else if (key[i] === "properties") { // properties
                            layout += create(val[i], formid);
                        } else if (key[i] === "oneOf") { // oneOf
                            layout += oneOfCase(val[i], formid);
                        } else if (key[i] === "enum") { // enum
                            layout += "<h6><label for='label-" + objectName + "'>" + upperCaseFirst(objectName) + "</label></h6>";
                            layout += enumCase(val, formid);
                        } else if (typeof val[i] === "object") { // object
                            objectName = key[i];
                            layout += create(val[i], formid);
                        } else if (key[i] === '$ref') { // $ref
                            layout += itemCase(data, formid);
                        } else if (val[i] === "boolean") { // boolean
                            layout += "<p><label for='id-" + objectName + "' class='checkbox-container'>" + upperCaseFirst(objectName);
                            layout += "<input id='id-" + objectName + "' type='checkbox' name='" + objectName + "' form='" + formid + "'><span class='checkbox-checkmark'></span></label></p>";
                        } else if (key[i] === "type" && val[i] != "array" && val[i] != "object" && !hasEnum) { // string integer
                            layout += inputCase(val[i], formid);
                        }
                    }
                    return layout;
                }


                //-------------------------------Cases--------------------------------

                // Input Case
                function inputCase(data, formid) {
                    var layout = "";
                    var min = "";
                    var max = "";
                    var isRequired = false;
                    for (j in required) {
                        if (required[j] === objectName) {
                            isRequired += true;
                        }
                    }
                    if (data === "number") {
                        min += "min='" + minimum + "'";
                        max += "max='" + maximum + "'";
                    }
                    if (isRequired) {
                        layout += "<h6><label for='id-" + objectName + "'>" + upperCaseFirst(objectName) + " *</label></h6>";
                        layout += "<input id='id-" + objectName + "' class='form-control form-control-sm' name='" + objectName + "' type='" + data + "' placeholder='Enter " + upperCaseFirst(objectName) + "...' " + min + max + "  form='" + formid + "' required>";
                    } else {
                        layout += "<h6><label for='id-" + objectName + "'>" + upperCaseFirst(objectName) + "</label></h6>";
                        layout += "<input id='id-" + objectName + "' class='form-control form-control-sm' name='" + objectName + "' type='" + data + "' placeholder='Enter " + upperCaseFirst(objectName) + "...' " + min + max + " form='" + formid + "'>";
                    }
                    layout += "<div class='invalid-feedback'>Please choose a " + objectName + ".</div>";
                    return layout + "<br>";
                }

                // Item Case
                function itemCase(data, formid) {
                    var layout = "";
                    var ref = data.$ref;
                    var path = json;
                    var id;
                    var keywords = ref.substring(2, ref.length).split("/");
                    for (i in keywords) {
                        id = keywords[i];
                        path = path[keywords[i]];
                    }
                    zIndex += 200;
                    layout += "<p><h6><label for='id-" + id + "'>" + upperCaseFirst(id) + "</label></h6>";
                    layout += "<button type='button' class='btn btn-primary btn-sm' data-toggle='modal' data-target='#" + id + "-modal'>New " + upperCaseFirst(id) + "</button></p>";
                    nestedModal.push(id);
                    modalLayout = NestedModal(id, path) + modalLayout;
                    return layout;
                }

                // oneOf Case
                function oneOfCase(data, formid) {
                    var layout = "";
                    if (Object.keys(data[0]) == "$ref") {
                        layout += "<h6><label for='id-" + objectName + "'>" + upperCaseFirst(objectName) + "</label><div id='returnContent'></div></h6>";
                        layout += "<button type='button' class='btn btn-primary btn-sm' data-toggle='modal' data-target='#" + objectName + "-modal'>Select</button></p>";
                        oneOfCases.push(objectName);
                        modalLayout = SelectModal(objectName, data) + modalLayout;
                    } else {
                        layout += create(data, formid);
                    }
                    return layout;
                }

                // Enum Case
                function enumCase(val, formid) {
                    var layout = "";
                    layout += "<select class='form-control form-control-sm' form='" + formid + "'>";
                    for (j in val[i]) {
                        layout += "<option>" + val[i][j] + "</option>";
                    }
                    layout += "</select><br>";
                    hasEnum = false;
                    return layout;
                }
            }
        });
    });
}