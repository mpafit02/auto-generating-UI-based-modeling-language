// General Variables
var json = undefined;
var jsonData = undefined;
var hasEnum = false;
var hasAdditionalProperties = false;
var hasUniqueItems = false;
var isPercentage = false;
var baseModalIsCreated = false;
var objectName = "";
var returnContent = "";
var modalMap = new Map();
var jsonDataMap = new Map();
var minItems = Number.MIN_VALUE;
var minProperties = Number.MIN_VALUE;
var minProperties = Number.MAX_VALUE;
var minimum = Number.MIN_VALUE;
var maximum = Number.MAX_VALUE;
var selectModalId = [];
var setModalId = [];
var setModalObjectId = [];
var slidersId = [];
var setModalPath = [];
var selectModalPath = [];
var selectModalObjectId = [];
var selectCases = [];
var required = [];
var itemStack = [];
var outputData = {};
var formContent = {};
var dataJSON = {};
var itemsCounter = 1;
var zIndex;
// Function for Creating the Upload json schema card
function createStartCard() {
    var layout = "";
    layout += "<div id='upload-card' class='card text-white centered-card animated bounceInDown'>";
    layout += "<div class='card-header'>";
    layout += "<h5 class='card-title'>Upload JSON Schema</h5>";
    layout += "</div>";
    layout += "<div class='card-body'>";
    layout += "<div class='custom-file'>";
    layout += "<input type='file' class='custom-file-input' id='inputFile' onchange='uploadSchemaFile(event)'>";
    layout += "<label id='input-schema-label' class='custom-file-label' for='inputGroupFile01'>Choose JSON file</label></div>";
    layout += "<p id='output'></p></div><div>";
    $('#start-screen').html(layout);
    $('#start-btn').fadeOut();
}
// -----------------------------------JSON upload---------------------------------------
// Function for Upload File
function uploadSchemaFile(event) {
    var input = event.target;
    var txt = "";
    var reader = new FileReader();
    reader.onload = function () {
        var file = reader.result;
        $('#input-schema-label').html(input.files[0].name);
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
// Method to find the path in the json data
function findPath(data) {
    var key = Object.keys(data);
    var val = Object.values(data);
    for (i in val) {
        if (typeof val[i] == "object") {
            jsonDataMap.set(key[i], val[i]);
            findPath(val[i]);
        }
    }
    return;
}
// Main function that creates the html
function createPage() {
    document.getElementById("app").innerHTML = `
<nav class="navbar fixed-top top-nav text-light container-fluid">
<div class='navbar-header'> 
<a class="navbar-brand text-light" href="index.html" style="font-size:22px">${json.description}</a>
</div>
<input type="button" class='btn btn-primary btn-sm float-right' id="download-btn" value='Download' disabled>
</nav>
<nav class="side-nav text-light">
<div id="existing-items"></div>
<div id="control-btn">
<input id='start-new-btn' type='button' class='btn btn-primary btn-sm btn-block' value='Create Property'>
<input id='load-btn' type='button' class='btn btn-dark btn-sm btn-block' value='Load Property'> 
</div>
<div class="fixed-bottom text-light">Copyrights <i class="fa fa-copyright"></i> Linc.ucy.ac.cy</div>
</nav>
<div id='upload-modal-html'></div>
<div id='base-modal-html' style='z-index:1000;'></div>
<div id='set-modal-html'></div>
<div id='select-modal-html'></div>
<div id='confirmation-modal-html'></div>
<div id='success-modal-html'></div>
`;
    // Create the confirmation modal
    confirmationModalCreation();
    // Success modal creation
    successModalCreation();
    // Create listeners for base modals
    document.getElementById('start-new-btn').addEventListener('click', function () {
        swal({
            title: 'Are you sure?',
            text: "Do you want to create a new Property?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                swal({
                    type: 'success',
                    title: 'New Property created!',
                    showConfirmButton: false,
                    timer: 1500
                });
                buttonsForBaseModal();
                $('#control-btn').fadeOut();
            } else if (
                result.dismiss === swal.DismissReason.cancel
            ) {
                swal({
                    title: 'Cancelled',
                    text: 'Create or Load a Property.',
                    type: 'error',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    });
    // Check if load json button is pressed
    document.getElementById('load-btn').addEventListener('click', function () {
        // Create the upload json modal
        uploadJsonModalCreation();
        // Function for Upload json file
        document.getElementById('input-json-file-btn').addEventListener('change', function (event) {
            var input = event.target;
            var txt = "";
            var reader = new FileReader();
            reader.onload = function () {
                var file = reader.result;
                $('#input-json-label').html(input.files[0].name);
                var isValidJSON = isValid(file);
                if (isValidJSON) {
                    txt += "<p><div style='font-weight: 700;'>Upload file: </div></p>";
                    txt += "<i class='fa fa-file-text-o'style='font-size:30px; color:white;'></i>";
                    txt += " " + input.files[0].name + "<br>";
                    txt += "<input type='button' id='upload-json-btn' class='btn btn-primary float-right' value='Upload'>";
                    jsonData = JSON.parse(file);
                    // Check if this object is loaded
                    $("#outputJsonData").html(txt);
                    document.getElementById("upload-json-btn").addEventListener("click", function () {
                        findPath(jsonData);
                        buttonsForBaseModal();
                        $("#upload-json-card").fadeOut();
                        $('#control-btn').fadeOut();
                    });
                } else {
                    txt += "<div style='color:#ff2045;'>";
                    txt += "<p><div style='font-weight: 700;'>Not valid: </div></p>";
                    txt += "<i class='fa fa-file-text-o'style='font-size:30px;'></i>";
                    txt += " " + input.files[0].name + "<br>";
                    txt += "<br>Upload a valid JSON file!</div>";
                    $("#outputJsonData").html(txt);
                }
            };
            reader.readAsText(input.files[0]);
        });
        // Listener for close button in upload card
        document.getElementById("upload-json-close-btn").addEventListener("click", function () {
            $("#upload-json-card").fadeOut();
        });
    });
    // ----------------------------------------------------Methods--------------------------------------------------------
    // Function the returns upper case first character of the string
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
        });
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
    // Call Listeners
    function callListener() {
        // Check for key press actions in set modal
        for (i in setModalId) {
            buttonsForSetModal(setModalObjectId[i], setModalId[i], setModalPath[i]);
        }
        // Check for key press actions in select modal
        for (i in selectModalId) {
            buttonsForSelectModal(selectModalObjectId[i], selectModalId[i], selectModalPath[i]);
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
        // Update the current slider value (each time you drag the slider handle)
        output.oninput = function () {
            slider.value = this.value;
        }
        slider.oninput = function () {
            output.value = this.value;
        }
    }
    //=============================================== Buttons in modals Listeners ===================================================
    // --------------------------------------------Function for buttons in base modal------------------------------------------------
    function buttonsForBaseModal() {
        var id = "Property-" + itemsCounter;
        var editBtn = id + '-edit-btn';
        var btnGroup = id + '-btn-group';
        var deleteBtn = id + '-delete-btn';
        var modalId = id + "-modal";
        var finishBtn = "finish-" + id + "-btn";
        var saveBtn = "save-" + id + "-btn";
        var cancelBtn = "cancel-" + id + "-btn";
        var formId = "base-" + id + "-form";
        var form = document.getElementById(formId);
        var activeBtnMapId = new Map();
        var activeBtnMapRequiredId = new Map();
        var isValidForm;
        // Create buttons for edit dialog
        var layout = "<div id='" + btnGroup + "' class='btn-group btn-line' role='group'>";
        layout += "<button type='button' id='" + editBtn + "' class='btn btn-primary btn-sm btn-edit' data-toggle='modal' data-target='#base-modal'>Property</button>";
        layout += "<button type='button' id='" + deleteBtn + "' class='btn btn-danger btn-sm btn-delete' data-toggle='modal' data-target='#confirmation-modal'>";
        layout += "<i class='fa fa-trash-o' style='font-size:18px' aria-hidden='true'></i></button></div>";
        $("#existing-items").prepend(layout);
        setModalId = [];
        setModalObjectId = [];
        setModalPath = [];
        selectModalId = [];
        selectModalObjectId = [];
        selectModalPath = [];
        // Create the base modal
        baseModalCreation();
        // Call function for listeners only the first time
        callListener();
        activeBtnMapId.set(id, setModalId);
        var tempRequired = [];
        for (i in required) {
            tempRequired.push(required[i] + "-" + itemsCounter);
        }
        activeBtnMapRequiredId.set(id, tempRequired);
        itemsCounter++;
        document.getElementById(editBtn).addEventListener("click", function () {
            var activeBtn = activeBtnMapId.get(id);
            var activeBtnRequired = activeBtnMapRequiredId.get(id);
            // Presents the modal
            modalShow(modalId);
            if (jsonDataMap != null) {
                for (i in setModalId) {
                    var tempData = jsonDataMap.get(setModalId[i]);
                    if (tempData === undefined) {
                        // Finish form button
                        document.getElementById(finishBtn).addEventListener("click", function () {
                            isValidForm = true;
                            for (i in activeBtn) {
                                for (j in activeBtnRequired) {
                                    if (activeBtnRequired[j] == activeBtn[i]) {
                                        if (!($("#" + activeBtn[i] + '-set-btn').is(":hidden"))) {
                                            $("#" + activeBtn[i] + '-set-btn').addClass('btn-danger');
                                            $("#" + activeBtn[i] + "-paragraph").removeAttr('hidden');
                                            isValidForm = false;
                                        }
                                    }
                                }
                            }
                            // Validate modal
                            if (isValidForm === false || (form != null && form.checkValidity() === false)) {
                                event.preventDefault();
                                event.stopPropagation();
                            } else {
                                // Create item's properties
                                formContent[id] = $(form).serializeArray();
                                $('#success-modal').modal('show');
                                $(".sa-success").addClass("hide");
                                setTimeout(function () {
                                    $(".sa-success").removeClass("hide");
                                }, 10);
                                setTimeout(function () {
                                    $("#success-modal").modal("hide");
                                }, 1200);
                                $("#" + modalId).modal('hide');
                                $('#' + finishBtn).hide();
                                $('#' + cancelBtn).hide();
                                $('#' + saveBtn).removeAttr('hidden');
                                $("#download-btn").removeAttr("disabled");
                                if (form != null) {
                                    form.classList.add('was-validated');
                                }
                            }
                        });
                    } else {
                        $('#' + finishBtn).hide();
                        $('#' + cancelBtn).hide();
                        $('#' + saveBtn).removeAttr('hidden');
                        $("#download-btn").removeAttr("disabled");
                    }
                    // Save form button
                    document.getElementById(saveBtn).addEventListener("click", function () {
                        if (form != null && form.checkValidity() === false) {
                            event.preventDefault();
                            event.stopPropagation();
                        } else {
                            $('#success-modal').modal('show');
                            $(".sa-success").addClass("hide");
                            setTimeout(function () {
                                $(".sa-success").removeClass("hide");
                            }, 10);
                            setTimeout(function () {
                                $("#success-modal").modal("hide");
                            }, 1200);
                            $("#" + modalId).modal('hide');
                        }
                    });
                }
            }
        });
        document.getElementById(deleteBtn).addEventListener("click", function () {
            document.getElementById('delete-item-btn').addEventListener("click", function () {
                formContent[id] = {};
                $("#" + btnGroup).hide();
                $('#confirmation-modal').modal('hide');
                $('#control-btn').fadeIn();
            });
        });
    }
    // ------------------------------------------------Function for buttons in set modal---------------------------------------------
    function buttonsForSetModal(objectId, id, path) {
        var setBtn = id + '-set-btn';
        var editBtn = id + '-edit-btn';
        var createBtn = id + '-create-btn';
        var cancelBtn = id + '-cancel-btn';
        var cancelSaveBtn = id + '-cancel-save-btn';
        var saveBtn = id + '-save-btn';
        var modal = id + '-modal';
        var formid = id + '-form';
        var form;
        var nestedCurrentPath = null;
        var modalIsCreated = false;
        var activeBtnMapId = new Map();
        var activeBtnMapObjectId = new Map();
        var isValidForm;
        var tempData = jsonDataMap.get(id);
        var isSaveTime = false;
        if (tempData != undefined) {
            $('#' + setBtn).hide();
            $('#' + editBtn).removeAttr('hidden');
            // Listener for the edit button to change the set modal
            document.getElementById(editBtn).addEventListener("click", function () {
                if (nestedCurrentPath != null) {
                    itemStack.push(nestedCurrentPath);
                } else {
                    itemStack.push({});
                }
                // Creates the modal if it is the first time pressing the button
                if (!modalIsCreated) {
                    setModalId = [];
                    setModalPath = [];
                    setModalObjectId = [];
                    selectModalId = [];
                    selectModalObjectId = [];
                    selectModalPath = [];
                    // Create the modal for the set case
                    setModalCreation(objectId, id, path);
                    // Activates the listeners for the buttons in the modal
                    callListener();
                    activeBtnMapId.set(id, setModalId);
                    activeBtnMapObjectId.set(id, setModalObjectId);
                    modalIsCreated = true;
                    $("#" + id + "-paragraph").hide();
                    $('#' + createBtn).hide();
                    $('#' + cancelBtn).hide();
                    $('#' + cancelSaveBtn).removeAttr('hidden');
                    $('#' + saveBtn).removeAttr('hidden');
                    form = document.getElementById(formid);
                    var elements = document.getElementById(formid).elements;
                    for (i = 0; i < elements.length; i++) {
                        if (elements[i].type != "button") {
                            if (elements[i].type == "checkbox" && tempData[elements[i].name] == "on") {
                                elements[i].checked = true;
                            } else {
                                elements[i].value = tempData[elements[i].name];
                            }
                        }
                    }
                    // Item creation in item Stack
                    document.getElementById(saveBtn).addEventListener('click', function () {
                        // Validate the form
                        if (form != null && form.checkValidity() === false) {
                            event.preventDefault();
                            event.stopPropagation();
                        } else {
                            // Create item's properties
                            formContent[id] = $(form).serializeArray();
                            if (!isSaveTime) {
                                for (j in formContent[id]) {
                                    itemStack[itemStack.length - 1][formContent[id][j].name] = formContent[id][j].value;
                                }
                                for (k in elements) {
                                    if (elements[k].type == "checkbox" && elements[k].checked == false) {
                                        delete itemStack[itemStack.length - 1][elements[k].name];
                                    }
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
                                isSaveTime = true;
                            } else {
                                for (j in formContent[id]) {
                                    nestedCurrentPath[formContent[id][j].name] = formContent[id][j].value;
                                }
                                for (k in elements) {
                                    if (elements[k].type == "checkbox" && elements[k].checked == false) {
                                        delete nestedCurrentPath[elements[k].name];
                                    }
                                }
                                // Transfer item's to export file object
                                if (itemStack.length <= 1) {
                                    itemStack.pop(itemStack[itemStack.length - 1]);
                                }
                            }
                            console.log(dataJSON);
                            modalHide(modal);
                        }
                        if (form != null) {
                            form.classList.add('was-validated');
                        }
                    });
                    // Listener for the cancel button in the edit modal
                    document.getElementById(cancelSaveBtn).addEventListener('click', function () {
                        // Recovering the last saved form input
                        for (j in formContent[id]) {
                            $("#" + formid + " input[name=" + formContent[id][j].name + "]").val(formContent[id][j].value);
                        }
                        itemStack.pop(itemStack[itemStack.length - 1]);
                        modalHide(modal);
                    });
                }
                modalShow(modal);
            });
        } else {
            // Listener for the set button to create the set modal
            document.getElementById(setBtn).addEventListener("click", function () {
                // Creates the modal if it is the first time pressing the button
                if (!modalIsCreated) {
                    setModalId = [];
                    setModalPath = [];
                    setModalObjectId = [];
                    selectModalId = [];
                    selectModalObjectId = [];
                    selectModalPath = [];
                    // Create the modal for the set case
                    setModalCreation(objectId, id, path);
                    // Activates the listeners for the buttons in the modal
                    callListener();
                    activeBtnMapId.set(id, setModalId);
                    activeBtnMapObjectId.set(id, setModalObjectId);
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
                    var activeBtn = activeBtnMapObjectId.get(id);
                    isValidForm = true;
                    for (i in activeBtn) {
                        for (j in required) {
                            if (required[j] == activeBtn[i]) {
                                var activeBtnId = activeBtnMapId.get(id)[i];
                                if (!($("#" + activeBtnId + '-set-btn').is(":hidden"))) {
                                    $("#" + activeBtnId + '-set-btn').addClass('btn-danger');
                                    $("#" + activeBtnId + "-paragraph").removeAttr('hidden');
                                    isValidForm = false;
                                }
                            }
                        }
                    }
                    // Validate modal
                    if (isValidForm === false || (form != null && form.checkValidity() === false)) {
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
                        console.log(dataJSON);
                        $("#" + id + "-paragraph").hide();
                        $('#' + createBtn).hide();
                        $('#' + setBtn).hide();
                        $('#' + cancelBtn).hide();
                        $('#' + cancelSaveBtn).removeAttr('hidden');
                        $('#' + saveBtn).removeAttr('hidden');
                        $('#' + editBtn).removeAttr('hidden');
                        modalHide(modal);
                    }
                    if (form != null) {
                        form.classList.add('was-validated');
                    }
                });
                // Listener for the cancel button in the set modal
                document.getElementById(cancelBtn).addEventListener('click', function () {
                    itemStack.pop(itemStack[itemStack.length - 1]);
                    modalHide(modal);
                });
            });
            // Listener for the edit button to change the set modal
            document.getElementById(editBtn).addEventListener("click", function () {
                modalShow(modal);
                itemStack.push(nestedCurrentPath);
                document.getElementById(saveBtn).addEventListener('click', function () {
                    // Validate the form
                    if (form != null && form.checkValidity() === false) {
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
                        console.log(dataJSON);
                        modalHide(modal);
                    }
                    if (form != null) {
                        form.classList.add('was-validated');
                    }
                });
                // Listener for the cancel button in the edit modal
                document.getElementById(cancelSaveBtn).addEventListener('click', function () {
                    // Recovering the last saved form input
                    for (j in formContent[id]) {
                        $("#" + formid + " input[name=" + formContent[id][j].name + "]").val(formContent[id][j].value);
                    }
                    itemStack.pop(itemStack[itemStack.length - 1]);
                    modalHide(modal);
                });
            });
        }
    }
    // ------------------------------------------------Function for buttons in select modal---------------------------------------------
    function buttonsForSelectModal(objectId, id, path) {
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
        var tempSelectCases;
        var selectedCase;
        var savedSelectedCase;
        var tempData = jsonDataMap.get(id);
        var form;
        var formid;
        var isSaveTime = false;
        if (tempData != undefined) {
            $('#' + selectBtn).hide();
            $('#' + editBtn).removeAttr('hidden');
            // Listener for edit button in select case
            document.getElementById(editBtn).addEventListener("click", function () {
                itemStack.push({});
                // Creates the modal if it is the first time pressing the button
                if (!modalIsCreated) {
                    setModalId = [];
                    setModalPath = [];
                    setModalObjectId = [];
                    selectModalId = [];
                    selectModalObjectId = [];
                    selectModalPath = [];
                    selectCases = [];
                    // Create the modal for the select case
                    selectModalCreation(objectId, id, path);
                    // Activates the listeners for the buttons in the modal
                    callListener();
                    // Activates the lsiteners for the radio buttons
                    radioButtonListener(radioName);
                    tempSelectCases = selectCases;
                    modalIsCreated = true;
                    $('#' + cancelBtn).hide();
                    $('#' + createBtn).hide();
                    $('#' + saveBtn).removeAttr('hidden');
                    $('#' + cancelSaveBtn).removeAttr('hidden');
                    for (i in selectCases) {
                        if (tempData[selectCases[i]] != undefined) {
                            var selectedCaseId = $('#select-' + tempSelectCases[i])[0];
                            selectedCaseId.checked = true;
                            savedSelectedCase = $('#select-' + tempSelectCases[j])[0];
                            formContent[id] = {};
                            formContent[id][selectedCase] = $(form).serializeArray();
                            var radioId = selectedCaseId.value;
                            returnContent = radioId;
                            $('.reveal-' + radioId).show().css({
                                'opacity': '1',
                                'max-height': 'inherit',
                                'overflow': 'visible'
                            });
                        }
                        formid = id + "-" + returnContent + '-form';
                        form = document.getElementById(formid);
                        var elements = document.getElementById(formid).elements;
                        for (j in elements) {
                            if (elements[j].type != "button") {
                                if (tempData[selectCases[i]] != undefined) {
                                    if (elements[j].type == "checkbox" && tempData[selectCases[i]][elements[j].name] == "on") {
                                        elements[j].checked = true;
                                    } else {
                                        elements[j].value = tempData[selectCases[i]][elements[j].name];
                                    }
                                }
                            }
                        }
                        document.getElementById(editBtn).value = upperCaseFirst(returnContent);
                    }
                    // Listener for the save button in select modal
                    document.getElementById(saveBtn).addEventListener('click', function () {
                        if (nestedCurrentPath != null) {
                            itemStack.pop();
                            itemStack.push(nestedCurrentPath);
                        }
                        for (j in selectCases) {
                            if ($('#select-' + selectCases[j])[0].checked) {
                                formid = id + "-" + returnContent + '-form';
                                form = document.getElementById(formid);
                                savedSelectedCase = $('#select-' + tempSelectCases[j])[0];
                                savedSelectedCase.checked = true;
                                selectedCase = $('#select-' + selectCases[j])[0].value;
                                if (form != null && form.checkValidity() === false) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                } else {
                                    // Create item's properties
                                    formContent[id] = {};
                                    formContent[id][selectedCase] = $(form).serializeArray();
                                    if (!isSaveTime) {
                                        if (formContent[id][selectedCase].length != 0) {
                                            for (j in formContent[id][selectedCase]) {
                                                itemStack[itemStack.length - 1] = {};
                                                itemStack[itemStack.length - 1][selectedCase] = {};
                                                itemStack[itemStack.length - 1][selectedCase][formContent[id][selectedCase][j].name] = formContent[id][selectedCase][j].value;
                                            }
                                            for (k in elements) {
                                                if (elements[k].type == "checkbox" && elements[k].checked == false) {
                                                    delete itemStack[itemStack.length - 1][selectedCase][elements[k].name];
                                                }
                                            }
                                        }
                                        isSaveTime = true;
                                    } else {
                                        nestedCurrentPath[selectedCase] = {};
                                        for (j in formContent[id][selectedCase]) {
                                            nestedCurrentPath[selectedCase][formContent[id][selectedCase][j].name] = formContent[id][selectedCase][j].value;
                                        }
                                        for (k in elements) {
                                            if (elements[k].type == "checkbox" && elements[k].checked == false) {
                                                delete nestedCurrentPath[selectedCase][elements[k].name];
                                            }
                                        }
                                    }
                                    // Transfer item's to export file object
                                    if (itemStack.length > 1) {
                                        itemStack[itemStack.length - 2][id] = itemStack[itemStack.length - 1];
                                        nestedCurrentPath = itemStack[itemStack.length - 2][id];
                                        itemStack.pop(itemStack[itemStack.length - 1]);
                                    } else {
                                        dataJSON[id] = itemStack[0];
                                        nestedCurrentPath = dataJSON[id];
                                        itemStack.pop(itemStack[0]);
                                    }
                                    document.getElementById(editBtn).value = upperCaseFirst(returnContent);
                                    modalHide(modal);
                                }
                                if (form != null) {
                                    form.classList.add('was-validated');
                                }
                            } else if (isSaveTime) {
                                delete nestedCurrentPath[selectCases[j]];
                            }
                        }
                    });
                    // Listener for the cancel button in the select modal
                    document.getElementById(cancelSaveBtn).addEventListener('click', function () {
                        for (i in selectCases) {
                            if ($('#select-' + selectCases[i])[0].checked) {
                                if ($('#select-' + selectCases[i])[0].value != savedSelectedCase.value) {
                                    savedSelectedCase.checked = true;
                                    var radioId = savedSelectedCase.value;
                                    returnContent = radioId;
                                    $('.reveal-' + radioId).show().css({
                                        'opacity': '1',
                                        'max-height': 'inherit',
                                        'overflow': 'visible'
                                    });
                                    for (j in selectCases) {
                                        var other = $('#select-' + selectCases[j])[0].value;
                                        if (other != radioId) {
                                            $('#select-' + selectCases[j])[0].checked = false;
                                            $('.reveal-' + other).show().css({
                                                'opacity': '0',
                                                'max-height': '0',
                                                'overflow': 'hidden'
                                            });
                                        }
                                    }
                                    selectedCase = savedSelectedCase.value;
                                }
                                formid = id + "-" + returnContent + '-form';
                                var form = document.getElementById(formid);
                                if (form != null && form.checkValidity() === false) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                } else {
                                    // Recovering the last saved form input
                                    for (j in formContent[id][selectedCase]) {
                                        $("#" + formid + " input[name=" + formContent[id][selectedCase][j].name + "]").val(formContent[id][selectedCase][j].value);
                                    }
                                }
                            }
                        }
                        itemStack.pop(itemStack[itemStack.length - 1]);
                        modalHide(modal);
                    });
                }
                modalShow(modal);
            });
        } else {
            // Listener for the select button to create the select modal
            document.getElementById(selectBtn).addEventListener("click", function () {
                // Creates the modal if it is the first time pressing the button
                if (!modalIsCreated) {
                    setModalId = [];
                    setModalPath = [];
                    setModalObjectId = [];
                    selectModalId = [];
                    selectModalObjectId = [];
                    selectModalPath = [];
                    selectCases = [];
                    // Create the modal for the select case
                    selectModalCreation(objectId, id, path);
                    // Activates the listeners for the buttons in the modal
                    callListener();
                    // Activates the lsiteners for the radio buttons
                    radioButtonListener(radioName);
                    tempSelectCases = selectCases;
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
                    //Find the selected case
                    for (j in tempSelectCases) {
                        if ($('#select-' + tempSelectCases[j])[0].checked) {
                            savedSelectedCase = $('#select-' + tempSelectCases[j])[0];
                            selectedCase = $('#select-' + tempSelectCases[j])[0].value;
                            var formid = id + "-" + returnContent + '-form';
                            var form = document.getElementById(formid);
                            // Validate modal
                            if (form != null && form.checkValidity() === false) {
                                event.preventDefault();
                                event.stopPropagation();
                            } else {
                                // Create item's properties
                                formContent[id] = {};
                                formContent[id][selectedCase] = $(form).serializeArray();
                                if (formContent[id][selectedCase].length != 0) {
                                    for (j in formContent[id][selectedCase]) {
                                        itemStack[itemStack.length - 1] = {};
                                        itemStack[itemStack.length - 1][selectedCase] = {};
                                        itemStack[itemStack.length - 1][selectedCase][formContent[id][selectedCase][j].name] = formContent[id][selectedCase][j].value;
                                    }
                                }
                                // Transfer item's to export file object
                                if (itemStack.length > 1) {
                                    itemStack[itemStack.length - 2][id] = itemStack[itemStack.length - 1];
                                    nestedCurrentPath = itemStack[itemStack.length - 2][id];
                                    itemStack.pop(itemStack[itemStack.length - 1]);
                                } else {
                                    dataJSON[id] = itemStack[0];
                                    nestedCurrentPath = dataJSON[id];
                                    itemStack.pop(itemStack[0]);
                                }
                                console.log(dataJSON);
                                $('#' + createBtn).hide();
                                $('#' + cancelBtn).hide();
                                $('#' + selectBtn).hide();
                                $('#' + saveBtn).removeAttr('hidden');
                                $('#' + cancelSaveBtn).removeAttr('hidden');
                                $('#' + editBtn).removeAttr('hidden');
                                document.getElementById(editBtn).value = upperCaseFirst(returnContent);
                                modalHide(modal);
                            }
                            if (form != null) {
                                form.classList.add('was-validated');
                            }
                        }
                    }
                });
                // Listener for the cancel button in select modal
                document.getElementById(cancelBtn).addEventListener('click', function () {
                    unckeckRadioButtons();
                    itemStack.pop(itemStack[itemStack.length - 1]);
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
                            savedSelectedCase = $('#select-' + tempSelectCases[j])[0];
                            selectedCase = $('#select-' + selectCases[j])[0].value;
                            formid = id + "-" + returnContent + '-form';
                            var form = document.getElementById(formid);
                            if (form != null && form.checkValidity() === false) {
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
                                // Transfer item's to export file object
                                if (itemStack.length > 1) {
                                    itemStack[itemStack.length - 2][id] = itemStack[itemStack.length - 1];
                                    nestedCurrentPath = itemStack[itemStack.length - 2][id];
                                    itemStack.pop(itemStack[itemStack.length - 1]);
                                } else {
                                    dataJSON[id] = itemStack[0];
                                    nestedCurrentPath = dataJSON[id];
                                    itemStack.pop(itemStack[0]);
                                }
                                console.log(dataJSON);
                                document.getElementById(editBtn).value = upperCaseFirst(returnContent);
                                modalHide(modal);
                            }
                            if (form != null) {
                                form.classList.add('was-validated');
                            }
                        } else {
                            delete nestedCurrentPath[selectCases[j]];
                        }
                    }
                });
                // Listener for the cancel button in the select modal
                document.getElementById(cancelSaveBtn).addEventListener('click', function () {
                    for (i in selectCases) {
                        if ($('#select-' + selectCases[i])[0].checked) {
                            if ($('#select-' + selectCases[i])[0].value != savedSelectedCase.value) {
                                savedSelectedCase.checked = true;
                                var radioId = savedSelectedCase.value;
                                returnContent = radioId;
                                $('.reveal-' + radioId).show().css({
                                    'opacity': '1',
                                    'max-height': 'inherit',
                                    'overflow': 'visible'
                                });
                                for (j in selectCases) {
                                    var other = $('#select-' + selectCases[j])[0].value;
                                    if (other != radioId) {
                                        selectedCase.checked = false;
                                        $('.reveal-' + other).show().css({
                                            'opacity': '0',
                                            'max-height': '0',
                                            'overflow': 'hidden'
                                        });
                                    }
                                }
                                selectedCase = savedSelectedCase.value;
                            }
                            formid = id + "-" + returnContent + '-form';
                            var form = document.getElementById(formid);
                            if (form != null && form.checkValidity() === false) {
                                event.preventDefault();
                                event.stopPropagation();
                            } else {
                                // Recovering the last saved form input
                                for (j in formContent[id][selectedCase]) {
                                    $("#" + formid + " input[name=" + formContent[id][selectedCase][j].name + "]").val(formContent[id][selectedCase][j].value);
                                }
                            }
                        }
                    }
                    itemStack.pop(itemStack[itemStack.length - 1]);
                    modalHide(modal);
                });
            });
        }
    }
    //------------------------------------------Modals------------------------------------------------
    // Upload Modal
    function uploadJsonModalCreation() {
        var layout = "";
        layout += "<div id='upload-json-card' class='card text-white centered-card animated bounceInLeft'>";
        layout += "<div class='card-header'>";
        layout += "<button type='button' id='upload-json-close-btn' class='close text-light' aria-label='Close'>";
        layout += "<span aria-hidden='true'>&times;</span>";
        layout += "</button>";
        layout += "<h5 class='card-title'>Upload JSON data</h5>";
        layout += "</div>";
        layout += "<div class='card-body'>";
        layout += "<div class='custom-file'>";
        layout += "<input type='file' class='custom-file-input' id='input-json-file-btn'>";
        layout += "<label id='input-json-label' class='custom-file-label' for='inputGroupFile02'>Choose JSON file</label>";
        layout += "</div>";
        layout += "<p id='outputJsonData'></p>";
        layout += "</div>";
        layout += "</div>";
        $("#upload-modal-html").html(layout);
    }
    // Base Modal
    function baseModalCreation() {
        var path = json.properties;
        // Find required in base modal
        var key = Object.keys(json);
        var val = Object.values(json);
        for (i in key) {
            if (key[i] === "required") {
                required = val[i];
            }
        }
        var layout = "";
        var id = "Property-" + itemsCounter;
        // Modal
        layout += "<div class='modal fade' id='" + id + "-modal' role='dialog'>";
        layout += "<div class='modal-dialog modal-lg'>";
        layout += "<div class='modal-content'>";
        // Header
        layout += "<div class='modal-header'>";
        layout += "<h5 class='modal-title'>Property</h5>";
        layout += "</div>";
        // Body 
        var formid = "base-" + id + "-form";
        layout += "<form id='" + formid + "' class='needs-validation' autocomplete='off' novalidate>";
        layout += "<div id='base-modal-body' class='modal-body'>" + create(path, formid) + "</div>";
        // Footer
        layout += "<div class='modal-footer'>";
        layout += "<input type='button' class='btn btn-secondary' id='cancel-" + id + "-btn' data-dismiss='modal' value='Cancel'>";
        layout += "<input type='button' class='btn btn-primary' id='finish-" + id + "-btn' form='" + formid + "' value='Finish'>";
        layout += "<input type='button' class='btn btn-success' id='save-" + id + "-btn' form='" + formid + "' value='Save' hidden>";
        layout += "</div></form></div></div></div>";
        document.getElementById("base-modal-html").innerHTML += layout;
    }
    // Set Modal
    function setModalCreation(objectId, id, path) {
        var layout = "";
        // Modal
        layout += "<div class='modal fade' id='" + id + "-modal' role='dialog'>";
        layout += "<div class='modal-dialog modal-lg'>";
        layout += "<div class='modal-content'>";
        // Header
        layout += "<div class='modal-header'>";
        layout += "<h5 id='" + id + "-modal-title' class='modal-title'>" + upperCaseFirst(objectId) + "</h5></div>";
        // Body 
        var formid = id + "-form";
        layout += "<form id='" + formid + "' class='needs-validation' autocomplete='off' novalidate>";
        layout += "<div class='modal-body'>" + create(path, formid) + "</div>";
        // Footer
        layout += "<div class='modal-footer'>";
        layout += "<input type='button' id='" + id + "-cancel-btn' class='btn btn-secondary' value='Cancel'>";
        layout += "<input type='button' id='" + id + "-cancel-save-btn' class='btn btn-secondary' value='Cancel' hidden>";
        layout += "<input type='button' id='" + id + "-create-btn' class='btn btn-primary' value='Set " + upperCaseFirst(objectId) + "'>";
        layout += "<input type='button' id='" + id + "-save-btn' class='btn btn-success' value='Save " + upperCaseFirst(objectId) + "' hidden>";
        layout += "</div></form></div></div></div>";
        document.getElementById("set-modal-html").innerHTML += layout;
    }
    // Select Modal
    function selectModalCreation(objectId, id, data) {
        var layout = "";
        var title = "";
        // Modal
        layout = "<div class='modal fade' id='" + id + "-modal' role='dialog' >";
        layout += "<div class='modal-dialog modal-lg'>";
        layout += "<div class='modal-content'>";
        // Header
        layout += "<div class='modal-header'>";
        layout += "<h5 class='modal-title'>" + upperCaseFirst(objectId) + "</h5></div>";
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
                layout += "<form id='" + formid + "' class='needs-validation' autocomplete='off' novalidate>";
                layout += create(path, formid);
                layout += "</form>"
                layout += "</div>";
            } else {
                title = Object.keys(data[j])[0];
                layout += "<label class='radio-container'><h6>" + upperCaseFirst(title) + "</h6><input id='select-" + title + "' type='radio' name='" + id + "-radio' value='" + title + "'><span class='radio-checkmark'></span></label>";
                selectCases.push(title);
                layout += "<div class='reveal-" + title + "' style='opacity:0; max-height: 0; overflow: hidden;'>";
                var formid = id + "-" + title + "-form";
                layout += "<form id='" + formid + "' class='needs-validation' autocomplete='off' novalidate>";
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
        layout += "<input type='button' id='" + id + "-create-btn' class='btn btn-primary' value='Create " + upperCaseFirst(objectId) + "'>";
        layout += "</div></div></div></div>";
        document.getElementById("select-modal-html").innerHTML += layout;
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
    // Success Modal
    function successModalCreation() {
        var layout = "";
        // Modal
        layout += "<div class='modal fade centered' id='success-modal' role='dialog' style='overflow-y: hidden; z-index:4000'>";
        layout += "<div class='modal-dialog modal-sm'>";
        layout += "<div class='modal-content'>";
        // Header
        layout += "<div class='modal-header bg-success'></div>";
        // Body 
        layout += "<div class='modal-body'>";
        layout += "<div class='check_mark'>";
        layout += "<div class='sa-icon sa-success animate'>";
        layout += "<span class='sa-line sa-tip animateSuccessTip'></span>";
        layout += "<span class='sa-line sa-long animateSuccessLong'></span>";
        layout += "<div class='sa-placeholder'></div>";
        layout += "<div class='sa-fix'></div></div></div>";
        layout += "<div class='text-center text-secondary'>";
        layout += "<h5>Your work has been saved!</h5></div></div>"
        $("#success-modal-html").html(layout);
    }
    //-------------------------------Cases--------------------------------
    // Input Case
    function inputCase(data, formid) {
        var layout = "<p>";
        var isRequiredHtml = "";
        var isRequiredText = "";
        var min = "";
        var max = "";
        for (j in required) {
            if (required[j] === objectName) {
                isRequiredHtml = "*";
                isRequiredText = "required";
            }
        }
        if (data === "string") {
            layout += "<h6><label for='" + objectName + "'>" + upperCaseFirst(objectName) + " " + isRequiredHtml + "</label></h6>";
            layout += "<input id='" + objectName + "' class='form-control form-control-sm' name='" + objectName + "' type='text' placeholder='Enter " + upperCaseFirst(objectName) + "...' " + min + max + " form='" + formid + "' " + isRequiredText + ">";
            layout += "<div class='invalid-feedback'>Please choose a " + objectName + ".</div>";
        } else {
            if (isPercentage) {
                layout += "<h6><label for='" + objectName + "'>" + upperCaseFirst(objectName) + " " + isRequiredHtml + "</label></h6>";
                layout += "<input id='" + objectName + "' class='form-control form-control-sm' name='" + objectName + "' type='" + data + "' value='0' min='0' + max='100' form='" + formid + "' " + isRequiredText + ">";
                layout += "<div class='slidecontainer'>";
                layout += "<input type='range' id='" + objectName + "-rangeInput' min='0' max='100' value='0' class='slider' id='" + objectName + "'></div>";
                slidersId.push(objectName);
                isPercentage = false;
            } else {
                if (data === "number") {
                    min += "min='" + minimum + "'";
                    max += "max='" + maximum + "'";
                }
                layout += "<h6><label for='" + objectName + "'>" + upperCaseFirst(objectName) + " " + isRequiredHtml + "</label></h6>";
                layout += "<input id='" + objectName + "' class='form-control form-control-sm' name='" + objectName + "' type='" + data + "' placeholder='Enter " + upperCaseFirst(objectName) + "...' " + min + max + " form='" + formid + "' " + isRequiredText + ">";
                layout += "<div class='invalid-feedback'>Please choose a " + objectName + ".</div>";
            }
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
        layout += "<p><h6><label for='" + id + "-set-btn'>" + upperCaseFirst(objectId) + " " + isRequiredHtml + "</label></h6>";
        layout += "<input type='button' name='" + id + "' id='" + id + "-set-btn' class='btn btn-primary btn-sm btn-set' data-toggle='modal' data-target='#" + id + "-modal' value='Add " + upperCaseFirst(objectId) + "'/>";
        layout += "<div class='text-danger' id='" + id + "-paragraph' style='font-size:0.8rem;' hidden><p style='line-height:1.75rem;'>Please add " + upperCaseFirst(objectId) + ".</p></div>";
        layout += "<input type='button' name='" + id + "' id='" + id + "-edit-btn' class='btn btn-success btn-sm' data-toggle='modal' data-target='#" + id + "-modal' value='Edit " + upperCaseFirst(objectId) + "' hidden/>";
        layout += "</p>";
        setModalObjectId.push(objectId);
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
        layout += "<p><h6><label for='" + id + "-select-btn'>" + upperCaseFirst(objectName) + "</label></h6>";
        layout += "<input id='" + id + "-select-btn' type='button' class='btn btn-primary btn-sm' data-toggle='modal' data-target='#" + id + "-modal' value='Select " + upperCaseFirst(objectName) + "'>";
        layout += "<input id='" + id + "-edit-btn' type='button' class='btn btn-success btn-sm' data-toggle='modal' data-target='#" + id + "-modal' value='" + upperCaseFirst(objectName) + "' hidden>";
        layout += "</p>";
        selectModalId.push(id);
        selectModalObjectId.push(objectName);
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
        if (modalMap.has(objectName)) {
            modalMap.set(objectName, modalMap.get(objectName) + 1);
        } else {
            modalMap.set(objectName, 1);
        }
        for (j in required) {
            if (required[j] === objectName) {
                isRequiredHtml = "*";
            }
        }
        var id = objectName + "-" + modalMap.get(objectName);
        layout += "<h6><label for='" + id + "'>" + upperCaseFirst(objectName) + " " + isRequiredHtml + "</label></h6>";
        layout += "<p><select id='" + id + "' name='" + id + "' class='form-control form-control-sm' form='" + formid + "'>";
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
            if (key[j] === "minimum") {
                minimum = val[j];
            }
            if (key[j] === "maximum") {
                maximum = val[j];
            }
            if (minimum == 0 && maximum == 100) {
                isPercentage = true;
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
                if (nextKey[j] === "uniqueItems") { // uniqueItems
                    hasUniqueItems = nextVal[j];
                }
                if (nextKey[j] === "additionalProperties") { // additionalProperties
                    hasAdditionalProperties = nextVal[j];
                }
            }
            // ----------------Cases----------------
            if (key[i] === "id" && typeof val[i] != "object") { // id
                var keywords = val[i].substring(2, val[i].length).split("/");
                for (j in keywords) {
                    objectName = keywords[j];
                }
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