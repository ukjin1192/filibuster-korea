// Update due timer
function updateDueTimer(){

  var now = moment();
  // 2016/03/10 23:59:%9
  var due = moment([2016, 2, 10, 23, 59, 59]);

  var duration = moment.duration(due.diff(now));

  var hours = Math.floor(duration.asHours());
  var minutes = Math.floor(duration.asMinutes()) - hours * 60;
  var seconds = Math.floor(duration.asSeconds()) - hours * 3600 - minutes * 60;

  // Set text of timer
  $('.desk-header--timer').text(hours + "시간 " + minutes + "분 " + seconds + "초");
}

// Alert that kakaotalk and line messenger sharing is only available at mobile
$(document).on('click', '#kakaotalk-share-1, #kakaotalk-share-2', function() {
  // Detect desktop browser
  if (!('ontouchstart' in window)) {
    alert("모바일에서만 가능합니다");
  }
  return false;
});

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

function getSearchedComments(category, keyword, lastCommentID) {
  $('#loading-icon').removeClass('hidden');

  var data = {};
  if (lastCommentID > 0) {
    data = {
      'category': category,
      'keyword': keyword,
      'spoken': true,
      'last_comment_id': lastCommentID
    };
  } else {
    data = {
      'category': category,
      'keyword': keyword,
      'spoken': true,
    };
  }

  $.ajax({
    url: '/api/comments/search/',
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
  getSearchedComments($('#category').val(), $('#keyword').val(), lastCommentID);
});

$(document).on('submit', '#search-form', function(event) {
  event.preventDefault();

  $('#spoken-comment-list').html('');

  getSearchedComments($('#category').val(), $('#keyword').val(), -1);
});

$(window).scroll(function() {
  // Automatically position search navigation bar
  if ($(window).scrollTop() > $('.desk-navbar').offset().top) {
    $('.desk-navbar--title').addClass('fixed');
  } else {
    $('.desk-navbar--title').removeClass('fixed');
  }
});

$(window).load(function() {
  $('#loading-icon').addClass('hidden');

  // Ease effect when body DOM loads
  $('body').animate({opacity: 1}, 700);

  // Attach fast-click to boost up touch reaction
  FastClick.attach(document.body);

  // Update due timer every seconds
  moment.locale('ko');
  setInterval(updateDueTimer, 1000);

  var parameter = location.href.split('?')[1];
  if (parameter != null) {
    var categoryMatching = parameter.match(/category=(\w+)/);
    var keywordMatching = parameter.match(/keyword=(\w+)/);
    var category, keyword;
    
    if (categoryMatching != undefined && categoryMatching.length > 1) {
      category = categoryMatching[1];
      
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
    } 
     
    if (keywordMatching != undefined && keywordMatching.length > 1) {
      keyword = keywordMatching[1];
      $('#keyword').val(keyword);
      
      if (keyword.length > 0) {
        getSearchedComments($('#category').val(), keyword, -1);
      }
    }
  } else {
    getSearchedComments($('#category').val(), '', -1);
  }

  // Kakaotalk sharing
  Kakao.init('8c5bcdda801470eb94f4db4b66f33d02');
  Kakao.Link.createTalkLinkButton({
    container: '#kakaotalk-share-1',
    label: '[필리버스터 릴레이: 편집실] 국회 본회의장에서 내가 쓴 글이 읽혔습니다. 당신도 참여하세요!',
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
  Kakao.Link.createTalkLinkButton({
    container: '#kakaotalk-share-2',
    label: '[필리버스터 릴레이: 편집실] 국회 본회의장에서 내가 쓴 글이 읽혔습니다. 당신도 참여하세요!',
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
});
