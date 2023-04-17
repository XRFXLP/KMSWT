window.addEventListener("message", function(event) {
    // Check that message came from the extension
    if (event.source === window && event.data.greeting) {
      // Do something with the data
      console.log(event.data.greeting);
    }
  });
  