$(document).on('click', '.dropdown-menu li', function(event) {
  var $target = $(event.currentTarget);

  $target.closest('.input-group-btn')
     .find('[data-bind="label"]').text($target.text()).end()
     .children('.dropdown-toggle').dropdown('toggle');

  if ($target.text() == '주자 번호') $('#category').val('id');
  else if ($target.text() == '별명') $('#category').val('nickname');
  else if ($target.text() == '연설문 내용') $('#category').val('content');
  else if ($target.text() == '의원명') $('#category').val('speaker');
  else $('#category').val('nickname');

  return false;
});

function getSpokenComments(category, keyword, lastCommentID) {
  $('#loading-icon').removeClass('hidden');

  var data = {};

  data['ordering'] = 'desc';
  data['category'] = 'spoken';
  if (keyword != '') data[category] = keyword;
  if (lastCommentID > 0) data['originally_last_comment_id'] = lastCommentID;

  $.ajax({
    url: '/api/comments/list/',
    type: 'GET',
    data: data
  }).done(function(data) {
    var comments = data.comments;
    
    comments.forEach(function(comment, index) {
      var $comment = $('#comment-virtual-dom').clone().removeClass('hidden').removeAttr('id');
      $comment.attr('data-comment-id', comment.id);
      $comment.find('.comment-nickname').text(comment.nickname + ' 님');
      $comment.find('.comment-content').text(comment.content);
      $comment.find('.comment-spoken-at').text(moment(new Date(comment.spoken_at)).format('YYYY년 MMMM Do'));
      $comment.find('.comment-speaker').text(comment.speaker);
      
      $('#spoken-comment-list').append($comment);
    });
    
    if (comments.length < 10) $('#see-more-comments').addClass('hidden');
    else $('#see-more-comments').removeClass('hidden');
  }).always(function() {
    $('#loading-icon').addClass('hidden');
    $('#see-more-comments').button('reset');
  });
}

$(document).on('click', '.desk-context--link', function() {
  $('html, body').animate({
    scrollTop: $('.desk-navbar').offset().top
  }, 1000);
});

$(document).on('click', '#see-more-comments', function() {
  var lastCommentID = parseInt($('#spoken-comment-list .comment').last().attr('data-comment-id'));
  $('#see-more-comments').button('loading');
  getSpokenComments($('#category').val(), $('#keyword').val(), lastCommentID);
});

$(document).on('submit', '#search-form', function(event) {
  event.preventDefault();
  $('#spoken-comment-list').html('');
  getSpokenComments($('#category').val(), $('#keyword').val(), -1);
});

$(window).load(function() {
  var permalink = location.href.split('?')[1];
  if (permalink != null) {
    var regexMatching = permalink.match(/(\w+)=(\w+)/);
    var category, keyword;
    
    if (regexMatching != undefined && regexMatching.length == 3) { 
      category = regexMatching[1];
      keyword = regexMatching[2];
      
      if (category == 'id') {
        $('#category').val('id');
        $('#category-text').text('순서');
      } else if (category == 'nickname') {
        $('#category').val('nickname');
        $('#category-text').text('별명');
      } else if (category == 'content') {
        $('#category').val('content');
        $('#category-text').text('연설문 내용');
      } else if (category == 'speaker') {
        $('#category').val('speaker');
        $('#category-text').text('의원명');
      } else { 
        $('#category').val('nickname');
        $('#category-text').text('별명');
      } 
     
      $('#keyword').val(keyword);
      
      if (keyword.length > 0) {
        getSpokenComments($('#category').val(), keyword, -1);
      }
    }
  } else {
    getSpokenComments($('#category').val(), '', -1);
  }
});
