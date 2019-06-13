function authLogin(){
    $.ajax({
        method: 'post',
        url: './',
        data: 'username='+$('#username').val()+'&password='+$('#password').val(),
        success: dashboard
    });
}

function startCheckin(){
    if($('#key').val() != ''){
        $.ajax({
            method: 'post',
            url: './start',
            data: 'key=' + $('#key').val(),
            //append active page
            success: (page) => {
                    $('body').empty();
                    $('body').append(page);
            }
        });
    }
    else
        alert("Invalid check ID.");
}

function yamete(){
    $.ajax({
        method: 'post',
        url: './yameteKudastop',
        success: (data) =>{
            showTable(data, $('#idContainer').text())
        }
    });
}

function checkIn(){
    $.ajax({
        method: 'post',
        url: './checkIn',
        data: 'key=' + $('#key').val()+'&name=' + $('#name').val()+'&userID='+$('#userID').val(),
        success: (data) => {
            if(data[0]){
                //ty for the check in bruh
                //empty the body and replace with something i guess
                $('body').empty();
                var temp = `<div id="wrapper">
                                <form>
                                    <label>Thank you for checking in!!</label>
                                </form>
                            </div>`;
                $('body').append(temp);
            }
            else{
                if(data[1] === 1){
                    alert('Wrong Check-Id. Check the spelling and try again.');
                }
                else
                    alert(`You've already checked in.`);
            }
        }
    });
}

function viewHistory(){
    if($('#key').val() != ''){
        $.ajax({
            method: 'post',
            url: './viewHistory',
            data: 'key=' + $('#key').val(),
            success: (data) =>{
                if(data[0]){
                    //update the page
                    showTable(data[1], $('#key').val());
                }
                else{
                    alert('There is no record of the specified check in.\n Check you spelling and try again.');
                }
            }
        });
    }
    else
        alert("Invalid check ID.");
}

function dashboard(data){
    if(data[0]){
        $('body').empty();
        $('body').append(data[1]);
        
    }
    else
        alert('Wrong username and/or password.');
}

//data will be an array of user objects
function showTable(data, name){
    $('body').empty();
    var h = $('<h1>' + name.toUpperCase() + ': ' + data.length + ' checked in</h1>');
    $('body').append(h);
    $('body').append(`<div id="wrapper">
    <table>
        <tr>
            <th>Name</th>
            <th>User ID</th> 
            <th>Date and Time of Check In</th>
        </tr>
    </table>
</div>`);
//loop and rows to the table
data.forEach(entry => {
    var tr = $('<tr></tr>');
    tr.append("<td>" + entry.name + "</td>");
    tr.append("<td>" + entry.id + "</td>");
    tr.append("<td>" + entry.date + "</td>");
    $('table').append(tr);
});


}