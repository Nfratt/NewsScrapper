// get articles
$.getJSON('/api/articles', function(data) {
  for (let i = 0; i < data.length; i++) {
    // Display the articles
    $('#articles').append(`
      <p style="cursor:pointer" data-id="${data[i]._id}">${data[i].title}<br />
      <a href="${data[i].link}" target="_blank">&#9758;</a>
      </p>
      `);
  }
});

$(document).on('click', 'p', function() {
  $('#comments').empty();
  const thisId = $(this).attr('data-id');
  $.ajax({
    method: 'GET',
    url: '/api/articles/' + thisId,
  })
      .then(function(data) {
        console.log(data);
        $('#comments').append('<h2>' + data.title + '</h2>');
        $('#comments').append('<input id=\'titleinput\' name=\'title\' placeholder= \'Username\'>');
        $('#comments').append('<textarea id=\'bodyinput\' name=\'body\'placeholder= \'what did you think about this article?\'></textarea>');
        $('#comments').append('<button data-id=\'' + data._id + '\' id=\'savecomment\'>Save comment</button>');
        if (data.comment) {
          $('#titleinput').val(data.comment.title);
          $('#bodyinput').val(data.comment.body);
        }
      });
});
$(document).on('click', '#savecomment', function() {
  const thisId = $(this).attr('data-id');
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: 'POST',
    url: '/api/articles/' + thisId,
    data: {
      // Value taken from title input
      title: $('#titleinput').val(),
      // Value taken from note textarea
      body: $('#bodyinput').val(),
    },
  })
      .then(function(data) {
        console.log(data);
        $('#notes').empty();
      });
  $('#titleinput').val('');
  $('#bodyinput').val('');
});

