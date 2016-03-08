// Get comments and add it to list
function getComments(lastCommentID) {
  $('#loading-icon').removeClass('hidden');

  var data = {};

  data['ordering'] = 'asc';
  data['category'] = $('#category').val();
  data['originally_last_comment_id'] = lastCommentID;

  $.ajax({
    url: '/api/comments/list/',
    type: 'GET',
    data: data
  }).done(function(data) {
    var comments = data.comments;
    
    comments.forEach(function(comment, index) {
      var $comment = $('#comment__virtual-dom').clone().removeClass('hidden').removeAttr('id');
      $comment.attr('data-comment-id', comment.id);
      $comment.find('.comment__nickname').text(comment.nickname + ' 님');
      $comment.find('.comment__content').text(comment.content);
      $comment.find('.comment__id').text(comment.id);
      $comment.find('.comment__created-at').text(moment(new Date(comment.created_at)).format('YYYY년 MMMM Do'));
      $('.comment-list').append($comment); 
    });
  }).always(function() {
    $('#loading-icon').addClass('hidden');
  });
}

$(window).scroll(function() {
  // Support inifinite scroll
  if($(window).scrollTop() + $(window).height() == $(document).height()) {
    var lastCommentID = parseInt($('.comment-list .comment').last().attr('data-comment-id'));
    if (isNaN(lastCommentID)) getComments(0);
    else getComments(lastCommentID);
  }

  // Synchronize back to top button with scroll position
  if($(window).scrollTop() > $(window).height() + 300) {
    $('#back-to-top').removeClass('hidden');
  } else {
    $('#back-to-top').addClass('hidden');
  }
});

$(window).load(function() {
  // Get initial data
  getComments(0);

  // Kakaotalk sharing
  Kakao.init('8c5bcdda801470eb94f4db4b66f33d02');
  Kakao.Link.createTalkLinkButton({
    container: '#kakaotalk-share',
    label: '[가나다] 라마바',
    image: {
      src: 'http://d1es9gk2quk02b.cloudfront.net/share/share-desk.jpg',
      width: '800',
      height: '421'
    },
    webButton: {
      text: '둘러보기',
      url: $('#kakaotalk-share__link-url').val()
    }
  });
});
