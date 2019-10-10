
var getUrl = window.location;
//var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
var baseUrl = getUrl.protocol + "//" + getUrl.host;

$(document).ready(function () {

  /***************************************/
  /* Form validation */
  /***************************************/
  $('#forms-login').validate({

    /* @validation states + elements */
    errorClass: 'error-view',
    validClass: 'success-view',
    errorElement: 'span',
    onkeyup: false,
    onclick: false,

    /* @validation rules */
    rules: {
      username: {
        required: true
      },
      password: {
        required: true,
        minlength: 6
      }
    },
    messages: {
      username: {
        required: 'Username tidak boleh kosong'
      },
      password: {
        required: 'Password tidak boleh kosong',
        minlength: 'Password minimal 6 karakter'
      }
    },
    // Add class 'error-view'
    highlight: function (element, errorClass, validClass) {
      $(element).closest('.input').removeClass(validClass).addClass(errorClass);
      if ($(element).is(':checkbox') || $(element).is(':radio')) {
        $(element).closest('.check').removeClass(validClass).addClass(errorClass);
      }
    },
    // Add class 'success-view'
    unhighlight: function (element, errorClass, validClass) {
      $(element).closest('.input').removeClass(errorClass).addClass(validClass);
      if ($(element).is(':checkbox') || $(element).is(':radio')) {
        $(element).closest('.check').removeClass(errorClass).addClass(validClass);
      }
    },
    // Error placement
    errorPlacement: function (error, element) {
      if ($(element).is(':checkbox') || $(element).is(':radio')) {
        $(element).closest('.check').append(error);
      } else {
        $(element).closest('.unit').append(error);
      }
    },
    // Submit the form
    submitHandler: function () {
      var target = $('#forms-login .response');
      $('#forms-login').ajaxSubmit({

        // Server response placement
        //target:'#forms-login .response',

        dataType: 'json',

        // If error occurs
        error: function (xhr) {
          $('#forms-login .response').html('An error occured: ' + xhr.status + ' - ' + xhr.statusText);
        },

        // Before submiting the form
        beforeSubmit: function () {
          // Add class 'processing' to the submit button
          $('#forms-login button[type="submit"]').attr('disabled', true).addClass('processing');
        },

        // If success occurs
        success: function (response) {
          if (response.error == false) {
            window.location = baseUrl + '/home';
          } else {
            target.html(response.message);

            // Remove class 'processing'
            $('#forms-login button[type="submit"]').attr('disabled', false).removeClass('processing');

            // Remove classes 'error-view' and 'success-view'
            $('#forms-login .input').removeClass('success-view error-view');
            $('#forms-login .check').removeClass('success-view error-view');

            $('#forms-login').resetForm();

            setTimeout(function () {
              // Delete response after 5 seconds
              target.html('');
              $('#forms-login button[type="submit"]').attr('disabled', false);
            }, 3000);
          }
        }
      });
    }
  });
  /***************************************/
  /* end form validation */
  /***************************************/
});
