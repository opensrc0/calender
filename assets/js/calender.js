$(document).ready(function(){
    
    var rooms
        ,noOfDatesShow
        ,roomType
        ,roomTyes
        ,date
        ,today
        ,datesToshow;

    function init () {
        rooms = [1, 2, 3, 4, 5];
        noOfDatesShow = 7;
        roomType = 'oak';
        roomTyes = ['oak', 'maple', 'maple or oak'];
        date = new Date();
        today = date.getDate();
        datesToshow = getDates(today, noOfDatesShow);
        $.ajax({
            "url" : 'http://www.mocky.io/v2/591596dc100000b9027595b1',
            "success" : function (result) {
                bookingData = result;
                showCalender(datesToshow, bookingData, rooms);
            }
        });
    }
   
    init();

    function getRoomTypeTemp () {
        var roomTypeStr = `<ul class="hide" id="changeRoomType">`;
        for(var j = 0; j < roomTyes.length; j++) {
            roomTypeStr += `<li data-attr="${roomTyes[j]}">${roomTyes[j]}</li>`;
        }
        roomTypeStr += `</ul>`;

        return roomTypeStr;
    }

    function getDates (today, noOfDatesShow) {
        var getDate = [];
        for(var i = 0; i < noOfDatesShow; i++) {
            if(today+i <= 31){
                getDate.push(today+i);
            } else {
                getDate.push(today + i - 31);
            }
        }
        return getDate;
    }

    var changeFormat = function (date) {
        var splitDate = date.split('-');
        return splitDate[1] + '-' + splitDate[0] + '-' + splitDate[2];
    }

    var markBookings = function (bookingData) {
        bookingData.map(function(value, index, arr){
            let roomNo = value.roomNumber;
            if(roomType == value.roomType) {
                let checkInDate = (new Date(changeFormat(value.checkIn))).getDate();
                let checkOutDate = (new Date(changeFormat(value.checkOut))).getDate();
                $("#"+roomNo+ '' + checkInDate).css({'border-radius' : '25% 0% 0% 25%'});
                $("#"+roomNo+ '' + checkOutDate).css({'border-radius' : '0% 25% 25% 0%'});
                for(var i = checkInDate; i <= checkOutDate; i++) {
                    $("#"+roomNo+ '' + i).css({'background-color' : 'red'});
                }
            } else {
                 $("#"+roomNo+ '' + i).css({'background-color' : 'white'});
            }
        })
    }

    var showCalender = function (datesToshow, bookingData, rooms) {
        
        let roomTypeStr = getRoomTypeTemp();

        var str = '';
        str += `<th id="roomType" data-attr="${roomType}" style="cursor:pointer">
            ${roomType}
            ${roomTypeStr}
        </th>`;
        for(var i = 0; i < datesToshow.length; i++) {
            if(datesToshow[i] <= 9) {
                str += `<th>${'0' + datesToshow[i]}</th>`;
            } else {
                str += `<th>${datesToshow[i]}</th>`;
            }
        }

        for(var i = 0; i < rooms.length; i++) {
            str += `<tr>
                        <td>
                            ${'0' + rooms[i]}
                        </td>
                        <td id="${rooms[i] + '' +datesToshow[0]}"></td>
                        <td id="${rooms[i] + '' +datesToshow[1]}"></td>
                        <td id="${rooms[i] + '' +datesToshow[2]}"></td>
                        <td id="${rooms[i] + '' +datesToshow[3]}"></td>
                        <td id="${rooms[i] + '' +datesToshow[4]}"></td>
                        <td id="${rooms[i] + '' +datesToshow[5]}"></td>
                        <td id="${rooms[i] + '' +datesToshow[6]}"></td>
                    </tr>`;
        }

        document.querySelector('#calender').innerHTML = str;
        markBookings(bookingData);
        changeRoomType();
    }

    function changeRoomType () {
        $("#roomType").click(function() {
            $("#changeRoomType").removeClass('hide');
        });
        $("#changeRoomType").click(function(e){
            roomType = e.target.getAttribute('data-attr');
            showCalender(datesToshow, bookingData, rooms);
            $("#changeRoomType").addClass('hide');
        });
    }
   
    function getPreviousdate() {
         if(today - 7 > 0) {
            today = today - 7;
        } else {
            today = today - 7 + 31;
        }
    }

    function getNextDate() {
        if(today + 7 <= 31) {
            today = today + 7;
        } else {
            today = today + 7 - 31;
        }
    }

    $('#prev-left').click(function(){
        getPreviousdate();
        datesToshow = getDates(today, noOfDatesShow);
        showCalender(datesToshow, bookingData, rooms);
    });

    $('#prev-right').click(function(){
        getNextDate();
        datesToshow = getDates(today, noOfDatesShow);
        showCalender(datesToshow, bookingData, rooms);
    });
});