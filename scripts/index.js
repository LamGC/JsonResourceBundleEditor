function map_addRow() {
    let newRow = $("#temp-row").clone(true);
    newRow.attr("id", null);
    newRow.addClass("data-row");
    newRow.appendTo($(".map-edit")[0]);
    return newRow;
}

function map_delSelectRow() {
    if(!confirm("Are you sure you want to delete the selected item?")) {
        return;
    }
    $(".data-row:has(input[type=checkbox]:checked)").remove();
}

function map_clearTable(force) {
    if(force || confirm("Are you sure you want to empty all items?")) {
        $(".data-row").remove();
    }
}

function map_loadFromCode() {
    if($(".data-row").length != 0 && 
       !confirm("Are you sure you want to load from code? Current existing items will be cleared!")) {
        return;
    }
    map_clearTable(true);
    let code = $(".code-area").val();
    let jsObject;
    try {
        jsObject = JSON.parse(code);
    } catch(e) {
        alert("Json parse failed: " + e.message);
        return;
    }
    
    for(key in jsObject) {
        let type = typeof(jsObject[key]);
        if(type == "undefined" || type == "function") {

        }

        let newRow = map_addRow();
        let typeSelector = newRow.find("select");
        newRow.find(".input-key").val(key);
        switch(type) {
            case "string":
                typeSelector.val("String");
                type_select(typeSelector[0]);
                newRow.find(".input-value").val(String(jsObject[key]));
                break;
            case "number":
                typeSelector.val("Number");
                type_select(typeSelector[0]);
                newRow.find(".input-value").val(Number(jsObject[key]));
                break;
            case "boolean":
                typeSelector.val("Boolean");
                type_select(typeSelector[0]);
                if(jsObject[key]) {
                    newRow.find(".input-value").attr("checked", "");
                }
                break;
            case "object":
                if(jsObject[key] == null) {
                    typeSelector.val("Null");
                    type_select(typeSelector[0]);
                } else {
                    typeSelector.val("Object/Array");
                    type_select(typeSelector[0]);
                    newRow.find(".input-value").val(JSON.stringify(jsObject[key]));
                }
                break;
        }
    }
}

function map_build() {
    let result = {};
    let rows = $(".data-row");
    for(let i = 0; i < rows.length; i++) {
        let row = rows.eq(i);
        let type = row.find("select").val();
        let key = row.find(".input-key").val();
        let value = row.find(".input-value").val();
        if(key == "") {
            continue;
        }
        
        console.info(i + ". key: " + key + ", value: '" + value + "', type: " + type);
        switch(type) {
            case "Object/Array":
                result[key] = JSON.parse(value);
                break;
            case "String":
                result[key] = String(value);
                break;
            case "Number":
                result[key] = Number(value);
                break;
            case "Boolean":
                result[key] = row.find(".input-value").prop("checked") ? true : false;
                break;
            case "Null":
                result[key] = null;
        }
    }
    console.info(result, JSON.stringify(result));
    $(".code-area").val(JSON.stringify(result, null, $("#input-indent").val()));
}

function type_select(el) {
    let element = $(el);
    let input_value = element.parent().parent().find(".input-value");
    input_value.attr("readonly", null);
    switch(element.val()) {
        case "Object/Array":
        case "String":
            input_value.attr("type", "text");
            break;
        case "Number":
            input_value.attr("type", "number");
            break;
        case "Boolean":
            input_value.attr("type", "checkbox");
            break;
        case "Null":
            input_value.attr("type", "text");
            input_value.val("null");
            input_value.attr("readonly", "");
            break;
    }
}
