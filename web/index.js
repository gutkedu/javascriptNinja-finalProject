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

    return {
      init: function () {
        console.log('app init');
        this.companyInfo();
        this.initEvents();
      },

      initEvents: function initEvents() {
        $('[data-js="form-register"]').on('submit', this.handleSubmit);
      },

      handleSubmit: function handleSubmit(e) {
        e.preventDefault();
        //var $tableCar = $('[data-js="table-car"]').get();
        //$tableCar.appendChild(app.createNewCar());
        app.createNewCarInServer();
        //app.handleCleanInputs();
        $('[data-js="delete-button"]').on('click', app.removeCarEntry);
      },

      carsInfo: function carsInfo() {
        const ajaxCars = new XMLHttpRequest();
        ajaxCars.open('GET', 'http://localhost:3000/cars');
        ajaxCars.send();
        ajaxCars.addEventListener('readystatechange', this.getCarsInfo, false);
      },

      getCarsInfo: function getCarsInfo() {
        if (!app.isReady.call(this))
          return;
        const response_cars = JSON.parse(ajaxCars.responseText);

        var $tableCar = $('[data-js="table-car"]').get();

        response_cars.map((item, index) => {
          $tableCar.innerHTML += `
          <tr id=${index}>
            <td> ${item.dateCreation}</td>
            <td> <img src=${item.image}/></td>
            <td> ${item.brandModel}</td>
            <td> ${item.year}</td>
            <td> ${item.plate}</td>-
            <td> ${item.color}</td>
          </tr>
          `
        });
      },

      createNewCarInServer: function createNewCarInServer() {
        ajax.open('POST', 'http://localhost:3000/cars');
        ajax.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        var img = $('[data-js="image"]').get();
        var brandModel = $('[data-js="brand-model"]').get();
        var year = $('[data-js="year"]').get();
        var plate = $('[data-js="plate"]').get();
        var color = $('[data-js="color"]').get();

        if (!img || !brandModel || !year || !plate || !color) {
          return alert('Preencha todos os campos');
        }

        var data = JSON.stringify({
          img,
          brandModel,
          year,
          plate,
          color,
        });

        ajax.send(data);
        ajax.addEventListener('readystatechange', this.carsInfo(), false);

      },

      carsInfo: function carsInfo() {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', 'http://localhost:3000/cars', true);
        ajax.send();
        ajax.addEventListener('readystatechange', this.getCarInfo, false);
      },

      createNewCar: function createNewCar() {
        var $fragment = document.createDocumentFragment();
        var $tr = document.createElement('tr');
        var $tdImage = document.createElement('td');
        var $image = document.createElement('img');
        var $tdBrand = document.createElement('td');
        var $tdYear = document.createElement('td');
        var $tdPlate = document.createElement('td');
        var $tdColor = document.createElement('td');
        var $tdRemoveButton = document.createElement('td');

        $image.setAttribute('src', $('[data-js="image"]').get().value);
        $tdImage.appendChild($image);

        $tdBrand.textContent = $('[data-js="brand-model"]').get().value;
        $tdYear.textContent = $('[data-js="year"]').get().value;
        $tdPlate.textContent = $('[data-js="plate"]').get().value;
        $tdColor.textContent = $('[data-js="color"]').get().value;

        const $deleteButton = app.createButton('Remover');
        $deleteButton.addEventListener('click', () => app.removeTableEntry($tr), false);
        var $removeButton = $tdRemoveButton.appendChild($deleteButton);

        $tr.appendChild($tdImage);
        $tr.appendChild($tdBrand);
        $tr.appendChild($tdYear);
        $tr.appendChild($tdPlate);
        $tr.appendChild($tdColor);
        $tr.appendChild($removeButton);

        return $fragment.appendChild($tr);
      },

      removeCarEntry: function removeCarEntry(event) {
        const pos = this.getAttribute('data-delete');
        $(`[data-position="${pos}"]`).get().outerHTML = '';
      },

      companyInfo: function companyInfo() {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', './company.json', true);
        ajax.send();
        ajax.addEventListener('readystatechange', this.getCompanyInfo, false);
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

      createButton: function createButton(text) {
        const $button = document.createElement('button');
        const $buttonText = document.createTextNode(text);
        $button.appendChild($buttonText);
        return $button;
      },

      removeTableEntry: function removeTableEntry(tr) {
        tr.remove();
      },

      handleCleanInputs: function handleCleanInputs() {
        var inputImage = DOM('[data-js="image"]').get();
        var model = DOM('[data-js="brand-model"]').get();
        var year = DOM('[data-js="year"]').get();
        var plate = DOM('[data-js="plate"]').get();
        var color = DOM('[data-js="color"]').get();

        inputImage.value = '';
        model.value = '';
        year.value = '';
        plate.value = '';
        color.value = '';
      },

    };
  })();

  app.init();

})(window.DOM);