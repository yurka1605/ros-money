$date = $('.calc-summary__item--date .calc-summary__value');
$summ = $('.calc-summary__item--summ .calc-summary__value');
$('.range-slider').each(function() {
  var min = Number($(this).attr('data-min')),
      max = Number($(this).attr('data-max')),
      value = Number($(this).attr('data-value')),
      step = Number($(this).attr('data-step')),
      separator = $(this).attr('data-separator'),
      $this = $(this);
      if (separator !== '₽') setCalcDate(value);
  
  $this.slider({
    range: 'min',
    value,
    min,
    max,
    step,
    change: function(event, {value}) {
      const valueNode = $this?.prev()?.children()?.last('.calc-label__summ');
      if (valueNode) {
        const newValue = value >= 10000 ? `${value / 1000} 000`  : value;
        if (separator !== '₽') {
          separator = getDataSeparator(value);
        }

        const strVal = `${newValue} ${separator}`;
        valueNode.text(strVal);
        separator === '₽' ? $summ.text(strVal) : setCalcDate(value);
      }
    }
  });

  $this.find('.value').html(value);
});

$('.range-slider-value').on('touch click', function() {
  $(this)?.parent()?.prev()?.slider(
    'value',
    Number($(this).text().split(' ').slice(0, -1).join(''))
  );
});

function getDataSeparator(value) {
  switch (value) {
    case 1:
      return 'день';
    case 2:
    case 3:
    case 4:
      return 'дня';
    default:
      return 'дней';
  }
}

function setCalcDate(value) {
  $date.text(moment().add(value, 'd').format('DD.MM.YYYY'));
}