import express from "express";
import pg from "pg";
import 'dotenv/config'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = new pg.Client({
  user: process.env.DB_USER,
  host: "localhost",
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

app.get("/", async (req, res) => {
  let result = await db.query("SELECT * FROM books");
  res.render("index.ejs", { books: result.rows });
});

app.get("/add", async (req, res) => {
  res.render("add_book.ejs");
});

app.post("/add", async (req, res) => {
  const { title, notes, rating,read_date } =
    req.body;
  
  let created_date= new Date();
let updated_date=new Date();

  let booktype = req.body.booktype;
  let bookvalue = req.body.value;
  let book_id = booktype + "/" + bookvalue;
  await db.query(
    "INSERT INTO books (title,notes,read_date,rating,created_date,updated_date,book_id) VALUES ($1,$2,$3,$4,$5,$6,$7)",
    [title, notes, read_date, rating, created_date, updated_date, book_id]
  );
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  let id = req.body.id;
  let result = await db.query(`SELECT * FROM books WHERE id=$1`, [id]);
  res.render("edit.ejs", { editbook: result.rows[0] });
});

app.post("/update/:id", async (req, res) => {
  let { title, notes } = req.body;
  let editId = req.params.id;

  await db.query(
    "UPDATE books SET title=$1, notes=$2 WHERE id=$3",
    [title, notes, editId]
  );
  res.redirect("/");
});


app.post("/delete",async(req,res)=>{
  console.log('delete called')
  let id = req.body.id;
  db.query("DELETE FROM books WHERE id=$1",[id]);
  res.redirect("/")
})

app.listen(3000, () => {
  console.log("server running on port 3000");
});
