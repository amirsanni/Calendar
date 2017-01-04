/**
 * @author: Amir Sanni <amirsanni@gmailcom>
 * @date: 29-Dec-2016
 */

'use strict';
const spinnerClass = 'fa fa-spinner faa-spin animated';

$(document).ready(function(){
    //initialize time input widgets for setting appointment
    $('#setEventModal .time').timepicker({
        timeFormat: 'H:i',
        disableTextInput: true,
        step: 30,
        scrollDefault: 'now',
        useSelect: true,
        className: 'form-control'
    });
    
    //initialise date input widgets for setting appointment
    $("#setEventModal .date").datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        assumeNearbyYear: true,
        todayBtn: 'linked',
        todayHighlight: true,
        startDate: 'today'
    });
    
    
    //now initialise datepair for setting appointment
    $("#setEventModal").datepair();
    
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
   
    
    //initialise the calendar
    $("#userCal").fullCalendar({
        header: {
            left: 'title',
            center: '',
            right: 'today agendaDay,listDay agendaWeek,listWeek month,listMonth prev,next'
        },
        
        views:{
            listMonth:{
                buttonText:"Month's events"
            },
            
            listWeek:{
                buttonText:"Week's events"
            },
            
            listDay: {
                buttonText: "Day's events"
            }
        },
        
        fixedWeekCount: false,
        eventLimit: true,//whether to limit the number of events displayed on a day
        timezone: 'local',
        nowIndicator: true,//whether to display a marker on the current time
        displayEventEnd: true,//whether to display the time an event will end
        navLinks: true,
        selectable: false,//to enable or disable selection
        selectOverlap: false,//to allow or disallow selecting a time with an event
        allDayDefault: false,
        nextDayThreshold: "00:00:00",// (12am)time to regard as the next day
        
        events: {
            url: 'php/events.php',
            data: {action:'get'},
            method: 'POST',
            
            fail: function(){
                $("#calMsg").html("An error occured while fetching events");
            }
        }
        
        
    });
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
    
    //get usercal calendar object
    var usercal = $('#userCal').fullCalendar('getCalendar');
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
    
    //when a day is clicked
    usercal.on('dayClick', function(clickedDate, jsEvent, view){
        //different modal for different user role. 
        //Doctors can set personal event and also time they'll be available for booking
        //other users can only set personal event
        var userCal = $('#userCal').fullCalendar('getCalendar');//get calendar object
        
        var today = userCal.moment();//create a moment object from the calendar's object
        
        if(today.stripTime().format() <= clickedDate.format()){
            //set the date field in the date on the modal to the selected date
            $("#setEventModal .date").datepicker('update', clickedDate.stripTime().format());
            
            $("#setEventModal").modal('show');
        }
    });
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
    
    //when an event is clicked
    usercal.on('eventClick', function(e, jsEvent, view){
        //allow the clicking of events with status = 1
    });
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
    
    //after a selection is made
    usercal.on('select', function(start, end, jsEvent, view){
        
    });
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
    
    //when user mouse over an event
    usercal.on('eventMouseover', function(e, jsEvent, view){
        $(this).attr('data-toggle', 'tooltip');
        $(this).attr('data-placement', 'bottom');
        $(this).attr('data-title', e.description);
        
        $(this).tooltip('show');
    });
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
    
    //TO show loading icon when an event is being loaded
    usercal.on('loading', function(isLoading, view){
        if(isLoading){
            //displayFlashMsg("Fetching events", spinnerClass, 'black', '', true);
            $("#calMsg").html("<i class='"+spinnerClass+"'></i> Fetching events...");
        }
        
        else{
            $("#calMsg").html("");
        }
    });
    
    
    /*
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    ********************************************************************************************************************************
    */
   
    //WHEN USERS TRY TO SET AN EVENT ON THE CALENDAR
    $("#appPersonalCreate").click(function(e){
        e.preventDefault();
        
        var title = $("#appPersonalTitle").val();
        var fromDate = $("#appPersonalFromDate").val();
        var fromTime = $("#appPersonalFromTime").val();
        var toDate = $("#appPersonalToDate").val();
        var toTime = $("#appPersonalToTime").val();
        var description = $("#appPersonalDescription").val();
        
        if(!title || !fromDate || !fromTime || !toDate || !toTime){
            !title ? $("#appPersonalTitleErr").html("Set event title") : $("#appPersonalTitleErr").html("");
            !fromDate ? $("#appPersonalFromDateErr").html("Set event start date") : $("#appPersonalFromDateErr").html("");
            !fromTime ? $("#appPersonalFromTimeErr").html("Set event start time") : $("#appPersonalFromTimeErr").html("");
            !toDate ? $("#appPersonalToDateErr").html("Set event end date") : $("#appPersonalToDateErr").html("");
            !toTime ? $("#appPersonalToTimeErr").html("Set event end time") : $("#appPersonalToTimeErr").html("");
            
            return;
        }
        
        //clear all error messages
        $("#appPersonalTitleErr").html("");
        $("#appPersonalFromDateErr").html("");
        $("#appPersonalFromTimeErr").html("");
        $("#appPersonalToDateErr").html("");
        $("#appPersonalToTimeErr").html("");
        
        //concatenate the date and time of both the 'from' and 'to' fields
        var startFrom = fromDate + " " + fromTime;//e.g "2016-10-19 09:41am"
        var endAt = toDate + " " + toTime;//e.g "2016-10-19 09:41am"
        
        //create an ISO string from the concatenated date and time of both the 'from' and 'to' fields
        var startDate = new moment(startFrom).format();
        var endDate = new moment(endAt).format();
        
        //show loading icon
        $("#pFormErr").css({color:'black'}).html("<i class='"+spinnerClass+"'></i> Creating event...");
        
        $.ajax({
            url: "php/events.php",
            data: {s:startDate, e:endDate, t:title, description:description, action:'post'},
            method: 'POST'
        }).done(function(rd){
            if(rd.status === 1){
                //display success msg
                $("#pFormErr").css({color:'green'}).html("Event successfully created");

                //remove msg after 5secs
                setTimeout(function(){
                    $("#pFormErr").html("");
                    
                    $("#setEventModal").modal('hide');
                }, 2000);

                //render event on calendar
                $("#userCal").fullCalendar('renderEvent', {
                    id: rd.id,
                    title: title,
                    start: startDate,
                    end: endDate,
                    allday: false,
                    description: description
                }, false);
                
                //reset form
                document.getElementById('personalForm').reset();
            }

            else if(rd.status === -1){
                $("#pFormErr").css({color:'red'}).html("Log in required to perform this action");
            }
            
            else if(rd.status === 2){
                $("#pFormErr").css({color:'red'}).html("Unable to process your request at this time. Please try again later");
            }
            
            else if(rd.status === 3){
                $("#pFormErr").css({color:'red'}).html("Event cannot be in the past");
            }

            else{
                $("#pFormErr").css({color:'red'}).html("One or more requird fields are empty or not properly filled");
            }
        }).fail(function(){
            $("#pFormErr").css({color:'red'}).html("Request Failed");
        });
    });
});