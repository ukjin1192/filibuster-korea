// Prevent CSRF token problem before sending reqeust with ajax
function setCSRFToken() {
  $.ajaxSetup({
    headers: {
      'X-CSRFToken': $.cookie('csrftoken')
    }
  });
}

$(document).on('submit', '#delete-comment-id', function(event) {
  event.preventDefault();

  $('#loading-icon').removeClass('hidden');

  setCSRFToken();

  $.ajax({
    url: '/api/comments/delete/',
    type: 'GET',
    data: {
      'category': 'id',
      'keyword': $('#comment-id').val()
    }
  }).done(function() {
    $('#comment-id').val('');
  }).always(function() {
    $('#loading-icon').addClass('hidden');
  });
});

$(document).on('submit', '#delete-comment-ip-address', function(event) {
  event.preventDefault();

  $('#loading-icon').removeClass('hidden');

  setCSRFToken();

  $.ajax({
    url: '/api/comments/delete/',
    type: 'GET',
    data: {
      'category': 'ip_address',
      'keyword': $('#ip-address').val()
    }
  }).done(function() {
    $('#ip-address').val('');
  }).always(function() {
    $('#loading-icon').addClass('hidden');
  });
});

$(document).on('submit', '#delete-comment-keyword', function(event) {
  event.preventDefault();

  $('#loading-icon').removeClass('hidden');

  setCSRFToken();

  $.ajax({
    url: '/api/comments/delete/',
    type: 'GET',
    data: {
      'category': 'keyword',
      'keyword': $('#keyword').val()
    }
  }).done(function() {
    $('#keyword').val('');
  }).always(function() {
    $('#loading-icon').addClass('hidden');
  });
});

$(window).load(function() {
  $('#loading-icon').addClass('hidden');

  // Ease effect when body DOM loads
  $('body').animate({opacity: 1}, 700);
});
