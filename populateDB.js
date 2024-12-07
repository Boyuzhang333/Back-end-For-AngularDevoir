const mongoose = require('mongoose');
const fs = require('fs');
const Assignment = require('./model/assignment');

// 数据库连接
const uri = 'mongodb+srv://boyuzhang333:Zz20001028@cluster0.ipoul.mongodb.net/assignmentsDB?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.once('open', () => {
  console.log('Connected to the database.');
  
  // 读取 JSON 数据
  const data = JSON.parse(fs.readFileSync('./assignments.json', 'utf-8'));
  
  // 插入数据
  Assignment.insertMany(data)
    .then(() => {
      console.log('Data inserted successfully!');
      mongoose.connection.close();
    })
    .catch(err => {
      console.error('Error inserting data:', err);
    });
});
