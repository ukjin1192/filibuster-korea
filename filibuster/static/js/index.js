var firebaseRepoURL, firebaseConnection;

// Update due timer
function updateDueTimer(){

  var now = moment();
  var due = moment([2016, 2, 10, 23, 59, 59]);

  var diff = due.diff(now); 

  if (diff > 0) {
    var duration = moment.duration(diff);
    
    var hours = Math.floor(duration.asHours());
    var minutes = Math.floor(duration.asMinutes()) - hours * 60;
    var seconds = Math.floor(duration.asSeconds()) - hours * 3600 - minutes * 60;
    
    // Set text of timer
    $('.intro-context--timer').text(hours + "시간 " + minutes + "분 " + seconds + "초");
  } else {
    $('.intro-context--timer').text("0시간 0분 0초");
  }
}

// Prevent CSRF token problem before sending reqeust with ajax
function setCSRFToken() {
  $.ajaxSetup({
    headers: {
      'X-CSRFToken': $.cookie('csrftoken')
    }
  });
}

function getCaptcha() {
  $.ajax({
    url: '/captcha/refresh/',
    type: 'GET'
  }).done(function(data) {
    $('#captcha-image').attr('src', data.image_url);
    $('#captcha-key').val(data.key);
  }); 
}

function getComments(firstCommentID, lastCommentID, position) {
  $('#loading-icon').removeClass('hidden');

  $.ajax({
    url: '/api/comments/list/',
    type: 'GET',
    data: {
      'first_comment_id': firstCommentID,
      'last_comment_id': lastCommentID
    }
  }).done(function(data) {
    var comments = data.comments;
    
    if (position == 'prepend') comments = _.orderBy(comments, 'id', 'asc');
    else comments = _.orderBy(comments, 'id', 'desc');
    
    comments.forEach(function(comment, index) {
      var $comment = $('#comment-virtual-dom').clone().removeClass('hidden').removeAttr('id');
      $comment.attr('data-comment-id', comment.id);
      $comment.find('.comment-nickname').text(comment.id + '번째 주자 - ' + comment.nickname + ' 님');
      $comment.find('.comment-content').text(comment.content);
      
      if (position == 'prepend') $('#recent-comment--list').prepend($comment);
      else $('#recent-comment--list').append($comment); 
    });
    
    // Update new comment ID
    // if (position == 'prepend') $('#new-comment-id').text(lastCommentID + 1);
  }).always(function() {
    $('#loading-icon').addClass('hidden');
  });
}

// Get spoken comments with recent order
function getSpokenComments() {
  $('#loading-icon').removeClass('hidden');

  $.ajax({
    url: '/api/comments/search/',
    type: 'GET',
    data: {
      'spoken': true,
      'category': 'nickname',
      'keyword': ''
    }
  }).done(function(data) {
    var comments = data.comments;
    
    comments.forEach(function(comment, index) {
      var contentMaxLength = 160;
      var $comment = $('#slide-comment--virtual-dom').clone().removeClass('hidden').removeAttr('id');
      $comment.find('a').attr('href', '/desk/?id=' + comment.id);
      if (comment.content.length > contentMaxLength) {
        $comment.find('.comment-content').text('"' + comment.content.substring(0, contentMaxLength) + '..."');
      } else { 
        $comment.find('.comment-content').text('"' + comment.content + '"');
      }
      $comment.find('.comment-spoken-at').text(moment(new Date(comment.spoken_at)).format('YYYY년 MMMM Do'));
      $comment.find('.comment-speaker').text(comment.speaker);
      $comment.find('.comment-id').text(comment.id);
      
      $('.spoken-comment--list').append($comment);
    });
    
    $('.spoken-comment--list').slick({adaptiveHeight: true});
  }).always(function() {
    $('#loading-icon').addClass('hidden');
  });
}

$(document).on('click', '#captcha-refresh', getCaptcha);

$(document).on('submit', '#comment-form', function(event) {
  event.preventDefault();

  $('#loading-icon').removeClass('hidden');
  $('#captcha-group').removeClass('has-error');
  $('#success-message, #fail-message').addClass('hidden');
  $('#comment-form--submit').button('loading');

  setCSRFToken();

  $.ajax({
    url: '/api/comments/create/',
    type: 'POST',
    data: {
      'captcha_key': $('#captcha-key').val(),
      'captcha_value': $('#captcha-value').val().replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ''),
      'nickname': $('#comment-form--nickname').val().replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '').replace(/(\r\n|\r|\n){2}/g, '$1').replace(/(\r\n|\r|\n){3,}/g, '$1\n'),
      'content': $('#comment-form--content').val().replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '').replace(/(\r\n|\r|\n){2}/g, '$1').replace(/(\r\n|\r|\n){3,}/g, '$1\n')
    }
  }).done(function(data) {
    if (data.state == 'success') {
      $('#comment-form--nickname, #comment-form--content, #captcha-value').val('');
      $('#my-comment-id').text(data.comment_id);
      $('#success-message').removeClass('hidden');
      getCaptcha();
    } else {
      $('#captcha-group').addClass('has-error');
      $('#fail-message').removeClass('hidden');
    }
  }).always(function() {
    $('#comment-form--submit').button('reset')
    $('#loading-icon').addClass('hidden');
  });
});

$(document).on('hover', '.spoken-comment--list .comment', function() {
  $(this).find('.comment-content').css('text-decoration', 'underline');
});

$(document).on('mouseleave', '.spoken-comment--list .comment', function() {
  $(this).find('.comment-content').css('text-decoration', 'none');
});

$(document).on('click', '#realtime-switch--on', function() {
  if($('#realtime-switch--off').find('input[type="radio"]').attr('checked')) {
    $('#realtime-switch--on').addClass('active').find('input[type="radio"]').attr('checked', true);
    $('#realtime-switch--off').removeClass('active').find('input[type="radio"]').attr('checked', false);
    Firebase.goOnline();
  }
});

$(document).on('click', '#realtime-switch--off', function() {
  if($('#realtime-switch--on').find('input[type="radio"]').attr('checked')) {
    $('#realtime-switch--off').addClass('active').find('input[type="radio"]').attr('checked', true);
    $('#realtime-switch--on').removeClass('active').find('input[type="radio"]').attr('checked', false);
    Firebase.goOffline();
  }
});

$(window).scroll(function() {
  if($(window).scrollTop() + $(window).height() == $(document).height()) {
    var lastCommentID = parseInt($('#recent-comment--list .comment').last().attr('data-comment-id')) - 1;
    if (lastCommentID > 0) getComments(Math.max(lastCommentID - 9, 1), lastCommentID, 'append');
  }

   // Automatically set position of realtime switch
  if ($(window).scrollTop() > $('#realtime-switch--container').offset().top) {
    $('#realtime-switch--group').addClass('fixed');
    $('#back-to-top').removeClass('hidden');
  } else {
    $('#realtime-switch--group').removeClass('fixed');
    $('#back-to-top').addClass('hidden');
  }
});

// Scroll to top if user clicked 'back to top'
$(document).on('click', '#back-to-top', function(event) {
  event.preventDefault();
  
  $('html, body').animate({ scrollTop: 0 }, 'fast');
});

// Alert that kakaotalk messenger sharing is only available at mobile
$(document).on('click', '#kakaotalk-share', function() {
  // Detect desktop browser
  if (!('ontouchstart' in window)) {
    alert("모바일에서만 가능합니다");
  }
  return false;
});

$(window).load(function() {
  firebaseRepoURL = $('#firebase-repo-url').val();
  firebaseConnection = new Firebase(firebaseRepoURL + 'comment/');

  // Fill out captcha key and image
  getCaptcha();

  $('#loading-icon').addClass('hidden');

  // Ease effect when body DOM loads
  $('body').animate({opacity: 1}, 700);

  firebaseConnection.child('last_comment_id/').once('value', function(snapshot) {
    var lastCommentID = parseInt(snapshot.val());
    getComments(Math.max(lastCommentID - 9, 1), lastCommentID, 'prepend');
  });

  firebaseConnection.on('child_changed', function(snapshot) {
    var originalLastCommentID = parseInt($('#recent-comment--list .comment').first().attr('data-comment-id'));
    if (snapshot.key() == 'last_comment_id') getComments(originalLastCommentID, parseInt(snapshot.val()), 'prepend');
  });

  // Attach fast-click to boost up touch reaction
  FastClick.attach(document.body);

  // Update due timer every seconds
  // moment.locale('ko');
  // setInterval(updateDueTimer, 1000);

  // Get spoken comments with recent order
  getSpokenComments();

  // Kakaotalk sharing
  Kakao.init('8c5bcdda801470eb94f4db4b66f33d02');
  Kakao.Link.createTalkLinkButton({
    container: '#kakaotalk-share',
    label: '[필리버스터 릴레이] 내가 쓰는 필리버스터 연설문',
    image: {
      src: 'http://d1es9gk2quk02b.cloudfront.net/share-index.png',
      width: '800',
      height: '421'
    },
    webButton: {
      text: '둘러보기',
      url: 'http://filibuster.me/'
    }
  });
});
