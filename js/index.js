let start, disabled;
const blocks = [
  'calculator',
  'stocks',
  'feedbacks',
  'answer',
];
$(document).ready(function() {
  $(".block").on('touchstart', touchStart);
  //   if (e.cancelable) {
  //     e.preventDefault();
  //     e.stopPropagation();
  //   }
  // });

  $(".block").on('touchend', function(e) {
    if (disabled) {
      return;
    }
      const touchLengthY = start.y - e.originalEvent.changedTouches[0].pageY;
      const touchLengthX = start.x - e.originalEvent.changedTouches[0].pageX;
      if (Math.abs(touchLengthY) < 10 || Math.abs(touchLengthX) > 50) {
        return;
      }

      const scrollTop = calcScrollTop(
        Math.abs(+$('#calculator').css('margin-top').replace('px', '')), 
        touchLengthY > 0,
        getCurrentBlockId(),
      );
      disabled = true;

      $("#calculator").animate(
        {"margin-top":`-${scrollTop}px`}, 
        300, 
        "linear", 
        function() {
          setActiveMenuItem('#' + $(`#${blocks[getCurrentBlockId()]}`).attr('id'));
          disabled = false;
	      }
      );
    });

  initRangeSliders();
  initSlick();
  initVideos();
  initAccordion();
  initInputs();
  initSelects();

  $('.menu-item a').each(function() {
    $(this).on('touch click', function(e) {
      e.preventDefault();
      const link = $(this).attr('href');
      if (link && link !== '#') {
        setActiveMenuItem(link);
        let scrollTop = 0;

        if (link !== "#calculator") {
          const windowHeight = $('body').outerHeight();
          const blockHeight = $(link).outerHeight();
          const blockName = link.replace('#', '');
          const maxScroll = getMaxScroll(blocks.findIndex(block => block === blockName));
          const diffHeight = Math.abs(blockHeight - windowHeight);
          scrollTop = diffHeight > 0 ? maxScroll - diffHeight : maxScroll;
        }

        $("#calculator").animate(
          {"margin-top":`-${scrollTop}px`},
          300, 
          "linear",
        );
      }
    });
  });

  $('.header img').on('touch click', () => {
    $("#calculator").animate(
      {'margin-top': '0px'}, 
      300, 
      "linear", 
      function() {
        setActiveMenuItem('#calculator');
        disabled = false;
      }
    );
  });
});

function calcScrollTop(top, isMoveToBottom, blockId) {
  const $block = $('#' + blocks[blockId]);
  const blockHeight = $block.outerHeight();
  const windowHeight = $('body').outerHeight();
  const maxScroll = getMaxScroll(blockId);

  if (isMoveToBottom) {
    const nextBlockId = blocks[blockId + 1];
    const diff = maxScroll - top;
    alert(`maxScroll ${maxScroll}\ntop ${top}`);
    return diff > 0 || !nextBlockId ?
      maxScroll :
      maxScroll + windowHeight;
  } else {
    const prevBlockId = blocks[blockId - 1];
    if (prevBlockId && (top !== maxScroll || blockHeight === windowHeight)) {
      return maxScroll - blockHeight;
    } else {
      return maxScroll - (blockHeight - $(window).outerHeight());
    }
  }
}

function getMaxScroll(blockId) {
  const windowHeight = $('body').outerHeight();
  let maxScroll = 0;
  blocks.forEach((el, i) => {
    if (i <= blockId) {
      const elHeight = $(`#${el}`).outerHeight();
      if (i === 0) {
        if (elHeight > windowHeight) {
          maxScroll += elHeight - windowHeight;
        }
      } else {
        maxScroll += elHeight;
      }
    }
  });

  return maxScroll;
}

function touchStart(e) {
  start = {
    y: e.originalEvent.touches[0].pageY,
    x: e.originalEvent.touches[0].pageX,
  }
}

function getCurrentBlockId() {
  const offset = Math.abs(+$('#calculator').css('margin-top').replace('px', ''));
  const height = $('body').outerHeight();
  return offset === 0 ? 0 : Math.floor(offset / height);
}

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
  $('.input, input[type=checkbox]').each(function() {
    const $this = $(this);
    const isCheckbox = $this.attr('type') === 'checkbox';
    let $field = $this.parent();

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

    if (isCheckbox) {
      $this.change(e => {
        $field = $this.parent().parent();
        $field.removeClass('invalid');
      });
    }
  });
}

function initAccordion() {
  $('.accordion').each(function() {
    $(this).accordion();
  });
}

function initVideos() {
  $('.carousel-feedbacks__item').each(function() {
    const $play = $(this).children('.play-btn');
    const $video = $(this).children('video');

    $play.on('touch click', function () {
      $video[0].play();
      $video.attr('controls', true);
      $play.hide();
    });
  
    $video.on('pause', function () {
      $play.show();
      $video.attr('controls', false);
    });

    $video.on('ended', function () {
      $video[0].currentTime = 0;
    });
  });
}

function initSlick() {
  $('.carousel').slick({
    dots: true,
    infinite: true,
    speed: 300,
    swipe: true,
  }).on('afterChange', function(){
    if ($(this).hasClass('carousel-feedbacks')) {
      $('.carousel-feedbacks__item video').each(function() {
        $(this)[0].pause();
        $(this)[0].currentTime = 0;
      });
    }
  });
}

function initRangeSliders() {
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
          if (separator !== '₽') {
            separator = getDataSeparator(value);
          }

          const strVal = `${separateSummClasses(value)} ${separator}`;
          valueNode.text(strVal);
          separator === '₽' ? setSumm(strVal) : setCalcDate(value);
          setFinalSumm();
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

function separateSummClasses(value) {
  if (value >= 10000) {
    const thousand = Math.floor(value / 1000);
    const hundred = value - thousand*1000;
    let remainder;
    switch (`${hundred}`.length) {
      case 1:
        remainder = `${hundred}00`;
        break;
      case 2:
        remainder = `${hundred}0`;
        break;
    
      default:
        remainder = hundred;
        break;
    }
    return `${thousand} ${remainder}`;
  } else {
    return value;
  }
}

function setSumm(val) {
  $('.calc-summary__item--summ .calc-summary__value').text(val);
  $('.calc-param--summ .calc-param__value').text(val);
}

function setCalcDate(value) {
  const date = moment().add(value, 'd').format('DD.MM.YYYY');
  $('.calc-summary__item--date .calc-summary__value').text(date);
  $('.calc-date .calc-param__value').text(date);
}

function setFinalSumm() {
  const days = +$('.calc-label--days .calc-label__summ')
    .text().split(' ').slice(0, -1).join('');
  const summ = +$('.calc-summary__item--summ .calc-summary__value')
    .text().split(' ').slice(0, -1).join('');
  const finalSumm = summ + (summ * 0.01) * days;
  $('.calc-param--final-summ .calc-param__value').text(
    `${separateSummClasses(finalSumm)} ₽`
  );
}

function setActiveMenuItem(id) {
  $('.menu-item').removeClass('menu-item--active');
  const $link = $(`.menu-item a[href="${id}"]`);
  $link.parent().addClass('menu-item--active');
}