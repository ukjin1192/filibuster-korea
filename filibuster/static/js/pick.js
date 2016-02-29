function getPickedComments(category) {
  $('#loading-icon').removeClass('hidden');

  $.ajax({
    url: '/api/comments/pick/',
    type: 'GET',
    data: {
      'category': category
    }
  }).done(function(data) {
    var comments = data.comments;
    
    comments.forEach(function(comment, index) {
      var $comment = $('#comment-virtual-dom').clone().removeClass('hidden').removeAttr('id');
      $comment.attr('data-comment-id', comment.id);
      $comment.find('.comment-nickname').text(comment.nickname + ' 님');
      $comment.find('.comment-content').text(comment.content);
      
      if (category == 'length') $('#length-pick-list').append($comment);
      else $('#editor-pick-list').append($comment);
    });
  }).always(function() {
    $('#loading-icon').addClass('hidden');
  });
}

$(window).load(function() {
  $('#loading-icon').addClass('hidden');

  // Ease effect when body DOM loads
  $('body').animate({opacity: 1}, 700);

  getPickedComments('length');
  // getPickedComments('editor');
});
