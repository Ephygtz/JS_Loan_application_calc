"use strict";

function calculate() {
  //Look up the input and output elements in the document
  var amount = document.getElementById("amount");
  var apr = document.getElementById("apr");
  var years = document.getElementById("years");
  var zipcode = document.getElementById("zipcode");
  var payment = document.getElementById("payment");
  var total = document.getElementById("total");
  var totatlInterest = document.getElementById("totatlInterest");

  //Get the user's input. Convert interest from % to a float and
  //convert from an annual rate to a monthly rate. Convert payment
  // period in years to the number of monthly payments.
  var principal = parseFloat(amount.value);
  var interest = parseFloat(apr.value) / 100 / 12;
  var payments = parseFloat(years.value) * 12;

  //Compute the monthly payment figure
  var x = Math.pow(1 + interest, payments);
  var monthly = (principal * x * interest) / (x - 1);

  //Check if the user's input was good if the result is a finite number
  if (isFinite(monthly)) {
    //FIll in the output fields, rounding to 2 decimal places
    payment.innerHTML = monthly.toFixed(2);
    total.innerHTML  = (monthly * payments).toFixed(2);
    totatlInterest.innerHTML = ((monthly * payments) - principal).toFixed(2);

    // Save the user's input for future sessions
    save(amount.value, apr.value, years.value, zipcode.value);

    //Find and display local lenders ignoring network errors
    try {
      //Catch any errors that occur within these curly braces
      getLenders(amount.value, apr.value, years.value, zipcode.value);
    } catch (e) {
      //and ignore those errors
    } finally {
      //Chart loan balance, interest and equity payments
      chart(principal, interest, monthly, payments);
    }
    else {
      //REsult was Not-a-Number hence the input was invalid.
      //Clear any displayed output
      payment.innerHTML = "";
      total.innerHTML = "";
      totatlInterest.innerHTML = "";
      chart();              //With no argument clears the chart
    }
  }
}

//Save the user's input as properties of the localStorage object
function save(amount, apr, years, zipcode) {
  if (window.localStorage) {  //Only do this if the browser supports it
    localStorage.loan_amount = amount;
    localStorage.loan_apr = apr;
    localStorage.loan_years = years;
    localStorage.loan_zipcode = zipcode;
  }
}

//Automatically restore input fields when the document first loads.
window.onload = function() {
  //If the browser supportd localStorage and we have some stored data
  if (window.localStorage && localStorage.loan_amount) {
    document.getElementById("amount").value = localStorage.loan_amount;
    document.getElementById("apr").value = localStorage.loan_apr;
    document.getElementById("years").value = localStorage.loan_years;
    document.getElementById("zipcode").value = localStorage.loan_zipcode;
  }
};

//Pass the user's input to a server-side script which can return a list
//of links to local lenders interested in making loans.
function getLenders(amount, apr, years, zipcode) {
  //If the window doesn't support XMLHttRequest object, do nothing
  if (!window.XMLHttpRequest) {
    return;
  }
  //Find the element to display the list of lenders in
  var ad = document.getElementById("lenders");
  if(!ad) return;                             //Quit if no spot for output

  // Encode the user's input as query parameters in a URL
  var url = "getLenders.php" +                //Service url plus
      "?amt=" + encodeURIComponent(amount) +  //User data in query string
      "&apr=" + encodeURIComponent(apr) +
      "&yrs=" + encodeURIComponent(years) +
      "&zip+" + encodeURIComponent(zipcode);
}
