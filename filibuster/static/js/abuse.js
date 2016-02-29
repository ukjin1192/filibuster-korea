function getAbusingComments(lastCommentID) {
  $('#loading-icon').removeClass('hidden');

  $.ajax({
    url: '/api/comments/abusing/',
    type: 'GET',
    data: {
      'last_comment_id': lastCommentID
    }
  }).done(function(data) {
    $('#abusing-comment-count').text(data.count);
    var comments = data.comments;
    
    comments.forEach(function(comment, index) {
      var $comment = $('#comment-virtual-dom').clone().removeClass('hidden').removeAttr('id');
      $comment.attr('data-comment-id', comment.id);
      $comment.find('.comment-nickname').text(comment.id + '번째 주자인 척 하신 ' + comment.nickname + ' 님');
      $comment.find('.comment-content').text(comment.content);
      
      $('#abusing-comment--list').append($comment); 
    });
  }).always(function() {
    $('#loading-icon').addClass('hidden');
  });
}

$(window).scroll(function() {
  if($(window).scrollTop() + $(window).height() == $(document).height()) {
    var lastCommentID = parseInt($('#abusing-comment--list .comment').last().attr('data-comment-id'));
    getAbusingComments(lastCommentID);
  }
});

// Scroll to top if user clicked 'back to top'
$(document).on('click', '#back-to-top', function(event) {
  event.preventDefault();
  
  $('html, body').animate({ scrollTop: 0 }, 'fast');
});

// Alert that kakaotalk and line messenger sharing is only available at mobile
$(document).on('click', '#kakaotalk-share', function() {
  // Detect desktop browser
  if (!('ontouchstart' in window)) {
    alert("모바일에서만 가능합니다");
  }
  return false;
});

$(window).load(function() {
  $('#loading-icon').addClass('hidden');

  // Ease effect when body DOM loads
  $('body').animate({opacity: 1}, 700);

  // Attach fast-click to boost up touch reaction
  FastClick.attach(document.body);

  // Get abusing comments
  getAbusingComments(99999);

  // Kakaotalk sharing
  /*
  Kakao.init('8c5bcdda801470eb94f4db4b66f33d02');
  Kakao.Link.createTalkLinkButton({
    container: '#kakaotalk-share',
    label: '[필리버스터 릴레이] 내가 쓰면 국회의원이 읽는다. 필리버스터 연설문 쓰러 가기',
    image: {
      src: 'http://d1es9gk2quk02b.cloudfront.net/share-new.jpg',
      width: '960',
      height: '480'
    },
    webButton: {
      text: '둘러보기',
      url: 'http://filibuster.me/'
    }
  });
  */
});
