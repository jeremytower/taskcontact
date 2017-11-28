var db;

$(document).ready(function(){

    $("#submitTask").click(function(){
            addTask();
    });
	$("button.show").click(function(){
            displayNotes();
    });
	

    $("#searchButton").click(function(){
            searchPeople();
    });

    $("#displayButton").click(function(){
            displayPeople();
    });
	
	$("#newTask").click(function(){
		$("#addNewTaskPage").popup("open");
		$("#taskInput").focus();
	});
	$("#closeAddPage").click(function(){
		
		$("#addNewContactPage").popup("close");
		
		$("#lastName").val("");
		 $("#firstName").val("");
		 $("#phone").val("");
		$("#email").val("");
		 $("#phone").val("");
	});
	
	 $('.text').keypress(function(e){
      if(e.keyCode==13){
		 
		  addNote();
		  }
    });
	
	   $(document).on('click', '.updateTaskLink', function(){
            id = $(this).attr("id");
            $("#taskUpdate").popup("open");
            populateForm(id);
        });
		$(document).on('click', '.deleteTaskLink', function(){
            id = $(this).attr("id");
			
            var sure = confirm("Are you sure?");
			if(sure){
				deleteTask(id);
			}
      
        });
		
		$(document).on('click', '.clearButton', function(){
			
			
            var sure = confirm("Are you sure?");
			if(sure){
				clearTasks();
			}
			
        });
		
		$(document).on('pageshow', '#taskPage',function (){
		displayTasks();
		});
		
		$(document).on('pageshow', '#contactsPage',function (){
		displayContacts();
		});
		
		$(document).on('click', '#updateContact', function(){
            id = $("#contactId").val();
            updateMode(id);
        });
		
		$(document).on('click', '.contactButton', function(){
            id = $(this).attr("id");
			id = id.split("n");
			id = id[1];
            $("#contactPage").popup("open");
            populateContactPage(id);
        });
		
		$(document).on('click', '#submitContactUpdate', function(){
           id = $("#contactId").val();
		
		updateContact(id);
            
        });
		
		 $("#submitNewContact").click(function(){
		 var lastName = $("#lastName").val();
		 var firstName = $("#firstName").val();
		 var phone = $("#phone").val();
		 var email = $("#email").val();
		 var phone = $("#phone").val();
		 
		 $("#lastName").val("");
		 $("#firstName").val("");
		 $("#phone").val("");
		$("#email").val("");
		 $("#phone").val("");
		 
		
            addContact(lastName, firstName, phone, email);
    });
	
	
	$(document).on('click', '#deleteContact', function(){
            id = $("#contactId").val();
			
			 var sure = confirm("Are you sure?");
			if(sure){
				
				$("#contactPage").popup("close");
				deleteContact(id);
			}
            
        });
	
			


	
	 $("#finalUpdateButton").click(function(){
		 var task = $("#updateTask").val();
		 var id = $("#hiddenID").val();
		
            updateTask(id, task);
    });
	
	$('#updateNote').keypress(function(e){
      if(e.keyCode==13){
		var note = $("#updateNote").val();
		 var id = $("#hiddenID").val();
		 var beerpage = $("#hiddenBeerID").val();
            updateNote(id, note, beerpage);
		  }
    });
	
	
	

   
});



 
document.addEventListener("DOMContentLoaded", function() {
    if(!"indexedDB" in window){
        return;
    } 
 
    var openRequest = indexedDB.open("tasksDatabase",1);
 
    openRequest.onupgradeneeded = function(e) {
        var thisDB = e.target.result;
 
        if(!thisDB.objectStoreNames.contains("tasks")) {
            var objectStore = thisDB.createObjectStore("tasks", {keyPath: "theid", autoIncrement: true});
            objectStore.createIndex("task","task", {unique:false});
			objectStore.createIndex("theid","theid", {unique:true});
        }
		if(!thisDB.objectStoreNames.contains("contacts")) {
            var objectStore = thisDB.createObjectStore("contacts", {keyPath: "theid", autoIncrement: true});
            objectStore.createIndex("lastName","lastName", {unique:false});
			objectStore.createIndex("firstName","firstName", {unique:false});
			objectStore.createIndex("phone","phone", {unique:false});
			objectStore.createIndex("email","email", {unique:false});
			objectStore.createIndex("theid","theid", {unique:true});
        }
    }
	

 
    openRequest.onsuccess = function(e) {
        db = e.target.result;
    }
 
    openRequest.onerror = function(e) {
        //Do something for the error
    }
	
	   
 
},false);




 function addTask(e){
	
	 var currentPage = $.mobile.activePage.attr( "id" );
	 
    var task = $("#taskInput").val();
	if(!task){return;}
    var transaction = db.transaction(["tasks"],"readwrite");
    var store = transaction.objectStore("tasks");
	
    var entry = {
        task:task
    }
 
    var request = store.add(entry);
 
    request.onerror = function(e) {
    }
 
    request.onsuccess = function(e) {
        console.log("Add Successful");
    }
	$("#taskInput").val("");
	displayTasks();
 }
 
 function deleteTask(id){
	 	var transaction = db.transaction(["tasks"],"readwrite");
    var store = transaction.objectStore("tasks");
	var index = store.index("theid");
    var request = index.get(Number(id));
	
	   var updateRequest = store.delete(Number(id));
	   displayTasks();
 }
 
  function clearTasks(){
	 
	 	var transaction = db.transaction(["tasks"],"readwrite");
    var store = transaction.objectStore("tasks");
	var request = store.openCursor();
	
	  request.onsuccess = function(e){
		
		var cursor = e.target.result;
		
        if(cursor) {
			
			
				 var updateRequest = store.delete(cursor.key);
			
			cursor.continue();
           
            
        }
	
    }
	
	  
	   displayTasks();
 }
 
 function displayTasks(e){
    var id = $.mobile.activePage.attr( "id" );
	var display = "";
	var empty = "true";
	
    var transaction = db.transaction(["tasks"],"readonly");
    var store = transaction.objectStore("tasks");
	var request = store.openCursor();
	
	


    request.onsuccess = function(e){
		
		var tsk = "";
		var cursor = e.target.result;
		
        if(cursor) {
			
        
		
			
		
				empty = "false";
				tsk = cursor.value['task'];
				display = "<div class='task'><p>" + tsk + "<br><a href='#' data-rel='popup' class='updateTaskLink' id='" + cursor.key + "'>Edit</a>  <a href='#' data-rel='popup' class='deleteTaskLink' id='" + cursor.key + "'>Delete</a></div>" + display;
				
			
			
			
			
			cursor.continue();
           
            
        }
		
		  
       

	    $("#taskDisplay").html(display + "<br><br><button class='clearButton' id ='clearButton'>Clear All Tasks</button><br><br>");
	   
	   clearButton(empty);
    }
	
}

function clearButton(empty){
	if(empty == "true"){
		
		 $("#taskDisplay").html("No tasks currently");
	   
	}
}


function populateForm(id){
    var transaction = db.transaction(["tasks"],"readwrite");
    var store = transaction.objectStore("tasks");
    var index = store.index("theid");
    var request = index.get(Number(id));

    

    request.onsuccess = function(){
        var data = request.result;
        $("#updateTask").val(data["task"]);
        $("#hiddenID").val(Number(id));
    }
}

function updateTask(id, task){
	var transaction = db.transaction(["tasks"],"readwrite");
    var store = transaction.objectStore("tasks");
	var index = store.index("theid");
    var request = index.get(Number(id));
	
	   request.onsuccess = function(){
        var data = request.result;
        data.task = task;
        var updateRequest = store.put(data);
    }
	
	

	$("#taskUpdate").popup("close");
	
	displayTasks();
	
	
	
	
}


function addContact(ln, fn, p, e){
	

	 
    
	
    var transaction = db.transaction(["contacts"],"readwrite");
    var store = transaction.objectStore("contacts");
	
    var entry = {
        lastName:ln,
		firstName:fn,
		phone:p,
		email:e
    }
 
    var request = store.add(entry);
 
    request.onerror = function(e) {
    }
 
    request.onsuccess = function(e) {
        console.log("Add Successful");
    }
	$("#addNewContactPage").popup("close");
	displayContacts();
 }
 
 function displayContacts(e){
	var x = 0;
	var display = "";
	var empty = "true";
	
    var transaction = db.transaction(["contacts"],"readonly");
    var store = transaction.objectStore("contacts");
	var request = store.openCursor();
	
	


    request.onsuccess = function(e){
		
		var ln = "";
		var fn  = "";
		var p = "";
		var em = "";
		var cursor = e.target.result;
		
		
        if(cursor) {
			
        
		
			
				
				empty = "false";
				ln = cursor.value['lastName'];
				fn = cursor.value['firstName'];
				p = cursor.value['phone'];
				em = cursor.value['email'];
		
				display = "<a class='contactButton' data-role='button' id = 'button" + cursor.key + "'>" + fn + " " + ln + "</button><br>" + display;
				x++;
				
			
			
			
			
			cursor.continue();
           
            
        }
		
		  
       

	    $("#contactsDisplayArea").html(display).trigger("create");
		
		
    }
	
}

function populateContactPage(id){
	
	var lastName;
	var firstName;
	var phone;
	var email;
	
	var transaction = db.transaction(["contacts"],"readonly");
    var store = transaction.objectStore("contacts");
	var index = store.index("theid");
    var request = index.get(Number(id));
	
	   request.onsuccess = function(){
        var data = request.result;
        lastName = data.lastName;
		firstName = data.firstName;
		phone = data.phone;
		email = data.email;
        var display = "Phone Number: " + phone + "<br><br>Email Address: " + email;
		var name = firstName + " " + lastName;
		$("#contactName").html(name);
		$("#contactDisplay").html(display);
		$("#contactId").val(id);
		
    }
}

function updateMode(id){
	
	var transaction = db.transaction(["contacts"],"readonly");
    var store = transaction.objectStore("contacts");
	var index = store.index("theid");
    var request = index.get(Number(id));
	
	   request.onsuccess = function(){
        var data = request.result;
		 lastName = data.lastName;
		firstName = data.firstName;
		phone = data.phone;
		email = data.email;
		console.log(phone + email + firstName + lastName);
		var display = "<form id='updateForm'>First Name:<br><input type='text' id='updatefirstName' value= '"+firstName+"'><br>Last Name:<br><input type='text' id='updatelastName' value= '" + lastName + "'><br>Phone Number:<br><input type='text' id='updatephone' value= '" + phone + "'><br>Email:<br><input type='text' id='updateemail' value= '" + email + "'><br><input type = submit id='submitContactUpdate' value='Update'></form>";
		$("#contactDisplay").html(display);
		$("#contactDisplay").trigger("create");
	}
}

function updateContact(id){
	
	   var firstName = $("#updatefirstName").val();
			var lastName = $("#updatelastName").val();
			var phone = $("#updatephone").val();
			var email = $("#updateemail").val();
	
	var transaction = db.transaction(["contacts"],"readwrite");
    var store = transaction.objectStore("contacts");
	var index = store.index("theid");
    var request = index.get(Number(id));
	
	   request.onsuccess = function(){
        var data = request.result;
        data.firstName = firstName;
		data.lastName = lastName;
		data.phone = phone;
		data.email = email;
        var updateRequest = store.put(data);
    }
	
	displayContacts();
}

function deleteContact(id){
		 	var transaction = db.transaction(["contacts"],"readwrite");
    var store = transaction.objectStore("contacts");
	var index = store.index("theid");
    var request = index.get(Number(id));
	
	   var updateRequest = store.delete(Number(id));
	   displayContacts();
}