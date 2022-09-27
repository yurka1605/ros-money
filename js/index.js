$(document).ready(function() {
  initRangeSliders();
  initSlick();
  initVideos();
  initAccordion();
  initInputs();
  initSelects();
});

function initSelects() {
  $( ".select" ).each(function() {
    const $this = $(this);
    $this.niceSelect();
    $this.next().on('DOMSubtreeModified', '.current', function() {
      $this.parent().removeClass('invalid valid');
      const val = +$(this).next()
        .children('li.option.selected')
        .attr('data-value');
      $this.parent().addClass(val === 0 ? 'invalid' : 'valid');
    });
  });
}

function initInputs() {
  $('.input').each(function() {
    const $this = $(this);
    const $field = $this.parent();

    const mask = $this.attr('data-masked');
    if (mask) {
      $this.mask(mask);
    }

    $this.on('blur', () => {
      if ($this.attr('required')) {
        const isValid = !mask || mask.length === $this[0].value?.length;
        const validateClass = $this[0].validity.valid && isValid ? 'valid' : 'invalid';
        $field.addClass(validateClass);
      } else if ($this[0].value.length > 0) {
        $field.addClass('valid');
      }
    });
  
    $this.on('focus', () => {
      $field.removeClass('valid invalid');
    });
  });
}

function initAccordion() {
  $('.accordion').each(function() {
    $(this).accordion();
  });
}

function initVideos() {
  $("iframe").prepend("Some prepended text.");
  const iframeWidth = $('.carousel-feedbacks__item').width();
  const $iframe = $('.carousel-feedbacks__item iframe');
  $iframe.attr('width', iframeWidth);
  $iframe.on('click', function() {
    $('.play-btn').toggle('.hide');
  });
}

function initSlick() {
  $('.carousel').slick({
    dots: true,
    infinite: true,
    speed: 300,
  });
}

function initRangeSliders() {
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
}

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