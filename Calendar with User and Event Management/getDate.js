

// For our purposes, we can keep the current month in a variable in the global scope
let currentMonth = new Month(2022, 9); // October 2017

// Change the month when the "next" button is pressed
document.getElementById("next_month_btn").addEventListener("click", function(event){
        currentMonth = currentMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
        updateCalendar(); 
        updateClickDate();
        // Whenever the month is updated, we'll need to re-render the calendar in HTML
	    //alert("The new month is "+currentMonth.month+" "+currentMonth.year);
}, false);


// Change the month when the "prev" button is pressed
document.getElementById("prev_month_btn").addEventListener("click", function(event){
	    currentMonth = currentMonth.prevMonth();
        updateCalendar();
        updateClickDate();
}, false);


// This updateCalendar() function only alerts the dates in the currently specified month.  You need to write
// it to modify the DOM (optionally using jQuery) to display the days and weeks in the current month.
function updateCalendar(){
    // adding "Month Year" on the top of calender
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let monYear = document.getElementById("month_year");
    $('#month_year').data('cleandate',currentMonth.year+"-"+String(currentMonth.month).padStart(2, '0'));
    monYear.innerHTML = months[parseInt(currentMonth.month)] + " " + currentMonth.year;

	let weeks = currentMonth.getWeeks();
    
    // get html dates parent 
    let dateParent = document.getElementsByClassName("card-body-dates")[0];
    dateParent.innerHTML = [];


    let reachThisMonth = false;
    let isNextMonth = false;
	for(let w in weeks){
		let days = weeks[w].getDates();

		for(let d in days){

            let cleanDay = parseInt((days[d].toISOString().substring(8,10)));
            let preFixGray = "<li class='prev'>";
            const preFix = "<li class='curr'>";

            if (cleanDay == 1) {
                reachThisMonth = !reachThisMonth;
                if (!reachThisMonth){
                    isNextMonth = true;
                }
            }
            if (isNextMonth){
                preFixGray = "<li class='next'>";
            }
            if (reachThisMonth) {
                dateParent.innerHTML += preFix +  "<a href='#' class = 'display-date'>"+cleanDay+"</a>" +"</li>" ;
            } else {
                dateParent.innerHTML += preFixGray+  "<a href='#' class = 'display-date'>"+cleanDay +"</a>"+"</li>" ;
            }
		}
	}
}
//cite: https://tecadmin.net/get-current-date-time-javascript/
function updateTimeDetail(){
    let timeP = document.getElementById("cur_time");
    let today = new Date();
    let time = String(today.getHours()).padStart(2, '0') + ":" +String(today.getMinutes()).padStart(2, '0');
    timeP.innerHTML = time;
}

// updateCalendar(); is called in calendar_fun
updateTimeDetail();

