document.addEventListener('DOMSubtreeModified', injectCSS, false);

function injectCSS () {
  if (document.body) {
    document.removeEventListener('DOMSubtreeModified', injectCSS, false);

    var style = document.createElement('style');

    chrome.storage.sync.get(['barcolor', 'iconcolor', 'corners', 'width2', 'width3',
                             'fade', 'shadow', 'roundavatars', 'previews',
                             'flip', 'sidebar', 'miniprofile', 'miniprofilenormal',
                             'miniprofilewide', 'wtf', 'trends', 'footer', 'font'], function(items){

        // Nav bar color
        if (items['barcolor'])
          style.innerHTML += '.global-nav,.global-nav-inner,#header{background:' + items['barcolor'] + '!important;}';

        // Nav icon color
        if (items['iconcolor']) {
          style.innerHTML += '.nav li .Icon{color:' + items['iconcolor'] + ';}';
          style.innerHTML += '.Icon--tweet{color:#fff!important;}';
        }

        if (items['corners'])
          style.innerHTML += '*{border-radius:0!important;-webkit-border-radius:0!important;}';

        // Content column width
        if (items['width2']) {
          // 2 columns
          style.innerHTML += '.wrapper,.wrapper-narrow,.wrapper-permalink,.global-nav .container{width:' + items['width2'] + 'px!important}';
          style.innerHTML += '.content-main,.profile-page-header,.profile-page-header .profile-header-inner-overlay{width:' + (items['width2'] - 300) + 'px!important}';
        }

        if (items['width3']) {
          // 3 columns
          style.innerHTML += '.three-col .wrapper,.three-col .wrapper-narrow,.three-col .wrapper-permalink,.three-col .global-nav .container{width:' + items['width3'] + 'px!important}';
          style.innerHTML += '.three-col .content-main,.three-col .profile-page-header,.three-col .profile-page-header .profile-header-inner-overlay{width:' + (items['width3'] - 600) + 'px!important}';
        }

        // Sidebar fade
        if (items['fade'])
          style.innerHTML += '.dashboard .module{opacity:' + (items['fade'] / 100) + ';}';

        // Round avatars
        if (items['roundavatars']) {
          style.innerHTML += '.avatar,.ProfileTweet-avatar{border:1px solid #fff;box-shadow:0 0 0 1px #eee;margin-top:-2px;margin-left:-2px;}';
          style.innerHTML += '.avatar,.profile-card.profile-header .profile-picture,.nav .session .dropdown-toggle,.current-user img,.ProfileTweet-avatar,.ProfileAvatar-image,.ProfileAvatar-placeholderImage,.ProfileAvatar,.ProfileCard-avatarImage,.ProfileCard-avatarLink,.DashboardProfileCard-avatarLink,.DashboardProfileCard-avatarImage,.ProfilePopupContainer--bellbird .ProfileHeader .profile-picture,.DMConversationAvatar--1 .DMConversationAvatar-image{-webkit-border-radius:100%!important;border-radius:100%!important;}';
        }

        // Image previews
        if (items['previews']) {
          style.innerHTML += '.with-media-forward .cards-base .media-forward{max-height:0!important;}';
          style.innerHTML += '.expanded-conversation .with-media-forward .cards-base .media-forward{max-height:none!important;}';
        }

        // Sidebar on left
        if (items['flip']) {
          style.innerHTML += 'body:not(.three-col) .dashboard{float:left!important;}';
          style.innerHTML += '.module .list-link .Icon--caretRight{-webkit-transform:none!important;float:right!important;margin-right:0!important;}';
          style.innerHTML += '.content-main,.profile-card.profile-header{margin-left:10px!important;}';
        }

        // sidebar + auto-hide sidebar if no modules to show
        if ((items['sidebar']) ||
          (items['wtf'] && items['trends'] && items['footer'] && (items['miniprofile'] || items['miniprofilewide']))) {
          if (!items['sidebar'] && items['miniprofilewide']) {
            style.innerHTML += '.wtf-module,.trends,.Footer{display:none!important;}';
            style.innerHTML += '.wrapper-home .content-main,.wrapper-settings .content-main,.wrapper-home .dashboard,.wrapper-settings .dashboard{margin-top:30px!important;}';
          } else {
            style.innerHTML += '.wrapper-home .dashboard{display:none!important;}';
            style.innerHTML += '.content-main,.dashboard{margin-top:0!important;}';
          }
          style.innerHTML += '.wrapper-home .content-main,.wrapper-home .profile-page-header,.wrapper-home .profile-page-header .profile-header-inner-overlay{width:' + items['width2'] + 'px!important}';
          style.innerHTML += '.three-col .wrapper-home .content-main,.three-col .wrapper-home .profile-page-header,.three-col .wrapper-home .profile-page-header .profile-header-inner-overlay{width:' + items['width3'] + 'px!important}';
        }

        // miniprofile
        if (items['miniprofile'])
          style.innerHTML += '.mini-profile{display:none!important;}';

        // who to follow
        if (items['wtf'])
          style.innerHTML += '.wtf-module{display:none!important;}';

        // trends
        if (items['trends'])
          style.innerHTML += '.trends{display:none!important;}';

        // footer
        if (items['footer'])
          style.innerHTML += '.Footer{display:none!important;}';

        if (!items['shadow'])
          style.innerHTML += '.profile-header-inner-overlay{display:none!important;}';

        // Custom font
        if (items["font"]) {
          if (items["font"].indexOf("Twitter default") > -1) {
            // Do nothing
          } else if (items["font"].indexOf("ReTwit default") > -1) {
            style.innerHTML += '*{font-family:"Segoe UI","Helvetica Neue",Helvetica-Neue,Helvetica,Arial,sans-serif!important;}';
          } else {
            $('head').append('<link type="text/css" rel="stylesheet" href="https://fonts.googleapis.com/css?family=' + items["font"] + '">');
            style.innerHTML += '*{font-family:' + items["font"] + '!important;}';
          }
        }
    });

    document.head.appendChild(style);
  }
}

window.onload = function() {
  chrome.storage.sync.get('columns', function (items) {
    if (items.columns && document.body.classList.contains('three-col')) {
      document.body.classList.remove('three-col');
    }
  });

  // ReTwit options link in menu
  $(".js-signout-button").before('<li><a href="' + chrome.extension.getURL("/options/options.html") + '" target="_blank">ReTwit Options</a></li>');

  // Media cards based on: https://github.com/ivanm/imgur-twitter-cards
  $(document).on('mousedown', '.js-stream-item', function () {
    appendCard($(this));
  });

  $(".permalink .permalink-tweet").each(function () {
    appendCard($(this));
  });

  function appendCard (el) {
    if (!el.hasClass("imgur") && !el.hasClass("instagram")) {
      text = el.find(".tweet-text").text();
      if (text) {
        link = el.find('[data-expanded-url]').attr('data-expanded-url');

        // Imgur
        if (text.indexOf("i.imgur.com") !== -1) {
          el.find('.expanded-content').prepend('<div class="CardAttribution"><img width="20" height="20" class="CardAttribution-avatar" src="https://pbs.twimg.com/profile_images/3723926625/e935032b01220d25946cde66dc317a1b_normal.png" alt=""><strong class="AttributionName">imgur</strong></div><div><a target="_blank" href="' + link + '"><img src="'+link+'" alt="Embedded image permalink" width="100%"></a><div class="CardFooter"><div class="byline"><a target="_blank" href="' + link + '">View on web</a></div></div></div>');
          el.addClass('imgur');
        }
        // Instagram
        else if (text.indexOf("instagram.com/p/") !== -1) {
          el.find('.expanded-content').prepend('<div class="CardAttribution"><strong>Instagram</strong></div><div><a target="_blank" href="' + link + '"><img src="'+link+'media/?size=l" alt="Embedded image permalink" width="100%"></a><div class="CardFooter"><div class="byline"><a target="_blank" href="' + link + '">View on web</a></div></div></div>');
          el.addClass('instagram');
        }
      }
    }
  }
};
