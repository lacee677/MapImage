// MAP image url
//var imgUrl = "https://felho.gombaszog.sk/api/mapimage",
var imgUrl = "https://www.gombaszog.sk/assets/terkep_raszter_upd-e41ec1cdb42ddf34a97a944e9768fcac.png",
    img = document.getElementById("mapimg");

img.setAttribute("src", imgUrl);

$(document).ready(function(){
  $("img").on("load", function(){
    var imgOriginal = imgOriginalSize(),
        imgResized = imgSmallSize();

    var drawnBox = $("#drawnBox"),
        container = $('#mapContainer');

    container.on("mousedown mousemove mouseup", getStartCoordianates);

    $(window).resize(function(){
      imgResized = imgSmallSize();
      changeHighlightBoxWindowResize();
    });

    $("input").on("change", function(){
      console.log(this.value);
      changeHighlightBoxFormChange(this.id);
    });

    // IMAGE original size
    function imgOriginalSize(){
        var imgWidth = img.naturalWidth;
            imgHeight = img.naturalHeight;
        return [imgWidth, imgHeight];
    }

    // RESIZED image size
    function imgSmallSize(){
      var imgSmallWidth = img.width,
          imgSmallHeight = img.height;
      return [imgSmallWidth, imgSmallHeight];
    }

    // DIFFERECE between original and resized image
    function imgDifference(imgO, imgR){
      var imgWidthDiff = imgO[0] / imgR[0],
          imgHeightDiff = imgO[1] / imgR[1];
      return [imgWidthDiff, imgHeightDiff];
    }

    // MULTIPLY values for original image
    function multiplyValues(smallValues, multiplyValue){
      var x1 = smallValues[0] * multiplyValue[0],
          y1 = smallValues[1] * multiplyValue[1],
          x2 = smallValues[2] * multiplyValue[0],
          y2 = smallValues[3] * multiplyValue[1];
      return [x1, y1, x2, y2];
    }

    // DIVIDE values for resized image
    function divideValues(bigValues, multiplyValue){
      var x1 = bigValues[0] / multiplyValue[0],
          y1 = bigValues[1] / multiplyValue[1],
          x2 = bigValues[2] / multiplyValue[0],
          y2 = bigValues[3] / multiplyValue[1];
      return [x1, y1, x2, y2];
    }

    // GET the form values
    function formValues(){
      x1 = document.getElementById("x1").value;
      y1 = document.getElementById("y1").value;
      x2 = document.getElementById("x2").value;
      y2 = document.getElementById("y2").value;
      return [x1, y1, x2, y2];
    }

    // SET the form value when drawing
    function setFormValueOnDraw(x1, y1, x2, y2){
      bigValues = multiplyValues([x1, y1, x2, y2], imgDifference(imgOriginal, imgResized));
      $("#x1").val(bigValues[0]);
      $("#y1").val(bigValues[1]);
      $("#x2").val(bigValues[2]);
      $("#y2").val(bigValues[3]);
    }

    // CHANGE the highlight box on window resize
    function changeHighlightBoxWindowResize(){
      values = divideValues(formValues(), imgDifference(imgOriginal, imgResized));
      drawnBox.css({
        left: values[0],
        top: values[1],
        width: values[2] - values[0],
        height: values[3] - values[1]
      })

    }

    // CHANGE the highlight box on change in form
    function changeHighlightBoxFormChange(id){
      console.log(id);
      values = divideValues(formValues(), imgDifference(imgOriginal, imgResized));
      coords = [drawnBox[0].offsetLeft, drawnBox[0].offsetTop, drawnBox[0].offsetWidth, drawnBox[0].offsetTop];
      var temp;
      if(id == "x1"){
        temp = values[0] - coords[0];
        if(temp <= 0){
          drawnBox.css({
            left: values[0],
            width: coords[2] + Math.abs(temp)
          });
        }
        else{
          drawnBox.css({
            left: values[0],
            width: coords[2] - Math.abs(temp)
          });
        }
        console.log(values[0]);
        console.log(temp);
        console.log(coords[2] + temp);
      }
      else if(id == "y1"){

      }
      else if(id =="x2"){

      }
      else if(id == "y2"){

      }

    }

    // DRAW the highlight box
    function getStartCoordianates(e){
      if(e.type == "mousedown"){
        drawnBox.css({
          width: 0,
          height: 0
        });
        e.preventDefault();
        var x1 = e.offsetX,
            y1 = e.offsetY;
        drawnBox.css({
          left: x1,
          top: y1
        });
      }
      else if(e.type == "mouseup"){
        var coords = [drawnBox[0].offsetLeft, drawnBox[0].offsetTop];
        var width = e.offsetX - coords[0],
            height = e.offsetY - coords[1],
            x2 = e.offsetX,
            y2 = e.offsetY;
        drawnBox.css({
          width: width,
          height: height
        });
        setFormValueOnDraw(coords[0], coords[1], x2, y2);
      }
    }
  });
});
/*
var dp = $('#map-container');
    dp.css({position: 'relative'});
    dp.on("mousemove mousedown mouseup", draw_a_box);
var draw = false;

function draw_a_box(e){
  var pageX = e.pageX,
      pageY = e.pageY,
      dpCurrent = dp.find('.drawnBox.current'),
      dpCurrent_data = dpCurrent.data();

  if(e.type === 'mousemove'){
        // If ".drawnBox.current" doesn't exist, create it.
    if(dpCurrent.length < 1){
      $('<div class="drawnBox current"></div>').appendTo(dp);
    }
    var drawCSS = {};
    // If drawing is initiated.
    if(draw){
            // Determine the direction.
            // xLeft
      if(dpCurrent_data.pageX > pageX){
        drawCSS['right'] = dp.width() - dpCurrent_data.pageX,
        drawCSS['left'] = 'auto',
        drawCSS['width'] = dpCurrent_data.pageX - pageX;
      }
              // xRight
      else if(dpCurrent_data.pageX < pageX){
        drawCSS['left'] = dpCurrent_data.pageX,
        drawCSS['right'] = 'auto',
        drawCSS['width'] = pageX - dpCurrent_data.pageX;
        }
              // yUp
      if(dpCurrent_data.pageY > pageY){
        drawCSS['bottom'] = dp.height() - dpCurrent_data.pageY,
        drawCSS['top'] = 'auto',
        drawCSS['height'] = dpCurrent_data.pageY - pageY;
      }
              // yDown
      else if(dpCurrent_data.pageY < pageY){
        drawCSS['top'] = dpCurrent_data.pageY,
        drawCSS['bottom'] = 'auto',
        drawCSS['height'] = pageY - dpCurrent_data.pageY;
      }
    }
    if(!draw && dpCurrent.length > 0){
      dpCurrent.css({
        top: pageY,
        left: pageX
      });
    }
    if(draw){
      dpCurrent.css(drawCSS);
    }
  }
  if(e.type === 'mousedown'){
    e.preventDefault();
    draw = true;
    dpCurrent.data({ "pageX": pageX, "pageY": pageY });
  }
  else if(e.type === 'mouseup'){
    draw = false;
    if(dpCurrent.width()<10) dpCurrent.remove();
    dpCurrent.prev().removeClass('last');
    dpCurrent
            .addClass('last')
            .removeClass('current');
  }
}
*/
