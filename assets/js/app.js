  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBB46iEfrPK6HMseGK6XC-tGrNeRCPEQ8Q",
    authDomain: "train-sched-c58c5.firebaseapp.com",
    databaseURL: "https://train-sched-c58c5.firebaseio.com",
    projectId: "train-sched-c58c5",
    storageBucket: "train-sched-c58c5.appspot.com",
    messagingSenderId: "26495242813"
  };
  firebase.initializeApp(config);

  // Firebase variables
  var database = firebase.database();

  // On click function for submit button
  $(".submit").on("click", function(event){
    event.preventDefault();

    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var trainTime = $("#trainTime").val().trim();
    var frequency = $("#frequency").val().trim();

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    // Coverts integer into a string
    JSON.stringify(tMinutesTillTrain);

    // Next Train arrival
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    database.ref().push({
      trainName: trainName,
      destination: destination,
      frequency: frequency,
      nextTrain: moment(nextTrain).format("hh:mm"),
      minutesAway: tMinutesTillTrain
    })

    $("#trainName").val('').empty();
    $("#destination").val('').empty();
    $("#trainTime").val('').empty();
    $("#frequency").val('').empty();

  });

  $(".delete").on("click", function(){

    // Find and remove selected table rows
    $("table tbody").find('input[name="record"]').each(function(){
      if($(this).is(":checked")){
        $(this).parents("tr").remove();
      }
    });
  })

  // Firebase watcher .on("child_added"
  database.ref().on("child_added", function(snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    // Console.loging the last user's data
    console.log(sv.trainName);
    console.log(sv.destination);
    console.log(sv.nextTrain);
    console.log(sv.frequency);
    console.log(sv.minutesAway);

    // Dynamically adding data from database to HTML
    var markup = "<tr><td><input type='checkbox' name='record'></td><td>" + sv.trainName + "</td><td>" + sv.destination + "</td><td>" + sv.frequency + "</td><td>" + sv.nextTrain + "</td><td>" + sv.minutesAway + "</tr>";
    $("table tbody").append(markup);

    // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
  });