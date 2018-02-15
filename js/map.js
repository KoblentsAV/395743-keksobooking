'use strict';

(function () {
  var REAL_ESTATE_OFFERS_LENGTH = 8;
  var PINS_WIDTH = 40;
  var PINS_HEIGHT = 44;
  var PINS_SHARP_HEIGHT = 22;
  var MAIN_PIN_CENTER_X = 600;
  var MAIN_PIN_CENTER_Y = 352;
  var ENTER_KEYCODE = 13;

  var setAppartType = function (objType) {
    var appartType;
    if (objType === 'flat') {
      appartType = 'Квартира';
    }
    if (objType === 'bungalo') {
      appartType = 'Бунгало';
    }
    if (objType === 'house') {
      appartType = 'Дом';
    }
    return appartType;
  };

  var setFeatures = function (featuresArray) {
    var templateFeature = document.createElement('li');
    templateFeature.classList.add('feature');
    var offerFeaturesFragment = document.createDocumentFragment();

    for (var i = 0; i < featuresArray.length; i++) {
      var featureItem = templateFeature.cloneNode();
      featureItem.classList.add('feature--' + featuresArray[i]);
      offerFeaturesFragment.appendChild(featureItem);
    }
    return offerFeaturesFragment;
  };

  var setPhotos = function (photosArray) {
    var templatePhoto = document.createElement('img');
    var photosFragment = document.createDocumentFragment();
    for (var i = 0; i < photosArray.length; i++) {
      var templatePhotoCopy = templatePhoto.cloneNode();
      templatePhotoCopy.src = photosArray[i];
      templatePhotoCopy.style.width = '65px';
      templatePhotoCopy.style.height = '65px';
      photosFragment.appendChild(templatePhotoCopy);
    }
    return photosFragment;
  };

  var renderOfferCard = function (i) {
    var map = document.querySelector('.map');
    var cardFragment = document.createDocumentFragment();
    var adBlockTemplate = document.querySelector('template').content.querySelector('article.map__card');
    window.adBlockElementGlobal = adBlockTemplate.cloneNode(true);
    var adBlockElement = window.adBlockElementGlobal = adBlockTemplate.cloneNode(true);
    adBlockElement.querySelector('h3').textContent = window.realEstateOffers[i].offer.title;
    adBlockElement.querySelector('.popup__address small').textContent = window.realEstateOffers[i].offer.address;
    adBlockElement.querySelector('.popup__price').textContent = window.realEstateOffers[i].offer.price + ' ₽/ночь';
    adBlockElement.querySelector('h4').textContent = setAppartType(window.realEstateOffers[i].offer.type);
    adBlockElement.querySelector('.popup__rooms-and-guests').textContent = window.realEstateOffers[i].offer.rooms +
      ' комнаты для ' + window.realEstateOffers[i].offer.guests + ' гостей';
    adBlockElement.querySelector('.popup__check').textContent = 'Заезд после ' + window.realEstateOffers[i].offer.checkin +
      ', выезд до ' + window.realEstateOffers[i].offer.checkout;
    adBlockElement.querySelector('.popup__features').textContent = '';
    adBlockElement.querySelector('.popup__features').appendChild(setFeatures(window.realEstateOffers[i].offer.features));
    adBlockElement.querySelector('.popup__description').textContent = window.realEstateOffers[i].offer.description;
    adBlockElement.querySelector('.popup__pictures').textContent = '';
    adBlockElement.querySelector('.popup__pictures').appendChild(setPhotos(window.realEstateOffers[i].offer.photos));
    adBlockElement.querySelector('.popup__avatar').src = window.realEstateOffers[i].author.avatar;
    var insertContainer = document.querySelector('.map__filters-container');
    cardFragment.appendChild(adBlockElement);
    map.insertBefore(cardFragment, insertContainer);
    return map;
  };

  var pinsOnMap = document.querySelector('.map__pins');
  var pinsTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var getPinsOnMap = function () {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < REAL_ESTATE_OFFERS_LENGTH; i++) {
      var pinsElement = pinsTemplate.cloneNode(true);
      pinsElement.setAttribute('style', 'left: ' + (window.realEstateOffers[i].location.x + PINS_WIDTH / 2) +
        'px; top: ' + (window.realEstateOffers[i].location.y + PINS_HEIGHT) + 'px');
      pinsElement.querySelector('img').setAttribute('src', window.realEstateOffers[i].author.avatar);
      fragment.appendChild(pinsElement);
    }
    pinsOnMap.appendChild(fragment);
    return pinsOnMap;
  };

  // МОДУЛЬ 4 ЗАДАЧА 1;

  // глобальные переменные

  var inputAddress = document.querySelector('input#address');
  inputAddress.value = MAIN_PIN_CENTER_X + ', ' + MAIN_PIN_CENTER_Y;
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var fieldList = document.querySelectorAll('fieldset');

  // функция переключения активации / деактивации
  var toggleFormAviability = function (isFormMustDisabled) {
    for (var i = 0; i < fieldList.length; i++) {
      fieldList[i].disabled = isFormMustDisabled;
    }
  };
  toggleFormAviability(true);

  // функция активации карты и отрисовки похожих объявлений
  var activateMap = function () {
    toggleFormAviability(false);
    var noticeForm = document.querySelector('.notice__form');
    map.classList.remove('map--faded');
    noticeForm.classList.remove('notice__form--disabled');
    getPinsOnMap();
    inputAddress.value = MAIN_PIN_CENTER_X + ', ' + parseInt(MAIN_PIN_CENTER_Y + PINS_HEIGHT / 2 + PINS_SHARP_HEIGHT, 10);
    mainPin.removeEventListener('mouseup', mainPinMouseupHandler);
    mainPin.removeEventListener('keyup', mainPinKeyupHandler);
  };

  // обработчики нажатия на main__pin
  var mainPinMouseupHandler = function () {
    activateMap();
  };
  mainPin.addEventListener('mouseup', mainPinMouseupHandler);

  var mainPinKeyupHandler = function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      activateMap();
    }
  };
  mainPin.addEventListener('keyup', mainPinKeyupHandler);

  // получение индекса элемента
  function getElementIndex(node) {
    var index = 0;
    while ((node = node.previousElementSibling)) {
      index++;
    }
    return index;
  }

  // делегирование и рендер карточек
  var mapCardsClickHandler = function (evt) {
    var overlay = document.querySelector('.map__pinsoverlay');
    if (overlay) {
      pinsOnMap.removeChild(overlay);
    }
    var target = evt.target;
    var button = target.closest('.map__pin--user');
    var index;
    if (!button) {
      return;
    }
    index = getElementIndex(button) - 1;
    renderOfferCard(index);
    map.replaceChild(window.adBlockElementGlobal, window.adBlockElementGlobal.previousSibling);
  };
  map.addEventListener('click', mapCardsClickHandler);
})();
