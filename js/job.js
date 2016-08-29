/**
 * @depends jquery-2.2.1.min.js
 * @depends libraries/parsley.min.js
 * @depends libraries/autogrow.min.js
 * @depends libraries/materialize.min.js
 *
 */
(function(global) {
    $('textarea.material-input').autogrow({ horizontal: false, flickering: false});

    $(document).ready(function(){
        $('.collapsible').collapsible({
            accordion : false
        });
    });

    var $form = $('form.job-form');

    $form.parsley();
    $form.submit(function (e) {
        e.preventDefault();

        var data = new FormData();
        data.append('text', $form.find("textarea").val());
        data.append('file', $('#file')[0].files[0]);

        $.ajax({
            method: "POST",
            url: "https://getform.org/u/4da9ee75-96ba-4984-ace2-96c647f11cef",
            data: data,
            processData: false,
            contentType: false,
            crossDomain: true
        }).done(function(res) {
            console.log(res);
        });
        $form[0].reset();

//        setTimeout(window.location = '/', 5000);
    });
})(this);

