const loginForm = document.querySelector('form')
const inputEmail = document.querySelector('#inputEmail')
const inputPassword = document.querySelector('#inputPassword')

$('form').on('submit', async function(event) {
  event.preventDefault();
  let user = {
    "email": inputEmail.value,
    "password": inputPassword.value
  }  
  let response = await fetch('/admin/login', {
    method: 'POST', 
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    body: JSON.stringify(user)
  })
  let result = await response.json()
  document.cookie = `tk=${result.token}`
  event.currentTarget.submit();
});
!function(t){"use strict";t("#sidebarToggle, #sidebarToggleTop").on("click",function(o){t("body").toggleClass("sidebar-toggled"),t(".sidebar").toggleClass("toggled"),t(".sidebar").hasClass("toggled")&&t(".sidebar .collapse").collapse("hide")}),t(window).resize(function(){t(window).width()<768&&t(".sidebar .collapse").collapse("hide")}),t("body.fixed-nav .sidebar").on("mousewheel DOMMouseScroll wheel",function(o){if(768<t(window).width()){var e=o.originalEvent,l=e.wheelDelta||-e.detail;this.scrollTop+=30*(l<0?1:-1),o.preventDefault()}}),t(document).on("scroll",function(){100<t(this).scrollTop()?t(".scroll-to-top").fadeIn():t(".scroll-to-top").fadeOut()}),t(document).on("click","a.scroll-to-top",function(o){var e=t(this);t("html, body").stop().animate({scrollTop:t(e.attr("href")).offset().top},1e3,"easeInOutExpo"),o.preventDefault()})}(jQuery);