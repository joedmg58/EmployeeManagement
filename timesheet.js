/* 
Example of working with a Firebase database
It shows a basic create, update and deletion of data

UM Coding Boot CAmp 2018. Joed Machado 
*/

var snapshotGlobal;

$(document).ready( function() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDBzDKLD0lehYiAHhEJbItJWL3SwsFLTCA",
        authDomain: "employees-joedmg58.firebaseapp.com",
        databaseURL: "https://employees-joedmg58.firebaseio.com",
        projectId: "employees-joedmg58",
        storageBucket: "",
        messagingSenderId: "385409609715"
    };
    firebase.initializeApp(config);

    //Reference to my database Employees
    var fbEmployees = firebase.database();
    console.log( fbEmployees );

    //Registering onclick event for adding employees
    $('#addEmployeeMore').click( addEmployee );
    $('#addEmployeeSave').click( addEmployee );

    //Set modal
    //$('#addEmployee').modal();

    
    //Clear all the inputs in the form
    function clearInputs() {
        console.log('clearing inputs...');
        $('#name-input').val('');
        $('#role-input').val('');
        $('#start-input').val('');
        $('#rate-input').val('');
    }
      
    //Adds employee to the database
    function addEmployee( event ) {
        event.preventDefault();
    
        var name = $('#name-input').val().trim();
        var role = $('#role-input').val().trim();
        var start = $('#start-input').val().trim();
        var rate = $('#rate-input').val().trim();
    
        fbEmployees.ref().push( {
            name: name,
            role: role,
            start: start,
            rate: rate,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        } );
    
        clearInputs();
    }
    

    //Its triggers when a new child (element) to the database is added (but when the child is modified it dosen't trigger)
    fbEmployees.ref().on( "child_added", function( snapshot ) {
        var name = snapshot.val().name;
        var role = snapshot.val().role;
        var start = snapshot.val().start;
        var rate = snapshot.val().rate;

        console.log('New child added: '+ snapshot.val() );

        snapshotGlobal = snapshot;

        var convertedDate = moment( start, "YYYY-MM-DD");

        var monthWorked = moment().diff( moment( convertedDate), "month"); 

        var totalBilled = parseFloat(rate) * parseInt(monthWorked);

        var newRow = $('<tr>').appendTo( $('#bodyTable') );
        $('<td>').text( name ).appendTo( newRow );
        $('<td>').text( role ).appendTo( newRow );
        $('<td>').text( start ).appendTo( newRow );
        $('<td>').text( monthWorked ).appendTo( newRow );
        $('<td>').text( rate ).appendTo( newRow );
        $('<td>').text( totalBilled.toString() ).appendTo( newRow );
        
        var rCol = $('<td>').appendTo( newRow );
        $('<i class="far fa-edit mr-2 editEmployee" data="'+ snapshot.getRef().getKey() +'" style="cursor: hand;">').appendTo( rCol );
        $('<i class="far fa-trash-alt deleteEmployee" data="'+ snapshot.getRef().getKey() +'" style="cursor: hand;">').appendTo( rCol );
        
    } );

    //Register onclick event for delete and update options on the table
    $(document).on( "click", ".editEmployee", editEmployee );
    $(document).on( "click", ".deleteEmployee", deleteEmployee );

    //Edit employee
    function editEmployee( event ) {
        console.log( 'Editing...' );
    }

    //delete employee
    function deleteEmployee( event ) {
        console.log( 'Deleting ' + $(this).attr('data') );
        fbEmployees.ref().child( $(this).attr('data') ).remove().then();
    }

    //Its trigger when a child is removed
    fbEmployees.ref().on( "child_removed", function(snapshot) {
        console.log( 'child deleted - '+snapshot.val() );
    } );
    

} );