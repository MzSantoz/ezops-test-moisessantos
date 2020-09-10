const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const Message = mongoose.model('Message',{
  name : String,
  message : String
});

app.get('/messages', (_, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
});


app.get('/messages/:user', (req, res) => {
  const user = req.params.user;
  Message.find({name: user},(err, messages)=> {
    io.emit('message-found', messages);
    res.sendStatus(200);
  })
});


app.post('/messages', async (req, res) => {
  try{
    const message = new Message(req.body);
    const savedMessage = await message.save()
      console.log('saved');

    const censored = await Message.findOne({message:'badword'});
      if(censored)
        await Message.remove({_id: censored.id})
      else
        io.emit('message', req.body);
      res.sendStatus(200);
  }
  catch (error){
    res.sendStatus(500);
    return console.log('error',error);
  }
  finally{
    console.log('Message Posted')
  }

});

io.on('connection', (socket) =>{
  console.log('a user is connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Connection to mongodb atlas

const DB_CONNECTION = "mongodb+srv://mz-master:mz1475963@cluster0.kbdpt.mongodb.net/ezops-admission-test?retryWrites=true&w=majority";

console.log('Iniciando conexão ao MongoDB...');
mongoose.connect(
  DB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      connectedToMongoDB = false;
      console.error(`Erro na conexão ao MongoDB - ${err}`);
    }
  }
);

const { connection } = mongoose;

connection.once('open', () => {
  connectedToMongoDB = true;
  console.log('Conectado ao MongoDB');
  const port = process.env.PORT || 8080;

  http.listen(port, () => {
    console.log(`server is running on port => ${port}`);
  });
});
