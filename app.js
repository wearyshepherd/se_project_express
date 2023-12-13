const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;
const routes = require('./routes');

app.use(express.json());
app.use('/api', routes);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/se_project', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(port, () => {
  // console.log(`Server is running on port ${port}`);
});
