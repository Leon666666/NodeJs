$(document).ready(function(){
      $('.deleteNote').on('click', deleteNote);
});

function deleteNote(){
    var confirmation = confirm('Are you Sure?');

    if(confirmation){
        $.ajax({
            type:'DELETE',
            url:'/note/delete/'+$(this).data('id')
        }).done(function(response){
            window.location.replace('/');
        });
    } else {
        return false;
    }
}
