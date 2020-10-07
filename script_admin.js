var from = $("#adminEmail").val();
var pwd = $("#adminPassword").val();
var to = [];
var subject = $("#subject").val();
var body = $("#body").val();
var filter =  $(".filter option:selected").text();
var filtertext = $("#filtertext").val();
var key = 0;

function sendEmail(){
    $.getJSON("https://spreadsheets.google.com/feeds/list/1wwGRfO0WvHWLbhku-J5-U13fyWIqo9JiN6XU1JFrggE/od6/public/values?alt=json", 
        function (data) {

            var sheetData = data.feed.entry;

            if(filter=="On basis of Location")
                key = 1;
            else if(filter=="On basis of first character of Username")
                key = 2;
            else if(filter=="Send to All")
                key = 3;

            var i;
            for (i = 0; i < sheetData.length; i++) {
                var name = data.feed.entry[i]['gsx$name']['$t'];
                var email = data.feed.entry[i]['gsx$email']['$t'];
                var city = data.feed.entry[i]['gsx$city']['$t'];
                
                if(key==1){
                    filtertext = filtertext.toString().toLowerCase();
                    city = city.toString().toLowerCase();
                    if(filtertext==city)
                        to.push(email);
                }
                else if(key==2){
                    filtertext = filtertext.toString().toLowerCase();
                    name = name.toString().toLowerCase();
                    if(name.startsWith(filtertext))
                        to.push(email);
                }
                else if(key==3){
                    filtertext = filtertext.toString().toLowerCase();
                    to.push(email);
                }
            }
        }
    );
  

    for(i=0; i<to.length; i++){
        Email.send(
            {
                Host: "smtp.gmail.com", 
                Username: from,
                Password: pwd,
                To: to[i],
                From: from,
                Subject: subject,
                Body: body,
            }
        ).then(
            message => console.log("Emails sent Successfully" + to[i])
        );
    }

    alert("Emails Sent Successfully");
}
