import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('views', './views');
app.set('view engine', 'ejs');
const games = [
  { id: 1, name: "John Doe", text: "I completely agree with this post! Indie games are really pushing"},
  { id :2 ,name: "John Doe", text: "I completely agree with this post! Indie games are really pushing the boundaries of creativity." },
  { id: 3, name: "Jane Smith" , text:" Great article! I'm excited to see how the indie scene continues to evolve." }
];
function addComment(name, text) {
  // Determine the next ID
  const newId = games.length > 0 ? games[games.length - 1].id + 1 : 1;

  // New object to add
  const newComment = { id: newId, name: name, text: text };

  // Add the new object to the array
  games.push(newComment);
}

app.get("/", (req, res) => {
    res.render("index");
  });
  app.get("/blog", (req, res) => {
    res.render("post", {
      comments : games,
    });
   
  });
  app.get("/about", (req, res) => {
    res.render("about");
  });

  app.get("/contact", (req, res) => {
    res.render("contact");
  });

app.post("/submit", (req, res) => {
  console.log(req.body);
  addComment(req.body.name, req.body.comment);
  console.log(games);

});
app.patch('/comments/:id', (req, res) => {
  const { id } = req.params; // Extract ID from parameters
  const { name, text } = req.body; // Extract updated data from the request body

  const comment = games.find(c => c.id === parseInt(id));
  if (!comment) {
      return res.status(404).send('Comment not found');
  }

  // Update the comment
  if (name) comment.name = name;
  if (text) comment.text = text;

  res.redirect('/blog'); // Redirect back to comments page after update
});

// DELETE - Delete a comment by ID
app.delete('/comments/:id', (req, res) => {
  const { id } = req.params; // Extract ID from parameters

  const index = games.findIndex(c => c.id === parseInt(id));
  if (index === -1) {
      return res.status(404).send('Comment not found');
  }

  // Remove the comment from the array
  games.splice(index, 1);
  res.redirect('/blog'); // Redirect back to comments page after deletion
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});