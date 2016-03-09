// Alert that line and kakaotalk messenger sharing is only available at mobile
$(document).on('click', '#line-share, #kakaotalk-share', function() {
  // Detect desktop browser
  if (!('ontouchstart' in window)) {
    alert("모바일에서만 가능합니다");
  }
  return false;
});

// Scroll to top if user clicked 'back to top'
$(document).on('click', '#back-to-top', function(event) {
  event.preventDefault();
  $('html, body').animate({ scrollTop: 0 }, 'fast');
});

// Back to previous page
$(document).on('click', '.header__back-btn', function() {
  history.go(-1);
});

$(window).load(function() {
  // Hide loading icon
  $('#loading-icon').addClass('hidden');

  // Ease effect when body DOM loads
  $('body').animate({opacity: 1}, 700);

  // Attach fast-click to boost up touch reaction
  FastClick.attach(document.body);

  // Set locale of moment.js
  moment.locale('ko');

  // Kakaotalk sharing
  Kakao.init('8c5bcdda801470eb94f4db4b66f33d02');
  Kakao.Link.createTalkLinkButton({
    container: '#kakaotalk-share',
    label: $('#kakaotalk-share__label').val(),
    image: {
      src: $('#kakaotalk-share__image-src').val(),
      width: $('#kakaotalk-share__image-width').val(),
      height: $('#kakaotalk-share__image-height').val()
    },
    webButton: {
      text: $('#kakaotalk-share__btn-text').val(),
      url: $('#kakaotalk-share__url').val()
    }
  });
});
