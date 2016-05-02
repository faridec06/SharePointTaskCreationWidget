    var availableTags = [];
    var userIds = [];
    var availableListTags = [];
    var ListIds = [];
    var ListEntityTypeFullName = [];


    // API call to get all the list for the member logged in
    var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists";
    $.ajax({
        url: requestUri,
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "X-RequestDigest": $("#_REQUESTDIGEST").val()
        },
        success: onSuccessList,
        error: onErrorList
    });


    // API call to get all the groups 
    var groupRequestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/sitegroups";
    $.ajax({
        url: groupRequestUri,
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "X-RequestDigest": $("#_REQUESTDIGEST").val()
        },
        success: onSuccess,
        error: onError
    });

    function onSuccess(data) {
        var items = data.d.results;
        var results = '';
        // loop over all the groups to get members from all the groups
        for (var i = 0; i < items.length; i++) {
            var UserRequestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/sitegroups(" + items[i].Id + ")/users";
            // API call to get all the member in a particular group
            $.ajax({
                url: UserRequestUri,
                type: "GET",
                headers: {
                    "accept": "application/json;odata=verbose",
                    "content-type": "application/json;odata=verbose",
                    "X-RequestDigest": $("#_REQUESTDIGEST").val()
                },
                success: onSuccessUser,
                error: onError
            });
        }
    }

    function onError(error) {
        alert(JSON.stringify(error));
    }

    function onSuccessUser(data) {
        var userIitems = data.d.results;
        var results = '';
        // loop over all the users to put it in an array for later use
        for (var i = 0; i < userIitems.length; i++) {
            // validate users so that it doesn't repeate in autocomplete because two group can have same member
            if (userIds.indexOf(userIitems[i].Id) > -1) {} else {
                // push member name and ID in an array which will be populated in autocomplete
                availableTags.push(userIitems[i].Title);
                userIds.push(userIitems[i].Id);
            }
        }
    }

    function onSuccessList(data) {
        var List = data.d.results;

        var results = '';
        for (var i = 0; i < List.length; i++) {

            //validate list name so that it doesn't repeate in autocomplete
            if (List.indexOf(List[i].Id) > -1) {} else {
                // put all list name, list ID and Entity type of the list into an array to populate in autocomplete
                availableListTags.push(List[i].Title);
                ListIds.push(List[i].Id);
                ListEntityTypeFullName.push(List[i].ListItemEntityTypeFullName);
            }
        }
    }

    function onErrorList(error) {
        alert(JSON.stringify(error));
    }




    function split(val) {
        return val.split(/@\s*/);
    }

    function splitHashTag(val) {
        return val.split(/#\s*/);
    }

    function extractLast(term) {
        return split(term).pop();
    }

    function extractLastHashTag(term) {
        return splitHashTag(term).pop();
    }

    $("#tags").bind("keydown", function(event) {
        if (event.keyCode === $.ui.keyCode.TAB && $(this).data("autocomplete").menu.active) {
            event.preventDefault();
        }
    }).autocomplete({
        autoFocus: true,
        minLength: 0,
        source: function(request, response) {
            var term = request.term,
                results = [];
            // Check the command if it has '@' to trigger the autocomplete
            if (term.indexOf("@") >= 0) {
                term = extractLast(request.term);
                if (term.length > 0) {
                    // trigger autocomplete for member name
                    results = $.ui.autocomplete.filter(
                        availableTags, term);
                }
            }
            // Check the command if it has '#' to trigger the autocomplete
            else if (term.indexOf("#") >= 0) {
                term = extractLastHashTag(request.term);
                if (term.length > 0) {
                    // trigger autocomplete for member name
                    results = $.ui.autocomplete.filter(
                        availableListTags, term);
                }
            } else return;
            response(results);
        },
        focus: function() {
            // prevent value inserted on focus
            return false;
        },
        select: function(event, ui) {
            if (this.value.indexOf("#") >= 0) {
                var terms_ = splitHashTag(this.value);
                // insert the list name into a hidden field to use it later in SharePoint API call
                $("#list_id").val(ui.item.value);
                // insert the metadata(entity type) into a hidden field to use it later in SharePoint API call
                $("#list_item_entity_type_fullname").val(ListEntityTypeFullName[availableListTags.indexOf(ui.item.value)])
            } else if (this.value.indexOf("@") >= 0) {
                var terms_ = split(this.value);
                // insert the userID into a hidden field to use it later in SharePoint API call
                $("#user_id").val(userIds[availableTags.indexOf(ui.item.value)]);
                // insert the user name into a hidden field to use it later in SharePoint API call
                $("#user_name").val(ui.item.value);
            } else {
                return false;
            }

            terms_.pop();
            terms_.push(ui.item.value + " ");
            terms_.push("");
            this.value = terms_.join("");
            return false;

        }
    });


    function go() {
        $("#status").html("<p style='color:blue'>Processing...</p>");
        splitCommand(); // this function sets global variable resultArray
        // Get metedata of the list selected
        var entity_type_full_name = $("#list_item_entity_type_fullname").val();
        // Get list name
        var listName = $("#list_id").val();
        // Get User ID that is selected from autocomplete for members
        var assignToId = $("#user_id").val();

        // Assign all the data from nlp in an array to insert into SharePoint
        var taskProperties = {
            "__metadata": {
                "type": $("#list_item_entity_type_fullname").val()
            },
            "Title": resultArray.TITLE,
            "AssignedToId": {
                "results": [$("#user_id").val()]
            }, //single-valued User field value
            'StartDate': resultArray.STARTDATE,
            'DueDate': resultArray.DUEDATE,
            'PercentComplete': (resultArray.PERCENTAGE != 0) ? resultArray.PERCENTAGE / 100 : 0,
            "Body": resultArray.DESCRIPTION,
            'Priority': resultArray.PRIORITY
        };

        // Ajax call to insert data into SharePoint 
        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items",
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(taskProperties),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            },
            success: function(data) {
                // Animate the screen to show success message
                $("#status").html("<p style='color:green' id='notice'>Task Created Successfully!!</p>");
                // delay for 3 seconds before refreshing the page
                setTimeout(function() {}, 3000);
                // Reload page to avoid cookies 
                location.reload(true);

            },
            error: function(data) {
                // Animate the screen to show faliour message
                $("#status").html("<p style='color:red' id='notice'>Oops!! Task Creation Unsuccessfull</p>");
                // delay for 3 seconds before refreshing the page
                setTimeout(function() {}, 3000);
                location.reload(true);
            }
        });

    }