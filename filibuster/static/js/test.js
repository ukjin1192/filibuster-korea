// Alert that line and kakaotalk messenger sharing is only available at mobile
$(document).on('click', '#line-share, #kakaotalk-share', function() {
  // Detect desktop browser
  if (!('ontouchstart' in window)) {
    alert("모바일에서만 가능합니다");
  }
  return false;
});

$(document).on('click', '#footer', function() {
  $.fn.fullpage.moveSectionDown();
});

$(window).load(function() {
  $('#loading-icon').addClass('hidden');

  // Ease effect when body DOM loads
  $('body').animate({opacity: 1}, 700);

  // Attach fast-click to boost up touch reaction
  FastClick.attach(document.body);

	var timeoutFunc;

	$('#fullpage').fullpage({
		anchors: ['1', '2', '3', '4', '5', '6'],
		animateAnchor: true,
		controlArrows: true,
		recordHistory: true,
		
		afterLoad: function(anchorLink, index){
			var loadedSection = $(this);
		
			if (anchorLink == '2') {
				setTimeout(function() {
					$('#speaker-list').typed({
						strings: ['김광진의', '문병호의', '은수미의', '박원석의'],
						typeSpeed: 100
					});
				}, 1000);
			}
			else if (anchorLink == '3') {
				$('#total-comments').typed({
					strings: ['38,619명'],
					typeSpeed: 100
				});
			}
			else if (anchorLink == '4') {
				$('#nickname-list').typed({
					strings: ['나의', '홍길동의', '가나다의'],
					typeSpeed: 100
				});
			}
			
			// Show info message for navigation
			timeoutFunc = setTimeout(function() {
				$('#footer-help-message').animate({opacity: 1}, 700);
			}, 2000);
		},
		
		onLeave: function(index, nextIndex, direction){
			var leavingSection = $(this);
			
			clearTimeout(timeoutFunc);
			$('#footer-help-message').animate({opacity: 0}, 700);
			
			if (index == 6) $('#footer').removeClass('hidden');
			else if (nextIndex == 6) $('#footer').addClass('hidden');
		}
	});

	$('#menu-carousel').slick({
		slidesToShow: 3,
	});

  /*
  Kakao.Link.createTalkLinkButton({
    container: '#kakaotalk-share',
    label: '[필리버스터 릴레이] 국회의원이 읽은 내 연설문 보러 가기 ',
    image: {
      src: 'http://d1es9gk2quk02b.cloudfront.net/share-desk.jpg',
      width: '800',
      height: '421'
    },
    webButton: {
      text: '둘러보기',
      url: 'http://filibuster.me/'
    }
  });
  */
});
