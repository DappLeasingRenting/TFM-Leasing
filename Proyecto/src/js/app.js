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
    $.getJSON("Cliente.json", function (Cliente) {
      App.contracts.Cliente = TruffleContract(Cliente);
      App.contracts.Cliente.setProvider(App.web3Provider);
      App.contracts.Cliente.deployed().then(function (Cliente) {
        App.listenForEvents();
        return App.render();
      });
    });
  },


  // Escuchando a los eventos que se emiten en los contratos
  listenForEvents: function () {
    App.contracts.Cliente.deployed().then(function (instance) {
      instance.nuevoCliente({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function (error, event) {
        console.log("event triggered", event)
        App.render();
      });
    });
    App.contracts.Cliente.deployed().then(function (instance) {
      instance.CostoSeguro({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function (error, event) {
        console.log("event triggered", event)
        App.render();
      });
    });
  },

  render: function () {
    if (App.loading) {
      return;
    }

    App.loading = true;
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
    setInterval(function () {
      if (web3.eth.accounts[0] !== account) {
        account = web3.eth.accounts[0];
        window.location.reload();
        App.init();
      }
    }, 100);

    App.admin = web3.eth.accounts[0];

    $("#loader").show();
    $("#contentOwner").show();
    $("#content").show();
    $("#content0").show();
    $("#content1").show();
    $("#content2").show();
    $("#content3").show();
  },
  /*
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
        
      })
    },/*
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
    },*/
  crearCliente: function () {
    console.log("entrando contrato")
    var name = $("#Nombre").val();
    var edad = $("#Edad").val();
    var idLicencia = $("#Licencia").val();
    var antiguedadLicencia = $("#AntiguedadLicencia").val();
    App.contracts.Cliente.deployed().then(function (instance) {
      return instance.crearCliente(name, edad, idLicencia, antiguedadLicencia, { from: App.account });
    }).then(function (result) {
      $("#content").show();
      $("#loader").show();
    }).catch(function (err) {
      console.error(err);
    });
  },
  infoCliente: function () {
    var htmlclienteDatos = $("#clienteDatos").empty();
    var persona = {};
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.clientes(App.account)
        .then(function (cliente) {
          persona = {
            nombre: cliente[0],
            edad: cliente[1],
            idLicencia: cliente[2],
            AntiguedadLicencia: cliente[3],
            seguro: cliente[4],
            idCoche: cliente[5],
            credito: cliente[6],
            recordCliente: cliente[7],
            leasing: cliente[8],
          };
          var usuarioTemplate =
            "<tr><th>" + persona.nombre +
            "</td><td>" + persona.edad +
            "</td><td>" + persona.seguro +
            "</td></tr>";
          htmlclienteDatos.append(usuarioTemplate);
        })
    })
  },

  infoAsegurador: function () {
    App.costoSeguro();
      var htmlclienteDatosSeguro = $("#clienteDatosSeguro").empty();
      var Datos = {};
      App.contracts.Cliente.deployed().then(function (instance) {
        infoInstance = instance;
        infoInstance.CostSeguro(App.account)
          .then(function (DatosSeguro) {
            ;
            Datos = {
              CostoTotal: DatosSeguro[0],
              KmCiudad: DatosSeguro[1],
              KmCarretera: DatosSeguro[2],
              TiempoAparcado: DatosSeguro[3],
            };
            console.log(DatosSeguro[0]);
            var usuarioTemplate =
              "<tr><th>" + Datos.CostoTotal +
              "</td><td>" + Datos.KmCiudad +
              "</td><td>" + Datos.KmCarretera +
              "</td><td>" + Datos.TiempoAparcado +
              "</td></tr>";
            htmlclienteDatosSeguro.append(usuarioTemplate);
          })
      })
  },

  costoSeguro: function () {
    console.log("entrando CostoSeguro")
     App.contracts.Cliente.deployed().then(function (instance) {
      return instance.costoSeguro()
    }).then(function (result) {
      $("#content").show();
      $("#loader").show();
    }).catch(function (err) {
      console.error(err);
    });
  },

  infoConsultaAsegurador: function () {
    console.log("entrandoConsulta");
    var htmlAparcado = $("#Aparcado").empty();
    var persona = {};
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(0)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          console.log(persona.Precio);
          htmlAparcado.append(usuarioTemplate);
        }).then(function () {
          var htmlCiudad = $("#Ciudad").empty();;
          App.contracts.Cliente.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCiudad(0)
              .then(function (PrecioB) {
                var usuarioTemplate =
                  "<tr><th>" + PrecioB + "</td></tr>";
                htmlCiudad.append(usuarioTemplate);
              }).then(function () {
                var htmlCarretera = $("#Carretera").empty();;
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceA = instance;
                  InstanceA.aseguradoraPrecioCarretera(0)
                    .then(function (PrecioC) {
                      var usuarioTemplate =
                        "<tr><th>" + PrecioC + "</td></tr>";
                      htmlCarretera.append(usuarioTemplate);
                    })
                })
              })
          })
        })
    })
  },


  actualizarPrecioAparcado: function () {
    console.log("entrando contrato")
    var valor = $("#actualizaAparcado").val();
    App.contracts.Cliente.deployed().then(function (instance) {
      return instance.actualizarPrecioAparcado(valor, { from: App.account });
    }).then(function (result) {
      $("#content").show();
      $("#loader").show();
    }).catch(function (err) {
      console.error(err);
    });
  },

  actualizarPrecioCiudad: function () {
    console.log("entrando contrato")
    var valor = $("#actualizaCiudad").val();
    App.contracts.Cliente.deployed().then(function (instance) {
      return instance.actualizarPrecioCiudad(valor, { from: App.account });
    }).then(function (result) {
      $("#content").show();
      $("#loader").show();
    }).catch(function (err) {
      console.error(err);
    });
  },

  actualizarPrecioCarretera: function () {
    console.log("entrando contrato")
    var valor = $("#actualizaCarretera").val();
    App.contracts.Cliente.deployed().then(function (instance) {
      return instance.actualizarPrecioCarretera(valor, { from: App.account });
    }).then(function (result) {
      $("#content").show();
      $("#loader").show();
    }).catch(function (err) {
      console.error(err);
    });
  },

  ZonaAdmin: function() {
      
    App.contracts.Cliente.deployed().then(function (instance) {
    return instance.CheckAdmin.call({ from: App.account });
  }).then(function (result) {
    if (result == true)
    {
      console.log(result);
      window.location.href = "../Admin.html";
    };
  }).catch(function (err) {
    console.error(err);
  });
},

IngresoUsuario: function () {
  console.log("verificando usuario...")
  var IdUsuario = $("#IdUsuario").val();
  var Password = $("#Contraseña").val();
  App.contracts.Cliente.deployed().then(function (instance) {
    return instance.fetchUser({ from: App.account });
  }).then(function (result) {
    if ((result[0] == IdUsuario) && (result[1] == Password))
    {
      console.log("Autenticación realizada con éxito");
    };
  }).catch(function (err) {
    console.error(err);
  });
},
  /*activarContrato: function () {
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
  },*/

};

$(function () {
  $(window).load(function () {
    console.log("entrando reinicio")
    App.init();
  });
});