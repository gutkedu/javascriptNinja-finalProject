(function ($) {
  'use strict';

  /*
  Vamos estruturar um pequeno app utilizando módulos.
  Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
  A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
  seguinte forma:
  - No início do arquivo, deverá ter as informações da sua empresa - nome e
  telefone (já vamos ver como isso vai ser feito)
  - Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
  um formulário para cadastro do carro, com os seguintes campos:
    - Imagem do carro (deverá aceitar uma URL)
    - Marca / Modelo
    - Ano
    - Placa
    - Cor
    - e um botão "Cadastrar"
  Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
  carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
  aparecer no final da tabela.
  Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
  empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
  Dê um nome para a empresa e um telefone fictício, preechendo essas informações
  no arquivo company.json que já está criado.
  Essas informações devem ser adicionadas no HTML via Ajax.
  Parte técnica:
  Separe o nosso módulo de DOM criado nas últimas aulas em
  um arquivo DOM.js.
  E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
  que será nomeado de "app".
  */

  var app = (function () {

    var ajax = new XMLHttpRequest();

    let car = new Array();

    return {
      init: function () {
        console.log('app init');
        this.companyInfo();
        this.initEvents();
      },

      initEvents: function initEvents() {
        $('[data-js="form-register"]').on('submit', this.handleSubmit);
        app.getCarInServer();
      },

      handleSubmit: function handleSubmit(e) {
        e.preventDefault();
        app.newCarEntry();
      },

      newCarEntry: function newCarEntry() {
        var $tr = document.createElement('tr');
        var $tdImage = document.createElement('td');
        var $image = document.createElement('img');
        var $tdBrand = document.createElement('td');
        var $tdYear = document.createElement('td');
        var $tdPlate = document.createElement('td');
        var $tdColor = document.createElement('td');
        var $tdRemoveButton = document.createElement('td');

        $image.src = new $('[data-js="image"]').get().value;
        $tdBrand.textContent = new $('[data-js="brand-model"]').get().value;
        $tdYear.textContent = new $('[data-js="year"]').get().value;
        $tdPlate.textContent = new $('[data-js="plate"]').get().value;
        $tdColor.textContent = new $('[data-js="color"]').get().value;

        app.createDeleteButtonByPlate($tdRemoveButton, $tdPlate.textContent, $tr);

        car = {
          img: $image.src,
          brandModel: $tdBrand.textContent,
          year: $tdYear.textContent,
          plate: $tdPlate.textContent,
          color: $tdColor.textContent
        }

        try {
          app.createNewCarInServer($image.src, $tdBrand.textContent, $tdYear.textContent
            , $tdPlate.textContent, $tdColor.textContent);
          app.addCarOnTable(car);
        }
        catch {
          return;
        }
      },

      addCarOnTable: function addCarOnTable(car) {
        var $tableCar = $('[data-js="table-car"]').get();
        var $fragment = document.createDocumentFragment();
        var $tr = document.createElement('tr');
        var $tdImage = document.createElement('td');
        var $image = document.createElement('img');
        var $tdBrand = document.createElement('td');
        var $tdYear = document.createElement('td');
        var $tdPlate = document.createElement('td');
        var $tdColor = document.createElement('td');
        var $tdRemoveButton = document.createElement('td');

        $image.src = car.img;
        $tdImage.appendChild($image);

        $tdBrand.textContent = car.brandModel;
        $tdYear.textContent = car.year;
        $tdPlate.textContent = car.plate;
        $tdColor.textContent = car.color;

        if ($tdPlate.textContent)
          app.createDeleteButtonByPlate($tdRemoveButton, $tdPlate.textContent, $tr);

        app.createTable($tr, $tdImage, $tdBrand, $tdYear, $tdPlate, $tdColor, $tdRemoveButton);
        app.createTable($fragment, $tr);
        app.createTable($tableCar, $fragment);

      },

      createTable: function createTable(parentElement) {
        for (let elements of arguments) {
          if (elements !== parentElement) parentElement.appendChild(elements);
        }
      },

      createNewCarInServer: function createNewCarInServer(img, brandModel, year, plate, color) {
        ajax.open('POST', 'http://localhost:3000/cars');
        ajax.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        var carData = JSON.stringify({
          img,
          brandModel,
          year,
          plate,
          color,
        });

        ajax.send(carData);
      },

      getCarInServer: function getCarInServer() {
        ajax.open('GET', 'http://localhost:3000/cars')
        ajax.send();
        ajax.addEventListener('readystatechange', function () {
          if (app.isReady.call(this)) {
            let response = JSON.parse(ajax.responseText);
            response.map((carsServer) => {
              car.push(carsServer);
            });

            car.forEach((carElement) => {
              app.addCarOnTable(carElement);
            });

          }
        }, false);
      },

      companyInfo: function companyInfo() {
        var ajaxCompany = new XMLHttpRequest();
        ajaxCompany.open('GET', './company.json', true);
        ajaxCompany.send();
        ajaxCompany.addEventListener('readystatechange', app.getCompanyInfo, false);
      },

      getCompanyInfo: function getCompanyInfo() {
        if (!app.isReady.call(this))
          return;
        var data = JSON.parse(this.responseText);
        var $companyName = $('[data-js="company-name"]').get();
        var $companyPhone = $('[data-js="company-phone"]').get();
        $companyName.textContent = data.name;
        $companyPhone.textContent = data.phone;
      },

      isReady: function isReady() {
        return this.readyState === 4 & this.status === 200;
      },

      removeCarDatabase: function removeCarDatabase(plate, $tr) {
        ajax.open('DELETE', 'http://localhost:3000/cars');
        ajax.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        ajax.send(`{"plate":"${plate}"}`);
        console.log(`{"plate":"${plate}"}`);
        app.removeTableEntry($tr);
      },

      createDeleteButtonByPlate: function createDeleteButtonByPlate($remove, plate, $tr) {
        const $removeButton = document.createElement('button');
        $removeButton.innerHTML = 'Remover';
        $removeButton.addEventListener('click', () => app.removeCarDatabase(plate, $tr));
        $remove.appendChild($removeButton);
      },

      removeTableEntry: function removeTableEntry(tr) {
        tr.remove();
      },

    };
  })();

  app.init();

})(window.DOM);
