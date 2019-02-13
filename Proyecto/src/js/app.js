App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  PrecioToken: 1000000000000000,
  tokensVendidos: 0,
  tokensDisponibles: 1000000,
  registrado: false,

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {

      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

  initContracts: function () {
    $.getJSON("CompraToken.json", function (CompraToken) {
      App.contracts.CompraToken = TruffleContract(CompraToken);
      App.contracts.CompraToken.setProvider(App.web3Provider);
      App.contracts.CompraToken.deployed().then(function (CompraToken) {
      });
    }).done(function () {
      $.getJSON("Token.json", function (Token) {
        App.contracts.Token = TruffleContract(Token);
        App.contracts.Token.setProvider(App.web3Provider);
        App.contracts.Token.deployed().then(function (Token) {
          App.listenForEvents();
          return App.render();
        });
      });
    })
  },


  // Escuchando a los eventos que se emiten en los contratos
  listenForEvents: function () {
    App.contracts.Token.deployed().then(function (instance) {
      
      instance.nuevoAhorrador({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function (error, event) {
        console.log("event triggered", event)
        App.render();
      });
    });
    App.contracts.Token.deployed().then(function (instance) {
      instance.TransferInicial({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function (error, event) {
        console.log("event triggered", event)
        App.render();
      });
    });
    App.contracts.CompraToken.deployed().then(function (instance) {
      instance.Venta({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function (error, event) {
        console.log("event triggered", event);
        App.render();
      });
    });
    App.contracts.CompraToken.deployed().then(function (instance) {
      instance.Retiro({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function (error, event) {
        console.log("event triggered", event);
        App.render();
      });
    });
    App.contracts.CompraToken.deployed().then(function (instance) {
      instance.Deposito({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function (error, event) {
        console.log("event triggered", event);
        App.render();
      });
    });
  },


  render: function () {
    if (App.loading) {
      return;
    }

    App.loading = true;
    console.log('#startValuesAndTargetExample .progress_bar');
    // Función que muestra el address en el Metamask
    web3.eth.getCoinbase(function (err, account) {
      console.log("entrando");
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    //Función para recargar la Daap cada vez que cambie de address en Metamask
    account = web3.eth.accounts[0];
    setInterval(function() {
      if (web3.eth.accounts[0] !== account) {
        account = web3.eth.accounts[0];
        window.location.reload();
        App.init();
      }
    }, 100);

    App.admin = web3.eth.accounts[0];

    App.contracts.CompraToken.deployed().then(function (instance) {
      CompraTokenInstance = instance;
      return CompraTokenInstance.PrecioToken();
    }).then(function (PrecioToken) {
      App.PrecioToken = PrecioToken;
      $('.token-price').html(web3.fromWei(App.PrecioToken, "ether").toNumber());
      return CompraTokenInstance.tokensVendidos();
    }).then(function (tokensVendidos) {
      App.tokensVendidos = tokensVendidos.toNumber();
      $('.tokens-vendidos').html(App.tokensVendidos);
      $('.tokens-disponibles').html(App.tokensDisponibles);

      var progressPercent = (Math.ceil(App.tokensVendidos) / App.tokensDisponibles) * 100;
      $('#progress').css('width', progressPercent + '%');

      // Load token contract
      App.contracts.Token.deployed().then(function (instance) {
        TokenInstance = instance;
        return TokenInstance.balanceOf(App.account);
      }).then(function (balance) {
        $('.dapp-balance').html(balance.toNumber());
        App.loading = false;
      })
    }).then(function () { //esta parte del códgio permite que se 
      //asigne los tokens Disponibles al contrato una vez se cargue y un
      //una única vez impidiendo que se puedan generar tokens al gusto del
      //creador
      App.contracts.Token.deployed().then(function (instance) {
        TokenInstance = instance;
        return App.contracts.CompraToken.deployed();
      }).then(function (instance) {
        CompraTokenInstance = instance;
        return TokenInstance.balanceOf(CompraTokenInstance.address);
      }).then(function (balance) {
        $('.contrato-balance').html(balance.toNumber());
        App.loading = false;
      })
    }).then(function () {
      App.contracts.Token.deployed().then(function (instance) {
        TokenInstance = instance;
        return TokenInstance.Ahorradores(App.account);
      }).then(function (verificar) {
        registrado = verificar[8];
        if (registrado) {
          $("#loader").hide();
          $("#contentOwner").hide();          
          $("#content").hide();
          $("#content0").show();
          $("#content1").show();
          $("#content2").show();
          $("#content3").show();
        } else {
          $("#loader").show();
          $("#contentOwner").show();
          $("#content").show();
          $("#content0").show();
          $("#content1").show();
          $("#content2").show();
          $("#content3").show();
          return TokenInstance.Activo();
        }
      }).then(function (Activo) {
        Estado = Activo;
        $('.estadoContrato').html(Activo.toString());
      })
    })
  },
  crearAhorrador: function () {
    let fecha = (new Date()).getTime();
    let fechaParaSolidity = fecha / 1000;
    let fechaSolidity = parseInt(fechaParaSolidity);
    var name = $("#fname").val();
    var idUsuario = $("#idUsuario").val();
    App.contracts.Token.deployed().then(function (instance) {
      return instance._crearAhorrador(name, idUsuario, fechaSolidity, { from: App.account });
    }).then(function (result) {
      $("#content").show();
      $("#loader").show();
    }).catch(function (err) {
      console.error(err);
    });
  },
  infoAhorrador: function () {
    var htmlahorrador = $("#Ahorrador").empty();
    var persona = {};
    App.contracts.Token.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.Ahorradores(App.account)
        .then(function (ahorrador) {
            persona = {
            direccion: ahorrador[0],
            id: ahorrador[1],
            nombre: ahorrador[2],
            prestamo: ahorrador[3],
            ahorro: ahorrador[4],
            balance: ahorrador[5],
            mes: ahorrador[6],
            puntualidad: ahorrador[7],
          };
          var usuarioTemplate =
            "<tr><th>" + persona.direccion +
            "</td><td>" + persona.id +
            "</td><td>" + persona.nombre +
            "</td><td>" + persona.prestamo +
            "</td><td>" + persona.ahorro +
            "</td><td>" + persona.balance +
            "</td><td>" + persona.mes +
            "</td><td>" + persona.puntualidad +
            "</td></tr>";
          htmlahorrador.append(usuarioTemplate);
        })
      App.contracts.Token.deployed().then(function (instance) {
        infoInstanceFecha = instance;
        return infoInstanceFecha.fechaComienzoAhorro();
      }).then(function (fechaComienzoAhorro) { 
        
        fechaInicioContrato = new Date(fechaComienzoAhorro * 1000);
        fecha1 = new Date(fechaInicioContrato);
        fecha2 = new Date(fechaInicioContrato.setMinutes(fechaInicioContrato.getMinutes() + (2)));
        fecha3 = new Date(fechaInicioContrato.setMinutes(fechaInicioContrato.getMinutes() + (2)));
        fecha4 = new Date(fechaInicioContrato.setMinutes(fechaInicioContrato.getMinutes() + (2)));
        fecha5 = new Date(fechaInicioContrato.setMinutes(fechaInicioContrato.getMinutes() + (2)));
        fecha6 = new Date(fechaInicioContrato.setMinutes(fechaInicioContrato.getMinutes() + (2)));
        fechaRetiroAhorro = new Date(fechaInicioContrato.setMinutes(fechaInicioContrato.getMinutes() + (2)*persona.mes));

        var Fechas = $("#fechasDepositos").empty();
        var fechaPago =
          "<tr><td>Primer Pago</td><td>" + fecha1 + "</td></tr>" +
          "<tr><td>Segundo Pago</td><td>" + fecha2 + "</td></tr>" +
          "<tr><td>Tercero Pago</td><td>" + fecha3 + "</td></tr>" +
          "<tr><td>Cuarto Pago</td><td>" + fecha4 + "</td></tr>" +
          "<tr><td>Quinto Pago</td><td>" + fecha5 + "</td></tr>" +
          "<tr><td>Sexto Pago</td><td>" + fecha6 + "</td></tr>" +
          "<tr><td>Retiro Ahorro</td><td>" + fechaRetiroAhorro + "</td></tr>";
        Fechas.append(fechaPago);
      })
    })
  },

  detenerContrato: function () {   
    App.contracts.Token.deployed().then(function (instance) {
      TokenInstance = instance;
      return App.contracts.CompraToken.deployed();
    }).then(function (instance) {
      CompraTokenInstance = instance;
      return TokenInstance.DetenerContratoToken();
    }).then(function (result) {
      $('form').trigger('reset') 
    }); 
  },
  activarContrato: function () {   
    App.contracts.Token.deployed().then(function (instance) {
      TokenInstance = instance;
      return App.contracts.CompraToken.deployed();
    }).then(function (instance) {
      CompraTokenInstance = instance;      
      return TokenInstance.ActivarContratoToken();
    }).then(function (result) {
      $('form').trigger('reset') 
    
    }); 
  },

  TranferenciaInicialTokens: function () {   
    App.contracts.Token.deployed().then(function (instance) {
      TokenInstance = instance;
      return App.contracts.CompraToken.deployed();
    }).then(function (instance) {
      CompraTokenInstance = instance;
      return TokenInstance.transferInicial(CompraTokenInstance.address, App.tokensDisponibles);
    }).then(function (result) {
      $('form').trigger('reset') 
      
    }); 
  },

  ComprarTokens: function () {
    var numeroTokens = $('#numeroTokens').val();
    App.contracts.CompraToken.deployed().then(function (instance) {
      return instance.compraTokens(numeroTokens, {
        from: App.account,
        value: numeroTokens * App.PrecioToken,
        gas: 500000 
      });
    }).then(function (result) {
      $('form').trigger('reset') 
      
    }); 
  },
  depositarTokens: function () {
    let fecha = (new Date()).getTime();
    let fechaParaSolidity = fecha / 1000;
    let fechaSolidity = parseInt(fechaParaSolidity);
    $('#content').hide();
    $('#loader').hide();
    var contribucion = $('#depositoTokens').val();
    App.contracts.CompraToken.deployed().then(function (instance) {
      return instance.depositoAhorro(contribucion, fechaSolidity);
    }).then(function (result) {
      $('form1').trigger('reset') 
    
    });
  },
  retiroTokens: function () {
    let fecha = (new Date()).getTime();
    let fechaParaSolidity = fecha / 1000;
    let fechaSolidity = parseInt(fechaParaSolidity);
    var prestamo = $('#retiroTokens').val();
    App.contracts.CompraToken.deployed().then(function (instance) {
      return instance.retiroTokens(prestamo, fechaSolidity);
    }).then(function (result) {
      $('form2').trigger('reset') 
      
    });
  },

};

$(function () {
  $(window).load(function () {
    console.log("entrando reinicio")
    App.init();
  });
});