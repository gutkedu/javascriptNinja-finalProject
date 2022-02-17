const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

let cars = [
  {
    img:
      'https://i0.wp.com/thegarage.com.br/wp-content/uploads/2020/09/1969-volkswagen-fusca-original.jpg?fit=1500%2C1000&ssl=1',
    brandModel: 'Volkswagen Fusca',
    year: '1952',
    plate: 'AAA-1234',
    color: 'Verde',
  },
  {
    img:
      'https://www.doutorie.com.br/blog/wp-content/uploads/2016/08/dica-324.jpg',
    brandModel: 'Fiat Palio',
    year: '2012',
    plate: 'BBBB-4567',
    color: 'Prata',
  },
];

app.get('/cars', function (req, res) {
  res.send(cars);
});

app.post('/cars', function (req, res) {
  const { img, brandModel, year, plate, color } = req.body;
  cars.push({
    img: img,
    brandModel: brandModel,
    year: year,
    plate: plate,
    color: color
  });
  res.status(200);
});

app.delete('/cars', function (req, res) {
   cars = cars.filter(function (car) {
    return car.plate !== req.body.plate;
  });
  res.status(200);
});

app.listen(port);
