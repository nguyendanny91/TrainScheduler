
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyC-6gjP4AIDc1ZzXC_lhKyz7PV7p21c2oE",
        authDomain: "trainscheduler-d5154.firebaseapp.com",
        databaseURL: "https://trainscheduler-d5154.firebaseio.com",
        projectId: "trainscheduler-d5154",
        storageBucket: "",
        messagingSenderId: "939337130409"
        };
    
        firebase.initializeApp(config);
    
        // Create a variable to reference the database.
        var database = firebase.database();
    
    
        
        // Initial Values
        var trainName = "";
        var Destination = "";
        var firstTrainTime = 0;
        var Frequency = "";
        var rownum = 0
        var row_val;
        
        // Capture Button Click
        $("#add-train").on("click", function(event) {
          event.preventDefault();
    
    
          // Increment rownum
          rownum ++;
    
          // Grabbed values from text boxes
          trainName = $("#train-name-input").val().trim();
          Destination = $("#destination-input").val().trim();
          firstTrainTime = $("#first-train-time-input").val().trim();
          var convertfirstTrainTime = moment(firstTrainTime,"HH:mm");
          var convertfirstTrainTimeX = convertfirstTrainTime.format("X");
          Frequency = $("#frequency-input").val().trim();
    
          // Code for handling the push
          database.ref('/trainschedule').push({
            fb_trainName: trainName,
            fb_Destination: Destination,
            fb_convertfirstTrainTimeX: convertfirstTrainTimeX,
            fb_Frequency: Frequency,
            fb_dateAdded: firebase.database.ServerValue.TIMESTAMP,
            fb_rownum: rownum
          });
    
          //Clear text on submission
          $("#train-name-input").val("");
          $("#destination-input").val("");
          $("#first-train-time-input").val("");
          $("#frequency-input").val("");
    
        });
    
        // Firebase watcher .on("child_added"
        database.ref('/trainschedule').on("child_added", function(snapshot) {
          // storing the snapshot.val() in a variable for convenience
          var sv = snapshot.val();
    
          rownum = sv.fb_rownum;
    
    
    
    
          // Console.loging the last user's data
    
          // Change the HTML to reflect
          $(".add-records").append( 
            "<tr class='remove-tr'>" +
            "<th class='rowcount' scope='row'>" +
            sv.fb_rownum +
            "</th>" + 
            "<td class='trainName' row_val='" + rownum + "'>" + sv.fb_trainName + "</td>" +
            "<td class='Destination' row_val='" + rownum + "'>" + sv.fb_Destination + "</td>" +
            "<td class='Frequency' row_val='" + rownum + "'>" + sv.fb_Frequency + "</td>" +
            // next train time
            "<td>" + (moment(moment().add((sv.fb_Frequency - ((moment().diff(moment(moment(sv.fb_convertfirstTrainTimeX, "X").subtract(1, "years")), "minutes")) % sv.fb_Frequency)), "minutes")).format("HH:mm")) + "</td>" +
            // minutes for next train
            "<td>" + (sv.fb_Frequency - ((moment().diff(moment(moment(sv.fb_convertfirstTrainTimeX, "X").subtract(1, "years")), "minutes")) % sv.fb_Frequency)) + "</td>" +
            "<td>" + "<button row_val='" + sv.fb_rownum + "' class='btn btn-secondary update-record'>Update</button" +"</td>" +
            "<td>" + "<button row_val='" + sv.fb_rownum + "' class='btn btn-primary remove-record'>Remove</button" +"</td>" +
            "</tr>");
    
          // Handle the errors
        }, function(errorObject) {
          console.log("Errors handled: " + errorObject.code);
        });
    
        $(document).on('click','.remove-record',function(){
    
          // removes from database
    
          var row_val = $(this).attr('row_val')
          row_val = parseInt(row_val)
    
          var abc = firebase.database().ref('/trainschedule');
          var key_to_delete = row_val;
          var query = abc.orderByChild('fb_rownum').equalTo(key_to_delete);
          query.on('child_added', function(snapshot)
          {
              snapshot.ref.remove();
          });
    
          // removes row from front end
          $(this).closest('.remove-tr').remove()
    
        })
    
        $(document).on('click','.update-record',function(){
    
        // removes from database
    
        var row_val = $(this).attr('row_val')
        row_val = parseInt(row_val)
    
        $(this).removeClass();
        $(this).addClass("btn btn-success commit-record");
        $(this).text("Commit");
        
    
        var  trainName = $('.trainName[row_val="' + row_val + '"]');
        trainName.html("<input class='trainNameInput' row_val='" + row_val + "'type='text' value=''/>")
    
        var  Destination = $('.Destination[row_val="' + row_val + '"]');
        Destination.html("<input class='destinationInput' row_val='" + row_val + "' type='text' value=''/>")
    
        var  Frequency = $('.Frequency[row_val="' + row_val + '"]');
        Frequency.html("<input class='frequencyInput' row_val='" + row_val + "' type='text' value=''>")
        })
    
        $(document).on('click','.commit-record',function(){
          var row_val = $(this).attr('row_val')
          row_val = parseInt(row_val)
    
          var abc = firebase.database().ref('/trainschedule');
          var key_to_delete = row_val;
          var query = abc.orderByChild('fb_rownum').equalTo(key_to_delete);
          var trainNameInput = $('.trainNameInput[row_val="' + row_val + '"]')
          var destinationInput = $('.destinationInput[row_val="' + row_val + '"]')
          var frequencyInput = $('.frequencyInput[row_val="' + row_val + '"]')
    
          query.on('child_added', function(snapshot)
          {
            snapshot.ref.update({
              fb_trainName: trainNameInput.val().trim(),
              fb_Destination: destinationInput.val().trim(),
              fb_Frequency: frequencyInput.val().trim(),
              fb_dateAdded: firebase.database.ServerValue.TIMESTAMP,
            });
          });
    
          trainNameInput.parent().text(trainNameInput.val().trim());
          destinationInput.parent().text(destinationInput.val().trim());
          frequencyInput.parent().text(frequencyInput.val().trim());
    
        // $(this).removeClass();
        $(this).attr('class', 'btn btn-secondary update-record');
        $(this).text("Update");
        });  