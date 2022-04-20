$(document).ready(function() {
    // get the data from imports/*.csv
    $.ajax({
        url: "imports/modules_data.csv",
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
                div1.attr("data-mod-location", line[2]);
                div1.attr("data-mod-condition", line[3]);
                div1.attr("data-mod-description", line[4]);
                div1.attr("data-mod-tags", line[5]);
                container.append(div1);
                div2.text(line[1]);
                div3.text(line[2]);
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
$("#filter-toggle-btn-1").click(function() {
    $("#filter-toggle-btn-1").toggleClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-2").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-3").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-4").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-5").removeClass("filter-toggle-btn-active");
    $("#mod-list").children().each(function() {
        let mod = $(this);
        if (mod.attr("data-mod-type") == "atk") {
            mod.show();
        } else {
            mod.hide();
        }
    });
});
$("#filter-toggle-btn-2").click(function() {
    $("#filter-toggle-btn-2").toggleClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-1").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-3").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-4").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-5").removeClass("filter-toggle-btn-active");
    $("#mod-list").children().each(function() {
        let mod = $(this);
        if (mod.attr("data-mod-type") == "def") {
            mod.show();
        } else {
            mod.hide();
        }
    });
});
$("#filter-toggle-btn-3").click(function() {
    $("#filter-toggle-btn-3").toggleClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-1").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-2").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-4").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-5").removeClass("filter-toggle-btn-active");
    $("#mod-list").children().each(function() {
        let mod = $(this);
        if (mod.attr("data-mod-type") == "utl") {
            mod.show();
        } else {
            mod.hide();
        }
    });
});
$("#filter-toggle-btn-4").click(function() {
    $("#filter-toggle-btn-4").toggleClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-1").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-2").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-3").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-5").removeClass("filter-toggle-btn-active");
    $("#mod-list").children().each(function() {
        let mod = $(this);
        if (mod.attr("data-mod-type") == "ult") {
            mod.show();
        } else {
            mod.hide();
        }
    });
});
$("#filter-toggle-btn-5").click(function() {
    $("#filter-toggle-btn-5").toggleClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-1").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-2").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-3").removeClass("filter-toggle-btn-active");
    $("#filter-toggle-btn-4").removeClass("filter-toggle-btn-active");
    $("#mod-list").children().each(function() {
        let mod = $(this);
        if (mod.attr("data-mod-type") == "spc") {
            mod.show();
        } else {
            mod.hide();
        }
    });
});

// show mod_info if show-details checkbox is toggled
$("#show-details").change(function() {
    if ($(this).is(":checked")) {
        $("#mod-list").children().each(function() {
            let mod = $(this);
            mod.children(".mod-info").show();
        });
    } else {
        $("#mod-list").children().each(function() {
            let mod = $(this);
            mod.children(".mod-info").hide();
        });
    }
});

// double click function
$("#mod-list").on("dblclick", ".mod-item", function() {
    let mod = $(this);
    let mod_name = mod.attr("data-mod-name");
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
    mod_item.attr("data-mod-location", mod_location);
    mod_item.attr("data-mod-condition", mod_condition);
    mod_item.attr("data-mod-description", mod_description);
    mod_item.attr("data-mod-tags", mod_tags);
    $("#bp-list").append(mod_item);
    mod.remove();
});
$("#bp-list").on("dblclick", ".mod-item", function() {
    let mod = $(this);
    let mod_name = mod.attr("data-mod-name");
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
    mod_item.attr("data-mod-location", mod_location);
    mod_item.attr("data-mod-condition", mod_condition);
    mod_item.attr("data-mod-description", mod_description);
    mod_item.attr("data-mod-tags", mod_tags);
    $("#mod-list").append(mod_item);
    mod.remove();
});