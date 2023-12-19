// Get data from modules_data.csv and create object array.
// Update #mod-list with mod names from object array.

$(document).ready(function() {
    // get the data from imports/*.csv and create object array
    $.ajax({
        url: "imports/modules_data_v2.csv",
        dataType: "text",
        success: function(data) {
            let lines = data.split("\n");
            let container = $("#mod-list");
            for (let i = 1; i < lines.length; i++) {
                let line = lines[i].split(",");
                let div1 = $("<div class='mod-item'>");
                let div2 = $("<div class='mod-name'>");
                let div3 = $("<div class='mod-info' style='display: none;'>");
                div1.attr("data-mod-type", line[0]);
                div1.attr("data-mod-name", line[1]);
                div1.attr("data-mod-enc", line[2]);
                div1.attr("data-mod-location", line[3]);
                div1.attr("data-mod-condition", line[4]);
                div1.attr("data-mod-description", line[5]);
                div1.attr("data-mod-tags", line[6]);
                container.append(div1);
                div2.text(line[1]);
                div3.text(line[3] + " " + line[4]);
                div1.append(div2);
                div1.append(div3);
            }
        }
    });
});

// search function
$("#search-input").keyup(function() {
    let search = $(this).val().toLowerCase();
    let container = $("#mod-list");
    container.children().each(function() {
        let mod = $(this);
        let mod_name = mod.attr("data-mod-name").toLowerCase();
        if (mod_name.includes(search)) {
            mod.show();
        } else {
            mod.hide();
        }
    });
});

// filter function
$("#filter-toggle-btn-0").click(function() {
    $("#filter-toggle-btn-0").toggleClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-1").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-2").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-3").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-4").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-5").removeClass("filter-toggle-btn-active");
    $("#mod-list").children().each(function() {
        let mod = $(this);
        mod.show();
    });
});
$("#filter-toggle-btn-1").click(function() {
    $("#filter-toggle-btn-0").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-1").toggleClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-2").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-3").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-4").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-5").removeClass("filter-toggle-btn-active");
    $("#mod-list").children().each(function() {
        let mod = $(this);
        if (mod.attr("data-mod-type") == "A") {
            mod.show();
        } else {
            mod.hide();
        }
    });
});
$("#filter-toggle-btn-2").click(function() {
    $("#filter-toggle-btn-0").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-1").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-2").toggleClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-3").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-4").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-5").removeClass("filter-toggle-btn-active");
    $("#mod-list").children().each(function() {
        let mod = $(this);
        if (mod.attr("data-mod-type") == "B") {
            mod.show();
        } else {
            mod.hide();
        }
    });
});
$("#filter-toggle-btn-3").click(function() {
    $("#filter-toggle-btn-0").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-1").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-2").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-3").toggleClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-4").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-5").removeClass("filter-toggle-btn-active");
    $("#mod-list").children().each(function() {
        let mod = $(this);
        if (mod.attr("data-mod-type") == "C") {
            mod.show();
        } else {
            mod.hide();
        }
    });
});
$("#filter-toggle-btn-4").click(function() {
    $("#filter-toggle-btn-0").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-1").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-2").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-3").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-4").toggleClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-5").removeClass("filter-toggle-btn-active");
    $("#mod-list").children().each(function() {
        let mod = $(this);
        if (mod.attr("data-mod-type") == "D") {
            mod.show();
        } else {
            mod.hide();
        }
    });
});
$("#filter-toggle-btn-5").click(function() {
    $("#filter-toggle-btn-0").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-1").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-2").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-3").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-4").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-5").toggleClass("filter-toggle-btn-active");
    $("#mod-list").children().each(function() {
        let mod = $(this);
        if (mod.attr("data-mod-type") == "E") {
            mod.show();
        } else {
            mod.hide();
        }
    });
});

// double click function
$("#mod-list").on("dblclick", ".mod-item", function() {
    let mod = $(this);
    let mod_name = mod.attr("data-mod-name");
    let mod_enc = mod.attr("data-mod-enc");
    let mod_type = mod.attr("data-mod-type");
    let mod_location = mod.attr("data-mod-location");
    let mod_condition = mod.attr("data-mod-condition");
    let mod_description = mod.attr("data-mod-description");
    let mod_tags = mod.attr("data-mod-tags");
    let mod_info = mod.children(".mod-info").text();
    let mod_item = $("<div class='mod-item'>");
    let mod_name_item = $("<div class='mod-name'>");
    let mod_info_item = $("<div class='mod-info' style='display: none;'>");
    mod_name_item.text(mod_name);
    mod_info_item.text(mod_info);
    mod_item.append(mod_name_item);
    mod_item.append(mod_info_item);
    mod_item.attr("data-mod-type", mod_type);
    mod_item.attr("data-mod-name", mod_name);
    mod_item.attr("data-mod-enc", mod_enc);
    mod_item.attr("data-mod-location", mod_location);
    mod_item.attr("data-mod-condition", mod_condition);
    mod_item.attr("data-mod-description", mod_description);
    mod_item.attr("data-mod-tags", mod_tags);
    $("#bp-list").append(mod_item);
    mod.remove();
    sortList('#bp-list');
    exportData();
});
$("#bp-list").on("dblclick", ".mod-item", function() {
    let mod = $(this);
    let mod_name = mod.attr("data-mod-name");
    let mod_enc = mod.attr("data-mod-enc");
    let mod_type = mod.attr("data-mod-type");
    let mod_location = mod.attr("data-mod-location");
    let mod_condition = mod.attr("data-mod-condition");
    let mod_description = mod.attr("data-mod-description");
    let mod_tags = mod.attr("data-mod-tags");
    let mod_info = mod.children(".mod-info").text();
    let mod_item = $("<div class='mod-item'>");
    let mod_name_item = $("<div class='mod-name'>");
    let mod_info_item = $("<div class='mod-info' style='display: none;'>");
    mod_name_item.text(mod_name);
    mod_info_item.text(mod_info);
    mod_item.append(mod_name_item);
    mod_item.append(mod_info_item);
    mod_item.attr("data-mod-type", mod_type);
    mod_item.attr("data-mod-name", mod_name);
    mod_item.attr("data-mod-enc", mod_enc);
    mod_item.attr("data-mod-location", mod_location);
    mod_item.attr("data-mod-condition", mod_condition);
    mod_item.attr("data-mod-description", mod_description);
    mod_item.attr("data-mod-tags", mod_tags);
    $("#mod-list").append(mod_item);
    mod.remove();
    sortList('#mod-list');
    exportData();
});

// Function to sort lists by data-mod-type then data-mod-name
function sortList(list) {
    let list_items = $(list).children();
    list_items.sort(function(a, b) {
        let a_type = $(a).attr("data-mod-type");
        let b_type = $(b).attr("data-mod-type");
        let a_name = $(a).attr("data-mod-name");
        let b_name = $(b).attr("data-mod-name");
        if (a_type < b_type) {
            return -1;
        } else if (a_type > b_type) {
            return 1;
        } else {
            if (a_name < b_name) {
                return -1;
            } else if (a_name > b_name) {
                return 1;
            } else {
                return 0;
            }
        }
    });
    list_items.detach().appendTo(list);
}

// on hover function display mod-info  
$("#mod-list").on("mouseenter", ".mod-item", function() {
    let mod = $(this);
    let mod_info = mod.children(".mod-info");
    mod_info.show();
});
$("#mod-list").on("mouseleave", ".mod-item", function() {
    let mod = $(this);
    let mod_info = mod.children(".mod-info");
    mod_info.hide();
});
$("#bp-list").on("mouseenter", ".mod-item", function() {
    let mod = $(this);
    let mod_info = mod.children(".mod-info");
    mod_info.show();
});
$("#bp-list").on("mouseleave", ".mod-item", function() {
    let mod = $(this);
    let mod_info = mod.children(".mod-info");
    mod_info.hide();
});

// on paste to #import, get clipboard data and decode from base64
$("#import").on("paste", function(e) {
    let clipboard_data = e.originalEvent.clipboardData.getData("text");
    let decoded_data = atob(clipboard_data);
    // create array seperated by ";"
    let decoded_data_array = decoded_data.split(";");
    // for each item in array find matching data-mod-enc and add mod to #bp-list, remove from #mod-list
    for (let i = 0; i < decoded_data_array.length; i++) {
        // BLA BLA BLA BLA
    }
    sortList('#bp-list');
    exportData();
});

// export function
function exportData() {
    let export_text = [];
    $("#bp-list").children().each(function() {
        let mod = $(this);
        let mod_enc = mod.attr("data-mod-enc");
        export_text.push(mod_enc);
    });
    let export_text_encoded = btoa(export_text.join(";"));
    $("#export").val(export_text_encoded);
}
