let done, pay;
$(document).ready(function() {
  const dialogConfig = {
    autoOpen: false,
    resizable: false,
    draggable: false,
    closeOnEscape: true,
    modal: true,
    open: () => $('body').addClass('disable'),
    close: () => $('body').removeClass('disable'),
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
  dialog.dialog( "open" );
  trigger.addClass('footer-item--active');
}

function closeDialog(menuItemSelector) {
  $('body').removeClass('disable');
  $(menuItemSelector).removeClass('footer-item--active');
}

function submitPay() {
  const data = {};
  $('.pay-form').find('input').each(function() {
    const val = $(this).val();
    data[this.name] = { val, input: $(this) };
    if (!val || `${val}`.length !== $(this).attr('data-masked').length) {
      $(this).parent('invalid');
      data[this.name].validate = false;
    } else {
      data[this.name].validate = true;
    }
  });

  const isValid = Object.values(data).findIndex(item => !item.validate) === -1;
  if (isValid) {
    Object.entries(data).forEach(([key, value]) => {
      value.input.parent().removeClass('valid invalid');
      value.input.val('');
      data[key] = value.val;
    });
    checkDebt(data);
    pay.dialog('close');
    done.dialog('open');
  } else {
    grecaptcha.reset();
  }
}

function submitMoney(e) {
  const data = {};
  $('.money-form').find('input, select').each(function() {
    const val = $(this).val();
    data[this.name] = { val };
    if (!val || `${val}`.length !== $(this).attr('data-masked').length) {
      $(this).parent('invalid');
      data[this.name].validate = false;
    } else {
      data[this.name].validate = true;
    }
  });

  console.log(data);
}

function checkDebt(formData) {
  console.log(formData);
}