var table;
var datesArr = [];
var titleDatesArr = [];
var dates;
var texts

var year_1, year_2, year_description, fYear_1, fYear_2, right = true;

var datesInterval = [[[1920, 1939], ["PRIMA DELLA SECONDA GUERRA MONDIALE"]],
                     [[1940, 1959], ["IL FASCISMO E LE SUE CENSURE"]],
                     [[1960, 1979], ["PRIMA DELLA SECONDA GUERRA MONDIALE"]],
                     [[1980, 1999], ["PRIMA DELLA SECONDA GUERRA MONDIALE"]],
                     [[2000, 2019], ["PRIMA DELLA SECONDA GUERRA MONDIALE"]]];

let dateI, dateF, sectionTitle, interval;

console.clear();

function startDocument() {
    datesInterval.forEach(function(item) {
        year_1 = item[0][0];
        year_2 = item[0][1];

        if (year_1 < 2000) {
            fYear_1 = year_1 - 1900;
        } else {
            fYear_1 = year_1;
        }

        if (year_2 < 2000) {
            fYear_2 =  year_2 - 1909;
        } else {
            fYear_2 = year_2 - 9;
        }

        year_description = item[1];

        if (right) {
            $('<div class="date-selection" data-dates="' + year_1 + '-' + year_2 + '"><div class="left"><div class="dates"></div></div><div class="right"><h2>Anni ' + fYear_1 + ' e ' + fYear_2 + ' <br> "' + year_description + '"</h2></div></div>').appendTo('.content')
            right = false;
        } else {
            $('<div class="date-selection" data-dates="' + year_1 + '-' + year_2 + '"><div class="left"><h2>Anni ' + fYear_1 + ' e ' + fYear_2 + ' <br> "' + year_description + '"</h2></div><div class="right"><div class="dates"></div></div></div>').appendTo('.content')
            right = true;
        }
    });

    setTimeout(function() {
        $('.top > h1').css('animation', 'none');
        $('.top > h1').css('border-right-color', 'transparent');
    }, 3500)
}

$(document).ready(function(){
    startDocument();
})

function preload() {
    table = loadTable('./assets/dataset.csv', 'csv', 'header');
}

function loadData() {
    let datesOriginal = table.getColumn('Banning Date');
  
    let titlesOriginal = table.getColumn('Title');
  
    for (i = 0; i < datesOriginal.length; i++) {
      if (!datesArr.includes(datesOriginal[i])) {
        datesArr.push(datesOriginal[i]);
      }
    }
  
    sortArray(datesArr, 0);
  
    for (i = 0; i < datesOriginal.length; i++) {
      titleDatesArr[i] = [titlesOriginal[i], datesOriginal[i]];
    }
  
    sortArray(titleDatesArr, 1);
}

function setup() {
    noLoop();
}

function draw() {
    loadData();

    datesInterval.forEach(function(item) {
        dateI = item[0][0];
        dateF = item[0][1];

        interval = dateF - dateI;

        for (i = 0; i < datesArr.length; i++) {
            if ((datesArr[i] - dateI) <= interval && (datesArr[i] - dateI) > 0) {
                $('<p class="date hidden">' + datesArr[i] + '</p>').appendTo('.content > [data-dates="' + dateI + '-' + dateF + '"] .dates');

                for (k = 0; k < titleDatesArr.length; k++) {
                    if (titleDatesArr[k][1] == datesArr[i]) {
                        $('<p class="date-' + datesArr[i] + ' title">' + titleDatesArr[k][0] + '</p>').appendTo('.content > [data-dates="' + dateI + '-' + dateF + '"] .dates');
                    }
                }  
            }
        }
    });

    startMouse();

    dates = selectAll('p');
}

function startMouse() {
    //let randomAnimation = Math.floor(random(1,5));
    let randomAnimation = 2;

    $('p.date').click(function() {
        if ($(this).attr('class').includes("hidden")) {
            $(this).addClass('showed');
            $(this).removeClass('hidden');
            showTitles($(this), randomAnimation);
        } else {
            $(this).addClass('hidden');
            $(this).removeClass('showed');
            hideTitles($(this), randomAnimation);
        }
    });
}

function showTitles(date, animation) {
    date = date.text();
    texts = selectAll('p.date-' + date);
  
    for (k = 0; k < texts.length; k++) {
      texts[k].addClass('animation-' + animation);
      texts[k].addClass('showed');
    }
}
  
function hideTitles(date) {
    date = date.text();
    texts = selectAll('p.date-' + date);
  
    for (k = 0; k < texts.length; k++) {
      texts[k].removeClass('showed');
    }
}

function sortArray(arr, type) {
    let temp; 
  
    if (type == 0) {
      for (i = 0; i < arr.length; i++) {
        if (arr[i] == "") {
          arr.splice(i, 1);
        }
        for (k = i; k < arr.length; k++) {
          if (parseInt(arr[i]) > parseInt(arr[k])) {
            temp = arr[i];
            arr[i] = arr[k];
            arr[k] = temp;
          }
        }
      }
    } else {
      for (i = 0; i < arr.length; i++) {
        if (arr[i][1] == "") {
          arr.splice(i, 1);
        }
        for (k = i; k < arr.length; k++) {
          if (parseInt(arr[i][1]) > parseInt(arr[k][1])) {
            temp = arr[i];
            arr[i] = arr[k];
            arr[k] = temp;
          }
        }
      }
    }
}  