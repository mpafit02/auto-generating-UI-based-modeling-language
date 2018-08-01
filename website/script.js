// General Variables
var json = undefined;
var hasEnum = false;
var hasAdditionalProperties = false;
var hasUniqueItems = false;
var isPercentage = false;
var objectName = "";
var returnContent = "";
var modalMap = new Map();
var itemMap = new Map();
var minItems = Number.MIN_VALUE;
var minProperties = Number.MIN_VALUE;
var minProperties = Number.MAX_VALUE;
var minimum = Number.MIN_VALUE;
var maximum = Number.MAX_VALUE;
var selectModalId = [];
var setModalId = [];
var slidersId = [];
var setModalPath = [];
var selectModalPath = [];
var selectCases = [];
var required = [];
var itemStack = [];
var outputData = {};
var formContent = {};
var dataJSON = {};
var zIndex;

// -----------------------------------JSON upload---------------------------------------
// Function for Upload File
function uploadFile(event) {
    var input = event.target;
    var txt = "";
    var reader = new FileReader();
    reader.onload = function () {
        var file = reader.result;
        var isValidJSON = isValid(file);
        if (isValidJSON) {
            txt += "<p><div style='font-weight: 700;'>Upload file: </div></p>";
            txt += "<i class='fa fa-file-text-o'style='font-size:30px; color:white;'></i>";
            txt += " " + input.files[0].name + "<br>";
            txt += "<input type='button' id='upload-btn' class='btn btn-primary float-right' value='Upload'>";
            json = JSON.parse(file);
            document.getElementById("output").innerHTML = txt;
            document.getElementById("upload-btn").addEventListener("click", function () {
                createPage();
                $("#upload-card").fadeOut();
            });
        } else {
            txt += "<div style='color:#ff2045;'>";
            txt += "<p><div style='font-weight: 700;'>Not valid: </div></p>";
            txt += "<i class='fa fa-file-text-o'style='font-size:30px;'></i>";
            txt += " " + input.files[0].name + "<br>";
            txt += "<br>Upload a valid JSON file!</div>";
            document.getElementById("output").innerHTML = txt;
        }
    };
    reader.readAsText(input.files[0]);
};
// Function for JSON file validation
function isValid(file) {
    try {
        JSON.parse(file);
        return true;
    } catch (e) {
        return false;
    }
}
// Function  the returns upper case first character of the string
function upperCaseFirst(string) {
    return (string.charAt(0).toUpperCase() + string.slice(1)).split("-").join(' ');
}
// Function that uncheck radio buttons     
function unckeckRadioButtons() {
    for (i in selectCases) {
        $('#select-' + selectCases[i])[0].checked = false;
        var other = $('#select-' + selectCases[i]).val();
        $('.reveal-' + other).show().css({
            'opacity': '0',
            'max-height': '0',
            'overflow': 'hidden'
        });
    }
}
// Main function that creates the html
function createPage() {
    document.getElementById("app").innerHTML = `
        <nav class="navbar fixed-top top-nav text-light" style='background-color: rgba(30,30,30,0.6);'>
        <div class="navbar-brand mb-0 h1 text-light">${json.description}</div>
        <input type="button" class='btn btn-primary btn-sm float-right' id="download-btn" value='Download' disabled>
        </nav>
        <input type='button' class='btn btn-lg btn-dark shadow centered' data-toggle='modal' data-target='#base-modal' value='Start'>
        <div id='base-modal-html' style='z-index:1000;'></div>
        <div id='set-modal-html'></div>
        <div id='select-modal-html'></div>
    `;
    // Create the base modal
    baseModalCreation("Properties", json.properties);
    // Call function for listeners
    callListener();

    // ----------------------------------------------------Methods--------------------------------------------------------
    // Control depth of modal backdrop
    $(document).on('show.bs.modal', '.modal', function () {
        zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function () {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });
    // Modal Show
    function modalShow(modalId) {
        $('#' + modalId).appendTo('body').modal('show');
    }
    // Modal Hide
    function modalHide(modalId) {
        $('#' + modalId).appendTo('body').modal('hide');
    }
    // Start file download.
    document.getElementById("download-btn").addEventListener("click", function () {
        var filename = "data.json";
        swal({
            title: 'Are you sure?',
            text: "Do you want to download '" + filename + "'?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                swal({
                    title: 'Downloading!',
                    text: 'Your file has been downloaded.',
                    type: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
                download(filename, dataJSON);
            } else if (
                // Read more about handling dismissals
                result.dismiss === swal.DismissReason.cancel
            ) {
                swal({
                    title: 'Cancelled',
                    text: 'Try again later.',
                    type: 'error',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        })
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
    // Save form button
    document.getElementById('save-form-btn').addEventListener("click", function () {
        swal({
            type: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1500
        });
        $("#base-modal").modal('hide');
        $("#download-btn").removeAttr("disabled");
    });
    // Call Listeners
    function callListener() {
        // Check for key press actions in set modal
        for (i in setModalId) {
            buttonsForSetModal(setModalId[i], setModalPath[i]);
        }
        // Check for key press actions in select modal
        for (i in selectModalId) {
            buttonsForSelectModal(selectModalId[i], selectModalPath[i]);
        }
        // Display sliders value
        for (i in slidersId) {
            actionInSlider(slidersId[i]);
        }
    }
    // Function to call the radio button listener
    function radioButtonListener(radioName) {
        $("input[name=" + radioName + "]").on("click", function () {
            var radioId = $("input[name=" + radioName + "]:checked").val();
            if (radioId == undefined) {
                radioId = "";
            }
            returnContent = radioId;
            $('.reveal-' + radioId).show().css({
                'opacity': '1',
                'max-height': 'inherit',
                'overflow': 'visible'
            });
            for (i in selectCases) {
                var other = $('#select-' + selectCases[i]).val();
                if (other != radioId) {
                    $('.reveal-' + other).show().css({
                        'opacity': '0',
                        'max-height': '0',
                        'overflow': 'hidden'
                    });
                }
            }
        });
    }
    // Function to change the value of a slider
    function actionInSlider(id) {
        var sliderId = id + "-rangeInput";
        var outputId = id;
        var slider = document.getElementById(sliderId);
        var output = document.getElementById(outputId);
        output.value = slider.value; // Display the default slider value
        // Update the current slider value (each time you drag the slider handle)
        slider.oninput = function () {
            output.value = this.value;
        }
        output.oninput = function () {
            slider.value = this.value;
        }
    }
    // ------------------------------------------------Function for buttons in set modal---------------------------------------------
    function buttonsForSetModal(id, path) {
        var setBtn = id + '-set-btn';
        var editBtn = id + '-edit-btn';
        var createBtn = id + '-create-btn';
        var cancelBtn = id + '-cancel-btn';
        var cancelSaveBtn = id + '-cancel-save-btn';
        var saveBtn = id + '-save-btn';
        var modal = id + '-modal';
        var formid = id + '-form';
        var form;
        var nestedCurrentPath;
        var modalIsCreated = false;
        // Listener for the set button to create the set modal
        document.getElementById(setBtn).addEventListener("click", function () {
            // Creates the modal if it is the first time pressing the button
            if (!modalIsCreated) {
                setModalId = [];
                setModalPath = [];
                selectModalId = [];
                selectModalPath = [];
                // Create the modal for the set case
                setModalCreation(id, path);
                // Activates the listeners for the buttons in the modal
                callListener();
                modalIsCreated = true;
            }
            // Presents the modal
            modalShow(modal);
            form = document.getElementById(formid);
            // Item creation in item Stack
            itemStack.push({});
            // Listener for the create button to finish the set modal
            document.getElementById(createBtn).addEventListener("click", function () {
                // Validate the form
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    // Create item's properties
                    formContent[id] = $(form).serializeArray();
                    for (j in formContent[id]) {
                        itemStack[itemStack.length - 1][formContent[id][j].name] = formContent[id][j].value;
                    }
                    // Transfer item's to export file object
                    if (itemStack.length > 1) {
                        itemStack[itemStack.length - 2][id] = itemStack[itemStack.length - 1];
                        nestedCurrentPath = itemStack[itemStack.length - 2][id];
                        itemStack.pop(itemStack[itemStack.length - 1]);
                    } else {
                        dataJSON[id] = itemStack[0];
                        nestedCurrentPath = dataJSON[id];
                        itemStack.pop(itemStack[itemStack.length - 1]);
                    }
                    //console.log(dataJSON);
                    $('#' + createBtn).hide();
                    $('#' + setBtn).hide();
                    $('#' + cancelBtn).hide();
                    $('#' + cancelSaveBtn).removeAttr('hidden');
                    $('#' + saveBtn).removeAttr('hidden');
                    $('#' + editBtn).removeAttr('hidden');
                    modalHide(modal);
                }
                form.classList.add('was-validated');
            });
            // Listener for the cancel button in the set modal
            document.getElementById(cancelBtn).addEventListener('click', function () {
                modalHide(modal);
            });
        });
        // Listener for the edit button to change the set modal
        document.getElementById(editBtn).addEventListener("click", function () {
            modalShow(modal);
            itemStack.push(nestedCurrentPath);
            document.getElementById(saveBtn).addEventListener('click', function () {
                // Validate the form
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    // Create item's properties
                    formContent[id] = $(form).serializeArray();
                    for (j in formContent[id]) {
                        nestedCurrentPath[formContent[id][j].name] = formContent[id][j].value;
                    }
                    // Transfer item's to export file object
                    if (itemStack.length <= 1) {
                        itemStack.pop(itemStack[itemStack.length - 1]);
                    }
                    //console.log(dataJSON);
                    modalHide(modal);
                }
                form.classList.add('was-validated');
            });
            // Listener for the cancel button in the edit modal
            document.getElementById(cancelSaveBtn).addEventListener('click', function () {
                // Recovering the last saved form input
                for (j in formContent[id]) {
                    $("#" + formid + " input[name=" + formContent[id][j].name + "]").val(formContent[id][j].value);
                }
                modalHide(modal);
            });
        });
    }
    // ------------------------------------------------Function for buttons in select modal---------------------------------------------
    function buttonsForSelectModal(id, path) {
        var modal = id + '-modal';
        var createBtn = id + '-create-btn';
        var editBtn = id + '-edit-btn';
        var cancelBtn = id + '-cancel-btn';
        var cancelSaveBtn = id + '-cancel-save-btn';
        var saveBtn = id + '-save-btn';
        var selectBtn = id + '-select-btn';
        var radioName = id + '-radio';
        var nestedCurrentPath = null;
        var modalIsCreated = false;
        // Listener for the select button to create the select modal
        document.getElementById(selectBtn).addEventListener("click", function () {
            // Creates the modal if it is the first time pressing the button
            if (!modalIsCreated) {
                setModalId = [];
                setModalPath = [];
                selectModalId = [];
                selectModalPath = [];
                // Create the modal for the select case
                selectModalCreation(id, path);
                // Activates the listeners for the buttons in the modal
                callListener();
                // Activates the lsiteners for the radio buttons
                radioButtonListener(radioName);
                modalIsCreated = true;
            }
            // Presents the modal
            modalShow(modal);
            // Item creation in item Stack
            if (nestedCurrentPath != null) {
                itemStack.push(nestedCurrentPath);
            } else {
                itemStack.push({});
            }
            // Listener for create button in select case
            document.getElementById(createBtn).addEventListener("click", function () {
                var selectedCase;
                //Find the selected case
                for (j in selectCases) {
                    if ($('#select-' + selectCases[j])[0].checked) {
                        selectedCase = $('#select-' + selectCases[j])[0].value;
                        var formid = id + "-" + returnContent + '-form';
                        var form = document.getElementById(formid);
                        if (form.checkValidity() === false) {
                            event.preventDefault();
                            event.stopPropagation();
                        } else {
                            // Create item's properties
                            formContent[id] = {};
                            formContent[id][selectedCase] = $(form).serializeArray();
                            itemStack[itemStack.length - 1] = {};
                            itemStack[itemStack.length - 1][selectedCase] = {};
                            for (j in formContent[id][selectedCase]) {
                                itemStack[itemStack.length - 1][selectedCase][formContent[id][selectedCase][j].name] = formContent[id][selectedCase][j].value;
                            }
                            // Transfer item's to export file object
                            if (itemStack.length > 1) {
                                itemStack[itemStack.length - 2][id] = itemStack[itemStack.length - 1];
                                nestedCurrentPath = itemStack[itemStack.length - 2][id];
                                itemStack.pop(itemStack[itemStack.length - 1]);
                            } else {
                                dataJSON[id] = itemStack[0];
                                nestedCurrentPath = dataJSON[id];
                                itemStack.pop(itemStack[itemStack.length - 1]);
                            }
                            //console.log(dataJSON);
                            $('#' + createBtn).hide();
                            $('#' + cancelBtn).hide();
                            $('#' + selectBtn).hide();
                            $('#' + saveBtn).removeAttr('hidden');
                            $('#' + cancelSaveBtn).removeAttr('hidden');
                            $('#' + editBtn).removeAttr('hidden');
                            document.getElementById(editBtn).value = upperCaseFirst(returnContent);
                            modalHide(modal);
                        }
                        form.classList.add('was-validated');
                    }
                }
            });
            // Listener for the cancel button in select modal
            document.getElementById(cancelBtn).addEventListener('click', function () {
                unckeckRadioButtons();
                modalHide(modal);
            });
        });
        // Listener for edit button in select case
        document.getElementById(editBtn).addEventListener("click", function () {
            var formid;
            modalShow(modal);
            // Listener for the save button in select modal
            document.getElementById(saveBtn).addEventListener('click', function () {
                for (j in selectCases) {
                    if ($('#select-' + selectCases[j])[0].checked) {
                        selectedCase = $('#select-' + selectCases[j])[0].value;
                        formid = id + "-" + returnContent + '-form';
                        var form = document.getElementById(formid);
                        if (form.checkValidity() === false) {
                            event.preventDefault();
                            event.stopPropagation();
                        } else {
                            // Create item's properties
                            formContent[id] = {};
                            formContent[id][selectedCase] = $(form).serializeArray();
                            nestedCurrentPath[selectedCase] = {};
                            for (j in formContent[id][selectedCase]) {
                                nestedCurrentPath[selectedCase][formContent[id][selectedCase][j].name] = formContent[id][selectedCase][j].value;
                            }
                            //console.log(dataJSON);
                            modalHide(modal);
                        }
                        form.classList.add('was-validated');
                    } else {
                        delete nestedCurrentPath[selectCases[j]];
                    }
                }
            });
            // Listener for the cancel button in the select modal
            document.getElementById(cancelSaveBtn).addEventListener('click', function () {
                modalHide(modal);
            });
        });
    }
    //---------------------------------DIALOGS------------------------------------
    // Base Modal
    function baseModalCreation(id, path) {
        var layout = "";
        // Modal
        layout += "<div class='modal fade' id='base-modal' role='dialog'>";
        layout += "<div class='modal-dialog modal-lg'>";
        layout += "<div class='modal-content'>";
        // Header
        layout += "<div class='modal-header'>";
        layout += "<h5 class='modal-title'>" + id + "</h5></div>";
        // Body 
        var formid = "base-form";
        layout += "<form id='" + formid + "' class='needs-validation' novalidate>";
        layout += "<div id='base-modal-body' class='modal-body'>" + create(path, formid) + "</div>";
        // Footer
        layout += "<div class='modal-footer'>";
        layout += "<input type='button' class='btn btn-secondary' data-dismiss='modal' value='Cancel'>";
        layout += "<input type='button' class='btn btn-primary' id='save-form-btn' form='" + formid + "' value='Finish'>";
        layout += "</div></form></div></div></div>";
        $("#base-modal-html").html(layout);
    }
    // Set Modal
    function setModalCreation(id, path) {
        var layout = "";
        // Modal
        layout += "<div class='modal fade' id='" + id + "-modal' role='dialog'>";
        layout += "<div class='modal-dialog modal-lg'>";
        layout += "<div class='modal-content'>";
        // Header
        layout += "<div class='modal-header'>";
        layout += "<h5 id='" + id + "-modal-title' class='modal-title'>" + upperCaseFirst(id) + "</h5></div>";
        // Body 
        var formid = id + "-form";
        layout += "<form id='" + formid + "' class='needs-validation' novalidate>";
        layout += "<div class='modal-body'>" + create(path, formid) + "</div>";
        // Footer
        layout += "<div class='modal-footer'>";
        layout += "<input type='button' id='" + id + "-cancel-btn' class='btn btn-secondary' value='Cancel'>";
        layout += "<input type='button' id='" + id + "-cancel-save-btn' class='btn btn-secondary' value='Cancel' hidden>";
        layout += "<input type='button' id='" + id + "-create-btn' class='btn btn-primary' value='Set " + upperCaseFirst(id) + "'>";
        layout += "<input type='button' id='" + id + "-save-btn' class='btn btn-success' value='Save " + upperCaseFirst(id) + "' hidden>";
        layout += "</div></form></div></div></div>";
        document.getElementById("set-modal-html").innerHTML += layout;
    }
    // Select Modal
    function selectModalCreation(id, data) {
        var layout = "";
        var title = "";
        // Modal
        layout = "<div class='modal fade' id='" + id + "-modal' role='dialog' >";
        layout += "<div class='modal-dialog modal-lg'>";
        layout += "<div class='modal-content'>";
        // Header
        layout += "<div class='modal-header'>";
        layout += "<h5 class='modal-title'>" + upperCaseFirst(id) + "</h5></div>";
        // Body 
        layout += "<div class='modal-body'>";
        for (j in data) {
            if (Object.keys(data[j]) == "$ref") {
                var ref = data[j].$ref;
                var path = json;
                var keywords = ref.substring(2, ref.length).split("/");
                for (i in keywords) {
                    title = keywords[i];
                    path = path[keywords[i]];
                }
                layout += "<label class='radio-container'><h6>" + upperCaseFirst(title) + "</h6><input id='select-" + title + "' type='radio' name='" + id + "-radio' value='" + title + "'><span class='radio-checkmark'></span></label>";
                selectCases.push(title);
                layout += "<div class='reveal-" + title + "' style='opacity:0; max-height: 0; overflow: hidden;'>";
                var formid = id + "-" + title + "-form";
                layout += "<form id='" + formid + "' class='needs-validation' novalidate>";
                layout += create(path, formid);
                layout += "</form>"
                layout += "</div>";
            } else {
                title = Object.keys(data[j])[0];
                layout += "<label class='radio-container'><h6>" + upperCaseFirst(title) + "</h6><input id='select-" + title + "' type='radio' name='" + id + "-radio' value='" + title + "'><span class='radio-checkmark'></span></label>";
                selectCases.push(title);
                layout += "<div class='reveal-" + title + "' style='opacity:0; max-height: 0; overflow: hidden;'>";
                var formid = id + "-" + title + "-form";
                layout += "<form id='" + formid + "' class='needs-validation' novalidate>";
                layout += create(data[j], formid);
                layout += "</form>"
                layout += "</div>";
            }
        }
        layout += "</div>";
        // Footer
        layout += "<div class='modal-footer'>";
        layout += "<input type='button' id='" + id + "-cancel-btn' class='btn btn-secondary' value='Cancel'>";
        layout += "<input type='button' id='" + id + "-cancel-save-btn' class='btn btn-secondary' value='Cancel' hidden>";
        layout += "<input type='button' id='" + id + "-save-btn' class='btn btn-success' value='Save' hidden>";
        layout += "<input type='button' id='" + id + "-create-btn' class='btn btn-primary' value='Create " + upperCaseFirst(id) + "'>";
        layout += "</div></div></div></div>";
        document.getElementById("select-modal-html").innerHTML += layout;
    }
    //-------------------------------Cases--------------------------------
    // Input Case
    function inputCase(data, formid) {
        var layout = "<p>";
        var isRequiredHtml = "";
        var isRequiredText = "";
        for (j in required) {
            if (required[j] === objectName) {
                isRequiredHtml = "*";
                isRequiredText = "required";
            }
        }
        if (isPercentage) {
            layout += "<h6><label for='" + objectName + "'>" + upperCaseFirst(objectName) + " " + isRequiredHtml + "</label></h6>";
            layout += "<input id='" + objectName + "' class='form-control form-control-sm' name='" + objectName + "' type='" + data + "' autocomplete='off' value='50' " + min + max + " form='" + formid + "' " + isRequiredText + ">";
            layout += "<div class='slidecontainer'>";
            layout += "<input type='range' id='" + objectName + "-rangeInput' min='0' max='100' value='50' class='slider' id='" + objectName + "'></div>";
            slidersId.push(objectName);
            isPercentage = false;
        } else {
            var min = "";
            var max = "";
            if (data === "number") {
                min += "min='" + minimum + "'";
                max += "max='" + maximum + "'";
            }
            layout += "<h6><label for='" + objectName + "'>" + upperCaseFirst(objectName) + " " + isRequiredHtml + "</label></h6>";
            layout += "<input id='" + objectName + "' class='form-control form-control-sm' name='" + objectName + "' type='" + data + "' autocomplete='off' placeholder='Enter " + upperCaseFirst(objectName) + "...' " + min + max + " form='" + formid + "' " + isRequiredText + ">";
            layout += "<div class='invalid-feedback'>Please choose a " + objectName + ".</div>";
        }
        return layout + "</p>";
    }
    // Set Case
    function setCase(data, formid) {
        var layout = "";
        var ref = data.$ref;
        var path = json;
        var objectId;
        var isRequiredHtml = "";
        var keywords = ref.substring(2, ref.length).split("/");
        for (i in keywords) {
            objectId = keywords[i];
            path = path[keywords[i]];
        }
        if (modalMap.has(objectId)) {
            modalMap.set(objectId, modalMap.get(objectId) + 1);
        } else {
            modalMap.set(objectId, 1);
        }
        for (j in required) {
            if (required[j] === objectId) {
                isRequiredHtml = "*";
            }
        }
        var id = objectId + "-" + modalMap.get(objectId);
        layout += "<p><h6><label for='" + id + "-set-btn'>" + upperCaseFirst(id) + " " + isRequiredHtml + "</label></h6>";
        layout += "<input type='button' name='" + id + "' id='" + id + "-set-btn' class='btn btn-primary btn-sm' data-toggle='modal' data-target='#" + id + "-modal' value='Set " + upperCaseFirst(id) + "'>";
        layout += "<input type='button' name='" + id + "' id='" + id + "-edit-btn' class='btn btn-success btn-sm' data-toggle='modal' data-target='#" + id + "-modal' value='Edit " + upperCaseFirst(id) + "' hidden>";
        layout += "</p>";
        setModalId.push(id);
        setModalPath.push(path);
        return layout;
    }
    // OneOf Case
    function oneOfCase(data, formid) {
        var layout = "";
        if (modalMap.has(objectName)) {
            modalMap.set(objectName, modalMap.get(objectName) + 1);
        } else {
            modalMap.set(objectName, 1);
        }
        var id = objectName + "-" + modalMap.get(objectName);
        layout += "<p><h6><label for='" + id + "-select-btn'>" + upperCaseFirst(id) + "</label></h6>";
        layout += "<input id='" + id + "-select-btn' type='button' class='btn btn-primary btn-sm' data-toggle='modal' data-target='#" + id + "-modal' value='Select " + upperCaseFirst(id) + "'>";
        layout += "<input id='" + id + "-edit-btn' type='button' class='btn btn-success btn-sm' data-toggle='modal' data-target='#" + id + "-modal' value='" + upperCaseFirst(id) + "' hidden>";
        layout += "</p>";
        selectModalId.push(id);
        selectModalPath.push(data);
        return layout;
    }
    // Enum Case
    function enumCase(data, formid) {
        var key = Object.keys(data);
        var val = Object.values(data);
        for (j in key) {
            if (key[j] == "enum") {
                val = val[j];
            }
        }
        var layout = "";
        var isRequiredHtml = "";
        for (j in required) {
            if (required[j] === objectName) {
                isRequiredHtml = "*";
            }
        }
        layout += "<h6><label for='label-" + objectName + "'>" + upperCaseFirst(objectName) + " " + isRequiredHtml + "</label></h6>";
        layout += "<p><select name='" + objectName + "' class='form-control form-control-sm' form='" + formid + "'>";
        for (j in val) {
            layout += "<option>" + val[j] + "</option>";
        }
        layout += "</select></p>";
        hasEnum = false;
        return layout;
    }
    // Boolean Case
    function booleanCase(formid) {
        layout = "";
        layout += "<p><label for='" + objectName + "' class='checkbox-container'>" + upperCaseFirst(objectName);
        layout += "<input id='" + objectName + "' type='checkbox' name='" + objectName + "' form='" + formid + "'><span class='checkbox-checkmark'></span></label></p>";
        return layout;
    }
    //------------------------------Element Creation---------------------------
    // Create Elements
    function create(data, formid) {
        var layout = "";
        var key = Object.keys(data);
        var val = Object.values(data);
        minItems = Number.MIN_VALUE;
        minProperties = Number.MIN_VALUE;
        minProperties = Number.MAX_VALUE;
        minimum = Number.MIN_VALUE;
        maximum = Number.MAX_VALUE;
        for (j in key) {
            if (key[j] === "enum") {
                hasEnum = true;
            }
        }
        for (i in key) {
            // Check if there is enum, minItems, minProperties, minimum, maximum in the val array
            var nextKey = Object.keys(val[i]);
            var nextVal = Object.values(val[i]);
            for (j in nextKey) {
                if (nextKey[j] === "minItems") {
                    minItems = nextVal[j];
                }
                if (nextKey[j] === "minProperties") {
                    minProperties = nextVal[j];
                }
                if (nextKey[j] === "maxProperties") {
                    maxProperties = nextVal[j];
                }
                if (nextKey[j] === "minimum") {
                    minimum = nextVal[j];
                }
                if (nextKey[j] === "maximum") {
                    maximum = nextVal[j];
                }
                if (nextKey[j] === "uniqueItems") { // uniqueItems
                    hasUniqueItems = nextVal[j];
                }
                if (nextKey[j] === "additionalProperties") { // additionalProperties
                    hasAdditionalProperties = nextVal[j];
                }
                if (minimum == 0 && maximum == 100) {
                    isPercentage = true;
                }
            }
            // ----------------Cases----------------
            if (key[i] === "id" && typeof val[i] != "object") { // id
                // Do nothing - Ingore
            } else if (key[i] === "required") { // required
                required = val[i];
            } else if (key[i] === "items") { // items
                layout += create(val[i], formid);
            } else if (key[i] === "properties") { // properties
                layout += create(val[i], formid);
            } else if (key[i] === "oneOf") { // oneOf
                layout += oneOfCase(val[i], formid);
            } else if (key[i] === "enum") { // enum
                layout += enumCase(val[i], formid);
            } else if (typeof val[i] === "object") { // object
                objectName = key[i];
                layout += create(val[i], formid);
            } else if (key[i] === '$ref') { // $ref
                layout += setCase(data, formid);
            } else if (val[i] === "boolean") { // boolean
                layout += booleanCase(formid);
            } else if (key[i] === "type" && val[i] != "array" && val[i] != "object" && !hasEnum) { // string integer percentage
                layout += inputCase(val[i], formid);
            }
        }
        return layout;
    }
}