// nav active class
$(function() {
  const current = location.pathname;
  $('#navbar li a').each(function() {
    const $this = $(this);
    // if the current path is like this link, make it active

    // edited below from //    if ($this.href('href').indexOf(current) !== -1) {
    if ($this.prop('href').indexOf(current) !== -1) {
      $this.addClass('active');
    }
  });
});

// popver and tooltoips
$(function() {
  $('[data-toggle="popover"]').popover();
});

$(function() {
  $('[data-toggle="tooltip"]').tooltip();
});

/* let deets = document.getElementById('tourType');
deets.addEventListener('change', showGuideDetails);

function showGuideDetails() {
    console.log(deets);

} */
// const showGuideDetails = document.getElementById('guideDetails');

// /// OP changer
$(document).ready(function() {
  opToggleFields(); // call this first so we start out with the correct visibility depending on the selected form values
  // this will call our opToggleFields function every time the selection value of our other field changes
  $('#operatorName').change(function() {
    opToggleFields();
  });
});
// this toggles the visibility of other
function opToggleFields() {
  // show hide guide info for gc only
  if ($('#operatorName').val() === 'GC') {
    // $('#tourType option:nth-child(3)').show();
    // $('#tourType option:nth-child(4)').show();
    $('#guideDetails').show();
    $('#referrer').show();
  } else if ($('#operatorName').val() === 'AS') {
    /*     $('#tourType option:nth-child(3)').hide();
    $('#tourType option:nth-child(4)').hide(); */
    $('#tourType').val('Group');
    $('#guideDetails').hide();
    $('#referrer').hide();
  } else if ($('#operatorName').val() === 'AV') {
    // $('#tourType option:nth-child(3)').hide();
    // $('#tourType option:nth-child(4)').hide();
    $('#tourType').val('Group');
    $('#guideDetails').hide();
    $('#referrer').hide();
  } else {
    $('#guideDetails').hide();
    $('#referrer').hide();
  }
  // select tour type based on OP selection
};
// ///
// /// tour type changer
$(document).ready(function() {
  tourTypeToggleFields(); // call this first so we start out with the correct visibility depending on the selected form values
  // this will call our opToggleFields function every time the selection value of our other field changes
  $('#tourType').change(function() {
    tourTypeToggleFields();
  });
});
function tourTypeToggleFields() {
  if ($('#tourType').val() === 'Chauffeur Drive') {
    $('#chdDuration').show();
  } else {
    $('#chdDuration').hide();
  };
}
// ///
/*
  $(document).ready(function() {
    countCheckboxes(); // call this first so we start out with the correct visibility depending on the selected form values
    // this will call our toggleFields function every time the selection value of our other field changes
    $('.checked').change(function() {
      countCheckboxes();
    });
  }); */

// wet long version of block below this one
/* jQuery(function ($) {
    var bcount = 1;

    $('input:checkbox').on('change', function () {
      var $el = $(this);
      if ($el.prop('checked')) {
        $el.addClass('checked');
        $('.deleteCounter').text(++bcount);
      } else {
        $el.removeClass('checked');
        $('.deleteCounter').text(--bcount);
      }
    });
  }); */

jQuery(function($) {
  $('input:checkbox').on('change', function() {
    $('.deleteCounter').text($('input:checkbox:checked').length);
  });
});

// paid status dropdown with custom option
function toggleField(hideObj, showObj) {
  hideObj.disabled = true;
  hideObj.style.display = 'none';
  showObj.disabled = false;
  showObj.style.display = 'block';
  showObj.focus();
};

// delete confirmation message
$(document).ready(function() {
  // confirmDelete(); // call this first so we start out with the correct visibility depending on the selected form values
  // this will call our confirmDelete function every time the selection value of our other field changes
  $('#delete').click(function() {
    confirmDelete();
  });
});
function confirmDelete() {
  return confirm('Are sure want to remove this booking?');
}

// ///
// add new rows for cdh multi day tours
// use below block to trigger script
/* <div>
  <label for="item">Enter a new item:</label>
  <input type="text" name="item" id="item">
    <button onclick="addItem()">Add item</button>
    </div>
  <ul>
  </ul> */
$(document).ready(function() {
  addMultipleDaysFields(); // call this first so we start out with the correct visibility depending on the selected form values
  // this will call our opToggleFields function every time the selection value of our other field changes
  $('#chdDurationSelect').change(function() {
    addMultipleDaysFields();
  });
});

function addMultipleDaysFields() {
  if ($('#chdDurationSelect').val() === 'Multi') {
    $('#addMultipleDays').show();
  } else {
    $('#addMultipleDays').hide();
  };
}

$(document).ready(function() {
  const list = document.querySelector('ul#items');
  const input = document.querySelector('input#item');
  const button = document.querySelector('button#addNew');
  button.onclick = function() {
    const myItem = input.value;
    input.value = '';
    const listItem = document.createElement('li');
    const listText = document.createElement('span');
    const listBtn = document.createElement('button');
    listBtn.setAttribute('class', 'btn btn-sm btn-secondary ml-2');
    listItem.setAttribute('class', 'mb-2');
    listItem.appendChild(listText);
    listText.textContent = myItem;
    listItem.appendChild(listBtn);
    listBtn.textContent = 'Delete';
    list.appendChild(listItem);
    listBtn.onclick = function(e) {
      list.removeChild(listItem);
    };
    input.focus();
  };
});


// ///
