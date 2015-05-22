document.getElementById('name').innerHTML =
  'ReTwit for Twitter ' + chrome.app.getDetails().version;

var storage = chrome.storage.sync;

var fonts = ['Anonymous Pro', 'Arial', 'Arvo', 'Droid Sans', 'Droid Serif', 'Maven Pro',
             'Open Sans', 'Ovo', 'PT Mono', 'PT Sans', 'PT Serif', 'Raleway', 'Roboto',
             'Roboto Condensed', 'Roboto Slab', 'Source Code Pro', 'Source Sans Pro',
             'Tahoma', 'Times', 'Ubuntu'];

function loadFonts () {
  var selector = document.getElementById('fonts');
  for (i = 0; i < fonts.length; i++) {
    var option = document.createElement('option');
    option.text = fonts[i];
    selector.add(option);
  }
}

$(document).ready(function () {
  document.getElementById('btnSave').onclick = function () {
    save();
    message('Settings saved, refresh Twitter!');
  };

  document.getElementById('btnReset').onclick = function () {
    $('#barcolor').val('#252525');
    $('#iconcolor').val('#66757f');
    $('#shadow').attr('checked', true);
    $('#corners').attr('checked', true);
    $('#columns').attr('checked', false);
    $('#width2').val('850');
    $('#chosenWidth2').html('Content width (2 columns): 850px');
    $('#width3').val('1200').show();
    $('#chosenWidth3').html('Content width (3 columns): 1200px').show();
    $('#fade').val('70');
    $('#chosenFade').html('Sidebar fade percentage: 70%');
    $('#roundavatars').attr('checked', true);
    $('#previews').attr('checked', false);
    $('#labels').attr('checked', true);
    $('#flip').attr('checked', false);
    $('#sidebar').attr('checked', false);
    $('#miniprofile').attr('checked', false);
    $('#miniprofilenormal').attr('checked', true);
    $('#wtf').attr('checked', false);
    $('#trends').attr('checked', false);
    $('#footer').attr('checked', false);
    $('.change').removeAttr('disabled');
    $('#fonts').val('Default');

    save();
    message('Settings reset.');
  };
});

$('#columns').change(function () {
  var show = $('#columns').is(':checked');
  $('#chosenWidth3').toggle(!show);
  $('#width3').toggle(!show);
})

$('#width2').change(function () {
  $('#chosenWidth2').html('Content width (2 columns): ' + $('#width2').val() + 'px');
});

$('#width3').change(function () {
  $('#chosenWidth3').html('Content width (3 columns): ' + $('#width3').val() + 'px');
});

$('#fade').change(function () {
  $('#chosenFade').html('Sidebar opacity: ' + $('#fade').val() + '%');
});

$('#sidebar').click(function (){
  var paramChangeBoxes = $('input.change');
  if ($(this).is(':checked'))
    paramChangeBoxes.attr('disabled', 'disabled');
  else
    paramChangeBoxes.removeAttr('disabled');
});

function save () {
  storage.set({
    'barcolor':          $('#barcolor').val(),
    'iconcolor':         $('#iconcolor').val(),
    'shadow':            $('#shadow').is(':checked'),
    'corners':           $('#corners').is(':checked'),
    'columns':           $('#columns').is(':checked'),
    'width2':            $('#width2').val(),
    'width3':            $('#width3').val(),
    'roundavatars':      $('#roundavatars').is(':checked'),
    'previews':          $('#previews').is(':checked'),
    'labels':            $('#labels').is(':checked'),
    'sidebar':           $('#sidebar').is(':checked'),
    'flip':              $('#flip').is(':checked'),
    'fade':              $('#fade').val(),
    'miniprofile':       $('#miniprofile').is(':checked'),
    'miniprofilenormal': $('#miniprofilenormal').is(':checked'),
    'wtf':               $('#wtf').is(':checked'),
    'trends':            $('#trends').is(':checked'),
    'footer':            $('#footer').is(':checked'),
    'font':              $('#fonts').val()
  });
}

function loadChanges () {
  storage.get(['barcolor', 'iconcolor', 'corners', 'columns', 'width2', 'width3',
               'fade', 'shadow', 'roundavatars', 'previews', 'labels', 'flip',
               'sidebar', 'miniprofile', 'miniprofilenormal', 'wtf', 'trends',
               'footer', 'font'], function(items) {
    if (items['barcolor'])
      $('#barcolor').val(items['barcolor']);

    if (items['iconcolor'])
      $('#iconcolor').val(items['iconcolor']);

    if (items['corners'])
      $('#corners').prop('checked', true);

    if (items['columns']) {
      $('#columns').prop('checked', true);
      $('#chosenWidth3').hide();
      $('#width3').hide();
    }

    if (items['width2']) {
      $('#width2').val(items['width2']);
      $('#chosenWidth2').html('Content width (2 columns): ' + items['width2'] + 'px');
    }

    if (items['width3']) {
      $('#width3').val(items['width3']);
      $('#chosenWidth3').html('Content width (3 columns): ' + items['width3'] + 'px');
    }

    if (items['fade']) {
      $('#fade').val(items['fade']);
      $('#chosenFade').html('Sidebar opacity: ' + items['fade'] + '%');
    }

    if (items['shadow'])
      $('#shadow').prop('checked', true);

    if (items['roundavatars'])
      $('#roundavatars').prop('checked', true);

    if (items['previews'])
      $('#previews').prop('checked', true);

    if (items['labels'])
      $('#labels').prop('checked', true);

    if (items['labels'])
      $('#labels').prop('checked', true);

    if (items['flip'])
      $('#flip').prop('checked', true);

    if (items['sidebar']) {
      $('#sidebar').prop('checked', true);
      $('.change').attr('disabled', 'disabled');
    }

    if (items['miniprofile'])
      $('#miniprofile').prop('checked', true);

    if (items['miniprofilenormal'])
      $('#miniprofilenormal').prop('checked', true);

    if (items['wtf'])
      $('#wtf').prop('checked', true);

    if (items['trends'])
      $('#trends').prop('checked', true);

    if (items['footer'])
      $('#footer').prop('checked', true);

    if (items['font'])
      $('#fonts').val(items['font']);

    message('Loaded settings.');
  });
}

function message (msg) {
  var message = $('#status');
  message.text(msg);

  setTimeout(function () {
    message.css('opacity', '0');
  }, 2000);

  message.css('opacity', '1');
}

loadFonts();
loadChanges();
