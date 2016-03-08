// Get comments count
function getCommentsCount() {
  $('#loading-icon').removeClass('hidden');

  $.ajax({
    url: '/api/comments/count/',
    type: 'GET',
    data: {
      'category': $('#category').val()
    }
  }).done(function(data) {
    $('#comments-count').text('(' + data.count + '개)'); 
  }).always(function() {
    $('#loading-icon').addClass('hidden');
  });
}

// Get comments and add it to list
function getComments(lastCommentID) {
  $('#loading-icon').removeClass('hidden');

  $.ajax({
    url: '/api/comments/list/',
    type: 'GET',
    data: {
      'ordering': 'asc',
      'category': $('#category').val(),
      'originally_last_comment_id': lastCommentID
    }
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
});

$(window).load(function() {
  // Get comments count
  getCommentsCount();

  // Get initial data
  getComments(0);
});
