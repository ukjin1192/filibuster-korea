$(window).load(function() {
  // Kakaotalk sharing
  Kakao.init('8c5bcdda801470eb94f4db4b66f33d02');
  Kakao.Link.createTalkLinkButton({
    container: '#kakaotalk-share',
    label: '[가나다] 라마바',
    image: {
      src: 'http://d1es9gk2quk02b.cloudfront.net/share-desk.jpg',
      width: '800',
      height: '421'
    },
    webButton: {
      text: '둘러보기',
      url: $('#kakaotalk-share__link-url').val()
    }
  });
});
