let done, pay, city, menu, money;
$(document).ready(function() {
  const dialogConfig = {
    autoOpen: false,
    resizable: false,
    draggable: false,
    closeOnEscape: true,
    modal: true,
    close: () => {},
  };

  city = $( "#dialog-city" ).dialog({
    ...dialogConfig,
    position: { my: "center" },
    width: $(window).width() - 32,
  });

  $( ".coordinates-btn, .menu-location" ).on('touch click', function()  {
    city.dialog("open");
  });

  menu = $('#dialog-menu').dialog({
    ...dialogConfig,
    width: 247,
    close: () => closeDialog('.footer-item--menu'),
  });

  $( ".footer-item--menu" ).on( 'touch click', function() {
    openDialog(menu, $(this));
    setTimeout(() => {
      let currentOverlay, currentZIndex = 0;
      $('.ui-widget-overlay').each((i, el) => {
        const zIndex = $(el).css('z-index');
        if (+zIndex > currentZIndex) {
          currentOverlay = $(el);
          currentZIndex = +zIndex;
        }
      });
      currentOverlay.on('touch click', function() {
        menu.dialog( "close" );
      });
    }, 0);
  });

  money = $('#dialog-money').dialog({
    ...dialogConfig,
    close: () => {
      dialogConfig.close();
      $('.footer-item--money').removeClass('footer-item--active');
    },
  });

  $( ".footer-item--money, .calc-submit" ).on( 'touch click', function(e) {
    e.preventDefault();
    openDialog(money, $(this));
  });

  $('.calc-change').on('touch click', function() {
    money.dialog("close");
    $("#main").css('top', `0px`);
    setTimeout(() => {
      $('.menu-item').removeClass('menu-item--active');
      $(`.menu-item a[href="#calculator"]`).parent().addClass('menu-item--active');
    }, 400);
  });

  $('.calc-date__btn button').on('touch click', submitMoney);

  pay = $('#dialog-pay').dialog({
    ...dialogConfig,
    close: () => {
      dialogConfig.close();
      grecaptcha.reset();
      $('.footer-item--pay').removeClass('footer-item--active');
    },
  });

  $( ".footer-item--pay" ).on( 'touch click', function(e) {
    e.preventDefault();
    openDialog(pay, $(this));
  });

  done = $('#dialog-done').dialog({
    ...dialogConfig,
    close: () => {
      dialogConfig.close();
      $('.footer-item--pay').removeClass('footer-item--active');
    },
    width: $(window).width() - 32,
  });
});

function closeOthers() {
}

function openDialog(dialog, trigger) {
  [pay, menu, money].forEach(current => {
    const isOpen = current.dialog( "isOpen" );
    if (isOpen) {
      current.dialog( "close" );
    }
  });
  dialog.dialog( "open" );
  trigger.addClass('footer-item--active');
}

function closeDialog(menuItemSelector) {
  $(menuItemSelector).removeClass('footer-item--active');
}

function submitPay() {
  const data = getInputValues('.pay-form');
  if (checkValidForm(data)) {
    checkDebt(getFormFieldOnly(data));
    resetForm(data);
    done.dialog('open');
  }

  grecaptcha.reset();
}

function submitMoney(e) {
  e.preventDefault();
  const data = {
    ...getInputValues('.money-form'),
    ...getSelectValues('.money-form'),
  };

  if (checkValidForm(data)) {
    const formData = getFormFieldOnly(data);
    getMoney(formData);
    resetForm(data);
    done.dialog('open');
  }
}

function getInputValues(formSelector) {
  const data = {};
  $(formSelector).find('input').each(function() {
    const $this = $(this);
    const isCheckbox = $this.attr('type') === 'checkbox';
    const val = isCheckbox ? $this.is(":checked") : $this.val();
    const required = $this.attr('required');
    data[this.name] = { 
      val,
      valid: null,
      node: $this,
    };

    if (required) {
      const mask = $this.attr('data-masked');
      const isInvalid = !val || (mask && `${val}`.length !== mask.length);
      const $fieldWrap = isCheckbox ? $this.parent().parent() : $this.parent(); 
      $fieldWrap.addClass(isInvalid ? 'invalid' : 'valid');
      data[this.name].valid = !isInvalid;
    }
  });

  return data;
}

function getSelectValues(formSelector) {
  const data = {};
  $(formSelector).find('.select.nice-select').each(function() {
    const $this = $(this);
    const val = $this.children('.list')
                         .children('.option.selected')
                         .attr('data-value');
    const name = $this.prev().attr('name');
    const required = $this.prev().attr('required');
    data[name] = { 
      val,
      valid: null,
      node: $this,
    };

    if (required) {
      $this.parent().addClass(val === '0' ? 'invalid' : 'valid');
      data[name].valid = val !== '0';
    }
  });

  return data;
}

function checkValidForm(formData) {
  return Object.values(formData).findIndex(
    item => !item.valid && item.valid !== null
  ) === -1;
}

function getFormFieldOnly(formData) {
  const data = {};
  Object.entries(formData)
        .forEach(([key, { val }]) => data[key] = val);
  return data;
}

function resetForm(formData) {
  Object.entries(formData).forEach(([key, { node }]) => {
    node.parent().removeClass('valid invalid');
    node.val('');
  });
}

// form submit data

function checkDebt(formData) {
  console.log(formData);
}

function getMoney(formData) {
  console.log(formData);
}