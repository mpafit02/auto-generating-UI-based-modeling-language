// General Variables
var json = undefined;
var active = false;
var hasEnum = false;
var hasAdditionalProperties = false;
var hasUniqueItems = false;
var isPercentage = false;
var formIsSaved = false;
var objectName = "";
var previousObjectName = "";
var returnContent = "";
var modalLayout = "";
var existingItems = "";
var parent = "";
var idCounter = 0;
var inputCounter = 0;
var selectCounter = 0;
var modalMap = new Map();
var itemMap = new Map();
var minItems = Number.MIN_VALUE;
var minProperties = Number.MIN_VALUE;
var minProperties = Number.MAX_VALUE;
var minimum = Number.MIN_VALUE;
var maximum = Number.MAX_VALUE;
var items = [];
var selectModalId = [];
var itemModalId = [];
var setModalId = [];
var slidersId = [];
var setModalPath = [];
var itemModalPath = [];
var selectModalPath = [];
var selectCases = [];
var required = [];
var editModal = [];
var itemsID = [];
var itemStack = [];
var nestedPath = [];
var modalStack = ["base-modal"];
var outputData = {};
var formContent = {};
var innerObject = {};
var dataJSON = {};
var currentPath = {};
var currentItemsPath = {};
// -------------------------------Modal Hide & Show ------------------------------------
// // Modal Show
// function modalShow(modalId) {
//     $('#' + modalStack[modalStack.length - 1]).modal('hide');
//     modalStack.push(modalId);
//     $('#' + modalId).modal('show');
// }
// // Modal Hide
// function modalHide(modalId) {
//     $('#' + modalId).modal('hide');
//     modalStack.pop(modalId);
//     $('#' + modalStack[modalStack.length - 1]).modal('show');
// }
// Modal Show
function modalShow(modalId) {
    $('#' + modalStack[modalStack.length - 1]).appendTo('body').modal('hide');
    modalStack.push(modalId);
    $('#' + modalId).appendTo('body').modal('show');
}
// Modal Hide
function modalHide(modalId) {
    $('#' + modalId).appendTo('body').modal('hide');
    modalStack.pop(modalId);
    $('#' + modalStack[modalStack.length - 1]).appendTo('body').modal('show');
}
// -----------------------------------JSON upload---------------------------------------
// Upload File
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
// Validate JSON file
function isValid(file) {
    try {
        JSON.parse(file);
        return true;
    } catch (e) {
        return false;
    }
}
// Upper Case First Character
function upperCaseFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
// Uncheck Radio Buttons     
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
// Create Page
function createPage() {
    document.getElementById("app").innerHTML = `
        <nav class="navbar fixed-top top-nav text-light" style='background-color: rgba(30,30,30,0.6);'>
        <div class="navbar-brand mb-0 h1 text-light">${json.description}</div>
        <input type="button" class='btn btn-primary btn-sm float-right' id="download-btn" value='Save' disabled>
        </nav>
        <input type='button' class='btn btn-lg btn-dark shadow centered' data-toggle='modal' data-target='#base-modal' value='Start'>
        <div id='base-modal-html'></div>
        <div id='item-modal-html'></div>
        <div id='set-modal-html'></div>
        <div id='select-modal-html'></div>
        <div id='confirmation-modal-html'></div>
    `;
    // Create the confirmation modal
    confirmationModalCreation();
    // Create the base modal
    baseModalCreation("Properties", json.properties);
    // Call function for listeners
    callListeners();

    // -------------------------------Methods------------------------------------
    // Start file download.
    document.getElementById("download-btn").addEventListener("click", function () {
        var filename = "data.json";
        download(filename, dataJSON);
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
        alert("Form saved!");
        $("#base-modal").modal('hide');
        $("#download-btn").removeAttr("disabled");
    });

    // Call Listeners
    function callListeners() {
        // Check for key press actions in set modal
        for (i in setModalId) {
            buttonsForSetModal(setModalId[i], setModalPath[i]);
        }
        // Check for key press actions in nested modal
        for (i in itemModalId) {
            buttonsForItemModal(itemModalId[i], itemModalPath[i]);
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
    }
    // Function for submit buttons in Nested Modal
    function buttonsForSetModal(id, path) {
        var setBtn = id + '-set-btn';
        var editBtn = id + '-edit-btn';
        var doneBtn = id + '-done-btn';
        var cancelBtn = id + '-cancel-btn';
        var saveBtn = id + '-save-btn';
        var modal = id + '-modal';
        var formid = id + '-form';
        var form;
        var nestedCurrentPath;
        document.getElementById(setBtn).addEventListener("click", function () {
            itemModalId = [];
            itemModalPath = [];
            setModalId = [];
            setModalPath = [];
            selectModalId = [];
            selectModalPath = [];
            setModalCreation(id, path);
            modalShow(modal);
            callListeners();
            form = document.getElementById(formid);
            // Item creation
            itemStack.push({});
            document.getElementById(doneBtn).addEventListener("click", function () {
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
                    console.log(dataJSON)
                    itemsID.push(id);
                    nestedPath.push(nestedCurrentPath);
                    modalHide(modal);

                    $('#' + doneBtn).hide();
                    $('#' + setBtn).hide();
                    $('#' + saveBtn).removeAttr('hidden');
                    $('#' + editBtn).removeAttr('hidden');
                }
                form.classList.add('was-validated');
            });
            document.getElementById(saveBtn).addEventListener('click', function () {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    // Create item's properties
                    formContent[id] = $(form).serializeArray();
                    for (j in formContent[id]) {
                        nestedCurrentPath[formContent[id][j].name] = formContent[id][j].value;
                    }
                    console.log(dataJSON)
                    modalHide(modal);
                }
                form.classList.add('was-validated');
            });
            document.getElementById(cancelBtn).addEventListener('click', function () {
                event.preventDefault();
                event.stopPropagation();
                modalHide(modal);
            });
        });
        document.getElementById(editBtn).addEventListener("click", function () {
            modalShow(modal);
            document.getElementById(saveBtn).addEventListener('click', function () {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    // Create item's properties
                    formContent[id] = $(form).serializeArray();
                    for (j in formContent[id]) {
                        nestedCurrentPath[formContent[id][j].name] = formContent[id][j].value;
                    }
                    console.log(dataJSON)
                    modalHide(modal);
                }
                form.classList.add('was-validated');
            });
            document.getElementById(cancelBtn).addEventListener('click', function () {
                event.preventDefault();
                event.stopPropagation();
                modalHide(modal);
            });
        });
    }
    // Function for buttons in Item Modal
    function buttonsForItemModal(id, path) {
        var addBtn = id + '-add-btn';
        document.getElementById(addBtn).addEventListener("click", function () {
            var createBtn = id + '-create-btn';
            var cancelBtn = id + '-cancel-btn';
            var saveBtn = id + '-save-btn';
            var modal = id + '-modal';
            var formid = id + '-form';
            itemModalId = [];
            itemModalPath = [];
            setModalId = [];
            setModalPath = [];
            selectModalId = [];
            selectModalPath = [];
            itemModalCreation(id, path);
            modalShow(modal);
            callListeners();
            var form = document.getElementById(formid);
            $("#" + saveBtn).hide();
            $("#" + createBtn).show();
            // Item creation
            itemStack.push({});
            document.getElementById(createBtn).addEventListener("click", function () {
                var nestedCurrentPath;
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    if (itemMap.has(id)) {
                        itemMap.set(id, itemMap.get(id) + 1);
                    } else {
                        itemMap.set(id, 1);
                    }
                    var itemId = id + "-" + itemMap.get(id);
                    var editBtn = itemId + '-edit-btn';
                    var btnGroup = itemId + '-btn-group';
                    var deleteBtn = itemId + '-delete-btn';
                    // Create buttons for edit dialog
                    var layout = "<div id='" + btnGroup + "' class='btn-group btn-space' role='group'>";
                    layout += "<button type='button' id='" + editBtn + "' class='btn btn-primary btn-sm' data-toggle='modal' data-target='#" + id + "-modal'>" + upperCaseFirst(id) + " " + itemMap.get(id) + "</button>";
                    layout += "<button type='button' id='" + deleteBtn + "' class='btn btn-danger btn-sm' data-toggle='modal' data-target='#confirmation-modal'>";
                    layout += "<i class='fa fa-trash-o' style='font-size:18px' aria-hidden='true'></i></button></div>";
                    document.getElementById(id + "-existing-items").innerHTML += layout;
                    // Create item's properties
                    formContent[itemId] = $(form).serializeArray();
                    for (j in formContent[itemId]) {
                        itemStack[itemStack.length - 1][formContent[itemId][j].name] = formContent[itemId][j].value;
                    }
                    // Transfer item's to export file object
                    if (itemStack.length > 1) {
                        itemStack[itemStack.length - 2][itemId] = itemStack[itemStack.length - 1];
                        nestedCurrentPath = itemStack[itemStack.length - 2][itemId];
                        itemStack.pop(itemStack[itemStack.length - 1]);
                    } else {
                        dataJSON[itemId] = itemStack[0];
                        nestedCurrentPath = dataJSON[itemId];
                        itemStack.pop(itemStack[itemStack.length - 1]);
                    }
                    console.log(dataJSON)
                    itemsID.push(itemId);
                    nestedPath.push(nestedCurrentPath);
                    buttonItemFunction(itemId, formid, saveBtn, modal, createBtn, id, nestedCurrentPath);
                    modalHide(modal);
                }
                form.classList.add('was-validated');
            });
            document.getElementById(cancelBtn).addEventListener('click', function () {
                modalHide(modal);
            });
        });
    }
    // Function for item buttons
    function buttonItemFunction(itemId, formid, saveBtn, modal, createBtn, id, path) {
        var editBtn = itemId + '-edit-btn';
        var btnGroup = itemId + '-btn-group';
        var deleteBtn = itemId + '-delete-btn';
        var saveButton = itemId + '-save-btn';
        var form = document.getElementById(formid);
        document.getElementById(editBtn).addEventListener("click", function () {
            modalShow(modal);
            document.getElementById(id + "-modal-title").innerText = upperCaseFirst(itemId.split("-").join(" "));
            document.getElementById(saveBtn).innerHTML = "<input type='button' id='" + saveButton + "' class='btn btn-success' value='Save'>";;
            $("#" + saveBtn).show();
            $("#" + createBtn).hide();
            for (var k in formContent[itemId]) {
                document.forms[formid][formContent[itemId][k].name].value = formContent[itemId][k].value;
            }
            document.getElementById(saveButton).addEventListener("click", function () {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    // Create item's properties
                    formContent[itemId] = $(form).serializeArray();
                    for (j in formContent[itemId]) {
                        path[formContent[itemId][j].name] = formContent[itemId][j].value;
                    }
                    console.log(dataJSON);
                    modalHide(modal);
                }
                form.classList.add('was-validated');
            });
        });
        document.getElementById(deleteBtn).addEventListener("click", function () {
            document.getElementById('delete-item-btn').addEventListener("click", function () {
                formContent[itemId] = {};
                $("#" + btnGroup).hide();
                $('#confirmation-modal').modal('hide');
            });
        });
    }
    // Function for submit buttons in Select Modal
    function buttonsForSelectModal(id, path) {
        var modal = id + '-modal';
        var createBtn = id + '-create-btn';
        var cancel = id + '-cancel';
        var saveBtn = id + '-save-btn';
        var selectBtn = id + '-select-btn';
        var nestedCurrentPath = null;
        document.getElementById(selectBtn).addEventListener("click", function () {
            itemModalId = [];
            itemModalPath = [];
            setModalId = [];
            setModalPath = [];
            selectModalId = [];
            selectModalPath = [];
            selectModalCreation(id, path);
            modalShow(modal);
            callListeners();
            // Item creation
            if (nestedCurrentPath != null) {
                itemStack.push(nestedCurrentPath);
            } else {
                itemStack.push({});
            }
            // Display the dialog which is selected in oneOf case
            $("input").on("click", function () {
                var radioId = $("input:checked").val();
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
                            console.log(dataJSON)
                            document.getElementById(selectBtn).value = upperCaseFirst(returnContent);
                            $('#' + createBtn).hide();
                            $('#' + cancel).hide();
                            $('#' + saveBtn).removeAttr('hidden');
                            modalHide(modal);
                        }
                        form.classList.add('was-validated');
                    }
                }
            });
            document.getElementById(saveBtn).addEventListener('click', function () {
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
                            nestedCurrentPath[selectedCase] = {};
                            for (j in formContent[id][selectedCase]) {
                                nestedCurrentPath[selectedCase][formContent[id][selectedCase][j].name] = formContent[id][selectedCase][j].value;
                            }
                            console.log(dataJSON);
                            modalHide(modal);
                        }
                        form.classList.add('was-validated');
                    } else {
                        delete nestedCurrentPath[selectCases[j]];
                    }
                }
            });
            document.getElementById(cancel).addEventListener('click', function () {
                unckeckRadioButtons();
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
        layout += "<input type='button' class='btn btn-primary' id='save-form-btn' form='" + formid + "' value='Done'>";
        layout += "</div></form></div></div></div>";
        $("#base-modal-html").html(layout);
    }
    // Item Modal
    function itemModalCreation(id, path) {
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
        layout += "<div id='" + id + "-modal-body' class='modal-body'>" + create(path, formid) + "</div>";
        // Footer
        layout += "<div class='modal-footer'>";
        layout += "<input type='button' id='" + id + "-cancel-btn' class='btn btn-secondary' data-dismiss='modal' value='Cancel'>";
        layout += "<input type='button' id='" + id + "-create-btn' class='btn btn-primary' value='Create " + upperCaseFirst(id) + "'>";
        layout += "<div id='" + id + "-save-btn'></div>";
        layout += "</div></form></div></div></div>";
        document.getElementById("item-modal-html").innerHTML = layout + document.getElementById("item-modal-html").innerHTML;
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
        layout += "<input type='button' id='" + id + "-cancel-btn' class='btn btn-secondary' data-dismiss='modal' value='Cancel'>";
        layout += "<input type='button' id='" + id + "-done-btn' class='btn btn-primary' value='Set " + upperCaseFirst(id) + "'>";
        layout += "<input type='button' id='" + id + "-save-btn' class='btn btn-success' value='Save' hidden>";
        layout += "</div></form></div></div></div>";
        document.getElementById("set-modal-html").innerHTML = layout + document.getElementById("set-modal-html").innerHTML;
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
                layout += "<label class='radio-container'><h6>" + upperCaseFirst(title) + "</h6><input id='select-" + title + "' type='radio' name='radio' value='" + title + "'><span class='radio-checkmark'></span></label>";
                selectCases.push(title);
                layout += "<div class='reveal-" + title + "' style='opacity:0; max-height: 0; overflow: hidden;'>";
                var formid = id + "-" + title + "-form";
                layout += "<form id='" + formid + "' class='needs-validation' novalidate>";
                layout += create(path, formid);
                layout += "</form>"
                layout += "</div>";
            } else {
                title = Object.keys(data[j])[0];
                layout += "<label class='radio-container'><h6>" + upperCaseFirst(title) + "</h6><input id='select-" + title + "' type='radio' name='radio' value='" + title + "'><span class='radio-checkmark'></span></label>";
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
        layout += "<input type='button' id='" + id + "-cancel' class='btn btn-secondary' value='Cancel'>";
        layout += "<input type='button' id='" + id + "-save-btn' class='btn btn-success' value='Save' hidden>";
        layout += "<input type='button' id='" + id + "-create-btn' class='btn btn-primary' value='Create " + upperCaseFirst(id) + "'>";
        layout += "</div></div></div></div>";
        document.getElementById("select-modal-html").innerHTML = layout + document.getElementById("select-modal-html").innerHTML;
    }
    // Confirmation Modal
    function confirmationModalCreation() {
        var layout = "";
        // Modal
        layout += "<div class='modal fade centered' id='confirmation-modal' role='dialog' style='z-index:4000'>";
        layout += "<div class='modal-dialog modal-sm'>";
        layout += "<div class='modal-content'>";
        // Header
        layout += "<div class='modal-header bg-danger'></div>";
        // Body 
        layout += "<div class='modal-body'>";
        layout += "<h5 class='modal-title'><i class='fa fa-trash-o' style='font-size:18px' aria-hidden='true'></i> Delete</h5>";
        layout += "<br>Are you sure you want to delete this item?</div>";
        // Footer
        layout += "<div class='modal-footer'>";
        layout += "<input type='button' class='btn btn-secondary' data-dismiss='modal' value='Cancel'>";
        layout += "<input type='submit' class='btn btn-danger' id='delete-item-btn' value='Delete'>";
        layout += "</div></div></div></div>";
        $('#confirmation-modal-html').html(layout);
    }
    //-------------------------------Cases--------------------------------
    // Input Case
    function inputCase(data, formid) {
        var layout = "<p>";
        var isRequired = "";
        for (j in required) {
            if (required[j] === objectName) {
                isRequired = "*";
            }
        }
        if (isPercentage) {
            layout += "<h6><label for='" + objectName + "'>" + upperCaseFirst(objectName) + " " + isRequired + "</label></h6>";
            layout += "<input id='" + objectName + "' class='form-control form-control-sm' name='" + objectName + "' type='" + data + "' autocomplete='off' value='50' " + min + max + " form='" + formid + "'>";
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
            layout += "<h6><label for='" + objectName + "'>" + upperCaseFirst(objectName) + " " + isRequired + "</label></h6>";
            layout += "<input id='" + objectName + "' class='form-control form-control-sm' name='" + objectName + "' type='" + data + "' autocomplete='off' placeholder='Enter " + upperCaseFirst(objectName) + "...' " + min + max + " form='" + formid + "'>";
            layout += "<div class='invalid-feedback'>Please choose a " + objectName + ".</div>";
        }
        return layout + "</p>";
    }
    // Item Case
    function itemCase(data, formid) {
        var layout = "";
        var ref = data.$ref;
        var path = json;
        var objectId;
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
        var id = objectId + "-" + modalMap.get(objectId);
        layout += "<p><h6><label for='" + id + "-existing-items'>" + upperCaseFirst(id) + "</label></h6>";
        layout += "<div id='" + id + "-existing-items'></div>";
        layout += "<input type='button' name='" + id + "' id='" + id + "-add-btn' class='btn btn-primary btn-sm' data-toggle='modal' value='Add " + upperCaseFirst(id) + "'></p>";
        itemModalId.push(id);
        itemModalPath.push(path);
        return layout;
    }
    // Set Case
    function setCase(data, formid) {
        var layout = "";
        var ref = data.$ref;
        var path = json;
        var objectId;
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
        var id = objectId + "-" + modalMap.get(objectId);
        layout += "<p><h6><label for='" + id + "-set-btn'>" + upperCaseFirst(id) + "</label></h6>";
        layout += "<input type='button' name='" + id + "' id='" + id + "-set-btn' class='btn btn-primary btn-sm' data-toggle='modal' data-target='#" + id + "-modal' value='Set " + upperCaseFirst(id) + "'>";
        layout += "<input type='button' name='" + id + "' id='" + id + "-edit-btn' class='btn btn-primary btn-sm' data-toggle='modal' data-target='#" + id + "-modal' value='Edit " + upperCaseFirst(id) + "' hidden>";
        layout += "</p>";
        setModalId.push(id);
        setModalPath.push(path);
        return layout;
    }
    // OneOf Case
    function oneOfCase(data, formid) {
        console.log(data);
        var layout = "";
        if (modalMap.has(objectName)) {
            modalMap.set(objectName, modalMap.get(objectName) + 1);
        } else {
            modalMap.set(objectName, 1);
        }
        var id = objectName + "-" + modalMap.get(objectName);
        layout += "<p><h6><label for='" + id + "-select-btn'>" + upperCaseFirst(id) + "</label></h6>";
        layout += "<input id='" + id + "-select-btn' type='button' class='btn btn-primary btn-sm' data-toggle='modal' data-target='#" + id + "-modal' value='Select " + upperCaseFirst(id) + "'></p>";
        selectModalId.push(id);
        selectModalPath.push(data);
        return layout;
    }
    // Enum Case
    function enumCase(val, formid) {
        var layout = "";
        layout += "<p><select name='" + objectName + "' class='form-control form-control-sm' form='" + formid + "'>";
        for (j in val[i]) {
            layout += "<option>" + val[i][j] + "</option>";
        }
        layout += "</select></p>";
        hasEnum = false;
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
        for (i in key) {
            // Check if there is enum, minItems, minProperties, minimum, maximum in the val array
            var nextKey = Object.keys(val[i]);
            var nextVal = Object.values(val[i]);
            for (j in nextKey) {
                if (nextKey[j] == "enum") {
                    hasEnum = true;
                }
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
                // Do nothing
            } else if (key[i] === "required") { // required
                required = val[i];
            } else if (key[i] === "items") { // items
                layout += itemCase(val[i], formid);
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
                layout += setCase(data, formid);
            } else if (val[i] === "boolean") { // boolean
                layout += "<p><label for='" + objectName + "' class='checkbox-container'>" + upperCaseFirst(objectName);
                layout += "<input id='" + objectName + "' type='checkbox' name='" + objectName + "' form='" + formid + "'><span class='checkbox-checkmark'></span></label></p>";
            } else if (key[i] === "type" && val[i] != "array" && val[i] != "object" && !hasEnum) { // string integer percentage
                layout += inputCase(val[i], formid);
            }
        }
        return layout;
    }
}