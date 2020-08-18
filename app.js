const express = require('express');

const cals = require('./datas');

const app = express();

app.use(express.json());

function all_cals(update_called, index_expecific) {
  const all_cals = [];

  if (update_called) {
    cals.forEach((called) => {
      all_cals.push(
        `Called: ${(cals.indexOf(called) == index_expecific ? "update" : " ")} 
            ${cals.indexOf(called)} : ${called}`
      )
    });
  } else {
    cals.forEach((called) => {
      all_cals.push(
        `Called: ${cals.indexOf(called)} : ${called}`
      )
    });
  }

  return all_cals;
};

// --------- Middlewares ---------

// Middleware Global
app.use((request, response, next) => {
  console.log(`Méthod: ${request.method}; URL: ${request.url}`);

  return next();
});

// Middle Local
function CheckCalledExists(request, response, next) {
  if (!request.body.called) {
    return response.status(404).json({ error: 'Called not found on request body' })
  }

  return next();
}

// Middle Local
function CheckCalledInArray(request, response, next) {
  if (!cals[request.params.index]) {
    return response.status(404).json({ error: 'Called does not exists' });
  }

  return next();
}

// ------- End middlewares -------

// Show Called All
app.get('/cals', (request, response) => {
  const all_cals_returned = all_cals();

  return response.json(all_cals_returned);
});

// Show Called
app.get('/cals/:index', CheckCalledInArray, (request, response) => {
  const { index } = request.params;

  return response.json({ "chamado": cals[index] });
});

// Create
app.post('/cals/new', CheckCalledExists, (request, response) => {
  const { called } = request.body;

  cals.push(called);

  return response.json(all_cals());
});


// Delete
app.delete('/cals/delete/:index', CheckCalledInArray, (request, response) => {
  const { index } = request.params;

  cals.splice(index, 1);

  return response.status(200).json({ message: 'called successfully deleted.' });
});

// Update
app.put('/cals/update/:index', CheckCalledExists, CheckCalledInArray, (request, response) => {
  const { index } = request.params;
  const { called } = request.body;

  cals[index] = called;

  console.log(index);

  return response.json(all_cals(update_called = true, index));

});

app.listen(4000);