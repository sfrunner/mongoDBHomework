$(document).ready(function(){
    $(".leaveComment-btn").click(function(event){
        console.log(event.target.attributes[2].value);
        todayDateString = new Date().toJSON().slice(0, 10)
vex.dialog.open({
    message: 'Select a date and color.',
    input: [
        '<style>',
            '.vex-custom-field-wrapper {',
                'margin: 1em 0;',
            '}',
            '.vex-custom-field-wrapper > label {',
                'display: inline-block;',
                'margin-bottom: .2em;',
            '}',
        '</style>',
        '<div class="vex-custom-field-wrapper">',
            '<label for="date">Name</label>',
            '<div class="vex-custom-input-wrapper">',
                '<input name="name" type="text" placeholder="John Doe" required />',
            '</div>',
        '</div>',
        '<div class="vex-custom-field-wrapper">',
            '<label for="date">Comment</label>',
            '<div class="vex-custom-input-wrapper">',
                '<textarea name="comment" type="text" placeholder="..." required /></textarea>',
            '</div>',
        '</div>',
    ].join(''),
    callback: function (data) {
        if (data.name == "" || data.comment == "") {
            return console.log('Cancelled')
        }
        else{
            var Data = {
                name: data.name,
                comment: data.comment,
                articleId: event.target.attributes[2].value
            }
            $.post("/addcomment", Data);
        }
    
    }
});
    });
});
