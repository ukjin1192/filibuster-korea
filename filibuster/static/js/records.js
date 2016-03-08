// Get comments and add it to list
function getComments(speaker, lastCommentID) {
  $('#loading-icon').removeClass('hidden');

  var data = {};

  data['ordering'] = 'asc';
  data['category'] = 'spoken';
  data['speaker'] = speaker;
  data['originally_last_comment_id'] = lastCommentID;

  $.ajax({
    url: '/api/comments/list/',
    type: 'GET',
    data: data
  }).done(function(data) {
    var comments = data.comments;
    var $commentList;
    
    switch(speaker) {
      case '김제남':
        $commentList = $('#tab--1 .comment-list');
        break;
      case '서영교':
        $commentList = $('#tab--2 .comment-list');
        break;
      case '최민희':
        $commentList = $('#tab--3 .comment-list');
        break;
      default:
        break;
    }
    
    comments.forEach(function(comment, index) {
      var $comment = $('#comment__virtual-dom').clone().removeClass('hidden').removeAttr('id');
      $comment.attr('data-comment-id', comment.id);
      $comment.find('.comment__nickname').text(comment.nickname + ' 님');
      $comment.find('.comment__content').text(comment.content);
      $comment.find('.comment__id').text(comment.id);
      $comment.find('.comment__created-at').text(moment(new Date(comment.created_at)).format('YYYY년 MMMM Do'));
      $commentList.append($comment); 
    });
  }).always(function() {
    $('#loading-icon').addClass('hidden');
  });
}

// Switch tab content
$(document).on('click', '#tab-toggle--1', function() {
  $('#tab-toggle--2, #tab-toggle--3').removeClass('active');
  $('#tab-toggle--1').addClass('active');
  var lastCommentID = parseInt($('#tab--1 .comment-list .comment').last().attr('data-comment-id'));
  if (isNaN(lastCommentID)) getComments('김제남', 0);
});

// Switch tab content
$(document).on('click', '#tab-toggle--2', function() {
  $('#tab-toggle--1, #tab-toggle--3').removeClass('active');
  $('#tab-toggle--2').addClass('active');
  var lastCommentID = parseInt($('#tab--2 .comment-list .comment').last().attr('data-comment-id'));
  if (isNaN(lastCommentID)) getComments('서영교', 0);
});

// Switch tab content
$(document).on('click', '#tab-toggle--3', function() {
  $('#tab-toggle--1, #tab-toggle--2').removeClass('active');
  $('#tab-toggle--3').addClass('active');
  var lastCommentID = parseInt($('#tab--3 .comment-list .comment').last().attr('data-comment-id'));
  if (isNaN(lastCommentID)) getComments('최민희', 0);
});

$(window).scroll(function() {
  // Support inifinite scroll
  if ($(window).scrollTop() + $(window).height() == $(document).height()) {
    if ($('tab-toggle--1').hasClass('active')) {
      var lastCommentID = parseInt($('#tab--1 .comment-list .comment').last().attr('data-comment-id'));
      if (isNaN(lastCommentID)) getComments('김제남', 0);
      else getComments('김제남', lastCommentID);
    } else if ($('tab-toggle--2').hasClass('active')) {
      var lastCommentID = parseInt($('#tab--2 .comment-list .comment').last().attr('data-comment-id'));
      if (isNaN(lastCommentID)) getComments('서영교', 0);
      else getComments('서영교', lastCommentID);
    } else {
      var lastCommentID = parseInt($('#tab--3 .comment-list .comment').last().attr('data-comment-id'));
      if (isNaN(lastCommentID)) getComments('최민희', 0);
      else getComments('최민희', lastCommentID);
    }
  }
});

$(window).load(function() {
  // Get initial data
  getComments('김제남', 0);
});
