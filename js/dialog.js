let done, pay;
$(document).ready(function() {
  const dialogConfig = {
    autoOpen: false,
    resizable: false,
    draggable: false,
    closeOnEscape: true,
    modal: true,
    open: () => $('body').addClass('disable'),
    close: removeDisableFormBody,
  };

  const city = $( "#dialog-city" ).dialog({
    ...dialogConfig,
    width: $(window).width() - 32,
  });

  $( ".coordinates-btn, .menu-location" ).on(
    "click", 
    () => city.dialog("open")
  );

  const menu = $('#dialog-menu').dialog({
    ...dialogConfig,
    width: 247,
    close: () => closeDialog('.footer-item--menu'),
  });

  $( ".footer-item--menu" ).on( "click", function() {
    openDialog(menu, $(this));
  });

  const money = $('#dialog-money').dialog({
    ...dialogConfig,
    close: () => {
      dialogConfig.close();
      $('.footer-item--money').removeClass('footer-item--active');
    },
  });

  $( ".footer-item--money, .calc-submit" ).on( "click", function(e) {
    e.preventDefault();
    openDialog(money, $(this));
  });

  $('.calc-change').on('click', function() {
    money.dialog("close");
    $("html, body").animate({
      scrollTop: $('#calculator').offset().top + "px"
    }, {
        duration: 500,
        easing: "swing"
    });
  });

  $('.calc-date__btn button').on('click', submitMoney);

  pay = $('#dialog-pay').dialog({
    ...dialogConfig,
    close: () => {
      dialogConfig.close();
      grecaptcha.reset();
      $('.footer-item--pay').removeClass('footer-item--active');
    },
  });

  $( ".footer-item--pay" ).on( "click", function(e) {
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

function openDialog(dialog, trigger) {
  $('body').addClass('disable');
  dialog.dialog( "open" );
  trigger.addClass('footer-item--active');
}

function closeDialog(menuItemSelector) {
  removeDisableFormBody();
  $(menuItemSelector).removeClass('footer-item--active');
}

function removeDisableFormBody() {
  let isSomeDialogDisplay = false;
  $('body').find('.dialog').each(function() {
    if ($(this).dialog( "isOpen" )) {
      isSomeDialogDisplay = true;
    }
  });

  if (!isSomeDialogDisplay) {
    $('body').removeClass('disable');
  }
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