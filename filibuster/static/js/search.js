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

  return false;
});

$(window).load(function() {
  $('#loading-icon').addClass('hidden');

  // Ease effect when body DOM loads
  $("body").animate({ opacity: 1 }, 700);

  // Attach fast-click to boost up touch reaction
  FastClick.attach(document.body);

  var parameter = location.href.split('?')[1];
  var categoryMatching = parameter.match(/category=(\w+)/)
  var keywordMatching = parameter.match(/keyword=(\w+)/)

  if (categoryMatching.length > 1) {
    category = categoryMatching[1];
    console.log(category);
  } 
  
  if (keywordMatching.length > 1) {
    keyword = keywordMatching[1];
    console.log(keyword);
  }

  // Kakao talk sharing
  /*
  Kakao.init('8c5bcdda801470eb94f4db4b66f33d02');
  Kakao.Link.createTalkLinkButton({
    container: '#kakaotalk-share',
    label: '[필리버스터 릴레이] 단상에 오르는 의원들의 입을 빌어 하고 싶은 이야기를 적어 주세요',
    image: {
      src: 'http://d1es9gk2quk02b.cloudfront.net/share13.png',
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
