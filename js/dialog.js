$(document).ready(function() {
  const $body = $('body');
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
    width: 247,
    close: () => {
      dialogConfig.close();
      $('.footer-item--money').removeClass('footer-item--active');
    },

    autoOpen: true,
  });

  $( ".footer-item--money, .calc-submit" ).on( "click", function(e) {
    e.preventDefault();
    openDialog(money, $(this));
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