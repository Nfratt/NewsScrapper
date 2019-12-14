// Grab the articles as a json object
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
// Whenever someone clicks on text
$(document).on('click', 'p', function() {
  // Empty the comments from the note section
  $('#notes').empty();
  // Save the id from the p tag
  const thisId = $(this).attr('data-id');
  $.ajax({
    method: 'GET',
    url: '/api/articles/' + thisId,
  })
  // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        //  article
        $('#notes').append('<h2>' + data.title + '</h2>');
        //  title
        $('#notes').append('<input id=\'titleinput\' name=\'title\' >');
        // body
        $('#notes').append('<textarea id=\'bodyinput\' name=\'body\'></textarea>');
        // comment
        $('#notes').append('<button data-id=\'' + data._id + '\' id=\'savenote\'>Save Note</button>');

        // If there's a comment in the article
        if (data.note) {
          // Place the title of the note in the title input
          $('#titleinput').val(data.note.title);
          // Place the body of the note in the body textarea
          $('#bodyinput').val(data.note.body);
        }
      });
});

// When you click the savenote button
$(document).on('click', '#savenote', function() {
  // Grab the id associated with the article from the submit button
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
        // Log the response
        console.log(data);
        $('#notes').empty();
      });
  $('#titleinput').val('');
  $('#bodyinput').val('');
});

