

var clickedTime;
var createdTime;
var reactionTime;
var highScore = [];
 function main() {
$('.startGame').on('click', function(){
  function makeBox() {

  var hue = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
  var time = Math.random() * 5000;
  var windowHeight = window.innerHeight;
  var windowWidth = window.innerWidth;
  var top = (Math.random()*(windowHeight-400))+100;
  var left = Math.random()*(windowWidth-200);
  var shape = Math.random()*50;

  setTimeout(function() {
    $('.box').style.display="block"
    $('.box').style.display="block";
    $('.box').style.background=hue ;
    $('.box').style.top=top + "px";
    $('.box').style.left=left + "px";
    $('.box').style.bordeRadius=shape + "%";
    createdTime = Date.now();
  }, time);

  if(highScore.length > 0 && reactionTime == highScore) {
    $('.highScore').style.color="red";
  } else {
    $('.highScore').style.color="white";
  }

};

$('.box').onclick = function(){
  clickedTime = Date.now();
  reactionTime = (clickedTime - createdTime)/1000;
  highScore.push(reactionTime);
  highScore.sort(function(a, b){return a-b});
  $('.highScore').innerHTML = highScore[0];
  $('.time').innerHTML = reactionTime;
  this.style.display="none";
  makeBox();
  }

  makeBox();
  });
}
$(document).ready(main);
