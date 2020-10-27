const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;
const blogs = [
  {
    title: "Jessica's Animal Farm",
    text: "Learn how to cultivate an army of ant soldiers with Jessica!",
  },
  {
    title: "Ishnoor's Totalitarian Metropolis",
    text:
      "Watch as Ishnoor educates the masses how to program their way into total dominion!",
  },
  {
    title: "test",
    text: "sample",
  },
];

//Changing one of the indicies through an endpoint

app.get("", function (req, res) {
  res.send("Welcome to Backend Basics! Feel free to look around: /blogs/all");
});

app.get("/blogs/all", function (req, res) {
  res.send(blogs);
});

app.get("/blogs/:id", function (req, res) {
  const id = parseInt(req.params.id);
  if (id >= blogs.length || id < 0) {
    res.status(400);
    res.send(
      "Error 400: Invalid ID! Try modifying the blogs, or input a different value."
    );
  } else {
    res.send(blogs[id]);
  }
});

app.post("/blogs/new", function (req, res) {
  const body = req.body;

  if (body.title && body.text) {
    // Checks if user entry already exists in blogs array
    const isRepeat = blogs.some(
      (blog) => blog.title == body.title || blog.text == body.text
    );

    if (isRepeat) {
      res.status(400);
      res.send(
        "Error 400: Duplicate information in database. Try a different entry!"
      );
    } else {
      blogs.push(body);
      const id = blogs.length - 1;
      res.json({ id });
    }
  } else {
    res.status(400);
    res.send(
      "Error 400: Invalid Blog. Each blog must have a title and a text field."
    );
  }
});

// Removes all entries in blogs (irrespectiev of order)
app.get("/remove", function (req, res) {
  if (blogs.length > 0) {
    // checks if blogs has at least one entry
    while (blogs.length > 0) {
      blogs.pop(); // remove all entries in blogs (immutable)
    }
    res.send("Successfully deleted all entries.");
  } else {
    res.status(400);
    res.send(
      "Error 400: No entries in blog. Try adding a new entry to blog first!"
    );
  }
});

// Remove specified entry from blog WITHOUT going into /blogs/:id
app.post("/blogs/remove", function (req, res) {
  const body = req.body;
  const removeEntry = function (input, storage, index) {
    input == storage ? blogs.splice(index, 1) : 0;
  };
  // Checks if an user-input id property exists and is an integer
  if (body.id && Number.isInteger(body.id)) {
    blogs.splice(body.id, 1);
    res.send("Successfully removed entry with specified ID.");
  } else if (body.title) {
    blogs.forEach((blog, index) => removeEntry(body.title, blog.title, index));
    res.send("Successfully removed entry with specified title.");
  } else if (body.text) {
    blogs.forEach((blog, index) => removeEntry(body.text, blog.text, index));
    res.send("Successfully removed entry with specified text.");
  } else {
    // If no ID, title, or text JSON property was sent to server
    res.status(400);
    res.send(
      "Error 400: No id, title, or text input! Ensure you input the JSON-formatted entry correctly!"
    );
  }
});

// METHOD 1: No property-based id system (based on array index)
// Listens for user-input for an id, which matches one of the ids of the current database.
// Prevents anyone from making any arbitrary id value (-1, blogs.length + 300, etc.)
// Switches the indices of the selected index and the current index, instead of shifting the elements.

app.post("/blogs/switch/:id", function (req, res) {
  const body = req.body;
  const current =
    parseInt(req.params.id) >= blogs.length || parseInt(req.params.id) < 0;

  if (current) {
    res.status(400);
    res.send(
      "Error 400: Invalid ID! Try modifying the blogs, or input a different value."
    );
    return;
  }

  if (!(body.id < blogs.length && Number.isInteger(body.id))) {
    res.status(400);
    res.send("Error 400: Invalid ID! Ensure the id is not a string!");
    return;
  }

  // Swaps element of array
  [blogs[body.id], blogs[req.params.id]] = [
    blogs[req.params.id],
    blogs[body.id],
  ];
  res.send(
    "Successfully switched pages! Try looking back through the database."
  );
});

// Starts express on port: x
if (!module.parent) {
  app.listen(port);
  console.log(`Express started on port ${port}`);
}
