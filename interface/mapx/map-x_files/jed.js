jsoneditors = {} ;


// https://davidwalsh.name/javascript-debounce-function
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}


HTMLWidgets.widget({
  name: 'jed',
  type: 'output',
  factory: function(el) {
    return {
      renderValue: function(x) {

        var options_final = {};
        
        // options can't be changed after instantiation. 
        var options = {
          theme : 'bootstrap3',
          iconlib : "bootstrap3",
          disable_collapse : true,
          disable_properties : true,
          disable_edit_json : true,
          show_errors : "always",
          schema :{
            "title": "empty schema",
            "type": "object",
            "properties": {
              "value": {
                "type":"string",
                "default":"<empty>"
              }
            }
          }
        };

       /* JSONEditor.plugins.selectize.enable = true;*/

        for (var v1 in options) { options_final[v1] = options[v1]; }
        for (var v2 in x) { options_final[v2] = x[v2]; }

        if(jsoneditors[el.id]){
          jsoneditors[el.id].destroy();
        }

        var editor = new JSONEditor(el,options_final);

         editor.on('change',debounce(function() {
          var id = editor.element.id;
          Shiny.onInputChange(id + '_values', editor.getValue());     
          Shiny.onInputChange(id + '_issues', editor.validate());     
        },50));


     
        jsoneditors[el.id] = editor; 

      },
      resize: function(width, height) {
        // do something with size ?
        console.log("width:" + width);
        console.log("height:" + height);
      }
    };
  }
});


Shiny.addCustomMessageHandler("updateJed",
    function(x) {
      jsoneditors[[x.id]]
      .setValue(x.val);
    }
);


