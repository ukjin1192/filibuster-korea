$(document).on('click', '.dropdown-text', function(event) {
  var $target = $(event.currentTarget);

  $target.closest('.input-group-btn')
     .find('#category-text').text($target.text()).end()
     .children('.dropdown-toggle').dropdown('toggle');

  if ($target.text() == '주자 번호') $('#category').val('id');
  else if ($target.text() == '별명') $('#category').val('nickname');
  else $('#category').val('content');

  return false;
});

// Get comments count
function getCommentsCount() {
  $('#loading-icon').removeClass('hidden');

  var data = {};

  if ($('#category').val() == 'id') data['id'] = $('#keyword').val();
  else if ($('#category').val() == 'nickname') data['nickname'] = $('#keyword').val();
  else data['content'] = $('#keyword').val();

  $.ajax({
    url: '/api/comments/count/',
    type: 'GET',
    data: data
  }).done(function(data) {
    $('#comments-count').text('(' + data.count + '개)'); 
  }).always(function() {
    $('#loading-icon').addClass('hidden');
  });
}

// Get searched comments
function getComments(lastCommentID) {
  $('#loading-icon').removeClass('hidden');

  var data = {};

  data['ordering'] = 'asc';
  if ($('#category').val() == 'id') data['id'] = $('#keyword').val();
  else if ($('#category').val() == 'nickname') data['nickname'] = $('#keyword').val();
  else data['content'] = $('#keyword').val();
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
    if (!isNaN(lastCommentID)) getComments(lastCommentID);
  }
});

$(document).on('submit', '#search__form', function(event) {
  event.preventDefault();

  // Truncate existing comment list
  $('.comment-list').html('');

  $('#keyword').val($('#keyword-input').val());

  // Get comments count
  getCommentsCount();

  // Get first page of searched comments
  getComments(0);
});
