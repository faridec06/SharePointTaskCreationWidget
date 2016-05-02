// An array variable to store time related texts
var time = ["TOMORROW", "WEEK", "TODAY", "DAYAFTERTOMORROW", "DAY", "DAYS", "WEEKS", "MONTH", "MONTHS", "YEAR", "YEARS", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY", "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
// An array variable to store time related adjectives
var timeAdj = ["THIS", "LAST", "FIRST", "NEXT", "SECOND", "THIRD", "FOURTH", "FIFTH", "WITHIN", "END"];
// A variable which has a first three characters of numbers from one to thirteen
var words = 'onetwothrfoufivsixseveigninteneletwethi';
// An array variable to store texts related to due date
var endElements = ["COMPLETE", "FINISH", "END", "CONCLUDE", "FINALISE", "TERMINATE", "SUBMIT", "DUE"];
// An array variable to store all other texts that has to be stripped off at the end from the command
var misc = ["ON", "IN", "WITH", "THE", "OF", "BY", "COUPLE", "START", "AFTER", "AND", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "COMPLETE", "FINISH", "END", "CONCLUDE", "FINALISE", "TERMINATE", "SUBMIT", "DUE"];
// An array variable to insert time related values
var timeElements = [];
// An array variable to insert time adjective related values
var timeAdjEle = [];
var month = "";
var date = new Date();
var lastDay;
var finalTime;
var day;
var timeFinal1;
var timeFinal = "";
var timeToAdd = "";
var dateText = [];
var dateCalculate = [];
var str;
var count = 0;
// sets initial value of 1 for priority
var priority = "1";
// sets initial value of 0 for percentage
var percentage = 0;
var taskName;
var desc = "";
var cap;
// An associative array that stores all the required field values from the command
var resultArray = {};
// sets default value of 1
resultArray['PRIORITY'] = "(1) High";
// sets default value of 0
resultArray['PERCENTAGE'] = 0;
// sets default value ""
resultArray['DESCRIPTION'] = "";
// sets default value of today's date
resultArray['STARTDATE'] = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();



/*  This function extracts the command from the html page textbox and
 processes it to seperate priority, percentege, description, start date, due date */
function splitCommand() {
    // command is retrieved from the text box
    str = document.getElementById('tags').value;
    var name = document.getElementById('user_name').value;
    var listname = document.getElementById('list_id').value;
    // Error message is thrown if either user or list is not specified
    if (!name || !listname) {
        alert("Enter the command without ANY spelling or grammatical errors \nEnter an '@' sign before entering the person's name \nOne task can be allocated to one person at a time \nType a '#' sign before the list name \nIf entering the date directly follow dd/mm/yyyy format i.e. 29/12/2017 \nDue date command should be able to fetch an exact date i.e. 'finish by the end of next week' will work whereas 'finish it next week' will not work \nMention start date and end date explicitly (synonyms are accepted) i.e. Start today and submit it by next Monday \nA week starts on Monday and finishes on Sunday (Public holidays and weekends are not considered) \nDue date cannot be before start date \nDescription of the task must be enclosed in '[ ]' \nPercentage completed must be stated as number followed by percentage sign i.e. 25% \nPlus symbol followed by 1 (high) or 2(medium) or 3(low) must be entered to indicate the priority of the task i.e. +1");
    }
    // user and list are replaced with empty spaces in the command
    str = str.replace(document.getElementById('user_name').value, '').replace(document.getElementById('list_id').value, '');
    // empty spaces are removed
    cap = str.trim().toUpperCase();
    // the command is processed with endElements array to split the command into two halves if it has start date and end date
    for (var x = 0; x < endElements.length; x++) {
        if (cap.indexOf(endElements[x]) >= 0) {
            dateText.push(cap.substr(cap.indexOf(endElements[x]) - cap.charAt(0), cap.indexOf(endElements[x]) - 1));
            dateText.push(cap.substr(cap.indexOf(endElements[x]), cap.length));
        }
    }
    // priority is processed from the command
    if (cap.indexOf('+') > -1) {
        priority = cap.substr(cap.indexOf('+') + 1, 1);
        var priority_text;
        switch (priority) {
            case "1":
                priority_text = "High";
                break;
            case "2":
                priority_text = "Medium";
                break;
            case "3":
                priority_text = "Low";
                break;
            default:
                priority_text = "high";
                priority = "1";
                break;
        }
        resultArray['PRIORITY'] = "(" + priority + ") " + priority_text;
    }
    // percentage is processed from the command
    if (cap.indexOf('%') > -1) {
        var cap1 = "  " + cap;
        percentage = cap1.substr(cap1.indexOf('%') - 3, 3);
        percentage = percentage.replace(/\D/g, '');
        percentage = percentage.trim();
        resultArray['PERCENTAGE'] = percentage;
    }
    // description is extracted from the command
    if (cap.indexOf('[') > -1) {
        desc = cap.substring(cap.lastIndexOf("[") + 1, cap.lastIndexOf("]"));
        desc = desc.trim();
        desc = desc.substring(0, 1).toUpperCase() + desc.substring(1).toLowerCase();
        resultArray['DESCRIPTION'] = desc;
    }
    // this loop gets the date by running the loop wrt length of dateText array
    for (var y1 = 0; y1 < dateText.length; y1++) {
        var res = dateText[y1].split(" ");
        var dateValue = dateText[y1].substr(dateText[y1].indexOf('/') - 2, 10);
        // checks if the date entered matches the format dd/mm/yyyy
        var t = dateValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (t !== null) {
            var d = +t[1],
                m = +t[2],
                y = +t[3];
            var dateFull = new Date(y, m - 1, d);
            if (dateFull.getFullYear() === y && dateFull.getMonth() === m - 1) {
                // passes the date value to displayDate function where the date is displayed
                displayDate(dateFull);
            }
        }
        // If the date specified is not in the format of dd/mm/yyyy then the time and time adjectives are pushed into the array
        for (var i = 0; i < res.length; i++) {
            for (var l = 0; l < time.length; l++) {

                if (res[i] == time[l]) {
                    timeElements.push(res[i]);
                }
            }
            for (var j = 0; j < timeAdj.length; j++) {
                if (res[i] == timeAdj[j]) {
                    timeAdjEle.push(res[i]);
                }
            }
        }
        // this if condition will get executed if there are no time elements
        if (timeElements.length == 0) {
            displayFields();
        }
        // this if condition will get executed if there are no time adjective elements
        if (timeElements.length >= 1 && timeAdjEle.length == 0) {

            for (var i = 0; i < res.length; i++) {
                for (var l = 0; l < time.length; l++) {
                    if (res[i] == time[l]) {
                        timeFinal = res[i];
                        // calculates today's date
                        if (timeFinal == "TODAY") {
                            var today = new Date();
                            timeToAdd = today;
                        }
                        // calculates tomorrow's date
                        if (timeFinal == "TOMORROW") {
                            if ((res[i - 1] != "AFTER") || (res[i - 2] != "DAY")) {
                                var tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                timeToAdd = tomorrow;
                            }
                        }
                        // calculates day after tomorrow's date
                        if (timeFinal == "TOMORROW") {
                            if ((res[i - 1] == "AFTER") && (res[i - 2] == "DAY")) {
                                var tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 2);
                                timeToAdd = tomorrow;
                            }
                        }
                        // calculates date values related to number of days
                        if (timeFinal == "DAY" || timeFinal == "DAYS") {
                            if (res[i - 2] == "COUPLE") {
                                var day = new Date();
                                day.setDate(day.getDate() + 2);
                                timeToAdd = day;
                            } else {
                                // the position of the number entered is found out from the words string
                                var pos = words.indexOf(res[i - 1].substring(0, 3).toLowerCase());
                                var numberConverted = pos / 3 + 1;
                                var days = numberConverted;
                                var day = new Date();
                                // number is added to along with today's date
                                day.setDate(day.getDate() + days);
                                timeToAdd = day;
                            }
                        }
                        // calculates date values related to number of weeks
                        if (timeFinal == "WEEK" || timeFinal == "WEEKS") {
                            if (res[i - 2] == "COUPLE") {
                                var week = new Date();
                                week.setDate(week.getDate() + 14);
                                timeToAdd = week;
                            } else {
                                var pos = words.indexOf(res[i - 1].substring(0, 3).toLowerCase());
                                var numberConverted = pos / 3 + 1;
                                var weeks = numberConverted * 7;
                                var week = new Date();
                                week.setDate(week.getDate() + weeks);
                                timeToAdd = week;
                            }
                        }
                        // calculates date values related to number of months
                        if (timeFinal == "MONTH" || timeFinal == "MONTHS") {
                            if (res[i - 2] == "COUPLE") {
                                var month = new Date();
                                month.setDate(month.getDate() + 61);
                                timeToAdd = month;
                            } else {
                                var pos = words.indexOf(res[i - 1].substring(0, 3).toLowerCase());
                                var numberConverted = pos / 3 + 1;
                                var months = numberConverted * 30;
                                var month = new Date();
                                month.setDate(month.getDate() + months);
                                timeToAdd = month;
                            }
                        }
                        // calculates date values related to number of years
                        if (timeFinal == "YEAR" || timeFinal == "YEARS") {
                            if (res[i - 2] == "COUPLE") {
                                var year = new Date();
                                year.setDate(year.getDate() + 730);
                                timeToAdd = year;
                            } else {
                                var pos = words.indexOf(res[i - 1].substring(0, 3).toLowerCase());
                                var numberConverted = pos / 3 + 1;
                                var years = numberConverted * 365;
                                var year = new Date();
                                year.setDate(year.getDate() + years);
                                timeToAdd = year;
                            }
                        }
                    }
                }
            }
            displayDate(timeToAdd);
        }

        if ((timeElements.length >= 1) && (timeAdjEle.length <= 1)) {
            if ((timeElements[0] == "MONDAY") || (timeElements[0] == "TUESDAY") || (timeElements[0] == "WEDNESDAY") || (timeElements[0] == "THURSDAY") || (timeElements[0] == "FRIDAY") || (timeElements[0] == "SATURDAY") || (timeElements[0] == "SUNDAY")) {
                // calculates date values related to this+weekday
                if ((timeAdjEle[0] == "THIS") || (timeAdjEle[1] == "THIS")) {
                    var dayNum = dayFinder(timeElements[0]);
                    if (dayNum >= date.getDay()) {
                        var thisDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (dayNum - date.getDay()));
                        displayDate(thisDay);
                    }
                    if (dayNum < date.getDay()) {
                        var thisDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (7 - (date.getDay() - dayNum)));
                        displayDate(thisDay);
                    }
                }
                // calculates date values related to next+weekday
                if ((timeAdjEle[0] == "NEXT") || (timeAdjEle[1] == "NEXT")) {
                    var dayNum = dayFinder(timeElements[0]);
                    var thisDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (7 - (date.getDay() - dayNum)));
                    displayDate(thisDay);
                }
            }
        }

        if ((timeElements.length >= 1) && (timeAdjEle.length <= 2)) {
            if ((timeAdjEle[0] == "WITHIN") || (timeAdjEle[1] == "WITHIN")) {
                if ((timeAdjEle[0] == "THIS") || (timeAdjEle[1] == "THIS")) {
                    // calculates date values related to within this month
                    if (timeElements[0] == "MONTH") {
                        lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                        finalTime = lastDay;
                        displayDate(finalTime);
                    }
                    // calculates date values related to within this + (month)
                    if ((timeElements[0] == "JANUARY") || (timeElements[0] == "FEBRUARY") || (timeElements[0] == "MARCH") || (timeElements[0] == "APRIL") || (timeElements[0] == "MAY") || (timeElements[0] == "JUNE") || (timeElements[0] == "JULY") || (timeElements[0] == "AUGUST") || (timeElements[0] == "SEPTEMBER") || (timeElements[0] == "OCTOBER") || (timeElements[0] == "NOVEMBER") || (timeElements[0] == "DECEMBER")) {
                        monthCalculator(timeElements[0]);
                    }
                    // calculates date values related to within this week
                    if (timeElements[0] == "WEEK") {
                        var curr = new Date;
                        lastDay = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));
                        finalTime = lastDay;
                        displayDate(finalTime);
                    }
                    // calculates date values related to within this year
                    if (timeElements[0] == "YEAR") {
                        var curr = new Date;
                        lastDay = new Date(curr.getFullYear(), 11, 31);
                        finalTime = lastDay;
                        displayDate(finalTime);
                    }
                }
                if ((timeAdjEle[0] == "NEXT") || (timeAdjEle[1] == "NEXT")) {
                    // calculates date values related to within next month
                    if (timeElements[0] == "MONTH") {
                        lastDay = new Date(date.getFullYear(), date.getMonth() + 2, 0);
                        finalTime = lastDay;
                        displayDate(finalTime);
                    }
                    // calculates date values related to within next + (month)
                    if ((timeElements[0] == "JANUARY") || (timeElements[0] == "FEBRUARY") || (timeElements[0] == "MARCH") || (timeElements[0] == "APRIL") || (timeElements[0] == "MAY") || (timeElements[0] == "JUNE") || (timeElements[0] == "JULY") || (timeElements[0] == "AUGUST") || (timeElements[0] == "SEPTEMBER") || (timeElements[0] == "OCTOBER") || (timeElements[0] == "NOVEMBER") || (timeElements[0] == "DECEMBER")) {
                        monthCalculator(timeElements[0]);
                    }
                    // calculates date values related to within next week
                    if (timeElements[0] == "WEEK") {
                        var curr = new Date;
                        lastDay = new Date(curr.setDate(curr.getDate() - curr.getDay() + 14));
                        finalTime = lastDay;
                        displayDate(finalTime);
                    }
                    // calculates date values related to within this year
                    if (timeElements[0] == "YEAR") {
                        var curr = new Date;
                        lastDay = new Date(curr.getFullYear() + 1, 11, 31);
                        finalTime = lastDay;
                        displayDate(finalTime);
                    }
                }
            }
            if ((timeAdjEle[0] == "END") || (timeAdjEle[1] == "END")) {
                if ((timeAdjEle[0] == "THIS") || (timeAdjEle[1] == "THIS")) {
                    // calculates date values related to by the end of this month
                    if (timeElements[0] == "MONTH") {
                        lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                        finalTime = lastDay;
                        displayDate(finalTime);
                    }
                    // calculates date values related to by the end of this (month)
                    if ((timeElements[0] == "JANUARY") || (timeElements[0] == "FEBRUARY") || (timeElements[0] == "MARCH") || (timeElements[0] == "APRIL") || (timeElements[0] == "MAY") || (timeElements[0] == "JUNE") || (timeElements[0] == "JULY") || (timeElements[0] == "AUGUST") || (timeElements[0] == "SEPTEMBER") || (timeElements[0] == "OCTOBER") || (timeElements[0] == "NOVEMBER") || (timeElements[0] == "DECEMBER")) {
                        monthCalculator(timeElements[0]);
                    }
                    // calculates date values related to by the end of this week
                    if (timeElements[0] == "WEEK") {
                        var curr = new Date;
                        lastDay = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));
                        finalTime = lastDay;
                        displayDate(finalTime);
                    }
                    // calculates date values related to by the end of this year
                    if (timeElements[0] == "YEAR") {
                        var curr = new Date;
                        lastDay = new Date(curr.getFullYear(), 11, 31);
                        finalTime = lastDay;
                        displayDate(finalTime);
                    }
                }
                if ((timeAdjEle[0] == "NEXT") || (timeAdjEle[1] == "NEXT")) {
                    // calculates date values related to by the end of next month
                    if (timeElements[0] == "MONTH") {
                        lastDay = new Date(date.getFullYear(), date.getMonth() + 2, 0);
                        finalTime = lastDay;
                        displayDate(finalTime);
                    }
                    // calculates date values related to by the end of next (month)
                    if ((timeElements[0] == "JANUARY") || (timeElements[0] == "FEBRUARY") || (timeElements[0] == "MARCH") || (timeElements[0] == "APRIL") || (timeElements[0] == "MAY") || (timeElements[0] == "JUNE") || (timeElements[0] == "JULY") || (timeElements[0] == "AUGUST") || (timeElements[0] == "SEPTEMBER") || (timeElements[0] == "OCTOBER") || (timeElements[0] == "NOVEMBER") || (timeElements[0] == "DECEMBER")) {
                        monthCalculator(timeElements[0]);
                    }
                    // calculates date values related to by the end of next week
                    if (timeElements[0] == "WEEK") {
                        var curr = new Date;
                        lastDay = new Date(curr.setDate(curr.getDate() - curr.getDay() + 14));
                        finalTime = lastDay;
                        displayDate(finalTime);
                    }
                    // calculates date values related to by the end of next year
                    if (timeElements[0] == "YEAR") {
                        var curr = new Date;
                        lastDay = new Date(curr.getFullYear() + 1, 11, 31);
                        finalTime = lastDay;
                        displayDate(finalTime);
                    }
                }
            }
        }
        if ((timeElements.length >= 2) && (timeAdjEle.length >= 2)) {
            if ((timeAdjEle[0] == "THIS") || (timeAdjEle[1] == "THIS")) {
                // calculates date values related to two time elements and two time adjective elements (this month)
                if ((timeElements[0] == "MONTH") || (timeElements[1] == "MONTH")) {
                    lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

                    if ((timeAdjEle[0] == "LAST") || (timeAdjEle[1] == "LAST")) {
                        thisMonthDay("LAST", "0");
                    }
                    if ((timeAdjEle[0] == "FIRST") || (timeAdjEle[1] == "FIRST")) {
                        thisMonthDay("FIRST", "1");
                    }
                    if ((timeAdjEle[0] == "SECOND") || (timeAdjEle[1] == "SECOND")) {
                        thisMonthDay("SECOND", "2");
                    }
                    if ((timeAdjEle[0] == "THIRD") || (timeAdjEle[1] == "THIRD")) {
                        thisMonthDay("THIRD", "3");
                    }
                    if ((timeAdjEle[0] == "FOURTH") || (timeAdjEle[1] == "FOURTH")) {
                        thisMonthDay("FOURTH", "4");
                    }
                    if ((timeAdjEle[0] == "FIFTH") || (timeAdjEle[1] == "FIFTH")) {
                        thisMonthDay("FIFTH", "5");
                    }
                }
                // calculates date values related to two time elements and two time adjective elements (this (month name))
                if ((timeElements[1] == "JANUARY") || (timeElements[1] == "FEBRUARY") || (timeElements[1] == "MARCH") || (timeElements[1] == "APRIL") || (timeElements[1] == "MAY") || (timeElements[1] == "JUNE") || (timeElements[1] == "JULY") || (timeElements[1] == "AUGUST") || (timeElements[1] == "SEPTEMBER") || (timeElements[1] == "OCTOBER") || (timeElements[1] == "NOVEMBER") || (timeElements[1] == "DECEMBER")) {
                    lastDay = monthReturn(timeElements[1]);
                    if ((timeAdjEle[0] == "LAST") || (timeAdjEle[1] == "LAST")) {
                        MonthDay("LAST", "0");
                    }
                    if ((timeAdjEle[0] == "FIRST") || (timeAdjEle[1] == "FIRST")) {
                        MonthDay("FIRST", "1");
                    }
                    if ((timeAdjEle[0] == "SECOND") || (timeAdjEle[1] == "SECOND")) {
                        MonthDay("SECOND", "2");
                    }
                    if ((timeAdjEle[0] == "THIRD") || (timeAdjEle[1] == "THIRD")) {
                        MonthDay("THIRD", "3");
                    }
                    if ((timeAdjEle[0] == "FOURTH") || (timeAdjEle[1] == "FOURTH")) {
                        MonthDay("FOURTH", "4");
                    }
                    if ((timeAdjEle[0] == "FIFTH") || (timeAdjEle[1] == "FIFTH")) {
                        MonthDay("FIFTH", "5");
                    }
                }
            }
            // calculates date values related to two time elements and two time adjective elements (next month)
            if ((timeAdjEle[0] == "NEXT") || (timeAdjEle[1] == "NEXT")) {
                if ((timeElements[0] == "MONTH") || (timeElements[1] == "MONTH")) {
                    lastDay = new Date(date.getFullYear(), date.getMonth() + 2, 0);
                    if ((timeAdjEle[0] == "LAST") || (timeAdjEle[1] == "LAST")) {
                        nextMonthDay("LAST", "0");
                    }
                    if ((timeAdjEle[0] == "FIRST") || (timeAdjEle[1] == "FIRST")) {
                        nextMonthDay("FIRST", "1");
                    }
                    if ((timeAdjEle[0] == "SECOND") || (timeAdjEle[1] == "SECOND")) {
                        nextMonthDay("SECOND", "2");
                    }
                    if ((timeAdjEle[0] == "THIRD") || (timeAdjEle[1] == "THIRD")) {
                        nextMonthDay("THIRD", "3");
                    }
                    if ((timeAdjEle[0] == "FOURTH") || (timeAdjEle[1] == "FOURTH")) {
                        nextMonthDay("FOURTH", "4");
                    }
                    if ((timeAdjEle[0] == "FIFTH") || (timeAdjEle[1] == "FIFTH")) {
                        nextMonthDay("FIFTH", "5");
                    }
                }
                // calculates date values related to two time elements and two time adjective elements (next (month name))
                if ((timeElements[1] == "JANUARY") || (timeElements[1] == "FEBRUARY") || (timeElements[1] == "MARCH") || (timeElements[1] == "APRIL") || (timeElements[1] == "MAY") || (timeElements[1] == "JUNE") || (timeElements[1] == "JULY") || (timeElements[1] == "AUGUST") || (timeElements[1] == "SEPTEMBER") || (timeElements[1] == "OCTOBER") || (timeElements[1] == "NOVEMBER") || (timeElements[1] == "DECEMBER")) {
                    lastDay = monthReturn(timeElements[1]);
                    if ((timeAdjEle[0] == "LAST") || (timeAdjEle[1] == "LAST")) {
                        MonthDay("LAST", "0");
                    }
                    if ((timeAdjEle[0] == "FIRST") || (timeAdjEle[1] == "FIRST")) {
                        MonthDay("FIRST", "1");
                    }
                    if ((timeAdjEle[0] == "SECOND") || (timeAdjEle[1] == "SECOND")) {
                        MonthDay("SECOND", "2");
                    }
                    if ((timeAdjEle[0] == "THIRD") || (timeAdjEle[1] == "THIRD")) {
                        MonthDay("THIRD", "3");
                    }
                    if ((timeAdjEle[0] == "FOURTH") || (timeAdjEle[1] == "FOURTH")) {
                        MonthDay("FOURTH", "4");
                    }
                    if ((timeAdjEle[0] == "FIFTH") || (timeAdjEle[1] == "FIFTH")) {
                        MonthDay("FIFTH", "5");
                    }
                }
            }
        }
        // empties the array
        timeAdjEle = [];
        timeElements = [];
    }
    // Final alert message is displayed with all the elements of associative array
    alert("User: " + document.getElementById('user_name').value + "\n Title:" + resultArray['TITLE'] + "\n" + "Priority: " + resultArray['PRIORITY'] + "\n" + "Percentage: " + resultArray['PERCENTAGE'] + "\n" + "Description: " + resultArray['DESCRIPTION'] + "\n" + "Start Date: " + resultArray['STARTDATE'] + "\n" + "Due Date: " + resultArray['DUEDATE']);
}

//Calculates date related to this month
function thisMonthDay(dayName, val) {

    if ((timeAdjEle[0] == dayName) || (timeAdjEle[1] == dayName)) {
        for (k = 0; k < timeElements.length; k++) {
            if (timeElements[k] != "MONTH") {
                day = dayFinder(timeElements[k]);

                for (n = 1; n <= 31; n++) {
                    if (val == "0") {
                        timeFind1 = new Date(date.getFullYear(), date.getMonth() + 1, -n + 1);
                    }
                    if (val == "1") {
                        timeFind1 = new Date(date.getFullYear(), date.getMonth(), +n);
                    }
                    if (val == "2") {
                        timeFind1 = new Date(date.getFullYear(), date.getMonth(), +n + 8);
                    }
                    if (val == "3") {
                        timeFind1 = new Date(date.getFullYear(), date.getMonth(), +n + 15);
                    }
                    if (val == "4") {
                        timeFind1 = new Date(date.getFullYear(), date.getMonth(), +n + 21);
                    }
                    if (val == "5") {
                        timeFind1 = new Date(date.getFullYear(), date.getMonth(), +n + 28);
                    }
                    var timeFind2 = timeFind1.getDay();

                    if (day == timeFind2) {
                        finalTime = timeFind1;
                        displayDate(finalTime);
                        return;
                    }
                }
            }
        }
    }
}

//Calculates date related to next month
function nextMonthDay(dayName, val) {

    if ((timeAdjEle[0] == dayName) || (timeAdjEle[1] == dayName)) {
        for (k = 0; k < timeElements.length; k++) {
            if (timeElements[k] != "MONTH") {
                day = dayFinder(timeElements[k]);
                for (n = 1; n <= 31; n++) {
                    if (val == "0") {
                        timeFind1 = new Date(date.getFullYear(), date.getMonth() + 2, -n + 1);

                    }
                    if (val == "1") {
                        timeFind1 = new Date(date.getFullYear(), date.getMonth() + 1, +n);
                    }
                    if (val == "2") {
                        timeFind1 = new Date(date.getFullYear(), date.getMonth() + 1, +n + 8);
                    }
                    if (val == "3") {
                        timeFind1 = new Date(date.getFullYear(), date.getMonth() + 1, +n + 15);
                    }
                    if (val == "4") {
                        timeFind1 = new Date(date.getFullYear(), date.getMonth() + 1, +n + 21);
                    }
                    if (val == "5") {
                        timeFind1 = new Date(date.getFullYear(), date.getMonth() + 1, +n + 28);
                    }
                    var timeFind2 = timeFind1.getDay();

                    if (day == timeFind2) {
                        finalTime = timeFind1;
                        displayDate(finalTime);
                        return;
                    }
                }
            }
        }
    }
}

//Calculates date related to this (month name)
function MonthDay(dayName, val) {

    if ((timeAdjEle[0] == dayName) || (timeAdjEle[1] == dayName)) {
        for (k = 0; k < timeElements.length; k++) {
            if ((timeElements[k] != "JANUARY") && (timeElements[k] != "FEBRUARY") && (timeElements[k] != "MARCH") && (timeElements[k] != "APRIL") && (timeElements[k] != "MAY") && (timeElements[k] != "JUNE") && (timeElements[k] != "JULY") && (timeElements[k] != "AUGUST") && (timeElements[k] != "SEPTEMBER") && (timeElements[k] != "OCTOBER") && (timeElements[k] != "NOVEMBER") && (timeElements[k] != "DECEMBER")) {
                day = dayFinder(timeElements[k]);
                for (n = 1; n <= 31; n++) {
                    if (val == "0") {
                        timeFind1 = new Date(lastDay.getFullYear(), lastDay.getMonth() + 1, -n + 1);
                    }
                    if (val == "1") {
                        timeFind1 = new Date(lastDay.getFullYear(), lastDay.getMonth(), +n);
                    }
                    if (val == "2") {
                        timeFind1 = new Date(lastDay.getFullYear(), lastDay.getMonth(), +n + 8);
                    }
                    if (val == "3") {
                        timeFind1 = new Date(lastDay.getFullYear(), lastDay.getMonth(), +n + 15);
                    }
                    if (val == "4") {
                        timeFind1 = new Date(lastDay.getFullYear(), lastDay.getMonth(), +n + 21);
                    }
                    if (val == "5") {
                        timeFind1 = new Date(lastDay.getFullYear(), date.getMonth(), +n + 28);
                    }
                    var timeFind2 = timeFind1.getDay();

                    if (day == timeFind2) {
                        finalTime = timeFind1;
                        displayDate(finalTime);
                        return;
                    }
                }
            }
        }
    }
}

//This function works with the extracted date and assigns to the associative array. 
//The other fields are also assigned. 
function displayDate(dValue) {
    var title = "";
    if (dValue != "") {
        dateCalculate.push(dValue);
        if (dateCalculate.length > 1) {
            if ((dateCalculate[0].getTime()) < (dateCalculate[1].getTime())) {
                resultArray['STARTDATE'] = (dateCalculate[0].getMonth() + 1) + "/" + dateCalculate[0].getDate() + "/" + dateCalculate[0].getFullYear();
                resultArray['DUEDATE'] = (dateCalculate[1].getMonth() + 1) + "/" + dateCalculate[1].getDate() + "/" + dateCalculate[1].getFullYear();
            }
        }
        if (dateCalculate.length == 1) {
            resultArray['DUEDATE'] = (dateCalculate[0].getMonth() + 1) + "/" + dateCalculate[0].getDate() + "/" + dateCalculate[0].getFullYear();
        }
        taskName = str.toUpperCase().trim().split(" ");
        // Priority text is stripped
        if (priority) {
            var index = taskName.indexOf("+" + priority);
            if (index != -1) {
                taskName.splice(index, 1);
            }
        }
        // Percentage text is stripped
        if (percentage) {
            var index = taskName.indexOf(percentage + "%");
            if (index != -1) {
                taskName.splice(index, 1);
            }
        }
        // Description text is stripped
        if (desc) {
            var decrip = cap.substring(cap.lastIndexOf("[") + 1, cap.lastIndexOf("]"));
            var desArr = decrip.split(" ");
            var index = taskName.indexOf("[" + desArr[0]);
            var index1 = taskName.indexOf(desArr[(desArr.length) - 1] + "]");
            var index2 = taskName.indexOf("[" + desArr[0] + "]");
            if (index != -1) {
                taskName.splice(index, 1);
            }
            if (index1 != -1) {
                taskName.splice(index1, 1);
            }
            if (index2 != -1) {
                taskName.splice(index2, 1);
            }
            var diff = index1 - index;
            for (var h = 1; h <= diff; h++) {
                taskName.splice(index, 1);
            }
        }

        // Time related text is stripped
        for (var b = 0; b <= time.length; b++) {

            var index = taskName.indexOf(time[b]);
            if (index != -1) {
                taskName.splice(index, 1);
            }
        }
        // Time adjective text is stripped
        for (var c = 0; c <= timeAdj.length; c++) {

            var index = taskName.indexOf(timeAdj[c]);
            if (index != -1) {
                taskName.splice(index, 1);
            }
        }
        // Other text is stripped
        for (var e = 0; e <= misc.length; e++) {

            var index = taskName.indexOf(misc[e]);
            if (index != -1) {
                taskName.splice(index, 1);
            }
        }
        // Exact date text is stripped
        for (var i = 0; i < 2; i++) {
            if (dateText[i].indexOf('/') != -1) {
                var index = taskName.indexOf(dateText[i].substr(dateText[i].indexOf('/') - 2, 10));
                if (index != -1) {
                    taskName.splice(index, 1);
                }
            }
        }
        // Title is assigned from the taskName array
        for (var d = 0; d < taskName.length; d++) {
            title = title + " " + taskName[d];
        }
        title = title.trim();
        title = title.substring(0, 1).toUpperCase() + title.substring(1).toLowerCase();
        resultArray['TITLE'] = title;
    }
}

// This function executes when there is no time related element in the command
function displayFields() {
    var title = "";
    taskName = str.toUpperCase().trim().split(" ");
    //var index = taskName.indexOf("FARID");
    //taskName.splice(index, 1);
    // Priority text is stripped
    if (priority) {
        var index = taskName.indexOf("+" + priority);
        if (index != -1) {
            taskName.splice(index, 1);
        }
    }
    // Percentage text is stripped
    if (percentage) {
        var index = taskName.indexOf(percentage + "%");
        if (index != -1) {
            taskName.splice(index, 1);
        }
    }
    // Description text is stripped
    if (desc) {
        var decrip = cap.substring(cap.lastIndexOf("[") + 1, cap.lastIndexOf("]"));
        var desArr = decrip.split(" ");
        var index = taskName.indexOf("[" + desArr[0]);
        var index1 = taskName.indexOf(desArr[(desArr.length) - 1] + "]");
        var index2 = taskName.indexOf("[" + desArr[0] + "]");
        if (index != -1) {
            taskName.splice(index, 1);
        }
        if (index1 != -1) {
            taskName.splice(index1, 1);
        }
        if (index2 != -1) {
            taskName.splice(index2, 1);
        }
        var diff = index1 - index;
        for (var h = 1; h <= diff; h++) {
            taskName.splice(index, 1);
        }
    }
    // Time text is stripped
    for (var b = 0; b <= time.length; b++) {

        var index = taskName.indexOf(time[b]);
        if (index != -1) {
            taskName.splice(index, 1);
        }
    }
    // Time adjective text is stripped
    for (var c = 0; c <= timeAdj.length; c++) {

        var index = taskName.indexOf(timeAdj[c]);
        if (index != -1) {
            taskName.splice(index, 1);
        }
    }
    // Other text is stripped
    for (var e = 0; e <= misc.length; e++) {

        var index = taskName.indexOf(misc[e]);
        if (index != -1) {
            taskName.splice(index, 1);
        }
    }
    // Exact date text is stripped
    for (var i = 0; i < 2; i++) {
        if (dateText[i].indexOf('/') != -1) {
            var index = taskName.indexOf(dateText[i].substr(dateText[i].indexOf('/') - 2, 10));
            if (index != -1) {
                taskName.splice(index, 1);
            }
        }
    }
    // Title is assigned from taskName array
    for (var d = 0; d < taskName.length; d++) {
        title = title + " " + taskName[d];
    }
    title = title.trim();
    title = title.substring(0, 1).toUpperCase() + title.substring(1).toLowerCase();
    resultArray['TITLE'] = title;
}

// Calculates the month
function monthCalculator(month) {
    var months = 'JANFEBMARAPRMAYJUNJULAUGSEPOCTNOVDEC';
    var dateMonth = new Date();
    var dateCheck = new Date();
    var actualMonth;
    var pos = months.indexOf(month.substring(0, 3));
    dateMonth.setMonth(pos / 3);
    if ((dateCheck.getMonth() + 1) > (dateMonth.getMonth() + 1)) {
        actualMonth = new Date(dateMonth.getFullYear() + 1, dateMonth.getMonth() + 1, 0);
    } else {
        actualMonth = new Date(dateMonth.getFullYear(), dateMonth.getMonth() + 1, 0);
    }
    displayDate(actualMonth);
}

// Returns the corresponding month
function monthReturn(month) {
    var months = 'JANFEBMARAPRMAYJUNJULAUGSEPOCTNOVDEC';
    var dateMonth = new Date();
    var dateCheck = new Date();
    var actualMonth;
    var pos = months.indexOf(month.substring(0, 3));
    dateMonth.setMonth(pos / 3);
    if ((dateCheck.getMonth() + 1) > (dateMonth.getMonth() + 1)) {
        actualMonth = new Date(dateMonth.getFullYear() + 1, dateMonth.getMonth() + 1, 0);
    } else {
        actualMonth = new Date(dateMonth.getFullYear(), dateMonth.getMonth() + 1, 0);
    }
    return actualMonth;
}

// Calculates the number based on the day value
function dayFinder(dayValue) {
    var dayCal = new Array();
    dayCal[1] = "MONDAY";
    dayCal[2] = "TUESDAY";
    dayCal[3] = "WEDNESDAY";
    dayCal[4] = "THURSDAY";
    dayCal[5] = "FRIDAY";
    dayCal[6] = "SATURDAY";
    dayCal[0] = "SUNDAY";
    for (m = 0; m < dayCal.length; m++) {
        if (dayCal[m] == dayValue) {
            return m;
        }
    }
}