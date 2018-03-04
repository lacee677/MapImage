// MAP image url
var imgUrl = "https://felho.gombaszog.sk/api/mapimage",
    img = document.getElementById("mapimg");

img.setAttribute("src", imgUrl);

$(document).ready(function(){
  $("img").on("load", function(){
    var imgOriginal = [ img.naturalWidth, img.naturalHeight ],
        imgResized = [ img.width, img.height ],
        imgDiff = [ imgOriginal[0] / imgResized[0], imgOriginal[1] / imgResized[1] ];

    var drawnBox = $("#drawnBox"),
        container = $('#mapContainer');

    container.css({position: 'relative'});

    container.on("mousedown mousemove mouseup", getStartCoordianates);

    $(window).resize(function(){
      imgResized = [ img.width, img.height ];
      imgDiff = [ imgOriginal[0] / imgResized[0], imgOriginal[1] / imgResized[1] ];
      changeHighlightBoxWindowResize();
    });

    $("#x1").on("change keypress mouseup", function(){
      if(this.value <= imgOriginal[0] &&
          this.value >= 0 ){
        drawnBox.css({
          left: this.value  / imgDiff[0]
        });
      }

      console.log(formValues());
    });

    $("#x2").on("change keypress mouseup", function(){
      if(drawnBox[0].offsetLeft != this.value &&
          this.value < imgOriginal[0] &&
          this.value > 0 ){
        var nWidth = this.value - ( drawnBox[0].offsetLeft * imgDiff[0] );
      }
      else{
       var nWidth = 0;
      }
      drawnBox.css({
        width: nWidth  / imgDiff[0]
      });

      console.log(formValues());
    });

    $("#y1").on("change keypress mouseup", function(){
      if(this.value <= imgOriginal[1] &&
          this.value >= 0 ){
        drawnBox.css({
          top: this.value / imgDiff[1]
        });
      }

      console.log(formValues());
    });

    $("#y2").on("change keypress mouseup", function(){
      if(drawnBox[0].offsetTop != this.value &&
          this.value < imgOriginal[1] &&
          this.value > 0 ){
        var nHeight = this.value - ( drawnBox[0].offsetTop * imgDiff[1] );
      }
      else{
       var nHeight = 0; 
      }
      drawnBox.css({
        height: nHeight  / imgDiff[1]
      });

      console.log(formValues());
    });

        // GET the form values
    function formValues(){
      x1 = document.getElementById("x1").value;
      y1 = document.getElementById("y1").value;
      x2 = document.getElementById("x2").value;
      y2 = document.getElementById("y2").value;
      return [x1, y1, x2, y2];
    }

    // CHANGE the highlight box on window resize
    function changeHighlightBoxWindowResize(){
      values = divideValues( formValues() );
      drawnBox.css({
        left: values[0],
        top: values[1],
        width: values[2] - values[0],
        height: values[3] - values[1]
      });
    }

    // MULTIPLY values for original image
    function multiplyValues(smallValues){
      var x1 = smallValues[0] * imgDiff[0],
          y1 = smallValues[1] * imgDiff[1],
          x2 = smallValues[2] * imgDiff[0],
          y2 = smallValues[3] * imgDiff[1];
      return [x1, y1, x2, y2];
    }

    // DIVIDE values for resized image
    function divideValues(bigValues, multiplyValue){
      var x1 = bigValues[0] / imgDiff[0],
          y1 = bigValues[1] / imgDiff[1],
          x2 = bigValues[2] / imgDiff[0],
          y2 = bigValues[3] / imgDiff[1];
      return [x1, y1, x2, y2];
    }

    // SET the form value when drawing
    function setFormValueOnDraw(x1, y1, x2, y2){
      bigValues = multiplyValues( [x1, y1, x2, y2] );
      $("#x1").val( parseInt( bigValues[0] ) );
      $("#y1").val( parseInt( bigValues[1] ) );
      $("#x2").val( parseInt( bigValues[2] ) );
      $("#y2").val( parseInt( bigValues[3] ) );
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