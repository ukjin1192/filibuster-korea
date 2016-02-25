function d_timer(){
  // set k_time
  d = new Date();
  utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  now = new Date(utc + (3600000*9));

  //set d_day
  d_day = new Date("Mar 10 2016 23:59:59"); // set march 10 2016

  hours = (d_day - now) / 1000 / 60 / 60 ; 
  h_interval = Math.floor(hours);
  minutes = (d_day - now) / 1000 /60 - (60 * h_interval);
  m_interval = Math.floor(minutes);
  seconds = (d_day - now) / 1000 - (60 * 60 * h_interval) -
  (60 * m_interval); 
  secondsRound = Math.round(seconds);

  // variable for display
  sec = "초"
  min = "분 "
  hr = "시간 "
  dy = " 일"

  var d_value = h_interval + hr + m_interval + min + secondsRound + sec;
  $('.due-timer').text(d_value);
  newtime = window.setTimeout("d_timer();", 1000);
}

// Alert that kakaotalk and line messenger sharing is only available at mobile
$(document).on('click', '#line-share, #kakaotalk-share', function() {
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
  else if ($target.text() == '원고') $('#category').val('content');
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
      $comment.find('.comment-speaker').text(comment.speaker);
      // $comment.find('.comment-created-at').text(comment.created_at);
      
      $('#comment-list').append($comment);
    });
  }).always(function() {
    $('#loading-icon').addClass('hidden');
  });
}

$(document).on('click', '.go-to-main-container', function() {
  $('html, body').animate({
    scrollTop: $('#search-navbar').offset().top
  }, 1000);
});


$(document).on('submit', '#search-form', function(event) {
  event.preventDefault();

  $('#comment-list').html('');

  getSearchedComments($('#category').val(), $('#keyword').val(), -1);
});

$(window).scroll(function() {
  if($(window).scrollTop() + $(window).height() == $(document).height()) {
    var lastCommentID = parseInt($('#comment-list .comment').last().attr('data-comment-id'));
    getSearchedComments($('#category').val(), $('#keyword').val(), lastCommentID);
  }

  // Automatically position search navigation bar
  if ($(window).scrollTop() > $('#search-navbar').offset().top) {
    $('#navbar-text').addClass('fixed-navbar');
  } else {
    $('#navbar-text').removeClass('fixed-navbar');
  }
});

$(window).load(function() {
  $('#loading-icon').addClass('hidden');

  // Ease effect when body DOM loads
  $("body").animate({ opacity: 1 }, 700);

  // Attach fast-click to boost up touch reaction
  FastClick.attach(document.body);

  // Due timer
  d_timer(); 

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
        $('#category-text').text('원고');
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
  }

  // Kakao talk sharing
  Kakao.init('8c5bcdda801470eb94f4db4b66f33d02');
  Kakao.Link.createTalkLinkButton({
    container: '#kakaotalk-share',
    label: '[필리버스터 릴레이: 편집실] 국회 본회의장에서 내가 쓴 글이 읽혔습니다. 당신도 참여하세요!',
    image: {
      src: 'http://d1es9gk2quk02b.cloudfront.net/share14.png',
      width: '960',
      height: '480'
    },
    webButton: {
      text: '둘러보기',
      url: 'http://filibuster.me/'
    }
  });
});
