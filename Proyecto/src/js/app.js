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
        });
      }).done(function () {
        $.getJSON("Cliente.json", function (Cliente) {
          App.contracts.Cliente = TruffleContract(Cliente);
          App.contracts.Cliente.setProvider(App.web3Provider);
          App.contracts.Cliente.deployed().then(function (Cliente) {
            App.listenForEvents();
            return App.render();
          })
        })
      })
    })
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
        console.log(App.account);
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    console.log("pruebacuenta");
    console.log({ from: App.account });

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
    $("#content4").show();
    $("#content5").show();
    $("#content6").show();



    var htmlPrecioPremium = $("#PrecioPremium").empty();
    PrecioPremium = 10;
    var usuarioTemplatePremium =
      "<tr><td>" + PrecioPremium + "</td></tr>";
    htmlPrecioPremium.append(usuarioTemplatePremium);

    var htmlPrecioLuxure = $("#PrecioLuxure").empty();
    PrecioLuxure = 9;
    var usuarioTemplateLuxure =
      "<tr><td>" + PrecioLuxure + "</td></tr>";
    htmlPrecioLuxure.append(usuarioTemplateLuxure);

    var htmlPrecioClassic = $("#PrecioLuxure").empty();
    PrecioClassic = 8;
    var usuarioTemplateClassic =
      "<tr><td>" + PrecioClassic + "</td></tr>";
    htmlPrecioClassic.append(usuarioTemplateClassic);

    var htmlPrecioCorriente = $("#PrecioCorriente").empty();
    PrecioCorriente = 7;
    var usuarioTemplateCorriente =
      "<tr><td>" + PrecioCorriente + "</td></tr>";
    htmlPrecioCorriente.append(usuarioTemplateCorriente);

    var htmlPrecioFurgonetas = $("#PrecioFurgonetas").empty();
    PrecioFurgonetas = 6;
    var usuarioTemplateFurgonetas =
      "<tr><td>" + PrecioFurgonetas + "</td></tr>";
    htmlPrecioFurgonetas.append(usuarioTemplateFurgonetas);








    console.log("carga inicial");
    var htmlAparcado01 = $("#AparcadoAseguradora01").empty();
    var persona = {};
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(01)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          console.log(persona.Precio);
          htmlAparcado01.append(usuarioTemplate);
        }).then(function () {
          var htmlCiudad01 = $("#CiudadAseguradora01").empty();
          App.contracts.Cliente.deployed().then(function (instance) {
            InstanceD = instance;
            InstanceD.aseguradoraPrecioCiudad(01)
              .then(function (PrecioB) {
                var usuarioTemplate =
                  "<tr><td>" + PrecioB + "</td></tr>";
                htmlCiudad01.append(usuarioTemplate);
              }).then(function () {
                var htmlCarretera01 = $("#CarreteraAseguradora01").empty();
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceA = instance;
                  InstanceA.aseguradoraPrecioCarretera(01)
                    .then(function (PrecioC) {
                      var usuarioTemplate =
                        "<tr><td>" + PrecioC + "</td></tr>";
                      htmlCarretera01.append(usuarioTemplate);
                    })
                })
              })
          })
        })
    })

    console.log("carga inicial");
    var htmlAparcado02 = $("#AparcadoAseguradora02").empty();
    var persona = {};
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(02)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          console.log(persona.Precio);
          htmlAparcado02.append(usuarioTemplate);
        }).then(function () {
          var htmlCiudad02 = $("#CiudadAseguradora02").empty();
          App.contracts.Cliente.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCiudad(02)
              .then(function (PrecioB) {
                var usuarioTemplate =
                  "<tr><td>" + PrecioB + "</td></tr>";
                htmlCiudad02.append(usuarioTemplate);
              }).then(function () {
                var htmlCarretera02 = $("#CarreteraAseguradora02").empty();
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceA = instance;
                  InstanceA.aseguradoraPrecioCarretera(02)
                    .then(function (PrecioC) {
                      var usuarioTemplate =
                        "<tr><td>" + PrecioC + "</td></tr>";
                      htmlCarretera02.append(usuarioTemplate);
                    })
                })
              })
          })
        })
    })

    console.log("carga inicial");
    var htmlAparcado03 = $("#AparcadoAseguradora03").empty();
    var persona = {};
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(03)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          console.log(persona.Precio);
          htmlAparcado03.append(usuarioTemplate);
        }).then(function () {
          var htmlCiudad03 = $("#CiudadAseguradora03").empty();
          App.contracts.Cliente.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCiudad(03)
              .then(function (PrecioB) {
                var usuarioTemplate =
                  "<tr><td>" + PrecioB + "</td></tr>";
                htmlCiudad03.append(usuarioTemplate);
              }).then(function () {
                var htmlCarretera03 = $("#CarreteraAseguradora03").empty();
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceA = instance;
                  InstanceA.aseguradoraPrecioCarretera(03)
                    .then(function (PrecioC) {
                      var usuarioTemplate =
                        "<tr><td>" + PrecioC + "</td></tr>";
                      htmlCarretera03.append(usuarioTemplate);
                    })
                })
              })
          })
        })
    })
    console.log("carga inicial");
    var htmlAparcado04 = $("#AparcadoAseguradora04").empty();
    var persona = {};
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(04)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          console.log(persona.Precio);
          htmlAparcado04.append(usuarioTemplate);
        }).then(function () {
          var htmlCiudad04 = $("#CiudadAseguradora04").empty();
          App.contracts.Cliente.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCiudad(04)
              .then(function (PrecioB) {
                var usuarioTemplate =
                  "<tr><td>" + PrecioB + "</td></tr>";
                htmlCiudad04.append(usuarioTemplate);
              }).then(function () {
                var htmlCarretera04 = $("#CarreteraAseguradora04").empty();
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceA = instance;
                  InstanceA.aseguradoraPrecioCarretera(04)
                    .then(function (PrecioC) {
                      var usuarioTemplate =
                        "<tr><td>" + PrecioC + "</td></tr>";
                      htmlCarretera04.append(usuarioTemplate);
                    })
                })
              })
          })
        })
    })
    console.log("carga inicial");
    var htmlAparcado05 = $("#AparcadoAseguradora05").empty();
    var persona = {};
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(05)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          console.log(persona.Precio);
          htmlAparcado05.append(usuarioTemplate);
        }).then(function () {
          var htmlCiudad05 = $("#CiudadAseguradora05").empty();
          App.contracts.Cliente.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCiudad(05)
              .then(function (PrecioB) {
                var usuarioTemplate =
                  "<tr><td>" + PrecioB + "</td></tr>";
                htmlCiudad05.append(usuarioTemplate);
              }).then(function () {
                var htmlCarretera05 = $("#CarreteraAseguradora05").empty();
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceA = instance;
                  InstanceA.aseguradoraPrecioCarretera(05)
                    .then(function (PrecioC) {
                      var usuarioTemplate =
                        "<tr><td>" + PrecioC + "</td></tr>";
                      htmlCarretera05.append(usuarioTemplate);
                    })
                })
              })
          })
        })
    })




    var htmlAparcado11 = $("#AparcadoAseguradora11").empty();
    var persona = {};
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(11)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          console.log(persona.Precio);
          htmlAparcado11.append(usuarioTemplate);
        }).then(function () {
          var htmlCiudad11 = $("#CiudadAseguradora11").empty();
          App.contracts.Cliente.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCiudad(11)
              .then(function (PrecioB) {
                var usuarioTemplate =
                  "<tr><td>" + PrecioB + "</td></tr>";
                htmlCiudad11.append(usuarioTemplate);
              }).then(function () {
                var htmlCarretera11 = $("#CarreteraAseguradora11").empty();
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceA = instance;
                  InstanceA.aseguradoraPrecioCarretera(11)
                    .then(function (PrecioC) {
                      var usuarioTemplate =
                        "<tr><td>" + PrecioC + "</td></tr>";
                      htmlCarretera11.append(usuarioTemplate);
                    })
                })
              })
          })
        })
    })

    var htmlAparcado12 = $("#AparcadoAseguradora12").empty();
    var persona = {};
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(12)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          console.log(persona.Precio);
          htmlAparcado12.append(usuarioTemplate);
        }).then(function () {
          var htmlCiudad12 = $("#CiudadAseguradora12").empty();
          App.contracts.Cliente.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCiudad(12)
              .then(function (PrecioB) {
                var usuarioTemplate =
                  "<tr><td>" + PrecioB + "</td></tr>";
                htmlCiudad12.append(usuarioTemplate);
              }).then(function () {
                var htmlCarretera12 = $("#CarreteraAseguradora12").empty();
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceA = instance;
                  InstanceA.aseguradoraPrecioCarretera(12)
                    .then(function (PrecioC) {
                      var usuarioTemplate =
                        "<tr><td>" + PrecioC + "</td></tr>";
                      htmlCarretera12.append(usuarioTemplate);
                    })
                })
              })
          })
        })
    })

    var htmlAparcado13 = $("#AparcadoAseguradora13").empty();
    var persona = {};
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(13)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          console.log(persona.Precio);
          htmlAparcado13.append(usuarioTemplate);
        }).then(function () {
          var htmlCiudad13 = $("#CiudadAseguradora13").empty();
          App.contracts.Cliente.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCiudad(13)
              .then(function (PrecioB) {
                var usuarioTemplate =
                  "<tr><td>" + PrecioB + "</td></tr>";
                htmlCiudad13.append(usuarioTemplate);
              }).then(function () {
                var htmlCarretera13 = $("#CarreteraAseguradora13").empty();
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceA = instance;
                  InstanceA.aseguradoraPrecioCarretera(13)
                    .then(function (PrecioC) {
                      var usuarioTemplate =
                        "<tr><td>" + PrecioC + "</td></tr>";
                      htmlCarretera13.append(usuarioTemplate);
                    })
                })
              })
          })
        })
    })
    var htmlAparcado14 = $("#AparcadoAseguradora14").empty();
    var persona = {};
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(14)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          console.log(persona.Precio);
          htmlAparcado14.append(usuarioTemplate);
        }).then(function () {
          var htmlCiudad14 = $("#CiudadAseguradora14").empty();
          App.contracts.Cliente.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCiudad(14)
              .then(function (PrecioB) {
                var usuarioTemplate =
                  "<tr><td>" + PrecioB + "</td></tr>";
                htmlCiudad14.append(usuarioTemplate);
              }).then(function () {
                var htmlCarretera14 = $("#CarreteraAseguradora14").empty();
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceA = instance;
                  InstanceA.aseguradoraPrecioCarretera(14)
                    .then(function (PrecioC) {
                      var usuarioTemplate =
                        "<tr><td>" + PrecioC + "</td></tr>";
                      htmlCarretera14.append(usuarioTemplate);
                    })
                })
              })
          })
        })
    })
    var htmlAparcado15 = $("#AparcadoAseguradora15").empty();
    var persona = {};
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(15)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          console.log(persona.Precio);
          htmlAparcado15.append(usuarioTemplate);
        }).then(function () {
          var htmlCiudad15 = $("#CiudadAseguradora15").empty();
          App.contracts.Cliente.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCiudad(15)
              .then(function (PrecioB) {
                var usuarioTemplate =
                  "<tr><td>" + PrecioB + "</td></tr>";
                htmlCiudad15.append(usuarioTemplate);
              }).then(function () {
                var htmlCarretera15 = $("#CarreteraAseguradora15").empty();;
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceA = instance;
                  InstanceA.aseguradoraPrecioCarretera(15)
                    .then(function (PrecioC) {
                      var usuarioTemplate =
                        "<tr><td>" + PrecioC + "</td></tr>";
                      htmlCarretera15.append(usuarioTemplate);
                    })
                })
              })
          })
        })
    })


    var htmlAparcado21 = $("#AparcadoAseguradora21").empty();
    var persona = {};
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(21)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          console.log(persona.Precio);
          htmlAparcado21.append(usuarioTemplate);
        }).then(function () {
          var htmlCiudad21 = $("#CiudadAseguradora21").empty();
          App.contracts.Cliente.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCiudad(21)
              .then(function (PrecioB) {
                var usuarioTemplate =
                  "<tr><td>" + PrecioB + "</td></tr>";
                htmlCiudad21.append(usuarioTemplate);
              }).then(function () {
                var htmlCarretera21 = $("#CarreteraAseguradora21").empty();;
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceA = instance;
                  InstanceA.aseguradoraPrecioCarretera(21)
                    .then(function (PrecioC) {
                      var usuarioTemplate =
                        "<tr><td>" + PrecioC + "</td></tr>";
                      htmlCarretera21.append(usuarioTemplate);
                    })
                })
              })
          })
        })
    })


    var htmlAparcado22 = $("#AparcadoAseguradora22").empty();
    var persona = {};
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(22)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          console.log(persona.Precio);
          htmlAparcado22.append(usuarioTemplate);
        }).then(function () {
          var htmlCiudad22 = $("#CiudadAseguradora22").empty();
          App.contracts.Cliente.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCiudad(22)
              .then(function (PrecioB) {
                var usuarioTemplate =
                  "<tr><td>" + PrecioB + "</td></tr>";
                htmlCiudad22.append(usuarioTemplate);
              }).then(function () {
                var htmlCarretera22 = $("#CarreteraAseguradora22").empty();;
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceA = instance;
                  InstanceA.aseguradoraPrecioCarretera(22)
                    .then(function (PrecioC) {
                      var usuarioTemplate =
                        "<tr><td>" + PrecioC + "</td></tr>";
                      htmlCarretera22.append(usuarioTemplate);
                    })
                })
              })
          })
        })
    })
    var htmlAparcado23 = $("#AparcadoAseguradora23").empty();
    var persona = {};
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(23)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          console.log(persona.Precio);
          htmlAparcado23.append(usuarioTemplate);
        }).then(function () {
          var htmlCiudad23 = $("#CiudadAseguradora23").empty();
          App.contracts.Cliente.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCiudad(23)
              .then(function (PrecioB) {
                var usuarioTemplate =
                  "<tr><td>" + PrecioB + "</td></tr>";
                htmlCiudad23.append(usuarioTemplate);
              }).then(function () {
                var htmlCarretera23 = $("#CarreteraAseguradora23").empty();;
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceA = instance;
                  InstanceA.aseguradoraPrecioCarretera(23)
                    .then(function (PrecioC) {
                      var usuarioTemplate =
                        "<tr><td>" + PrecioC + "</td></tr>";
                      htmlCarretera23.append(usuarioTemplate);
                    })
                })
              })
          })
        })
    })
    var htmlAparcado24 = $("#AparcadoAseguradora24").empty();
    var persona = {};
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(24)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          console.log(persona.Precio);
          htmlAparcado24.append(usuarioTemplate);
        }).then(function () {
          var htmlCiudad24 = $("#CiudadAseguradora24").empty();
          App.contracts.Cliente.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCiudad(24)
              .then(function (PrecioB) {
                var usuarioTemplate =
                  "<tr><td>" + PrecioB + "</td></tr>";
                htmlCiudad24.append(usuarioTemplate);
              }).then(function () {
                var htmlCarretera24 = $("#CarreteraAseguradora24").empty();;
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceA = instance;
                  InstanceA.aseguradoraPrecioCarretera(24)
                    .then(function (PrecioC) {
                      var usuarioTemplate =
                        "<tr><td>" + PrecioC + "</td></tr>";
                      htmlCarretera24.append(usuarioTemplate);
                    })
                })
              })
          })
        })
    })
    var htmlAparcado25 = $("#AparcadoAseguradora25").empty();
    var persona = {};
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(25)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          console.log(persona.Precio);
          htmlAparcado25.append(usuarioTemplate);
        }).then(function () {
          var htmlCiudad25 = $("#CiudadAseguradora25").empty();
          App.contracts.Cliente.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCiudad(25)
              .then(function (PrecioB) {
                var usuarioTemplate =
                  "<tr><td>" + PrecioB + "</td></tr>";
                htmlCiudad25.append(usuarioTemplate);
              }).then(function () {
                var htmlCarretera25 = $("#CarreteraAseguradora25").empty();;
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceA = instance;
                  InstanceA.aseguradoraPrecioCarretera(25)
                    .then(function (PrecioC) {
                      var usuarioTemplate =
                        "<tr><td>" + PrecioC + "</td></tr>";
                      htmlCarretera25.append(usuarioTemplate);
                    })
                })
              })
          })
        })
    })

    



    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          console.log(DatosCliente[4]);
          record = (DatosCliente[4] / 10);
          var htmlAparcado01 = $("#ClienteAparcadoAseguradora01").empty();
          App.contracts.Cliente.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(01)
              .then(function (PrecioA) {                
                var PrecioClienteA = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA + "</td></tr>";
                  ClienteAparcadoAseguradora01 = PrecioClienteA;
                console.log(persona.Precio);
                htmlAparcado01.append(usuarioTemplate);
              }).then(function () {
                var htmlCiudad01 = $("#ClienteCiudadAseguradora01").empty();;
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceD = instance;
                  InstanceD.aseguradoraPrecioCiudad(01)
                    .then(function (PrecioB) {
                      var PrecioClienteB = Math.round(PrecioB / record);
                      var usuarioTemplate =
                        "<tr><td>" + PrecioClienteB + "</td></tr>";
                      htmlCiudad01.append(usuarioTemplate);
                    }).then(function () {
                      var htmlCarretera01 = $("#ClienteCarreteraAseguradora01").empty();;
                      App.contracts.Cliente.deployed().then(function (instance) {
                        InstanceA = instance;
                        InstanceA.aseguradoraPrecioCarretera(01)
                          .then(function (PrecioC) {
                            var PrecioClienteC = Math.round(PrecioC / record);
                            var usuarioTemplate =
                              "<tr><td>" + PrecioClienteC + "</td></tr>";
                            htmlCarretera01.append(usuarioTemplate);
                          })
                      })
                    })
                })
              })
          })
        })
    })
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          console.log(DatosCliente[4]);
          record = (DatosCliente[4] / 10);
          var htmlAparcado01 = $("#ClienteAparcadoAseguradora02").empty();
          App.contracts.Cliente.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(02)
              .then(function (PrecioA) {
                var PrecioClienteA = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA + "</td></tr>";
                console.log(persona.Precio);
                htmlAparcado01.append(usuarioTemplate);
              }).then(function () {
                var htmlCiudad01 = $("#ClienteCiudadAseguradora02").empty();;
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceD = instance;
                  InstanceD.aseguradoraPrecioCiudad(02)
                    .then(function (PrecioB) {
                      var PrecioClienteB = Math.round(PrecioB / record);
                      var usuarioTemplate =
                        "<tr><td>" + PrecioClienteB + "</td></tr>";
                      htmlCiudad01.append(usuarioTemplate);
                    }).then(function () {
                      var htmlCarretera01 = $("#ClienteCarreteraAseguradora02").empty();;
                      App.contracts.Cliente.deployed().then(function (instance) {
                        InstanceA = instance;
                        InstanceA.aseguradoraPrecioCarretera(02)
                          .then(function (PrecioC) {
                            var PrecioClienteC = Math.round(PrecioC / record);
                            var usuarioTemplate =
                              "<tr><td>" + PrecioClienteC + "</td></tr>";
                            htmlCarretera01.append(usuarioTemplate);
                          })
                      })
                    })
                })
              })
          })
        })
    })
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          console.log(DatosCliente[4]);
          record = (DatosCliente[4] / 10);
          var htmlAparcado01 = $("#ClienteAparcadoAseguradora03").empty();
          var persona = {};
          App.contracts.Cliente.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(03)
              .then(function (PrecioA) {
                var PrecioClienteA = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA + "</td></tr>";
                console.log(persona.Precio);
                htmlAparcado01.append(usuarioTemplate);
              }).then(function () {
                var htmlCiudad01 = $("#ClienteCiudadAseguradora03").empty();;
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceD = instance;
                  InstanceD.aseguradoraPrecioCiudad(03)
                    .then(function (PrecioB) {
                      var PrecioClienteB = Math.round(PrecioB / record);
                      var usuarioTemplate =
                        "<tr><td>" + PrecioClienteB + "</td></tr>";
                      htmlCiudad01.append(usuarioTemplate);
                    }).then(function () {
                      var htmlCarretera01 = $("#ClienteCarreteraAseguradora03").empty();;
                      App.contracts.Cliente.deployed().then(function (instance) {
                        InstanceA = instance;
                        InstanceA.aseguradoraPrecioCarretera(03)
                          .then(function (PrecioC) {
                            var PrecioClienteC = Math.round(PrecioC / record);
                            var usuarioTemplate =
                              "<tr><td>" + PrecioClienteC + "</td></tr>";
                            htmlCarretera01.append(usuarioTemplate);
                          })
                      })
                    })
                })
              })
          })
        })
    })
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          console.log(DatosCliente[4]);
          record = (DatosCliente[4] / 10);
          var htmlAparcado01 = $("#ClienteAparcadoAseguradora04").empty();
          var persona = {};
          App.contracts.Cliente.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(04)
              .then(function (PrecioA) {
                var PrecioClienteA = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA + "</td></tr>";
                console.log(persona.Precio);
                htmlAparcado01.append(usuarioTemplate);
              }).then(function () {
                var htmlCiudad01 = $("#ClienteCiudadAseguradora04").empty();;
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceD = instance;
                  InstanceD.aseguradoraPrecioCiudad(04)
                    .then(function (PrecioB) {
                      var PrecioClienteB = Math.round(PrecioB / record);
                      var usuarioTemplate =
                        "<tr><td>" + PrecioClienteB + "</td></tr>";
                      htmlCiudad01.append(usuarioTemplate);
                    }).then(function () {
                      var htmlCarretera01 = $("#ClienteCarreteraAseguradora04").empty();;
                      App.contracts.Cliente.deployed().then(function (instance) {
                        InstanceA = instance;
                        InstanceA.aseguradoraPrecioCarretera(04)
                          .then(function (PrecioC) {
                            var PrecioClienteC = Math.round(PrecioC / record);
                            var usuarioTemplate =
                              "<tr><td>" + PrecioClienteC + "</td></tr>";
                            htmlCarretera01.append(usuarioTemplate);
                          })
                      })
                    })
                })
              })
          })
        })
    })
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          console.log(DatosCliente[4]);
          record = (DatosCliente[4] / 10);
          var htmlAparcado01 = $("#ClienteAparcadoAseguradora05").empty();
          var persona = {};
          App.contracts.Cliente.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(05)
              .then(function (PrecioA) {
                var PrecioClienteA = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA + "</td></tr>";
                console.log(persona.Precio);
                htmlAparcado01.append(usuarioTemplate);
              }).then(function () {
                var htmlCiudad01 = $("#ClienteCiudadAseguradora05").empty();;
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceD = instance;
                  InstanceD.aseguradoraPrecioCiudad(05)
                    .then(function (PrecioB) {
                      var PrecioClienteB = Math.round(PrecioB / record);
                      var usuarioTemplate =
                        "<tr><td>" + PrecioClienteB + "</td></tr>";
                      htmlCiudad01.append(usuarioTemplate);
                    }).then(function () {
                      var htmlCarretera01 = $("#ClienteCarreteraAseguradora05").empty();;
                      App.contracts.Cliente.deployed().then(function (instance) {
                        InstanceA = instance;
                        InstanceA.aseguradoraPrecioCarretera(05)
                          .then(function (PrecioC) {
                            var PrecioClienteC = Math.round(PrecioC / record);
                            var usuarioTemplate =
                              "<tr><td>" + PrecioClienteC + "</td></tr>";
                            htmlCarretera01.append(usuarioTemplate);
                          })
                      })
                    })
                })
              })
          })
        })
    })

    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          console.log(DatosCliente[4]);
          record = (DatosCliente[4] / 10);
          var htmlAparcado01 = $("#ClienteAparcadoAseguradora11").empty();
          var persona = {};
          App.contracts.Cliente.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(11)
              .then(function (PrecioA) {
                var PrecioClienteA = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA + "</td></tr>";
                console.log(persona.Precio);
                htmlAparcado01.append(usuarioTemplate);
              }).then(function () {
                var htmlCiudad01 = $("#ClienteCiudadAseguradora11").empty();;
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceD = instance;
                  InstanceD.aseguradoraPrecioCiudad(11)
                    .then(function (PrecioB) {
                      var PrecioClienteB = Math.round(PrecioB / record);
                      var usuarioTemplate =
                        "<tr><td>" + PrecioClienteB + "</td></tr>";
                      htmlCiudad01.append(usuarioTemplate);
                    }).then(function () {
                      var htmlCarretera01 = $("#ClienteCarreteraAseguradora11").empty();;
                      App.contracts.Cliente.deployed().then(function (instance) {
                        InstanceA = instance;
                        InstanceA.aseguradoraPrecioCarretera(11)
                          .then(function (PrecioC) {
                            var PrecioClienteC = Math.round(PrecioC / record);
                            var usuarioTemplate =
                              "<tr><td>" + PrecioClienteC + "</td></tr>";
                            htmlCarretera01.append(usuarioTemplate);
                          })
                      })
                    })
                })
              })
          })
        })
    })
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          console.log(DatosCliente[4]);
          record = (DatosCliente[4] / 10);
          var htmlAparcado01 = $("#ClienteAparcadoAseguradora12").empty();
          var persona = {};
          App.contracts.Cliente.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(12)
              .then(function (PrecioA) {
                var PrecioClienteA = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA + "</td></tr>";
                console.log(persona.Precio);
                htmlAparcado01.append(usuarioTemplate);
              }).then(function () {
                var htmlCiudad01 = $("#ClienteCiudadAseguradora12").empty();;
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceD = instance;
                  InstanceD.aseguradoraPrecioCiudad(12)
                    .then(function (PrecioB) {
                      var PrecioClienteB = Math.round(PrecioB / record);
                      var usuarioTemplate =
                        "<tr><td>" + PrecioClienteB + "</td></tr>";
                      htmlCiudad01.append(usuarioTemplate);
                    }).then(function () {
                      var htmlCarretera01 = $("#ClienteCarreteraAseguradora12").empty();;
                      App.contracts.Cliente.deployed().then(function (instance) {
                        InstanceA = instance;
                        InstanceA.aseguradoraPrecioCarretera(12)
                          .then(function (PrecioC) {
                            var PrecioClienteC = Math.round(PrecioC / record);
                            var usuarioTemplate =
                              "<tr><td>" + PrecioClienteC + "</td></tr>";
                            htmlCarretera01.append(usuarioTemplate);
                          })
                      })
                    })
                })
              })
          })
        })
    })
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          console.log(DatosCliente[4]);
          record = (DatosCliente[4] / 10);
          var htmlAparcado01 = $("#ClienteAparcadoAseguradora13").empty();
          var persona = {};
          App.contracts.Cliente.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(13)
              .then(function (PrecioA) {
                var PrecioClienteA = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA + "</td></tr>";
                console.log(persona.Precio);
                htmlAparcado01.append(usuarioTemplate);
              }).then(function () {
                var htmlCiudad01 = $("#ClienteCiudadAseguradora13").empty();;
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceD = instance;
                  InstanceD.aseguradoraPrecioCiudad(13)
                    .then(function (PrecioB) {
                      var PrecioClienteB = Math.round(PrecioB / record);
                      var usuarioTemplate =
                        "<tr><td>" + PrecioClienteB + "</td></tr>";
                      htmlCiudad01.append(usuarioTemplate);
                    }).then(function () {
                      var htmlCarretera01 = $("#ClienteCarreteraAseguradora13").empty();;
                      App.contracts.Cliente.deployed().then(function (instance) {
                        InstanceA = instance;
                        InstanceA.aseguradoraPrecioCarretera(13)
                          .then(function (PrecioC) {
                            var PrecioClienteC = Math.round(PrecioC / record);
                            var usuarioTemplate =
                              "<tr><td>" + PrecioClienteC + "</td></tr>";
                            htmlCarretera01.append(usuarioTemplate);
                          })
                      })
                    })
                })
              })
          })
        })
    })

    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          console.log(DatosCliente[4]);
          record = (DatosCliente[4] / 10);
          var htmlAparcado01 = $("#ClienteAparcadoAseguradora14").empty();
          var persona = {};
          App.contracts.Cliente.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(14)
              .then(function (PrecioA) {
                var PrecioClienteA = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA + "</td></tr>";
                console.log(persona.Precio);
                htmlAparcado01.append(usuarioTemplate);
              }).then(function () {
                var htmlCiudad01 = $("#ClienteCiudadAseguradora14").empty();;
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceD = instance;
                  InstanceD.aseguradoraPrecioCiudad(14)
                    .then(function (PrecioB) {
                      var PrecioClienteB = Math.round(PrecioB / record);
                      var usuarioTemplate =
                        "<tr><td>" + PrecioClienteB + "</td></tr>";
                      htmlCiudad01.append(usuarioTemplate);
                    }).then(function () {
                      var htmlCarretera01 = $("#ClienteCarreteraAseguradora14").empty();;
                      App.contracts.Cliente.deployed().then(function (instance) {
                        InstanceA = instance;
                        InstanceA.aseguradoraPrecioCarretera(14)
                          .then(function (PrecioC) {
                            var PrecioClienteC = Math.round(PrecioC / record);
                            var usuarioTemplate =
                              "<tr><td>" + PrecioClienteC + "</td></tr>";
                            htmlCarretera01.append(usuarioTemplate);
                          })
                      })
                    })
                })
              })
          })
        })
    })

    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          console.log(DatosCliente[4]);
          record = (DatosCliente[4] / 10);
          var htmlAparcado01 = $("#ClienteAparcadoAseguradora15").empty();
          var persona = {};
          App.contracts.Cliente.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(15)
              .then(function (PrecioA) {
                var PrecioClienteA = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA + "</td></tr>";
                console.log(persona.Precio);
                htmlAparcado01.append(usuarioTemplate);
              }).then(function () {
                var htmlCiudad01 = $("#ClienteCiudadAseguradora15").empty();;
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceD = instance;
                  InstanceD.aseguradoraPrecioCiudad(15)
                    .then(function (PrecioB) {
                      var PrecioClienteB = Math.round(PrecioB / record);
                      var usuarioTemplate =
                        "<tr><td>" + PrecioClienteB + "</td></tr>";
                      htmlCiudad01.append(usuarioTemplate);
                    }).then(function () {
                      var htmlCarretera01 = $("#ClienteCarreteraAseguradora15").empty();;
                      App.contracts.Cliente.deployed().then(function (instance) {
                        InstanceA = instance;
                        InstanceA.aseguradoraPrecioCarretera(15)
                          .then(function (PrecioC) {
                            var PrecioClienteC = Math.round(PrecioC / record);
                            var usuarioTemplate =
                              "<tr><td>" + PrecioClienteC + "</td></tr>";
                            htmlCarretera01.append(usuarioTemplate);
                          })
                      })
                    })
                })
              })
          })
        })
    })

    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          console.log(DatosCliente[4]);
          record = (DatosCliente[4] / 10);
          var htmlAparcado01 = $("#ClienteAparcadoAseguradora21").empty();
          var persona = {};
          App.contracts.Cliente.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(21)
              .then(function (PrecioA) {
                var PrecioClienteA = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA + "</td></tr>";
                console.log(persona.Precio);
                htmlAparcado01.append(usuarioTemplate);
              }).then(function () {
                var htmlCiudad01 = $("#ClienteCiudadAseguradora21").empty();;
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceD = instance;
                  InstanceD.aseguradoraPrecioCiudad(21)
                    .then(function (PrecioB) {
                      var PrecioClienteB = Math.round(PrecioB / record);
                      var usuarioTemplate =
                        "<tr><td>" + PrecioClienteB + "</td></tr>";
                      htmlCiudad01.append(usuarioTemplate);
                    }).then(function () {
                      var htmlCarretera01 = $("#ClienteCarreteraAseguradora21").empty();;
                      App.contracts.Cliente.deployed().then(function (instance) {
                        InstanceA = instance;
                        InstanceA.aseguradoraPrecioCarretera(21)
                          .then(function (PrecioC) {
                            var PrecioClienteC = Math.round(PrecioC / record);
                            var usuarioTemplate =
                              "<tr><td>" + PrecioClienteC + "</td></tr>";
                            htmlCarretera01.append(usuarioTemplate);
                          })
                      })
                    })
                })
              })
          })
        })
    })

    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          console.log(DatosCliente[4]);
          record = (DatosCliente[4] / 10);
          var htmlAparcado01 = $("#ClienteAparcadoAseguradora22").empty();
          var persona = {};
          App.contracts.Cliente.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(22)
              .then(function (PrecioA) {
                var PrecioClienteA = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA + "</td></tr>";
                console.log(persona.Precio);
                htmlAparcado01.append(usuarioTemplate);
              }).then(function () {
                var htmlCiudad01 = $("#ClienteCiudadAseguradora22").empty();;
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceD = instance;
                  InstanceD.aseguradoraPrecioCiudad(22)
                    .then(function (PrecioB) {
                      var PrecioClienteB = Math.round(PrecioB / record);
                      var usuarioTemplate =
                        "<tr><td>" + PrecioClienteB + "</td></tr>";
                      htmlCiudad01.append(usuarioTemplate);
                    }).then(function () {
                      var htmlCarretera01 = $("#ClienteCarreteraAseguradora22").empty();;
                      App.contracts.Cliente.deployed().then(function (instance) {
                        InstanceA = instance;
                        InstanceA.aseguradoraPrecioCarretera(22)
                          .then(function (PrecioC) {
                            var PrecioClienteC = Math.round(PrecioC / record);
                            var usuarioTemplate =
                              "<tr><td>" + PrecioClienteC + "</td></tr>";
                            htmlCarretera01.append(usuarioTemplate);
                          })
                      })
                    })
                })
              })
          })
        })
    })
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          console.log(DatosCliente[4]);
          record = (DatosCliente[4] / 10);
          var htmlAparcado01 = $("#ClienteAparcadoAseguradora23").empty();
          var persona = {};
          App.contracts.Cliente.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(23)
              .then(function (PrecioA) {
                var PrecioClienteA = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA + "</td></tr>";
                console.log(persona.Precio);
                htmlAparcado01.append(usuarioTemplate);
              }).then(function () {
                var htmlCiudad01 = $("#ClienteCiudadAseguradora23").empty();;
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceD = instance;
                  InstanceD.aseguradoraPrecioCiudad(23)
                    .then(function (PrecioB) {
                      var PrecioClienteB = Math.round(PrecioB / record);
                      var usuarioTemplate =
                        "<tr><td>" + PrecioClienteB + "</td></tr>";
                      htmlCiudad01.append(usuarioTemplate);
                    }).then(function () {
                      var htmlCarretera01 = $("#ClienteCarreteraAseguradora23").empty();;
                      App.contracts.Cliente.deployed().then(function (instance) {
                        InstanceA = instance;
                        InstanceA.aseguradoraPrecioCarretera(23)
                          .then(function (PrecioC) {
                            var PrecioClienteC = Math.round(PrecioC / record);
                            var usuarioTemplate =
                              "<tr><td>" + PrecioClienteC + "</td></tr>";
                            htmlCarretera01.append(usuarioTemplate);
                          })
                      })
                    })
                })
              })
          })
        })
    })
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          console.log(DatosCliente[4]);
          record = (DatosCliente[4] / 10);
          var htmlAparcado01 = $("#ClienteAparcadoAseguradora24").empty();

          App.contracts.Cliente.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(24)
              .then(function (PrecioA) {
                var PrecioClienteA = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA + "</td></tr>";

                htmlAparcado01.append(usuarioTemplate);
              }).then(function () {
                var htmlCiudad01 = $("#ClienteCiudadAseguradora24").empty();;
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceD = instance;
                  InstanceD.aseguradoraPrecioCiudad(24)
                    .then(function (PrecioB) {
                      var PrecioClienteB = Math.round(PrecioB / record);
                      var usuarioTemplate =
                        "<tr><td>" + PrecioClienteB + "</td></tr>";
                      htmlCiudad01.append(usuarioTemplate);
                    }).then(function () {
                      var htmlCarretera01 = $("#ClienteCarreteraAseguradora24").empty();;
                      App.contracts.Cliente.deployed().then(function (instance) {
                        InstanceA = instance;
                        InstanceA.aseguradoraPrecioCarretera(24)
                          .then(function (PrecioC) {
                            var PrecioClienteC = Math.round(PrecioC / record);
                            var usuarioTemplate =
                              "<tr><td>" + PrecioClienteC + "</td></tr>";
                            htmlCarretera01.append(usuarioTemplate);
                          })
                      })
                    })
                })
              })
          })
        })
    })
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {

          record = (DatosCliente[4] / 10);
          var htmlAparcado01 = $("#ClienteAparcadoAseguradora25").empty();
          App.contracts.Cliente.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(25)
              .then(function (PrecioA) {
                var PrecioClienteA = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA + "</td></tr>";

                htmlAparcado01.append(usuarioTemplate);
              }).then(function () {
                var htmlCiudad01 = $("#ClienteCiudadAseguradora25").empty();;
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceD = instance;
                  InstanceD.aseguradoraPrecioCiudad(25)
                    .then(function (PrecioB) {
                      var PrecioClienteB = Math.round(PrecioB / record);
                      var usuarioTemplate =
                        "<tr><td>" + PrecioClienteB + "</td></tr>";
                      htmlCiudad01.append(usuarioTemplate);
                    }).then(function () {
                      var htmlCarretera01 = $("#ClienteCarreteraAseguradora25").empty();;
                      App.contracts.Cliente.deployed().then(function (instance) {
                        InstanceA = instance;
                        InstanceA.aseguradoraPrecioCarretera(25)
                          .then(function (PrecioC) {
                            var PrecioClienteC = Math.round(PrecioC / record);
                            var usuarioTemplate =
                              "<tr><td>" + PrecioClienteC + "</td></tr>";
                            htmlCarretera01.append(usuarioTemplate);
                          })
                      })
                    })
                })
              })
          })
        })
    })




    var htmlclienteDatosSeguro = $("#clienteDatosSeguro").empty();
    var Datos = {};
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      console.log(App.account + 'Hola');
      infoInstance.users(App.account)
        .then(function (DatosSeguro) {
          console.log(DatosSeguro[0]);
          Datos = {
            CostoTotal: DatosSeguro[0],
            KmCiudad: DatosSeguro[1],
            KmCarretera: DatosSeguro[4],
            TiempoAparcado: DatosSeguro[4],
          };

          var usuarioTemplate =
            "<tr><th>" + Datos.CostoTotal +
            "</td><td>" + Datos.KmCiudad +
            "</td><td>" + Datos.KmCarretera +
            "</td><td>" + Datos.TiempoAparcado +
            "</td></tr>";
          htmlclienteDatosSeguro.append(usuarioTemplate);
        })
    })

    var htmlclienteDatos1 = $("#clienteDatos1").empty();
    var persona = {};
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.Aleatorio(App.account)
        .then(function (cliente) {
          persona = {
            nombre: cliente[0],
            /*edad: cliente[1],
            idLicencia: cliente[2],
            AntiguedadLicencia: cliente[3],
            seguro: cliente[4],
            idCoche: cliente[5],
            credito: cliente[6],
            recordCliente: cliente[7],
            leasing: cliente[8],*/
          };
          var usuarioTemplate =
            "<tr><th>" + persona.nombre +
            "</td><td>" + persona.nombre +
            "</td><td>" + persona.nombre +
            "</td></tr>";
          htmlclienteDatos1.append(usuarioTemplate);
        })
    })

    App.contracts.Token.deployed().then(function (instance) {
      TokenInstance = instance;
      return App.contracts.CompraToken.deployed();
    }).then(function (instance) {
      CompraTokenInstance = instance;
      return TokenInstance.balanceOf(CompraTokenInstance.address);
    }).then(function (balance) {
      BalanceContrato = balance.toNumber();
      App.loading = false;
    }).then(function () {
      return CompraTokenInstance.PrecioToken();
    }).then(function (PrecioToken) {
      App.PrecioToken = PrecioToken;
      $('.token-price').html(web3.fromWei(App.PrecioToken, "ether").toNumber());
      return CompraTokenInstance.tokensVendidos();
    }).then(function (tokensVendidos) {
      App.tokensVendidos = tokensVendidos.toNumber();
      $('.tokens-vendidos').html(App.tokensVendidos);
      $('.tokens-disponibles').html(BalanceContrato);

      var progressPercent = (Math.ceil(App.tokensVendidos) / BalanceContrato) * 100;
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
  },
  /*
      App.contracts.CompraToken.deployed().then(function (instance) {
        CompraTokenInstance = instance;
        return CompraTokenInstance.PrecioToken());
      }).then(function (PrecioToken) {)
        App.PrecioToken = PrecioToken;)
        $('.token-price').html(web3.fromWei(App.)PrecioToken, "ether").toNumber());
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
        }))
      }).t)gio permite que se 
        //)ato una vez se cargue y un
        //) generar tokens al gusto del
        //)
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
          $('.estadoContrato').html(ActApp.contracts.CompraToken.deployed().then(function (instance) {
      CompraTokenInstance = instance;
      return CompraTokenInstance.PrecioToken();
    }).then(function (PrecioToken) {
      App.PrecioToken = PrecioToken;
      $('.token-price').html(web3.fromWei(App.PrecioToken, "ether").toNumber());ivo.toString());
        })
      })
    },*/
  recordCliente: function () {

    var IdUsuario = $("#IdUsuarioAlta").val();
    var TypeUserString = 1;
    var antiguedadLicencia = $("#AntiguedadLicenciaAlta").val();
    var DNI = $("#DNI").val();
    var VATNumber = 'N/A';
    //var name = $("#Nombre").val();
    //var edad = $("#Edad").val();
    //var idLicencia = $("#Licencia").val();
    App.contracts.Cliente.deployed().then(function (instance) {
      return instance.crearCliente(IdUsuario, TypeUserString, DNI, VATNumber, antiguedadLicencia, { from: App.account });
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
      infoInstance.users(App.account)
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
    var htmlAparcado = $("#AparcadoAseguradora01").empty();
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(01)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          console.log(persona.Precio);
          htmlAparcado.append(usuarioTemplate);
        }).then(function () {
          var htmlCiudad = $("#CiudadAseguradora01").empty();;
          App.contracts.Cliente.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCiudad(01)
              .then(function (PrecioB) {
                var usuarioTemplate =
                  "<tr><th>" + PrecioB + "</td></tr>";
                htmlCiudad.append(usuarioTemplate);
              }).then(function () {
                var htmlCarretera = $("#CarreteraAseguradora01").empty();;
                App.contracts.Cliente.deployed().then(function (instance) {
                  InstanceA = instance;
                  InstanceA.aseguradoraPrecioCarretera(01)
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


  actualizarPrecioAparcado: function (a, b) {
    console.log("entrando precio aparcado");
    console.log(a);
    console.log(b);
    switch (a) {
      case 0:
        {
          console.log("entrando empresa 0");
          switch (b) {
            case 1:
              {
                console.log("entrando empresa Premium")
                var id = 01;
                var valor = $("#actualizaAparcado01").val();
              }
              break;
            case 2:
              {
                console.log("entrando empresa Luxure")
                var id = 02;
                var valor = $("#actualizaAparcado02").val();
              }
              break;
            case 3:
              {
                console.log("entrando empresa Classic")
                var id = 03;
                var valor = $("#actualizaAparcado03").val();

              }
              break;
            case 4:
              {
                console.log("entrando empresa Corriente")
                var id = 04;
                var valor = $("#actualizaAparcado04").val();
              }
              break;
            case 5:
              {
                console.log("entrando empresa Furgoneta")
                var id = 05;
                var valor = $("#actualizaAparcado05").val();
              }
              break;

          }
        }
        break;

      case 1:
        {
          console.log("entrando empresa 1");
          switch (b) {
            case 1:
              {
                console.log("entrando empresa Premium")
                var id = 11;
                var valor = $("#actualizaAparcado11").val();

              }
              break;
            case 2:
              {
                console.log("entrando empresa Luxure")
                var id = 12;
                var valor = $("#actualizaAparcado12").val();

              }
              break;
            case 3:
              {
                console.log("entrando empresa Classic")
                var id = 13;
                var valor = $("#actualizaAparcado13").val();

              }
              break;
            case 4:
              {
                console.log("entrando empresa Corriente")
                var id = 14;
                var valor = $("#actualizaAparcado14").val();

              }
              break;
            case 5:
              {
                console.log("entrando empresa Furgoneta")
                var id = 15;
                var valor = $("#actualizaAparcado15").val();

              }
              break;

          }

        }
        break;
      case 2:
        {
          console.log("entrando empresa 2");
          switch (b) {
            case 1:
              {
                console.log("entrando empresa Premium")
                var id = 21;
                var valor = $("#actualizaAparcado21").val();
              }
              break;
            case 2:
              {
                console.log("entrando empresa Luxure")
                var id = 22;
                var valor = $("#actualizaAparcado22").val();
              }
              break;
            case 3:
              {
                console.log("entrando empresa Classic")
                var id = 23;
                var valor = $("#actualizaAparcado23").val();
              }
              break;
            case 4:
              {
                console.log("entrando empresa Corriente")
                var id = 24;
                var valor = $("#actualizaAparcado24").val();
              }
              break;
            case 5:
              {
                console.log("entrando empresa Furgoneta")
                var id = 25;
                var valor = $("#actualizaAparcado25").val();
              }
              break;
          }
          break;
        }


    }


    App.contracts.Cliente.deployed().then(function (instance) {
      return instance.actualizarPrecioAparcado(id, valor, { from: App.account });
    }).then(function (result) {
    }).catch(function (err) {
      console.error(err);
    });
  },


  actualizarPrecioCiudad: function (a, b) {

    console.log("entrando precio Ciudad");
    console.log(a);
    console.log(b);
    switch (a) {
      case 0:
        {
          console.log("entrando empresa 0");
          switch (b) {
            case 1:
              {
                console.log("entrando empresa Premium")
                var id = 01;
                var valor = $("#actualizaCiudad01").val();
              }
              break;
            case 2:
              {
                console.log("entrando empresa Luxure")
                var id = 02;
                var valor = $("#actualizaCiudad02").val();
              }
              break;
            case 3:
              {
                console.log("entrando empresa Classic")
                var id = 03;
                var valor = $("#actualizaCiudad03").val();

              }
              break;
            case 4:
              {
                console.log("entrando empresa Corriente")
                var id = 04;
                var valor = $("#actualizaCiudad04").val();
              }
              break;
            case 5:
              {
                console.log("entrando empresa Furgoneta")
                var id = 05;
                var valor = $("#actualizaCiudad05").val();
              }

          }
        }
        break;

      case 1:
        {
          console.log("entrando empresa 1");
          switch (b) {
            case 1:
              {
                console.log("entrando empresa Premium")
                var id = 11;
                var valor = $("#actualizaCiudad11").val();

              }
              break;
            case 2:
              {
                console.log("entrando empresa Luxure")
                var id = 12;
                var valor = $("#actualizaCiudad12").val();

              }
              break;
            case 3:
              {
                console.log("entrando empresa Classic")
                var id = 13;
                var valor = $("#actualizaCiudad13").val();

              }
              break;
            case 4:
              {
                console.log("entrando empresa Corriente")
                var id = 14;
                var valor = $("#actualizaCiudad14").val();

              }
              break;
            case 5:
              {
                console.log("entrando empresa Furgoneta")
                var id = 15;
                var valor = $("#actualizaCiudad15").val();

              }

          }

        }
        break;
      case 2:
        {
          console.log("entrando empresa 2");
          switch (b) {
            case 1:
              {
                console.log("entrando empresa Premium")
                var id = 21;
                var valor = $("#actualizaCiudad21").val();
              }
              break;
            case 2:
              {
                console.log("entrando empresa Luxure")
                var id = 22;
                var valor = $("#actualizaCiudad22").val();
              }
              break;
            case 3:
              {
                console.log("entrando empresa Classic")
                var id = 23;
                var valor = $("#actualizaCiudad23").val();
              }
              break;
            case 4:
              {
                console.log("entrando empresa Corriente")
                var id = 24;
                var valor = $("#actualizaCiudad24").val();
              }
              break;
            case 5:
              {
                console.log("entrando empresa Furgoneta")
                var id = 25;
                var valor = $("#actualizaCiudad25").val();
              }
          }
          break;
        }


    }


    App.contracts.Cliente.deployed().then(function (instance) {
      return instance.actualizarPrecioCiudad(id, valor, { from: App.account });
    }).then(function (result) {
      $("#content").show();
      $("#loader").show();
    }).catch(function (err) {
      console.error(err);
    });
  },

  actualizarPrecioCarretera: function (a, b) {

    console.log("entrando precio Carretera");
    console.log(a);
    console.log(b);
    switch (a) {
      case 0:
        {
          console.log("entrando empresa 0");
          switch (b) {
            case 1:
              {
                console.log("entrando empresa Premium")
                var id = 01;
                var valor = $("#actualizaCarretera01").val();
              }
              break;
            case 2:
              {
                console.log("entrando empresa Luxure")
                var id = 02;
                var valor = $("#actualizaCarretera02").val();
              }
              break;
            case 3:
              {
                console.log("entrando empresa Classic")
                var id = 03;
                var valor = $("#actualizaCarretera03").val();

              }
              break;
            case 4:
              {
                console.log("entrando empresa Corriente")
                var id = 04;
                var valor = $("#actualizaCarretera04").val();
              }
              break;
            case 5:
              {
                console.log("entrando empresa Furgoneta")
                var id = 05;
                var valor = $("#actualizaCarretera05").val();
              }

          }
        }
        break;

      case 1:
        {
          console.log("entrando empresa 1");
          switch (b) {
            case 1:
              {
                console.log("entrando empresa Premium")
                var id = 11;
                var valor = $("#actualizaCarretera11").val();

              }
              break;
            case 2:
              {
                console.log("entrando empresa Luxure")
                var id = 12;
                var valor = $("#actualizaCarretera12").val();

              }
              break;
            case 3:
              {
                console.log("entrando empresa Classic")
                var id = 13;
                var valor = $("#actualizaCarretera13").val();

              }
              break;
            case 4:
              {
                console.log("entrando empresa Corriente")
                var id = 14;
                var valor = $("#actualizaCarretera14").val();

              }
              break;
            case 5:
              {
                console.log("entrando empresa Furgoneta")
                var id = 15;
                var valor = $("#actualizaCarretera15").val();

              }

          }

        }
        break;
      case 2:
        {
          console.log("entrando empresa 2");
          switch (b) {
            case 1:
              {
                console.log("entrando empresa Premium")
                var id = 21;
                var valor = $("#actualizaCarretera21").val();
              }
              break;
            case 2:
              {
                console.log("entrando empresa Luxure")
                var id = 22;
                var valor = $("#actualizaCarretera22").val();
              }
              break;
            case 3:
              {
                console.log("entrando empresa Classic")
                var id = 23;
                var valor = $("#actualizaCarretera23").val();
              }
              break;
            case 4:
              {
                console.log("entrando empresa Corriente")
                var id = 24;
                var valor = $("#actualizaCarretera24").val();
              }
              break;
            case 5:
              {
                console.log("entrando empresa Furgoneta")
                var id = 25;
                var valor = $("#actualizaCarretera25").val();
              }
          }
          break;
        }


    }
    App.contracts.Cliente.deployed().then(function (instance) {
      return instance.actualizarPrecioCarretera(id, valor, { from: App.account });
    }).then(function (result) {
      $("#content").show();
      $("#loader").show();
    }).catch(function (err) {
      console.error(err);
    });
  },

  contratarLeasing: function (a, b) {
    console.log(a);
    console.log(b);
    console.log("entrando contrato Leasing")
    var pago = PrecioPremium;
    console.log(pago);
    App.contracts.CompraToken.deployed().then(function (instance) {
    instance.pagarTokens(pago);
    return [a,b];
  }).then(function (valores) {
      console.log(valores[0]);
      console.log(valores[1]);
      var precioKmCiudad = $("#ClienteCiudadAseguradora01").val();
      var precioKmCarretera = $("#ClienteCarreteraAseguradora01").val();
      var PrecioAparcado = ClienteAparcadoAseguradora01;
      console.log(precioKmCiudad);
      console.log(precioKmCarretera);
      console.log(PrecioAparcado);

      App.contracts.Cliente.deployed().then(function (instance) {
        return instance.actualizarSeguro(precioKmCiudad, precioKmCarretera, PrecioAparcado, { from: App.account });
      }).then(function (result) {
        $("#content").show();
        $("#loader").show();
      }).catch(function (err) {
        console.error(err);
      });
    })
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
  aumentarSupply: function () {
    var numeroTokens = $('#numeroTokensAumentar').val();
    App.contracts.CompraToken.deployed().then(function (instance) {
      return instance.aumentarSupply(numeroTokens, { from: App.account });
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

  contratarOraculo: function () {
    console.log("entrando Oraculo")
    App.contracts.Cliente.deployed().then(function (instance) {
      return instance.update({ from: App.account });
    }).then(function (result) {
      $("#content").show();
      $("#loader").show();
    }).catch(function (err) {
      console.error(err);
    });
  },

  ZonaAdmin: function () {

    App.contracts.Cliente.deployed().then(function (instance) {
      return instance.CheckAdmin.call({ from: App.account });
    }).then(function (result) {
      if (result == true) {
        console.log(result);
        window.location.href = "../Admin.html";
      };
    }).catch(function (err) {
      console.error(err);
    });
  },

  RegistroUsuario: function () {
    console.log("registrando usuario...");
    var IdUsuario = $("#IdUsuarioAlta").val();
    var TypeUserString = $("#ListaTipoUsuario").val();

    console.log("Comprobando registro" + IdUsuario);
    console.log("Comprobando registro" + TypeUserString);

    switch (TypeUserString) {
      case ('Cliente'):
        {
          TypeUser = 1;
          var DNI = $("#DNI").val();
          var VATNumber = 'N/A';
          var antiguedadLicencia = $("#AntiguedadLicenciaAlta").val();
          console.log("Comprobando registro" + antiguedadLicencia);
          console.log("uno");
        }
        break;
      case ('Empresa Aseguradora'):
        {
          TypeUser = 2;
          var VATNumber = $("#VATNumber").val();
          var DNI = 'N/A';
          var antiguedadLicencia = 'N/A';
          console.log("dos");
        }
        break;
      case ('Empresa Financiera'):
        {
          TypeUser = 3;
          var VATNumber = $("#VATNumber").val();
          var DNI = 'N/A';
          var antiguedadLicencia = 'N/A';
          console.log("tres");

        }
        break;
      default:
        {
          TypeUser = 0;
          var DNI = 'N/A';
          var VATNumber = 'N/A';
          var antiguedadLicencia = 'N/A';
          console.log("Tipo de usuario incorrecto...");
        }
        break;
    }
    App.contracts.Cliente.deployed().then(function (instance) {
      console.log("Comprobando registro" + TypeUser);
      console.log("Comprobando registro" + antiguedadLicencia);
      return instance.NewUser(IdUsuario, TypeUser, DNI, VATNumber, antiguedadLicencia, { from: App.account });
    }).then(function (result) {
      // nuevo usuario
      console.log("Nuevo usuario..." + result);
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
      console.log(result + "fetch");
      if ((result[0] == IdUsuario) && (result[1] == Password)) {
        console.log("Autenticación realizada con éxito");
        return instance.RegistraTime({ from: App.account });

        //OMAR: Introducir aquí el front siguiente al de login que quieres que aparezca: window.location.href = "../XXX.html";

      };
    }).catch(function (err) {
      console.error(err);
    });
  },


  getInfo: function () {
    var dir = $("#AddressUsuarioAdmin").val();
    var htmlUserDatos = $("#tablaUsers").empty();
    var persona_ = {};
    App.contracts.Cliente.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(dir)
        .then(function (user) {
          persona_ = {
            IdUsuario: user[0],
            Type: user[4],
            Time: user[5],
          };
          var usuarioTemplate =
            "<tr><th>" + persona_.IdUsuario +
            "</td><td>" + persona_.Type +
            "</td><td>" + persona_.Time +
            "</td></tr>";
          htmlUserDatos.append(usuarioTemplate);
        })
    })
  },

  removeInfo: function () {
    console.log("borrando usuario...")
    var dir = $("#AddressUsuarioAdmin").val();
    App.contracts.Cliente.deployed().then(function (instance) {
      return instance.deleteUser(dir, { from: App.account });
    }).then(function (result) {

      console.log("Borrado realizado con éxito" + result);


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
    console.log("entrando reinicio");
    App.init();
  });
});