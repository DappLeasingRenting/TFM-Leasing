//import { sha256, sha224 } from 'js-sha256';
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
      })
    })
  },

  // Escuchando a los eventos que se emiten en los contratos
  listenForEvents: function () {
    App.contracts.CompraToken.deployed().then(function (instance) {
      instance.nuevoCliente({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function (error, event) {
        console.log("event triggered", event)
        App.render();
      });
    });
    App.contracts.CompraToken.deployed().then(function (instance) {
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
    App.account = account;
    App.admin = web3.eth.accounts[0];

   App.contracts.CompraToken.deployed().then(function (instance) {
      return instance.fetchTypeUser({ from: App.account });
    }).then(function (result) {
      console.log(result + " Tipo Usuario");
      switch (parseInt(result)) {
        case 0: //caso default
          {
           $("#loader").show();
           $("#contentOwner").show();
           $("#contentOwner").show(); //Bienvenido zona clientes
           $("#content").show(); 
          $("#content0").show();
          $("#content1").show(); //mapfre
           $("#content2").show();
           $("#content3").show(); //Puede financiar hasta un máximo de
           $("#content4").show(); //Bienvenido aumentar tokens
           $("#content5").show(); //allianz
          $("#content6").show(); //AXA
            $("#content7").show(); //Bienvenido "Leasing Smart Token" (LST)!
           $("#content8").show(); //mis contratos "Leasing"
           $("#content0Alta").show();

          }
          break;
        case 1: //caso cliente
          {
            $("#loader").show();
            $("#contentOwner").show(); //Bienvenido zona clientes
            $("#content").show(); 
            $("#content0").show();
            $("#content1").show(); //mapfre
            $("#content2").show();
            $("#content3").show(); //Puede financiar hasta un máximo de
            $("#content4").show(); //Bienvenido aumentar tokens
            $("#content5").show(); //allianz
            $("#content6").show(); //AXA
            $("#content7").show(); //Bienvenido "Leasing Smart Token" (LST)!
            $("#content8").show(); //mis contratos "Leasing"
            $("#content0Alta").show();
          }
          break;
        case 2:
          {
            $("#loader").show();
            $("#content1").show(); //mapfre
            $("#content5").show(); //allianz
            $("#content6").show(); //AXA
            $("#content0Alta").show();
          }
          break;
        case 3:
          {
            //poner módulo financiero
            $("#content0Alta").show();
          }
          break;
        
      };
    
      
    }).catch(function (err) {
      console.error(err);
    });
    
  // $("#loader").show();
  // $("#contentOwner").show(); //Bienvenido zona clientes
  // $("#content").show(); 
  //  $("#content0").show();
   // $("#content1").show(); //mapfre
   // $("#content2").show();
   // $("#content3").show(); //Puede financiar hasta un máximo de
   // $("#content4").show(); //Bienvenido aumentar tokens
   // $("#content5").show(); //allianz
   // $("#content6").show(); //AXA
   // $("#content7").show(); //Bienvenido "Leasing Smart Token" (LST)!
   // $("#content8").show(); //mis contratos "Leasing"





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

    var htmlPrecioClassic = $("#PrecioClassic").empty();
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




    TiempoAparcadoArray = new Array(100, 7759, 6116, 165, 8247, 7569, 4538, 6248, 943, 4665, 5147, 5337, 4821, 5919, 5310, 2639, 3829, 8622, 2581, 7046, 21, 310, 6904, 1945, 418, 3532, 534, 421, 1485, 2350, 2814, 4622, 5240, 154, 4000, 2991, 3320, 1589, 8571, 2284, 1781, 540, 2601, 5058, 2854, 2672, 8020, 6252, 6605, 78, 5551, 2185, 977, 1334, 4853, 1375, 5200, 2935, 5487, 4045, 483, 5707, 4255, 5625, 8318, 2948, 8138, 2476, 1706, 4224, 2267, 3324, 4548, 5119, 7795, 4655, 5538, 8195, 2135, 5943, 1721, 878, 6693, 6241, 1517, 5546, 1307, 4023, 6330, 2512, 5768, 6082, 7250, 1312, 7241, 7984, 8292, 2409, 113, 2131);
    TiempoKmCiudadArray = new Array(100, 313612, 73317, 124328, 78296, 558883, 521653, 75777, 189051, 219484, 519583, 31070, 481577, 10774, 170515, 63111, 305285, 258683, 109814, 519422, 20295, 235418, 533894, 390006, 246544, 71403, 51565, 328477, 477193, 157426, 222323, 436023, 551782, 531217, 384385, 351176, 450820, 179260, 319585, 578028, 145944, 277339, 252841, 531389, 218492, 342418, 40757, 79584, 444305, 273675, 566967, 223934, 133772, 322051, 331210, 368660, 313596, 145457, 394691, 205801, 440487, 80795, 226094, 566938, 46917, 194221, 180765, 476859, 335315, 157608, 339837, 484000, 259509, 341939, 436723, 138347, 260977, 117379, 405199, 39681, 362375, 5056, 296404, 387405, 162067, 437097, 131403, 427859, 220817, 49239, 481573, 415943, 385535, 54368, 200872, 484971, 354892, 325599, 372167, 152132);
    TiempoKmCarreteraArray = new Array(100, 314116, 48487, 304343, 279758, 425999, 424192, 226395, 205730, 17043, 216839, 82952, 312747, 283458, 451653, 262119, 92940, 237407, 459708, 471848, 488702, 310919, 58655, 443378, 214021, 413886, 220002, 172159, 109820, 578741, 457419, 317438, 347732, 353092, 569579, 588468, 248941, 236556, 426310, 358426, 393090, 499262, 398347, 366434, 556895, 266923, 198767, 393691, 443046, 1124, 528203, 231524, 537071, 543403, 596200, 497295, 163274, 77941, 327605, 98391, 100498, 500100, 55669, 195156, 164352, 256806, 352534, 570419, 364704, 269695, 153088, 376384, 405628, 363175, 89651, 98979, 409651, 497006, 372772, 455334, 419040, 196710, 427414, 221917, 254014, 385103, 224076, 278914, 291175, 334423, 230948, 250809, 65090, 281010, 555935, 223670, 291854, 173195, 546442, 126516);

    console.log(TiempoAparcadoArray[0]);
    console.log(TiempoKmCiudadArray[0]);
    console.log(TiempoKmCarreteraArray[0]);




    var htmlAparcado01 = $("#AparcadoAseguradora01").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(01)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          htmlAparcado01.append(usuarioTemplate);
        })
    })
    var htmlCiudad01 = $("#CiudadAseguradora01").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceD = instance;
      InstanceD.aseguradoraPrecioCiudad(01)
        .then(function (PrecioB) {
          var usuarioTemplate =
            "<tr><td>" + PrecioB + "</td></tr>";
          htmlCiudad01.append(usuarioTemplate);
          console.log(PrecioB)
        })
    })
    var htmlCarretera01 = $("#CarreteraAseguradora01").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCarretera(01)
        .then(function (PrecioC) {
          var usuarioTemplate =
            "<tr><td>" + PrecioC + "</td></tr>";
          console.log(PrecioC);
          htmlCarretera01.append(usuarioTemplate);
        })
    })



    var htmlAparcado02 = $("#AparcadoAseguradora02").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(02)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          htmlAparcado02.append(usuarioTemplate);
        })
    })
    var htmlCiudad02 = $("#CiudadAseguradora02").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCiudad(02)
        .then(function (PrecioB) {
          var usuarioTemplate =
            "<tr><td>" + PrecioB + "</td></tr>";
          htmlCiudad02.append(usuarioTemplate);
        })
    })
    var htmlCarretera02 = $("#CarreteraAseguradora02").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCarretera(02)
        .then(function (PrecioC) {
          var usuarioTemplate =
            "<tr><td>" + PrecioC + "</td></tr>";
          htmlCarretera02.append(usuarioTemplate);
        })
    })


    var htmlAparcado03 = $("#AparcadoAseguradora03").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(03)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          htmlAparcado03.append(usuarioTemplate);
        })
    })
    var htmlCiudad03 = $("#CiudadAseguradora03").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCiudad(03)
        .then(function (PrecioB) {
          var usuarioTemplate =
            "<tr><td>" + PrecioB + "</td></tr>";
          htmlCiudad03.append(usuarioTemplate);
        })
    })
    var htmlCarretera03 = $("#CarreteraAseguradora03").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCarretera(03)
        .then(function (PrecioC) {
          var usuarioTemplate =
            "<tr><td>" + PrecioC + "</td></tr>";
          htmlCarretera03.append(usuarioTemplate);
        })
    })

    var htmlAparcado04 = $("#AparcadoAseguradora04").empty();

    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(04)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          htmlAparcado04.append(usuarioTemplate);
        })
    })
    var htmlCiudad04 = $("#CiudadAseguradora04").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCiudad(04)
        .then(function (PrecioB) {
          var usuarioTemplate =
            "<tr><td>" + PrecioB + "</td></tr>";
          htmlCiudad04.append(usuarioTemplate);
        })
    })
    var htmlCarretera04 = $("#CarreteraAseguradora04").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCarretera(04)
        .then(function (PrecioC) {
          var usuarioTemplate =
            "<tr><td>" + PrecioC + "</td></tr>";
          htmlCarretera04.append(usuarioTemplate);
        })
    })

    var htmlAparcado05 = $("#AparcadoAseguradora05").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(05)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          htmlAparcado05.append(usuarioTemplate);
        })
    })
    var htmlCiudad05 = $("#CiudadAseguradora05").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCiudad(05)
        .then(function (PrecioB) {
          var usuarioTemplate =
            "<tr><td>" + PrecioB + "</td></tr>";
          htmlCiudad05.append(usuarioTemplate);
        })
    })
    var htmlCarretera05 = $("#CarreteraAseguradora05").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCarretera(05)
        .then(function (PrecioC) {
          var usuarioTemplate =
            "<tr><td>" + PrecioC + "</td></tr>";
          htmlCarretera05.append(usuarioTemplate);
        })
    })





    var htmlAparcado11 = $("#AparcadoAseguradora11").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(11)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          htmlAparcado11.append(usuarioTemplate);
        })
    })
    var htmlCiudad11 = $("#CiudadAseguradora11").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCiudad(11)
        .then(function (PrecioB) {
          var usuarioTemplate =
            "<tr><td>" + PrecioB + "</td></tr>";
          htmlCiudad11.append(usuarioTemplate);
        })
    })
    var htmlCarretera11 = $("#CarreteraAseguradora11").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCarretera(11)
        .then(function (PrecioC) {
          var usuarioTemplate =
            "<tr><td>" + PrecioC + "</td></tr>";
          htmlCarretera11.append(usuarioTemplate);
        })
    })


    var htmlAparcado12 = $("#AparcadoAseguradora12").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(12)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          htmlAparcado12.append(usuarioTemplate);
        })
    })
    var htmlCiudad12 = $("#CiudadAseguradora12").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCiudad(12)
        .then(function (PrecioB) {
          var usuarioTemplate =
            "<tr><td>" + PrecioB + "</td></tr>";
          htmlCiudad12.append(usuarioTemplate);
        })
    })
    var htmlCarretera12 = $("#CarreteraAseguradora12").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCarretera(12)
        .then(function (PrecioC) {
          var usuarioTemplate =
            "<tr><td>" + PrecioC + "</td></tr>";
          htmlCarretera12.append(usuarioTemplate);
        })
    })


    var htmlAparcado13 = $("#AparcadoAseguradora13").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(13)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          htmlAparcado13.append(usuarioTemplate);
        })
    })
    var htmlCiudad13 = $("#CiudadAseguradora13").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCiudad(13)
        .then(function (PrecioB) {
          var usuarioTemplate =
            "<tr><td>" + PrecioB + "</td></tr>";
          htmlCiudad13.append(usuarioTemplate);
        })
    })
    var htmlCarretera13 = $("#CarreteraAseguradora13").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCarretera(13)
        .then(function (PrecioC) {
          var usuarioTemplate =
            "<tr><td>" + PrecioC + "</td></tr>";
          htmlCarretera13.append(usuarioTemplate);
        })
    })

    var htmlAparcado14 = $("#AparcadoAseguradora14").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(14)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          htmlAparcado14.append(usuarioTemplate);
        })
    })
    var htmlCiudad14 = $("#CiudadAseguradora14").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCiudad(14)
        .then(function (PrecioB) {
          var usuarioTemplate =
            "<tr><td>" + PrecioB + "</td></tr>";
          htmlCiudad14.append(usuarioTemplate);
        })
    })
    var htmlCarretera14 = $("#CarreteraAseguradora14").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCarretera(14)
        .then(function (PrecioC) {
          var usuarioTemplate =
            "<tr><td>" + PrecioC + "</td></tr>";
          htmlCarretera14.append(usuarioTemplate);
        })
    })

    var htmlAparcado15 = $("#AparcadoAseguradora15").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(15)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          htmlAparcado15.append(usuarioTemplate);
        })
    })
    var htmlCiudad15 = $("#CiudadAseguradora15").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCiudad(15)
        .then(function (PrecioB) {
          var usuarioTemplate =
            "<tr><td>" + PrecioB + "</td></tr>";
          htmlCiudad15.append(usuarioTemplate);
        })
    })
    var htmlCarretera15 = $("#CarreteraAseguradora15").empty();;
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCarretera(15)
        .then(function (PrecioC) {
          var usuarioTemplate =
            "<tr><td>" + PrecioC + "</td></tr>";
          htmlCarretera15.append(usuarioTemplate);
        })
    })
    var htmlAparcado21 = $("#AparcadoAseguradora21").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(21)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          htmlAparcado21.append(usuarioTemplate);
        })
    })
    var htmlCiudad21 = $("#CiudadAseguradora21").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCiudad(21)
        .then(function (PrecioB) {
          var usuarioTemplate =
            "<tr><td>" + PrecioB + "</td></tr>";
          htmlCiudad21.append(usuarioTemplate);
        })
    })
    var htmlCarretera21 = $("#CarreteraAseguradora21").empty();;
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCarretera(21)
        .then(function (PrecioC) {
          var usuarioTemplate =
            "<tr><td>" + PrecioC + "</td></tr>";
          htmlCarretera21.append(usuarioTemplate);
        })
    })

    var htmlAparcado22 = $("#AparcadoAseguradora22").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(22)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          htmlAparcado22.append(usuarioTemplate);
        })
    })
    var htmlCiudad22 = $("#CiudadAseguradora22").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCiudad(22)
        .then(function (PrecioB) {
          var usuarioTemplate =
            "<tr><td>" + PrecioB + "</td></tr>";
          htmlCiudad22.append(usuarioTemplate);
        })
    })
    var htmlCarretera22 = $("#CarreteraAseguradora22").empty();;
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCarretera(22)
        .then(function (PrecioC) {
          var usuarioTemplate =
            "<tr><td>" + PrecioC + "</td></tr>";
          htmlCarretera22.append(usuarioTemplate);
        })
    })

    var htmlAparcado23 = $("#AparcadoAseguradora23").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(23)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          htmlAparcado23.append(usuarioTemplate);
        })
    })
    var htmlCiudad23 = $("#CiudadAseguradora23").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCiudad(23)
        .then(function (PrecioB) {
          var usuarioTemplate =
            "<tr><td>" + PrecioB + "</td></tr>";
          htmlCiudad23.append(usuarioTemplate);
        })
    })
    var htmlCarretera23 = $("#CarreteraAseguradora23").empty();;
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCarretera(23)
        .then(function (PrecioC) {
          var usuarioTemplate =
            "<tr><td>" + PrecioC + "</td></tr>";
          htmlCarretera23.append(usuarioTemplate);
        })
    })
    var htmlAparcado24 = $("#AparcadoAseguradora24").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(24)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          htmlAparcado24.append(usuarioTemplate);
        })
    })
    var htmlCiudad24 = $("#CiudadAseguradora24").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCiudad(24)
        .then(function (PrecioB) {
          var usuarioTemplate =
            "<tr><td>" + PrecioB + "</td></tr>";
          htmlCiudad24.append(usuarioTemplate);
        })
    })
    var htmlCarretera24 = $("#CarreteraAseguradora24").empty();;
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCarretera(24)
        .then(function (PrecioC) {
          var usuarioTemplate =
            "<tr><td>" + PrecioC + "</td></tr>";
          htmlCarretera24.append(usuarioTemplate);
        })
    })

    var htmlAparcado25 = $("#AparcadoAseguradora25").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.aseguradoraPrecioAparcado(25)
        .then(function (PrecioA) {
          var usuarioTemplate =
            "<tr><td>" + PrecioA + "</td></tr>";
          htmlAparcado25.append(usuarioTemplate);
        })
    })


    var htmlCiudad25 = $("#CiudadAseguradora25").empty();
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCiudad(25)
        .then(function (PrecioB) {
          var usuarioTemplate =
            "<tr><td>" + PrecioB + "</td></tr>";
          htmlCiudad25.append(usuarioTemplate);
        })
    })
    var htmlCarretera25 = $("#CarreteraAseguradora25").empty();;
    App.contracts.CompraToken.deployed().then(function (instance) {
      InstanceA = instance;
      InstanceA.aseguradoraPrecioCarretera(25)
        .then(function (PrecioC) {
          var usuarioTemplate =
            "<tr><td>" + PrecioC + "</td></tr>";
          htmlCarretera25.append(usuarioTemplate);
        })
    })






    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlAparcado001 = $("#ClienteAparcadoAseguradora01").empty();
          App.contracts.CompraToken.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(01)
              .then(function (PrecioA) {
                var PrecioClienteA01 = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA01 + "</td></tr>";
                ClienteAparcadoAseguradora01 = PrecioClienteA01;
                htmlAparcado001.append(usuarioTemplate);
              })
          })
        })
    })

    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCiudad001 = $("#ClienteCiudadAseguradora01").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceD = instance;
            InstanceD.aseguradoraPrecioCiudad(01)
              .then(function (PrecioB) {
                var PrecioClienteB01 = Math.round(PrecioB / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteB01 + "</td></tr>";
                ClienteCiudadAseguradora01 = PrecioClienteB01
                htmlCiudad001.append(usuarioTemplate);
              })
          })
        })
    })

    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCarretera001 = $("#ClienteCarreteraAseguradora01").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCarretera(01)
              .then(function (PrecioC) {
                var PrecioClienteC01 = Math.round(PrecioC / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteC01 + "</td></tr>";
                ClienteCarreteraAseguradora01 = PrecioClienteC01
                htmlCarretera001.append(usuarioTemplate);
              })
          })
        })
    })

    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlAparcado001 = $("#ClienteAparcadoAseguradora02").empty();
          App.contracts.CompraToken.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(02)
              .then(function (PrecioA) {
                var PrecioClienteA02 = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA02 + "</td></tr>";
                ClienteAparcadoAseguradora02 = PrecioClienteA02;
                htmlAparcado001.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCiudad002 = $("#ClienteCiudadAseguradora02").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceD = instance;
            InstanceD.aseguradoraPrecioCiudad(02)
              .then(function (PrecioB) {
                var PrecioClienteB02 = Math.round(PrecioB / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteB02 + "</td></tr>";
                ClienteCiudadAseguradora02 = PrecioClienteB02;
                htmlCiudad002.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCarretera002 = $("#ClienteCarreteraAseguradora02").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCarretera(02)
              .then(function (PrecioC) {
                var PrecioClienteC02 = Math.round(PrecioC / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteC02 + "</td></tr>";
                ClienteCarreteraAseguradora02 = PrecioClienteC02;
                htmlCarretera002.append(usuarioTemplate);
              })
          })
        })
    })

    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlAparcado003 = $("#ClienteAparcadoAseguradora03").empty();
          App.contracts.CompraToken.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(03)
              .then(function (PrecioA) {
                var PrecioClienteA03 = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA03 + "</td></tr>";
                ClienteAparcadoAseguradora03 = PrecioClienteA03;
                htmlAparcado003.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCiudad003 = $("#ClienteCiudadAseguradora03").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceD = instance;
            InstanceD.aseguradoraPrecioCiudad(03)
              .then(function (PrecioB) {
                var PrecioClienteB03 = Math.round(PrecioB / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteB03 + "</td></tr>";
                ClienteCiudadAseguradora03 = PrecioClienteB03
                htmlCiudad003.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCarretera003 = $("#ClienteCarreteraAseguradora03").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCarretera(03)
              .then(function (PrecioC) {
                var PrecioClienteC03 = Math.round(PrecioC / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteC03 + "</td></tr>";
                ClienteCarreteraAseguradora03 = PrecioClienteC03;
                htmlCarretera003.append(usuarioTemplate);
              })
          })
        })
    })

    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlAparcado004 = $("#ClienteAparcadoAseguradora04").empty();
          App.contracts.CompraToken.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(04)
              .then(function (PrecioA) {
                var PrecioClienteA04 = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA04 + "</td></tr>";
                ClienteAparcadoAseguradora04 = PrecioClienteA04;
                htmlAparcado004.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCiudad004 = $("#ClienteCiudadAseguradora04").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceD = instance;
            InstanceD.aseguradoraPrecioCiudad(04)
              .then(function (PrecioB) {
                var PrecioClienteB04 = Math.round(PrecioB / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteB04 + "</td></tr>";
                ClienteCiudadAseguradora04 = PrecioClienteB04
                htmlCiudad004.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCarretera004 = $("#ClienteCarreteraAseguradora04").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCarretera(04)
              .then(function (PrecioC) {
                var PrecioClienteC04 = Math.round(PrecioC / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteC04 + "</td></tr>";
                ClienteCarreteraAseguradora04 = PrecioClienteC04;
                htmlCarretera004.append(usuarioTemplate);
              })
          })
        })
    })

    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlAparcado005 = $("#ClienteAparcadoAseguradora05").empty();
          App.contracts.CompraToken.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(05)
              .then(function (PrecioA) {
                var PrecioClienteA05 = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA05 + "</td></tr>";
                ClienteAparcadoAseguradora05 = PrecioClienteA05;
                htmlAparcado005.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCiudad005 = $("#ClienteCiudadAseguradora05").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceD = instance;
            InstanceD.aseguradoraPrecioCiudad(05)
              .then(function (PrecioB) {
                var PrecioClienteB05 = Math.round(PrecioB / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteB05 + "</td></tr>";
                ClienteCiudadAseguradora05 = PrecioClienteB05
                htmlCiudad005.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);

          var htmlCarretera005 = $("#ClienteCarreteraAseguradora05").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCarretera(05)
              .then(function (PrecioC) {
                var PrecioClienteC05 = Math.round(PrecioC / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteC05 + "</td></tr>";
                ClienteCarreteraAseguradora05 = PrecioClienteC05;
                htmlCarretera005.append(usuarioTemplate);
              })
          })
        })
    })


    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlAparcado111 = $("#ClienteAparcadoAseguradora11").empty();
          App.contracts.CompraToken.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(11)
              .then(function (PrecioA) {
                var PrecioClienteA11 = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA11 + "</td></tr>";
                ClienteAparcadoAseguradora11 = PrecioClienteA11;
                htmlAparcado111.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCiudad111 = $("#ClienteCiudadAseguradora11").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceD = instance;
            InstanceD.aseguradoraPrecioCiudad(11)
              .then(function (PrecioB) {
                var PrecioClienteB11 = Math.round(PrecioB / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteB11 + "</td></tr>";
                ClienteCiudadAseguradora11 = PrecioClienteB11
                htmlCiudad111.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCarretera111 = $("#ClienteCarreteraAseguradora11").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCarretera(11)
              .then(function (PrecioC) {
                var PrecioClienteC11 = Math.round(PrecioC / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteC11 + "</td></tr>";
                ClienteCarreteraAseguradora11 = PrecioClienteC11;
                htmlCarretera111.append(usuarioTemplate);
              })
          })
        })
    })

    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlAparcado121 = $("#ClienteAparcadoAseguradora12").empty();
          App.contracts.CompraToken.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(12)
              .then(function (PrecioA) {
                var PrecioClienteA12 = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA12 + "</td></tr>";
                ClienteAparcadoAseguradora12 = PrecioClienteA12;
                htmlAparcado121.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCiudad121 = $("#ClienteCiudadAseguradora12").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceD = instance;
            InstanceD.aseguradoraPrecioCiudad(12)
              .then(function (PrecioB) {
                var PrecioClienteB12 = Math.round(PrecioB / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteB12 + "</td></tr>";
                ClienteCiudadAseguradora12 = PrecioClienteB12
                htmlCiudad121.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCarretera121 = $("#ClienteCarreteraAseguradora12").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCarretera(12)
              .then(function (PrecioC) {
                var PrecioClienteC12 = Math.round(PrecioC / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteC12 + "</td></tr>";
                ClienteCarreteraAseguradora12 = PrecioClienteC12;
                htmlCarretera121.append(usuarioTemplate);
              })
          })
        })
    })

    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlAparcado131 = $("#ClienteAparcadoAseguradora13").empty();
          App.contracts.CompraToken.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(13)
              .then(function (PrecioA) {
                var PrecioClienteA13 = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA13 + "</td></tr>";
                ClienteAparcadoAseguradora13 = PrecioClienteA13;
                htmlAparcado131.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCiudad131 = $("#ClienteCiudadAseguradora13").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceD = instance;
            InstanceD.aseguradoraPrecioCiudad(13)
              .then(function (PrecioB) {
                var PrecioClienteB13 = Math.round(PrecioB / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteB13 + "</td></tr>";
                ClienteCiudadAseguradora13 = PrecioClienteB13
                htmlCiudad131.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);

          var htmlCarretera131 = $("#ClienteCarreteraAseguradora13").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCarretera(13)
              .then(function (PrecioC) {
                var PrecioClienteC13 = Math.round(PrecioC / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteC13 + "</td></tr>";
                ClienteCarreteraAseguradora13 = PrecioClienteC13;
                htmlCarretera131.append(usuarioTemplate);
              })
          })
        })
    })

    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlAparcado141 = $("#ClienteAparcadoAseguradora14").empty();
          App.contracts.CompraToken.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(14)
              .then(function (PrecioA) {
                var PrecioClienteA14 = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA14 + "</td></tr>";
                ClienteAparcadoAseguradora14 = PrecioClienteA14;
                htmlAparcado141.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCiudad141 = $("#ClienteCiudadAseguradora14").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceD = instance;
            InstanceD.aseguradoraPrecioCiudad(14)
              .then(function (PrecioB) {
                var PrecioClienteB14 = Math.round(PrecioB / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteB14 + "</td></tr>";
                ClienteCiudadAseguradora14 = PrecioClienteB14
                htmlCiudad141.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCarretera141 = $("#ClienteCarreteraAseguradora14").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCarretera(14)
              .then(function (PrecioC) {
                var PrecioClienteC14 = Math.round(PrecioC / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteC14 + "</td></tr>";
                ClienteCarreteraAseguradora14 = PrecioClienteC14;
                htmlCarretera141.append(usuarioTemplate);
              })
          })
        })
    })


    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlAparcado151 = $("#ClienteAparcadoAseguradora15").empty();
          App.contracts.CompraToken.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(15)
              .then(function (PrecioA) {
                var PrecioClienteA15 = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA15 + "</td></tr>";
                ClienteAparcadoAseguradora15 = PrecioClienteA15;
                htmlAparcado151.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCiudad151 = $("#ClienteCiudadAseguradora15").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceD = instance;
            InstanceD.aseguradoraPrecioCiudad(15)
              .then(function (PrecioB) {
                var PrecioClienteB15 = Math.round(PrecioB / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteB15 + "</td></tr>";
                ClienteCiudadAseguradora15 = PrecioClienteB15
                htmlCiudad151.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCarretera151 = $("#ClienteCarreteraAseguradora15").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCarretera(15)
              .then(function (PrecioC) {
                var PrecioClienteC15 = Math.round(PrecioC / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteC15 + "</td></tr>";
                ClienteCarreteraAseguradora15 = PrecioClienteC15;
                htmlCarretera151.append(usuarioTemplate);
              })
          })
        })
    })


    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlAparcado211 = $("#ClienteAparcadoAseguradora21").empty();
          App.contracts.CompraToken.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(21)
              .then(function (PrecioA) {
                var PrecioClienteA21 = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA21 + "</td></tr>";
                ClienteAparcadoAseguradora21 = PrecioClienteA21;
                htmlAparcado211.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCiudad211 = $("#ClienteCiudadAseguradora21").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceD = instance;
            InstanceD.aseguradoraPrecioCiudad(21)
              .then(function (PrecioB) {
                var PrecioClienteB21 = Math.round(PrecioB / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteB21 + "</td></tr>";
                ClienteCiudadAseguradora21 = PrecioClienteB21
                htmlCiudad211.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCarretera211 = $("#ClienteCarreteraAseguradora21").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCarretera(21)
              .then(function (PrecioC) {
                var PrecioClienteC21 = Math.round(PrecioC / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteC21 + "</td></tr>";
                ClienteCarreteraAseguradora21 = PrecioClienteC21;
                htmlCarretera211.append(usuarioTemplate);
              })
          })
        })
    })


    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlAparcado211 = $("#ClienteAparcadoAseguradora22").empty();
          App.contracts.CompraToken.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(22)
              .then(function (PrecioA) {
                var PrecioClienteA22 = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA22 + "</td></tr>";
                ClienteAparcadoAseguradora22 = PrecioClienteA22;
                htmlAparcado211.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCiudad221 = $("#ClienteCiudadAseguradora22").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceD = instance;
            InstanceD.aseguradoraPrecioCiudad(22)
              .then(function (PrecioB) {
                var PrecioClienteB22 = Math.round(PrecioB / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteB22 + "</td></tr>";
                ClienteCiudadAseguradora22 = PrecioClienteB22
                htmlCiudad221.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCarretera221 = $("#ClienteCarreteraAseguradora22").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCarretera(22)
              .then(function (PrecioC) {
                var PrecioClienteC22 = Math.round(PrecioC / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteC22 + "</td></tr>";
                ClienteCarreteraAseguradora22 = PrecioClienteC22;
                htmlCarretera221.append(usuarioTemplate);
              })
          })
        })
    })

    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlAparcado231 = $("#ClienteAparcadoAseguradora23").empty();
          App.contracts.CompraToken.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(23)
              .then(function (PrecioA) {
                var PrecioClienteA23 = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA23 + "</td></tr>";
                ClienteAparcadoAseguradora23 = PrecioClienteA23;
                htmlAparcado231.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);

          var htmlCiudad231 = $("#ClienteCiudadAseguradora23").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceD = instance;
            InstanceD.aseguradoraPrecioCiudad(23)
              .then(function (PrecioB) {
                var PrecioClienteB23 = Math.round(PrecioB / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteB23 + "</td></tr>";
                ClienteCiudadAseguradora23 = PrecioClienteB23
                htmlCiudad231.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);

          var htmlCarretera231 = $("#ClienteCarreteraAseguradora23").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCarretera(23)
              .then(function (PrecioC) {
                var PrecioClienteC23 = Math.round(PrecioC / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteC23 + "</td></tr>";
                ClienteCarreteraAseguradora23 = PrecioClienteC23;
                htmlCarretera231.append(usuarioTemplate);
              })
          })
        })
    })

    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlAparcado241 = $("#ClienteAparcadoAseguradora24").empty();
          App.contracts.CompraToken.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(24)
              .then(function (PrecioA) {
                var PrecioClienteA24 = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA24 + "</td></tr>";
                ClienteAparcadoAseguradora24 = PrecioClienteA24;
                htmlAparcado241.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);

          var htmlCiudad241 = $("#ClienteCiudadAseguradora24").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceD = instance;
            InstanceD.aseguradoraPrecioCiudad(24)
              .then(function (PrecioB) {
                var PrecioClienteB24 = Math.round(PrecioB / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteB24 + "</td></tr>";
                ClienteCiudadAseguradora24 = PrecioClienteB24
                htmlCiudad241.append(usuarioTemplate);
              })
          })
        })
    })
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);

          var htmlCarretera241 = $("#ClienteCarreteraAseguradora24").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCarretera(24)
              .then(function (PrecioC) {
                var PrecioClienteC24 = Math.round(PrecioC / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteC24 + "</td></tr>";
                ClienteCarreteraAseguradora24 = PrecioClienteC24;
                htmlCarretera241.append(usuarioTemplate);
              })
          })
        })
    })

    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlAparcado251 = $("#ClienteAparcadoAseguradora25").empty();
          App.contracts.CompraToken.deployed().then(function (instance) {
            infoInstance = instance;
            infoInstance.aseguradoraPrecioAparcado(25)
              .then(function (PrecioA) {
                var PrecioClienteA25 = Math.round(PrecioA / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteA25 + "</td></tr>";
                ClienteAparcadoAseguradora25 = PrecioClienteA25;
                htmlAparcado251.append(usuarioTemplate);
              })
          })
        })
    })

    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCiudad251 = $("#ClienteCiudadAseguradora25").empty();
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceD = instance;
            InstanceD.aseguradoraPrecioCiudad(25)
              .then(function (PrecioB) {
                var PrecioClienteB25 = Math.round(PrecioB / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteB25 + "</td></tr>";
                ClienteCiudadAseguradora25 = PrecioClienteB25
                htmlCiudad251.append(usuarioTemplate);
              })
          })
        })
    })

    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          record = (DatosCliente[4] / 10);
          var htmlCarretera251 = $("#ClienteCarreteraAseguradora25").empty();;
          App.contracts.CompraToken.deployed().then(function (instance) {
            InstanceA = instance;
            InstanceA.aseguradoraPrecioCarretera(25)
              .then(function (PrecioC) {
                var PrecioClienteC25 = Math.round(PrecioC / record);
                var usuarioTemplate =
                  "<tr><td>" + PrecioClienteC25 + "</td></tr>";
                ClienteCarreteraAseguradora25 = PrecioClienteC25;
                htmlCarretera251.append(usuarioTemplate);
              })
          })
        })
    })



    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      console.log(App.account);
      infoInstance.users(App.account)
        .then(function (DatosCliente) {
          MaximoPrestamo = DatosCliente[8].toNumber();
          console.log(MaximoPrestamo);
          $('.tokens-maximo').html(MaximoPrestamo);
          MaximoPrestamoUsuario = MaximoPrestamo;
        })
    })

    //Recoger los valores que son almacenados en el Array

    /*App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      console.log(App.account);
      infoInstance.Coches(0)
        .then(function (DatosCoches) {
          IDCoches0 = DatosCoches[0].toNumber();
          console.log(IDCoches0);
        })
    })*/

    //Verificar la cantidad de Coches dados de alta en la categoría Premium
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;     
      infoInstance.consultaArray(1)
        .then(function (Size1) {
          console.log(Size1[0]);
        })
    })
    //Verificar la cantidad de Coches dados de alta en la categoría Premium
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;      
      infoInstance.consultaArray(2)
        .then(function (Size2) {
          console.log(Size2[0]);
        })
    })
    //Verificar la cantidad de Coches dados de alta en la categoría Premium
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;      
      infoInstance.consultaArray(3)
        .then(function (Size3) {
          console.log(Size3[0]);
        })
    })

    //Verificar la cantidad de Coches dados de alta en la categoría Premium
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;      
      infoInstance.consultaArray(4)
        .then(function (Size4) {
          console.log(Size4[0]);
        })
    })
    //Verificar la cantidad de Coches dados de alta en la categoría Premium
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;      
      infoInstance.consultaArray(5)
        .then(function (Size5) {
          console.log(Size5[0]);
        })
    })
    //Recoger info de un coche con un ID Particular
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      console.log("Consulta ID Cochen array")
      infoInstance.CochesDisponibles(1,0)
        .then(function (Datos) {
          console.log(Datos.toNumber());
        })
    })







    var htmlclienteDatosSeguro = $("#clienteDatosSeguro").empty();
    var htmlclienteDatosPrestamo = $("#clienteDatos2").empty();
    var Datos = {};
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      console.log(App.account);
      infoInstance.users(App.account)
        .then(function (DatosSeguro) {
          //console.log(Number(DatosSeguro));
          Datos = {
            CostoTotal: DatosSeguro[9],
            KmCiudad: DatosSeguro[5],
            KmCarretera: DatosSeguro[6],
            TiempoAparcado: DatosSeguro[7],
            Prestamo: DatosSeguro[10],
          };

          ValorPagoPrestamoInicial = Number(Datos.Prestamo);
          if (ValorPagoPrestamoInicial < 10 && ValorPagoPrestamoInicial > 0) {
            X = 1;
            ValorPagoPrestamo = ValorPagoPrestamoInicial + X;
            console.log(ValorPagoPrestamo);

          } else {
            ValorPagoPrestamo = Math.round(Number(Datos.Prestamo * 1.10));
            console.log(ValorPagoPrestamo);
          }

          var usuarioTemplate =
            "<tr><th>" + Datos.CostoTotal +
            "</td><td>" + Datos.KmCiudad +
            "</td><td>" + Datos.KmCarretera +
            "</td><td>" + Datos.TiempoAparcado +
            "</td><td>" + Datos.Entregado +
            "</td></tr>";
          htmlclienteDatosSeguro.append(usuarioTemplate);

          var usuarioTemplate =
            "<tr><th>" + Datos.Prestamo +
            "</td><td>" + ValorPagoPrestamo +
            "</td></tr>";
          htmlclienteDatosPrestamo.append(usuarioTemplate);

        })
    })

    //Omar
/* var htmlclienteDatosPrestamo = $("#clienteDatos1").empty();
    var Datos = {};
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      console.log(App.account);
      infoInstance.users(App.account)
        .then(function (DatosUsuario) {
          //console.log(Number(DatosSeguro));
          Datos = {
            tipoCoche: DatosUsuario[0],
            IdCoche: DatosUsuario[9],
          };     
          App.contracts.CompraToken.deployed().then(function (instance) {
            infoInstance = instance;    
            var Datos1 = {};      
            infoInstance.coches(Datos.tipoCoche,Datos.IdCoche)
            .then(function (DatosCoche){
          Datos1 = {
            IdCoche: DatosCoche[0],
            KmCiudad: DatosCoche[1],
            KmCarretera: DatosCoche[2],
            TiempoAparcado: DatosCoche[3],
            IdSeguro: DatosCoche[4],
            Entregado: DatosCoche[5],
          };      

          var usuarioTemplate =
            "<tr><th>" + Datos1.IdCoche +
            "</td><td>" + Datos1.KmCiudad +
            "</td><td>" + Datos1.KmCarretera +
            "</td><td>" + Datos1.TiempoAparcado +
            "</td><td>" + Datos1.IdSeguro +
            "</td><td>" + Datos1.Entregado+
            "</td></tr>";
          htmlclienteDatos1.append(usuarioTemplate);


        })
    })
  })
})*/



    /*var htmlclienteDatos1 = $("#clienteDatos1").empty();
    var persona = {};
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.Aleatorio(App.account)
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
            "</td><td>" + persona.nombre +
            "</td><td>" + persona.nombre +
            "</td></tr>";
          htmlclienteDatos1.append(usuarioTemplate);
        })
    })*/

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

    App.contracts.CompraToken.deployed().then(function (instance) {
      TokenInstance = instance;
      return TokenInstance.Activo();
    }).then(function (Activo) {
      Estado = Activo;
      $('.estadoContratoCompraToken').html(Activo.toString());
    })

    App.contracts.Token.deployed().then(function (instance) {
      TokenInstance = instance;
      return TokenInstance.Activo();
    }).then(function (Activo) {
      Estado = Activo;
      $('.estadoContratoToken').html(Activo.toString());
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

  infoCliente: function () {
    var htmlclienteDatos = $("#clienteDatos").empty();
    var persona = {};
    App.contracts.CompraToken.deployed().then(function (instance) {
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
    App.contracts.CompraToken.deployed().then(function (instance) {
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

  EntregaCoche: function () {
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(App.account)
        .then(function (DatosSeguro) {
          CostoAparcado = Number(TiempoAparcadoArray[DatosSeguro[0]]) * Number([DatosSeguro[5]]);
          CostoMovCiudad = Number(TiempoKmCiudadArray[DatosSeguro[0]]) * Number([DatosSeguro[7]]);
          CostoMovCarretera = Number(TiempoKmCarreteraArray[DatosSeguro[0]]) * Number([DatosSeguro[6]]);
          TokensSeguro = Number(CostoAparcado) + Number(CostoMovCiudad) + Number(CostoMovCarretera);
          TipoCoche = DatosSeguro[0];
          IdCoche = DatosSeguro[9];
          console.log(TokensSeguro);
          App.contracts.CompraToken.deployed().then(function (instance) {
            return instance.PagoSeguro(TokensSeguro, TipoCoche, IdCoche, {
              from: App.account,
              value: TokensSeguro * App.PrecioToken,
              gas: 500000
            });
          }).then(function (result) {
            $("#content").show();
            $("#loader").show();
          }).catch(function (err) {
            console.error(err);
          });
        })
    })
  },
  actualizarPrecioAparcado: function (a, b) {
    switch (a) {
      case 0:
        {

          switch (b) {
            case 1:
              {
                var id = 01;
                var valor = $("#actualizaAparcado01").val();
              }
              break;
            case 2:
              {
                var id = 02;
                var valor = $("#actualizaAparcado02").val();
              }
              break;
            case 3:
              {
                var id = 03;
                var valor = $("#actualizaAparcado03").val();

              }
              break;
            case 4:
              {
                var id = 04;
                var valor = $("#actualizaAparcado04").val();
              }
              break;
            case 5:
              {
                var id = 05;
                var valor = $("#actualizaAparcado05").val();
              }
              break;

          }
        }
        break;

      case 1:
        {
          switch (b) {
            case 1:
              {
                var id = 11;
                var valor = $("#actualizaAparcado11").val();

              }
              break;
            case 2:
              {
                var id = 12;
                var valor = $("#actualizaAparcado12").val();

              }
              break;
            case 3:
              {
                var id = 13;
                var valor = $("#actualizaAparcado13").val();

              }
              break;
            case 4:
              {
                var id = 14;
                var valor = $("#actualizaAparcado14").val();

              }
              break;
            case 5:
              {
                var id = 15;
                var valor = $("#actualizaAparcado15").val();

              }
              break;

          }

        }
        break;
      case 2:
        {
          switch (b) {
            case 1:
              {
                var id = 21;
                var valor = $("#actualizaAparcado21").val();
              }
              break;
            case 2:
              {
                var id = 22;
                var valor = $("#actualizaAparcado22").val();
              }
              break;
            case 3:
              {
                var id = 23;
                var valor = $("#actualizaAparcado23").val();
              }
              break;
            case 4:
              {
                var id = 24;
                var valor = $("#actualizaAparcado24").val();
              }
              break;
            case 5:
              {
                var id = 25;
                var valor = $("#actualizaAparcado25").val();
              }
              break;
          }
          break;
        }


    }


    App.contracts.CompraToken.deployed().then(function (instance) {
      return instance.actualizarPrecioAparcado(id, valor, { from: App.account });
    }).then(function (result) {
    }).catch(function (err) {
      console.error(err);
    });
  },


  actualizarPrecioCiudad: function (a, b) {

    switch (a) {
      case 0:
        {
          switch (b) {
            case 1:
              {
                var id = 01;
                var valor = $("#actualizaCiudad01").val();
              }
              break;
            case 2:
              {
                var id = 02;
                var valor = $("#actualizaCiudad02").val();
              }
              break;
            case 3:
              {
                var id = 03;
                var valor = $("#actualizaCiudad03").val();

              }
              break;
            case 4:
              {
                var id = 04;
                var valor = $("#actualizaCiudad04").val();
              }
              break;
            case 5:
              {
                var id = 05;
                var valor = $("#actualizaCiudad05").val();
              }

          }
        }
        break;

      case 1:
        {
          switch (b) {
            case 1:
              {
                var id = 11;
                var valor = $("#actualizaCiudad11").val();

              }
              break;
            case 2:
              {
                var id = 12;
                var valor = $("#actualizaCiudad12").val();

              }
              break;
            case 3:
              {
                var id = 13;
                var valor = $("#actualizaCiudad13").val();

              }
              break;
            case 4:
              {
                var id = 14;
                var valor = $("#actualizaCiudad14").val();

              }
              break;
            case 5:
              {
                var id = 15;
                var valor = $("#actualizaCiudad15").val();

              }

          }

        }
        break;
      case 2:
        {
          switch (b) {
            case 1:
              {
                var id = 21;
                var valor = $("#actualizaCiudad21").val();
              }
              break;
            case 2:
              {
                var id = 22;
                var valor = $("#actualizaCiudad22").val();
              }
              break;
            case 3:
              {
                var id = 23;
                var valor = $("#actualizaCiudad23").val();
              }
              break;
            case 4:
              {
                var id = 24;
                var valor = $("#actualizaCiudad24").val();
              }
              break;
            case 5:
              {
                var id = 25;
                var valor = $("#actualizaCiudad25").val();
              }
          }
          break;
        }


    }


    App.contracts.CompraToken.deployed().then(function (instance) {
      return instance.actualizarPrecioCiudad(id, valor, { from: App.account });
    }).then(function (result) {
      $("#content").show();
      $("#loader").show();
    }).catch(function (err) {
      console.error(err);
    });
  },

  actualizarPrecioCarretera: function (a, b) {

    switch (a) {
      case 0:
        {

          switch (b) {
            case 1:
              {
                var id = 01;
                var valor = $("#actualizaCarretera01").val();
              }
              break;
            case 2:
              {
                var id = 02;
                var valor = $("#actualizaCarretera02").val();
              }
              break;
            case 3:
              {
                var id = 03;
                var valor = $("#actualizaCarretera03").val();

              }
              break;
            case 4:
              {
                var id = 04;
                var valor = $("#actualizaCarretera04").val();
              }
              break;
            case 5:
              {
                var id = 05;
                var valor = $("#actualizaCarretera05").val();
              }

          }
        }
        break;

      case 1:
        {
          switch (b) {
            case 1:
              {
                var id = 11;
                var valor = $("#actualizaCarretera11").val();

              }
              break;
            case 2:
              {
                var id = 12;
                var valor = $("#actualizaCarretera12").val();

              }
              break;
            case 3:
              {
                var id = 13;
                var valor = $("#actualizaCarretera13").val();

              }
              break;
            case 4:
              {
                var id = 14;
                var valor = $("#actualizaCarretera14").val();

              }
              break;
            case 5:
              {
                var id = 15;
                var valor = $("#actualizaCarretera15").val();

              }

          }

        }
        break;
      case 2:
        {
          switch (b) {
            case 1:
              {
                var id = 21;
                var valor = $("#actualizaCarretera21").val();
              }
              break;
            case 2:
              {
                var id = 22;
                var valor = $("#actualizaCarretera22").val();
              }
              break;
            case 3:
              {
                var id = 23;
                var valor = $("#actualizaCarretera23").val();
              }
              break;
            case 4:
              {
                var id = 24;
                var valor = $("#actualizaCarretera24").val();
              }
              break;
            case 5:
              {
                var id = 25;
                var valor = $("#actualizaCarretera25").val();
              }
          }
          break;
        }


    }
    App.contracts.CompraToken.deployed().then(function (instance) {
      return instance.actualizarPrecioCarretera(id, valor, { from: App.account });
    }).then(function (result) {
      $("#content").show();
      $("#loader").show();
    }).catch(function (err) {
      console.error(err);
    });
  },

  contratarLeasing: function (a, b) {
    console.log("entrando contrato Leasing")
    switch (a) {
      case 0:
        {

          switch (b) {
            case 1:
              {
                var precioKmCiudad = ClienteCiudadAseguradora01;
                var precioKmCarretera = ClienteCarreteraAseguradora01;
                var precioAparcado = ClienteAparcadoAseguradora01;
                var pago = PrecioPremium;
                var IdSeguro = 0;
                var tipoCoche = 1;
              }
              break;
            case 2:
              {
                var precioKmCiudad = ClienteCiudadAseguradora02;
                var precioKmCarretera = ClienteCarreteraAseguradora02;
                var precioAparcado = ClienteAparcadoAseguradora02;
                var pago = PrecioLuxure;
                var IdSeguro = 0;
                var tipoCoche = 2;
              }
              break;
            case 3:
              {
                var precioKmCiudad = ClienteCiudadAseguradora03;
                var precioKmCarretera = ClienteCarreteraAseguradora03;
                var precioAparcado = ClienteAparcadoAseguradora03;
                var pago = PrecioClassic;
                var IdSeguro = 0;
                var tipoCoche = 3;

              }
              break;
            case 4:
              {
                var precioKmCiudad = ClienteCiudadAseguradora04;
                var precioKmCarretera = ClienteCarreteraAseguradora04;
                var precioAparcado = ClienteAparcadoAseguradora04;
                var pago = PrecioCorriente;
                var IdSeguro = 0;
                var tipoCoche = 4;
              }
              break;
            case 5:
              {
                var precioKmCiudad = ClienteCiudadAseguradora05;
                var precioKmCarretera = ClienteCarreteraAseguradora05;
                var precioAparcado = ClienteAparcadoAseguradora05;
                var pago = PrecioFurgonetas;
                var IdSeguro = 0;
                var tipoCoche = 5;
              }

          }
        }
        break;

      case 1:
        {
          switch (b) {
            case 1:
              {
                var precioKmCiudad = ClienteCiudadAseguradora11;
                var precioKmCarretera = ClienteCarreteraAseguradora11;
                var precioAparcado = ClienteAparcadoAseguradora11;
                var pago = PrecioPremium;
                var IdSeguro = 1;
                var tipoCoche = 1;

              }
              break;
            case 2:
              {
                var precioKmCiudad = ClienteCiudadAseguradora12;
                var precioKmCarretera = ClienteCarreteraAseguradora12;
                var precioAparcado = ClienteAparcadoAseguradora12;
                var pago = PrecioLuxure;
                var IdSeguro = 1;
                var tipoCoche = 2;

              }
              break;
            case 3:
              {
                var precioKmCiudad = ClienteCiudadAseguradora13;
                var precioKmCarretera = ClienteCarreteraAseguradora13;
                var precioAparcado = ClienteAparcadoAseguradora13;
                var pago = PrecioClassic;
                var IdSeguro = 1;
                var tipoCoche = 3;
              }
              break;
            case 4:
              {
                var precioKmCiudad = ClienteCiudadAseguradora14;
                var precioKmCarretera = ClienteCarreteraAseguradora14;
                var precioAparcado = ClienteAparcadoAseguradora14;
                var pago = PrecioCorriente;
                var IdSeguro = 1;
                var tipoCoche = 4;

              }
              break;
            case 5:
              {
                var precioKmCiudad = ClienteCiudadAseguradora15;
                var precioKmCarretera = ClienteCarreteraAseguradora15;
                var precioAparcado = ClienteAparcadoAseguradora15;
                var pago = PrecioFurgonetas;
                var IdSeguro = 1;
                var tipoCoche = 5;
                

              }

          }

        }
        break;
      case 2:
        {
          switch (b) {
            case 1:
              {
                var precioKmCiudad = ClienteCiudadAseguradora21;
                var precioKmCarretera = ClienteCarreteraAseguradora21;
                var precioAparcado = ClienteAparcadoAseguradora21;
                var pago = PrecioPremium;
                var IdSeguro = 2;
                var tipoCoche = 1;
              }
              break;
            case 2:
              {
                var precioKmCiudad = ClienteCiudadAseguradora22;
                var precioKmCarretera = ClienteCarreteraAseguradora22;
                var precioAparcado = ClienteAparcadoAseguradora22;
                var pago = PrecioLuxure;
                var IdSeguro = 2;
                var tipoCoche = 2;
              }
              break;
            case 3:
              {
                var precioKmCiudad = ClienteCiudadAseguradora23;
                var precioKmCarretera = ClienteCarreteraAseguradora23;
                var precioAparcado = ClienteAparcadoAseguradora23;
                var pago = PrecioClassic;
                var IdSeguro = 2;
                var tipoCoche = 3;
              }
              break;
            case 4:
              {
                var precioKmCiudad = ClienteCiudadAseguradora24;
                var precioKmCarretera = ClienteCarreteraAseguradora24;
                var precioAparcado = ClienteAparcadoAseguradora24;
                var pago = PrecioCorriente;
                var IdSeguro = 2;
                var tipoCoche = 4;

              }
              break;
            case 5:
              {
                var precioKmCiudad = ClienteCiudadAseguradora25;
                var precioKmCarretera = ClienteCarreteraAseguradora25;
                var precioAparcado = ClienteAparcadoAseguradora25;
                var pago = PrecioFurgonetas;
                var IdSeguro = 2;
                var tipoCoche = 5;
              }
          }
          break;
        }


    }

    console.log(precioKmCiudad);
    console.log(precioKmCarretera);
    console.log(precioAparcado);
    console.log(pago);
    console.log(IdSeguro);
    console.log(tipoCoche);


    App.contracts.CompraToken.deployed().then(function (instance) {
      return instance.pagarTokens(pago, precioKmCiudad, precioKmCarretera, precioAparcado,tipoCoche,IdSeguro,{
        from: App.account,
        value: pago * App.PrecioToken,
        gas: 500000
      });
    }).then(function (result) {
      $("#content").show();
      $("#loader").show();
    }).catch(function (err) {
      console.error(err);
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


  Financiar: function () {
    var numeroTokens = $('#numeroTokensFinanciar').val();
    App.contracts.CompraToken.deployed().then(function (instance) {
      return instance.prestamoTokens(numeroTokens, { from: App.account });
    }).then(function (result) {
      $('form').trigger('reset')
    });
  },


  PagarFinanciacion: function () {
    var PagoFinanciacionInicial = ValorPagoPrestamoInicial;
    var PagoFinanciacion = ValorPagoPrestamo;
    App.contracts.CompraToken.deployed().then(function (instance) {
      return instance.PagoFinanciacion(PagoFinanciacion, PagoFinanciacionInicial);
    }).then(function (result) {
      $('form1').trigger('reset')

    });
  },
  
  EliminarValorArray: function () {    
    App.contracts.CompraToken.deployed().then(function (instance) {
      return instance.EliminarValorArray(2,0);
    }).then(function (result) {
      $('form1').trigger('reset')

    });
  },

  /*PagarFinanciacion: function () {
    var CIFEmpresa = $('#CIFEmpresa').val();
    var Hash256 = SHA256(CIFEmpresa);
    console.log(Hash256);
    App.contracts.CompraToken.deployed().then(function (instance) {
      return instance.maestroEmpresas(Hash256);
    }).then(function (result) {
      console.log(result);
      var PagoFinanciacionInicial = ValorPagoPrestamoInicial;
      var PagoFinanciacion = ValorPagoPrestamo;
      Address = result
      App.contracts.CompraToken.deployed().then(function (instance) {
        return instance.PagoFinanciacion(PagoFinanciacion, PagoFinanciacionInicial);
      }).then(function (result) {
        $('form1').trigger('reset')

      });
    })
  },*/



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
    App.contracts.CompraToken.deployed().then(function (instance) {
      return instance.update({ from: App.account });
    }).then(function (result) {
      $("#content").show();
      $("#loader").show();
    }).catch(function (err) {
      console.error(err);
    });
  },

  ZonaAdmin: function () {

    App.contracts.CompraToken.deployed().then(function (instance) {
      return instance.CheckAdmin.call({ fromdetenerContratoToken: App.account });
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
    var PuntosLicencia = $("#PuntosLicenciaAlta").val();

    console.log("Comprobando registro" + IdUsuario);
    console.log("Comprobando registro" + TypeUserString);

    switch (TypeUserString) {
      case ('Cliente'):
        {
          TypeUser = 1;
          var DNI = $("#DNI").val();
          var VATNumber = 'N/A';
          var antiguedadLicencia = $("#AntiguedadLicenciaAlta").val();
          var PuntosLicencia = $("#PuntosLicenciaAlta").val();
          console.log("Comprobando registro" + antiguedadLicencia);
          console.log("uno");
        }
        break;
      case ('Empresa Aseguradora'):
        {
          TypeUser = 2;
          var VATNumber1 = $("#VATNumber").val();

          var VATNumber = web3.sha3(VATNumber1, { encoding: 'hex' });
          var DNI = 'N/A';
          var antiguedadLicencia = 'N/A';
          console.log("dos");
        }
        break;
      case ('Empresa Financiera'):
        {
          TypeUser = 3;
          var VATNumber2 = $("#VATNumber").val();
          var VATNumber = web3.sha3(VATNumber2, { encoding: 'hex' });
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




    if (antiguedadLicencia <= 3) {
      record = (PuntosLicencia / 8 * 10);
    } else if (antiguedadLicencia >= 6 && antiguedadLicencia <= 9) {
      record = (PuntosLicencia / 12) * 10;
    } else if (antiguedadLicencia >= 9 && antiguedadLicencia <= 12) {
      record = (PuntosLicencia / 14) * 10;
    } else if (antiguedadLicencia >= 13) {
      record = (PuntosLicencia / 15) * 10;
    } else {
      record = 0;
    }





    console.log(record);
    App.contracts.CompraToken.deployed().then(function (instance) {
      console.log("Comprobando registro" + TypeUser);
      console.log("Comprobando registro" + VATNumber);
      if (TypeUser == 1) {
        return instance.NewUser(TypeUser, DNI, VATNumber, record, { from: App.account });
      }
      else if (TypeUser == 2 ||
        TypeUser == 3) {
        return instance.NewEmpresa(TypeUser, DNI, VATNumber, record, { from: App.account });
      }
      else {
        return false;
      }
    }).then(function (result) {
      // nuevo usuario
      console.log("Nuevo usuario..." + result);
    }).catch(function (err) {
      console.error(err);
    });
  },

  RegistroCoche: function () {
    console.log("registrando Coche...");
    var IdCoche = $("#IdCocheAlta").val();
    var TypeCocheString = $("#ListaGama").val();


    console.log("Comprobando registro" + IdCoche);
    console.log("Comprobando registro" + TypeCocheString);

    switch (TypeCocheString) {
      case ('Premium'):
        {
          TypeCoche = 1;
          var IdCoche = $("#IdCocheAlta").val();
          console.log("Comprobando registro" + IdCoche);
          console.log("Premium");
        }
        break;
      case ('Luxure'):
        {
          TypeCoche = 2;
          var IdCoche = $("#IdCocheAlta").val();
          console.log("Comprobando registro" + IdCoche);
          console.log("Luxure");
        }
        break;
      case ('Classic'):
        {
          TypeCoche = 3;
          var IdCoche = $("#IdCocheAlta").val();
          console.log("Comprobando registro" + IdCoche);
          console.log("Classic");

        }
        break;
      case ('Corriente'):
        {
          TypeCoche = 4;
          var IdCoche = $("#IdCocheAlta").val();
          console.log("Comprobando registro" + IdCoche);
          console.log("Corriente");

        }
        break;
      case ('Furgoneta'):
        {
          TypeCoche = 5;
          var IdCoche = $("#IdCocheAlta").val();
          console.log("Comprobando registro" + IdCoche);
          console.log("Furgoneta");

        }
        break;
      default:
        {
          TypeCoche = 0;
          console.log("Tipo de Coche incorrecto...");
        }
        break;
    }

    console.log(record);
    App.contracts.CompraToken.deployed().then(function (instance) {
      console.log("Comprobando registro" + TypeCoche);
      console.log("Comprobando registro" + IdCoche);
      return instance.NewCoche(TypeCoche, IdCoche, { from: App.account });
    }).then(function (result) {
      // nuevo usuario
      console.log("Nuevo Coche..." + result);
    }).catch(function (err) {
      console.error(err);
    });
  },





  IngresoUsuario: function () {
    console.log("verificando usuario...")
    var IdUsuario = $("#IdUsuario").val();
    var Password = $("#Contraseña").val();
    App.contracts.CompraToken.deployed().then(function (instance) {
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
    App.contracts.CompraToken.deployed().then(function (instance) {
      infoInstance = instance;
      infoInstance.users(dir)
        .then(function (user) {
          persona_ = {
            IdUsuario: user[0],
            Type: user[4],

          };
          var usuarioTemplate =
            "<tr><th>" + persona_.IdUsuario +
            "</td><td>" + persona_.Type +
            "</td></tr>";
          htmlUserDatos.append(usuarioTemplate);
        })
    })
  },

  removeInfo: function () {
    console.log("borrando usuario...")
    var dir = $("#AddressUsuarioAdmin").val();
    App.contracts.CompraToken.deployed().then(function (instance) {
      return instance.deleteUser(dir, { from: App.account });
    }).then(function (result) {

      console.log("Borrado realizado con éxito" + result);


    }).catch(function (err) {
      console.error(err);
    });
  },


  actualizaLimiteCredito: function () {
    console.log("actualizando el crédito máximo...");
    var VolumenCredito = $("#VolumenCredito").val();
    var Demora = $("#Demora").val();
    var modificadorText = $("#ClienteNuevo").val();
    console.log("Comprobando volumen crédito " + VolumenCredito);
    console.log("Comprobando demora en días " + Demora);
    if (modificadorText == 'Si') {

      modificador = 0.5;

    }
    else if (modificadorText == 'No') {

      modificador = 1;
    }
    else {
      modificador = 0;

    }

    console.log("Comprobando si es nuevo cliente " + modificador);
    maxCredito = VolumenCredito * (Demora / 360) * modificador;
    console.log("Maxcredito " + maxCredito);

    App.contracts.CompraToken.deployed().then(function (instance) {
      window.location.href = "../index.html";
      return instance.asignaCreditoMaximo(maxCredito, { from: App.account });


    }).catch(function (err) {
      console.error(err);
    });
  },

  detenerContratoToken: function () {
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
  BotonAltaCoche: function () {

    App.contracts.CompraToken.deployed().then(function (instance) {
      return instance.CheckAdmin.call({ from: App.account });
    }).then(function (result) {
      if (result == true) {
        console.log(result);
        window.location.href = "../AltaCoches.html";
      };
    }).catch(function (err) {
      console.error(err);
    });
  },

  BotonEntregaCoche: function () {
    App.contracts.CompraToken.deployed().then(function (instance) {
      return instance.CheckAdmin.call({ from: App.account });
    }).then(function (result) {
      if (result == true) {
        console.log(result);
        window.location.href = "../EntregaCoches.html";
      };
    }).catch(function (err) {
      console.error(err);
    });
  },




  detenerContratoCompraToken: function () {
    App.contracts.CompraToken.deployed().then(function (instance) {
      return instance.DetenerContratoCompraToken();
    }).then(function (result) {
      $('form').trigger('reset')
    });
  },

  activarContratoToken: function () {
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
  activarContratoCompraToken: function () {
    App.contracts.CompraToken.deployed().then(function (instance) {
      return instance.ActivarContratoCompraToken();
    }).then(function (result) {
      $('form').trigger('reset')
    });
  },



  /*
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