import express from 'express';
const hostname = '127.0.0.1';
const app = express();
const port = 3000;
const cat = {
  cat_id: 1,
  name: "lumi",
  birthdate: "16.04.2019",
  weight: 5,
  owner: "Umut",
  image: "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_1280.jpg"

}
app.get('/api/v1/cat', (req, res) => {
  res.send(cat);
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.use('/public', express.static('public'))
