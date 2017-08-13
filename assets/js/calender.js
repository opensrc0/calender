(function() {
  "use srict";

  const calendar = {};
  let i;
  const FETCH_API = 'http://www.mocky.io/v2/591596dc100000b9027595b1';
  
  const eId = (id) => document.getElementById(id);

  const hasClass = (ele, cls) => !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));

  const addClass = (ele, cls) => ele && !hasClass(ele, cls) && (ele.className = `${ele.className} ${cls}`);

  const removeClass = (ele, cls) => {
    if (ele && hasClass(ele, cls)) {
      const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      ele.className = ele.className.replace(reg, ' ');
    }
  }

  const buildRoomTypeHtml = (roomTypes) => roomTypes.reduce((accu, roomType) =>
    `${accu}<li data-attr="${roomType}">${roomType}</li>`, `<ul class="hide" id="changeRoomType">`) + `</ul>`;

  const getDates = (today, noOfDatesShow) => {
    const dates = [];
    let curDay = 0;
    for (i = 0; i < noOfDatesShow; i++) {
      curDay = today + i;
      curDay = curDay <= 31 ? curDay : curDay - 31;
      dates.push(curDay);
    }
    return dates;
  }

  const changeFormat = (date) => {
    let splitDate = date.split('-');
    splitDate = `${splitDate[1]}-${splitDate[0]}-${splitDate[2]}`;
    return (new Date(splitDate)).getDate();
  }

  const markBookings = (bookingData) =>
    bookingData.forEach((item, index) => {
      const { roomNumber, checkIn, checkOut, roomType } = item;
      let id = null;
      i = 0;
      if (calendar.roomType == roomType) {
        let checkInDate = changeFormat(checkIn);
        let checkOutDate = changeFormat(checkOut);
        addClass(eId(`${roomNumber}${checkInDate}`), 'openCurve');
        addClass(eId(`${roomNumber}${checkOutDate}`), 'closeCurve');
        for (i = checkInDate; i <= checkOutDate; i++) {
          addClass(eId(`${roomNumber}${i}`), 'backGroundColorRed');
        }
      } else {
        addClass(eId(`${roomNumber}${i}`), 'backGroundColorWhite');
      }
    })

  const showCalender = (datesToshow, bookingData, rooms) => {
    const roomTypeStr = buildRoomTypeHtml(calendar.roomTypes);

    let str = `
      <th id="roomType" data-attr="${calendar.roomType}" style="cursor:pointer">
        ${calendar.roomType}
        ${roomTypeStr}
      </th>`;
    datesToshow.forEach((date) => {
      const modDate = date <= 9 ? `0${date}` : date;
      str = `${str}<th>${modDate}</th>`;
    });

    str = rooms.reduce((accu, room) => {
      return `${accu}
        <tr>
          <td>
            ${'0' + room}
          </td>
          ${[0,1,2,3,4,5,6].map((item) => `<td id="${room + '' + datesToshow[item]}"></td>`)}
        </tr>`;
    }, str);

    eId('calender').innerHTML = str;
    markBookings(bookingData);
    changeRoomType(datesToshow, bookingData, rooms);
  }

  const changeRoomType = (datesToshow, bookingData, rooms) => {
    const changeRoomTypeId = eId('changeRoomType');
    eId('roomType').addEventListener('click', (e) => {
      removeClass(changeRoomTypeId, 'hide');
    }, false);
    changeRoomTypeId.addEventListener('click', (e) => {
      calendar.roomType = e.target.getAttribute('data-attr');
      showCalender(datesToshow, bookingData, rooms);
      addClass(changeRoomTypeId, 'hide');
    }, false);
  }

  const getPreviousDate = (today) => {
    let curDay = today - 7;
    return curDay > 0 ? curDay : curDay + 31;
  }

  const getNextDate = (today) => {
    let curDay = today + 7;
    return curDay <= 31 ? curDay : curDay - 31;
  }

  const handlePagination = (e) => {
    const id = e.target.id;
    if (!['prev-left', 'prev-right'].includes(id)) return;
    const { today, noOfDatesShow, rooms } = calendar;
    const func = id == 'prev-left' ? getPreviousDate : getNextDate;
    calendar.today = func(today);
    calendar.datesToshow = getDates(calendar.today, noOfDatesShow);
    showCalender(calendar.datesToshow, calendar.bookingData, rooms);
  }

  eId('pagination').addEventListener('click', handlePagination);

  const handleApiData = (e) => {
    const rooms = [];
    const roomTypes = [];
    calendar.bookingData = e.data || [];
    calendar.bookingData.forEach(({ roomNumber, roomType }) => {
      rooms.push(roomNumber);
      roomTypes.push(roomType);
    });
    calendar.rooms = [...new Set(rooms)];
    calendar.roomTypes = [...new Set(roomTypes)];
    calendar.roomType = calendar.roomTypes[0] || 'N.A.';
    showCalender(calendar.datesToshow, calendar.bookingData, calendar.rooms);
  }

  const fetchApiData = () => {
    const worker = new Worker('assets/js/webWorker.js');
    worker.postMessage({url: FETCH_API});
    worker.addEventListener('message', handleApiData);
  }

  const init = () => {
    calendar.noOfDatesShow = 7;
    calendar.today = (new Date()).getDate();
    calendar.datesToshow = getDates(calendar.today, calendar.noOfDatesShow);
    fetchApiData();
  }

  docReady(init, null);
}());
