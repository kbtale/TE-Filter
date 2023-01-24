const moodle_select = document.getElementsByClassName("custom-select singleselect")[0];
const groups = [];

setToExcel();
setGroups();
createInput();

function setToExcel(){
  var select = document.getElementById("downloadtype_adownload");
    for (var i = 0; i < select.options.length; i++) {
    if (select.options[i].value === "excel") {
      select.selectedIndex = i;
      break;
    }
  }
}

function setGroups(){
  for (i = 0; i < moodle_select.length; i++) {
          groups.push(moodle_select.options[i].text);
  }
}

function filterGroups(f){
  var filteredGroups = groups.filter(e => e.toLowerCase().includes(f.toLowerCase()));
  return filteredGroups;
}

function createInput(){
  let box = document.createElement("div");
  let input = document.createElement("input");
  let btn = document.createElement("a");
  var filter;
  box.setAttribute("id","InputBox");
  box.className = "inputBox";
  input.className = "input";
  input.id = "Filter";
  input.setAttribute("type", "text");
  input.setAttribute("placeholder", "Write your filter here...");
  
  chrome.storage.sync.get("filter", function(r){
    input.value = r.filter;
    createFilteredSelect(r.filter);
  });

  btn.className = "input-btn";
  btn.innerHTML = "Filter";
  btn.addEventListener("click", () => setFilteredOptions(filterGroups(input.value)));
  box.insertAdjacentElement("beforeend", btn);
  box.insertAdjacentElement("afterbegin", input);
  moodle_select.insertAdjacentElement("afterend",box);
}

function createFilteredSelect(f){
    var fSelect = document.createElement("select");
    var opt; 
    fSelect.id = "fSelect";
    fSelect.classList = "select";
    fSelect.addEventListener("change", () => syncSelect(fSelect.options[fSelect.selectedIndex].text, document.getElementById("Filter").value))
    var option = document.createElement("option");
    option.text =  "-- Select an option --";
    option.disabled = true;
    option.selected = true;
    if (f != null) {
      chrome.storage.sync.get("gSelected", function(r){
        setFilteredOptions(filterGroups(f),r.gSelected);
      });
    }
    fSelect.appendChild(option);
    document.getElementById("InputBox").insertAdjacentElement("afterend",fSelect);
}

function setFilteredOptions(a,opt){
  var sel = document.getElementById("fSelect");
  var i, L = sel.options.length - 1;
  for(i = L; i >= 1; i--) {
      sel.remove(i);
  }

  for (var i = 0; i < a.length; i++) {
    var option = document.createElement("option");
    option.value = i;
    option.text = a[i];
    fSelect.appendChild(option);
  }

  if (opt != null) {
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].text === opt) {
        sel.selectedIndex = i;
        sel.value = sel.options[i].value;
        purifyString(sel.options[i].text);
      break;
    }
  }
  }
}

function syncSelect(opt, filter){
  var selValue;
  var urlParams = new URLSearchParams(window.location.search);
  var id = urlParams.get('id');
  for (var i = 0; i < moodle_select.options.length; i++) {
    if (moodle_select.options[i].text === opt) {
      moodle_select.selectedIndex = i;
      selValue = moodle_select.options[i].value;
      break;
    }
  }
  chrome.storage.sync.set({"gSelected": opt});
  if (filter)
    chrome.storage.sync.set({"filter": filter});
  
  redirect(id,selValue);

}

function redirect(id,sv){
  var params = [
    "id=" + id,
    "group=" + sv 
  ];

  window.location.href =
      "http://" +
      window.location.host +
      window.location.pathname +
      '?' + params.join('&');
}

function purifyString(str){
  var pstr = str.replace(/[:|/]/g,"")
  navigator.clipboard.writeText(pstr);
}

/*
var formats = [
    {
      name: "INTENSIVE",
      options: ["10", "1", "2023", "7", "2", "2023"]
    },
    {
      name: "WED-FRI F2F 1",
      options: ["7", "12", "2022", "14", "12", "2022"]
    },
    {
      name: "WED-FRI F2F 2",
      options: ["11", "1", "2023", "24", "2", "2023"]
    },
    {
      name: "SAT F2F 1",
      options: ["26", "11", "2022", "10", "12", "2022"]
    },
    {
      name: "SAT F2F 2",
      options: ["14", "1", "2023", "18", "2", "2023"]
    },
    {
      name: "TUE-THU F2F 1",
      options: ["22", "11", "2022", "15", "12", "2022"]
    },
    {
      name: "TUE-THU F2F 2",
      options: ["10", "1", "2023", "9", "2", "2023"]
    },
    {
      name: "SAT 1",
      options: ["19", "11", "2022", "10", "12", "2022"]
    },
    {
      name: "SAT 2",
      options: ["14", "1", "2023", "11", "2", "2023"]
    },
    {
      name: "TUE-THU 1",
      options: ["15", "11", "2022", "15", "12", "2022"]
    },
    {
      name: "TUE-THU 2",
      options: ["12", "1", "2023", "2", "2", "2023"]
    },
    {
      name: "WED-FRI 1",
      options: ["21", "10", "2022", "14", "12", "2022"]
    },
    {
      name: "WED-FRI 2",
      options: ["11", "1", "2023", "18", "1", "2023"]
    },
    {
      name: "TUE-THU F2F",
      options: ["22", "9", "2022", "17", "11", "2022"]
    },
    {
      name: "TUE-THU F2F",
      options: ["26", "7", "2022", "20", "9", "2022"]
    }
  ]

var days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
var days_id = ["id_sdays_Mon","id_sdays_Tue","id_sdays_Wed","id_sdays_Thu", "id_sdays_Fri", "id_sdays_Sat", "id_sdays_Sun"];
var hours = ["8:30", "9:00", "10:00", "10:30", "11:30", "12:00", "12:30", "1:30", "2:00", "2:45", "3:00", "3:15", "4:15", "4:30", "5:00", "6:00","6:30","8:00"]
var hours_input = [
  ["8","30"],
  ["9","0"],
  ["10","0"],
  ["10","30"],
  ["11","30"],
  ["12","0"],
  ["12","30"],
  ["13","30"],
  ["14","0"],
  ["14","45"],
  ["15","0"],
  ["15","15"],
  ["16","15"],
  ["16","30"],
  ["17","0"],
  ["18","0"],
  ["18","30"],
  ["20","0"]
]

  function useFormat(f){
    document.getElementsByName("sessiondate[day]")[0].value = f[0];
    document.getElementsByName("sessiondate[month]")[0].value = f[1];
    document.getElementsByName("sessiondate[year]")[0].value = f[2];
    document.getElementById("id_sessionenddate_day").value = f[3];
    document.getElementById("id_sessionenddate_month").value = f[4];
    document.getElementById("id_sessionenddate_year").value = f[5];
  }

  function startChange(){
    if (document.getElementById('id_sessiontype_1')){
      document.getElementById('id_sessiontype_1').checked = true;
      document.getElementById('id_sessiontype_0').checked = false;
    }
    document.getElementsByName("addmultiply")[0].checked = true;
    document.getElementById("id_headeraddmultiplesessions").classList.remove("collapsed");

    var scheduleSelect = document.createElement("select");
    scheduleSelect.id = "schedule_select";
    scheduleSelect.classList = "select";
    var option = document.createElement("option");
    option.text =  "-- Select an option --";
    option.disabled = true;
    option.selected = true;
    scheduleSelect.appendChild(option);
    for (var i = 0; i < formats.length; i++) {
      var option = document.createElement("option");
      option.value = i;
      option.text = formats[i].name;
      scheduleSelect.appendChild(option);
    }
    document.getElementById("fitem_id_groups").insertAdjacentElement("afterend",scheduleSelect);
  }

  window.addEventListener('load', (event) => {
    startChange();
  });

  document.addEventListener('change',function(e){
      if(e.target && e.target.id == 'schedule_select'){
        selection = document.getElementById("schedule_select").value;
        console.log(selection)
        useFormat(formats[selection].options);
      }
  });

  document.getElementById("id_groups").addEventListener('change', (event) => {
    secondHour = [];
    hoursSkipped = 0;

    selection = document.getElementById("id_groups").options[document.getElementById("id_groups").selectedIndex].text;
    if (!selection.includes(" TO ")) {
    days.forEach((day, i) => {
      (selection.includes(day)) ? document.getElementById(days_id[i]).checked = true : document.getElementById(days_id[i]).checked = false;
    })
    }
    else {
      let inTheMiddle = -1;
      days.forEach((day, i) => {
        if (selection.includes(day)){
          inTheMiddle *= -1;
          document.getElementById(days_id[i]).checked = true;
        }
        else if (inTheMiddle === 1)
          document.getElementById(days_id[i]).checked = true;

      })
    }

    for (const [i, hour] of hours.entries()) {
      if (selection.includes(hour)){
        document.getElementsByName("sestime[starthour]")[0].value = hours_input[i][0];
        document.getElementsByName("sestime[startminute]")[0].value = hours_input[i][1];
        secondHour = hours.slice(i+1, hours.length);
        hoursSkipped = i+1;
        break;
      }
    }

    for (const [i, hour] of secondHour.entries()) {
      if (selection.includes(hour)){
        document.getElementsByName("sestime[endhour]")[0].value = hours_input[hoursSkipped+i][0];
        document.getElementsByName("sestime[endminute]")[0].value = hours_input[hoursSkipped+i][1];
        break;
      }
    }

  });
*/