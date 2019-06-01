var end;
var score;
var highScore;

var height;
var width;
$(document).ready(function(){
  highScore =0;
  height = $(document).height();
  width = $(document).width();

  $("#pane").css({
    "width" : width,
    "height" : height,
  });

  $("#pane").hide();

  $("#start").click(function(){
    end = false;
    score = 0;

    $("#menu").hide();
    $("#pane").show();
    checkGame = setInterval(function(){
      if ($(".alienBox").html() == "" && end == false) {
        spawnAliens();
        $("#score").text("Your score : "+score);
      }
      if (end == true) {
        clearInterval(checkGame);
      }
    }, 10);
  });
  var pane = $('#pane'),
  box = $('#joueur'),
  maxValue = pane.width() - box.width(),
  keysPressed = {},
  distancePerIteration = 10;

  function calculateNewValue(oldValue, keyCode1, keyCode2) {
    var newValue = parseInt(oldValue, 10)
    - (keysPressed[keyCode1] ? distancePerIteration : 0)
    + (keysPressed[keyCode2] ? distancePerIteration : 0);
    return newValue < 0 ? 0 : newValue > maxValue ? maxValue : newValue;
  }

  $(window).keydown(function(event) { keysPressed[event.which] = true;});
  $(window).keyup(function(event) { keysPressed[event.which] = false; });

  setInterval(function() {
    box.css({
      left: function(index ,oldValue) {
        return calculateNewValue(oldValue, 37, 39);
      },
      top: function(index, oldValue) {
        return calculateNewValue(oldValue, 38, 40);
      }
    });
  }, 20);

  $(document).keydown(function(event){
    if (event.which == 37) {
      $("#joueur").css({transform: ' scaleX(-1)'});
    }else if(event.which == 38){
      $("#joueur").css({transform: 'rotate(-90deg)'});
    }else if(event.which == 39){
      $("#joueur").css({transform: 'rotate(0deg)'});
    }else if(event.which == 40){
      $("#joueur").css({transform: 'rotate(90deg)'});
    }
  });

});

function spawnAliens(){
  var rand = getRandomInt(width/100);
  var index;
  if (score >= 1000) {
    index = score/250;
  }else{
    index = 5
  }

  var speed = width/index;
  var orientation = getRandomInt(4);
  for (var i = 0; i < rand; i++) {
    createAlien(i, orientation);
    moveAlien(i, speed, orientation);
  }
}

function createAlien(id, orientation){
  var newAlien = $("#alien").clone().prependTo(".alienBox").attr("id", id);
  if (orientation ==0) {//droite à gauche
    var posY = getRandomInt(height-60);
    $("#"+id).css({
      "top" : posY,
      "left" : width
    });
  }else if(orientation == 1) {//gauche à droite
    var posY = getRandomInt(height-60);
    $("#"+id).css({
      "top" : posY,
      "left" : 0
    });
  }else if (orientation == 2) {//haut en bas
    var posX = getRandomInt(width-150);
    $("#"+id).css({
      "top" : 0,
      "left" : posX
    });
  }else if (orientation ==3) {//bas en haut
    var posX = getRandomInt(width-150);
    $("#"+id).css({
      "top" : height,
      "left" : posX
    });
  }
  $("#"+id).show();
}

function moveAlien(id, speed, orientation){
  var e = $("#"+id);
  if (e.length != 0) {
    var pos = e.position();

    if (collision($("#joueur"), e) == true) {
      end = true;
      if (score >= highScore) {
        highScore = score;
      }
      $(".alienBox").html("");
      $("#pane").hide();
      $("#highScore").html("Your best score is : <b>" +highScore+"</b>");
      $("#menu").show();
    }
    if (orientation == 0) {
      if (e.position().left <= -82) {
        e.remove();
        score = score + 100
      }else{
        e.animate ({left: '-=100px',}, speed, 'linear', function() {
          moveAlien(id, speed, orientation);
        });
      }
    }else if (orientation == 1) {
      if (e.position().left >= width+82) {
        e.remove();
        score = score + 100
      }else{
        e.animate ({left: '+=100px',}, speed, 'linear', function() {
          moveAlien(id, speed, orientation);
        });
      }
    }else if (orientation == 2) {
      if (e.position().top >= height+60) {
        e.remove();
        score = score + 100
      }else{
        e.animate ({top: '+=100px',}, speed, 'linear', function() {
          moveAlien(id, speed, orientation);
        });
      }
    }else if (orientation == 3) {
      if (e.position().top <= -60) {
        e.remove();
        score = score + 100
      }else{
        e.animate ({top: '-=100px',}, speed, 'linear', function() {
          moveAlien(id, speed, orientation);
        });
      }
    }
  }
}


function collision($div1, $div2) {
  var x1 = $div1.position().left;
  var y1 = $div1.position().top;
  var h1 = $div1.outerHeight(true);
  var w1 = $div1.outerWidth(true);
  var b1 = y1 + h1;
  var r1 = x1 + w1;
  var x2 = $div2.position().left;
  var y2 = $div2.position().top;
  var h2 = $div2.outerHeight(true);
  var w2 = $div2.outerWidth(true);
  var b2 = y2 + h2;
  var r2 = x2 + w2;

  if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2){
    return false;
  }else{
    return true;
  }

}


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
