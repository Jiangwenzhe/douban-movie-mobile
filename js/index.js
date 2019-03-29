//tab 切换
$('footer>div').on('click', function () {
  var index = $(this).index()
  $('section').hide().eq(index).fadeIn()
  $(this).addClass('active').siblings().removeClass('active')
})


/*调用top250的电影信息*/
//页面计数
var index = 0
var isLoading = false
loadTopData()

function loadTopData() {
if(isLoading){
  return
}
  isLoading = true
  $('.loading').show()
  $.ajax({
    url: 'https://api.douban.com/v2/movie/top250',
    type: 'GET',
    data: {
      start: index,
      count: 20
    },
    dataType: 'jsonp'
  }).done(function (ret) {
    console.log(ret)
    setMovieDate(ret)
    index+=20
  }).fail(function () {
    console.log('error')
  }).always(function(){
    isLoading = false
    $('.loading').hide()
  })
}

//检测是够滚动到页面底部
var clock
$('main').scroll(function(){
  if(clock) {
    clearTimeout(clock)
  }
  clock = setTimeout(function(){
    if($('#top').height() <= $('main').scrollTop() + $('main').height() ){
      console.log(1)
      loadTopData()
    }
  }, 100)
})

function setMovieDate(data) {
  data.subjects.forEach(function (movie) {
    var cardhtml = '<div class="card"> \
    <a href="https://movie.douban.com/subject/1292052/"> \
      <div class="cover"> \
        <img  src=""  alt=""> \
      </div> \
      <div class="detail"> \
        <h2></h2>\
        <div class="extra"><span class="score"></span> / <span class="collection"></span> 收藏</div>\
        <div class="extra"><span class="year"></span> / <span class="type"></span></div>\
        <div class="extra"><span class="director"></span> </div>\
        <div class="extra"><span class="casts"></span></div>\
        <div class="extra"></div> \
      </div> \
    </a> \
  </div>'
    var card = $(cardhtml)
    card.find('a').attr('href', movie.alt)
    card.find('.cover img').attr('src',movie.images.medium)
    card.find('h2').text(movie.title)
    card.find('.score').text(movie.rating.average)
    card.find('.collection').text(movie.collect_count)
    card.find('.year').text(movie.year)
    card.find('.type').text(movie.genres.join('、'))
    card.find('.director').text('导演：'+movie.directors.map(function(director){
      return director.name
    }).join('、'))
    card.find('.casts').text('演员：'+movie.casts.map(function(cast){
      return cast.name
    }).join('、'))
    $('#top').append(card)
  })
}