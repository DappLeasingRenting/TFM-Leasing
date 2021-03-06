var Token = artifacts.require('./Token.sol');
var CompraToken = artifacts.require('./CompraToken.sol');


contract('CompraToken', function (accounts) {
  var TokenInstance;
  var CompraTokenInstance;
  var admin = accounts[0];
  var comprador = accounts[1];
  var cuenta1 = accounts[2];
  var cuenta2 = accounts[3];
  var cuenta3 = accounts[4];
  var cuenta4 = accounts[5];
  var cuenta5 = accounts[6];
  var PrecioToken = 1000000000000000; // en wei
  var tokensDisponibles = 1000000;
  var numeroTokens;


  it('Se incializa el contrato CompraToken con los valores correctos y se verifica las address de Token y CompraToken', function () {
    return CompraToken.deployed().then(function (instance) {
      // Se graba la instancia
      CompraTokenInstance = instance;
      //Se solicita el address del contrato Compratoken
      return CompraTokenInstance.address
    }).then(function (address) {
      assert.notEqual(address, 0x0, 'el contrato devuelve una address válida diferente de la 0X0');
      return CompraTokenInstance.tokenContract();
    }).then(function (address) {
      assert.notEqual(address, 0x0, 'El contrato devuelve una address válida diferente de la 0X0 para el address del contrato Token');
      return CompraTokenInstance.PrecioToken();
    }).then(function (price) {
      assert.equal(price, PrecioToken, 'El precio de los Token (LST)');
    });
  });
  

  it('Al crear el usuario  de tipo cliente se devuelven los datos correctos', function () {
    return CompraToken.deployed().then(function (instance) {
      CompraTokenInstance = instance;
      return CompraTokenInstance.NewUser(1,"76921645L", cuenta3,10, { from: cuenta2 }); 
    }).then(function (Resultado1) {
      assert.equal(Resultado1.logs[0].event, 'nuevoCliente', 'El evento se ha generado');
      assert.equal(Resultado1.logs[0].args.TypeUser, 1, 'El tipo de usuario es el correcto');
      assert.equal(Resultado1.logs[0].args.DNI, "76921645L", 'El DNI de usuario es el correcto');
      return CompraTokenInstance.users(cuenta2);
    }).then(function (ResultadoUsuario) {
      assert.equal(ResultadoUsuario[1], "76921645L", 'El DNI se ha almacenado correctamente');
    });
  });


  it('Al crear el usuario  de tipo empresa aseguradora se devuelven los datos correctos', function () {
    return CompraToken.deployed().then(function (instance) {
      CompraTokenInstance = instance;
      return CompraTokenInstance.NewEmpresa(2, "76921645L", "0xeb8a0653c627d29be3c312cea5c10e1b6a0d66bfed70ea9d4bd57d3a38716986", 10, { from: cuenta1 }); //el tercer parámatro corresponde al hash 256 de A58818501
    }).then(function (Resultado) {
      assert.equal(Resultado.logs[0].event, 'nuevaEmpresa', 'El evento se ha generado');
      assert.equal(Resultado.logs[0].args.TypeUser, 2, 'El tipo de usuario es el correcto');
      assert.equal(Resultado.logs[0].args.VATNumber, "0xeb8a0653c627d29be3c312cea5c10e1b6a0d66bfed70ea9d4bd57d3a38716986", 'El hash del CIF se ha generado con éxito');
      return CompraTokenInstance.maestroEmpresas("0xeb8a0653c627d29be3c312cea5c10e1b6a0d66bfed70ea9d4bd57d3a38716986");
    }).then(function (ResultadoUsuario) {
      assert.equal(ResultadoUsuario, cuenta1, 'La dirección desde la que se ha creado la empresa es la correcta'); //El hash 256 del CIF que le estoy metindo me debería de devlver la dirección desde la que se ha creado la cuenta
    });
  });


  it('El fetch del usuario se hace de la manera correcta', function () {
    return CompraToken.deployed().then(function (instance) {
      CompraTokenInstance = instance;
      return CompraTokenInstance.NewUser(1,"76921645Q", cuenta5,10, { from: cuenta4 }); 
    }).then(function (Resultado1) {
      assert.equal(Resultado1.logs[0].event, 'nuevoCliente', 'El evento se ha generado');
      assert.equal(Resultado1.logs[0].args.TypeUser, 1, 'El tipo de usuario es el correcto');
      assert.equal(Resultado1.logs[0].args.DNI, "76921645Q", 'El DNI de usuario es el correcto');
      return CompraTokenInstance.fetchTypeUser({ from: cuenta4 });
    }).then(function (ResultadoTypeUsuario) {
      assert.equal(ResultadoTypeUsuario, 1, 'El fetch del usuario se hace de la manera correcta');
    });
  });


  it('La asignación de un coche nuevo se hace de la manera correcta', function () {
    return CompraToken.deployed().then(function (instance) {
      CompraTokenInstance = instance;
      return CompraTokenInstance.NewCoche(1,1,{ from: cuenta4 }); 
    }).then(function (Resultado1) {
      assert.equal(Resultado1.logs[0].event, 'CocheAsignado', 'El evento se ha generado');
      assert.equal(Resultado1.logs[0].args.tipoCoche, 1, 'El tipo de coche es correcto');
      assert.equal(Resultado1.logs[0].args.IdCoche, 1, 'El ID de coche es correcto');
      
    });
  });

  it('La validación de un coche se hace de la manera correcta', function () {
    return CompraToken.deployed().then(function (instance) {
      CompraTokenInstance = instance;
      return CompraTokenInstance.ValidarCoche(1,1,{ from: cuenta4 }); 
    }).then(function (Resultado1) {
      assert.equal(Resultado1.logs[0].event, 'CocheValidado', 'El evento se ha generado');
      assert.equal(Resultado1.logs[0].args.tipoCoche, 1, 'El tipo de coche es correcto');
      assert.equal(Resultado1.logs[0].args.IdCoche, 1, 'El ID de coche es correcto');
      
    });
  });


  it('La actualización del número de coches se hace de la manera correcta', function () { //asignamos 3 coches: con el inicial el resultado sería 4
    return CompraToken.deployed().then(function (instance) {
      CompraTokenInstance = instance;
      return CompraTokenInstance.NewCoche(1,1,{ from: cuenta4 }); 
    }).then(function (Resultado1) {
      assert.equal(Resultado1.logs[0].event, 'CocheAsignado', 'El evento se ha generado');
      assert.equal(Resultado1.logs[0].args.tipoCoche, 1, 'El tipo de coche es correcto');
      assert.equal(Resultado1.logs[0].args.IdCoche, 1, 'El ID de coche es correcto');
      return CompraTokenInstance.NewCoche(1,2,{ from: cuenta3 }); 
    }).then(function (Resultado1) {
      assert.equal(Resultado1.logs[0].event, 'CocheAsignado', 'El evento se ha generado');
      assert.equal(Resultado1.logs[0].args.tipoCoche, 1, 'El tipo de coche es correcto');
      assert.equal(Resultado1.logs[0].args.IdCoche, 2, 'El ID de coche es correcto');
      return CompraTokenInstance.NewCoche(1,3,{ from: cuenta1 }); 
    }).then(function (Resultado1) {
      assert.equal(Resultado1.logs[0].event, 'CocheAsignado', 'El evento se ha generado');
      assert.equal(Resultado1.logs[0].args.tipoCoche, 1, 'El tipo de coche es correcto');
      assert.equal(Resultado1.logs[0].args.IdCoche, 3, 'El ID de coche es correcto');
      return CompraTokenInstance.EliminarValorArray(1,{ from: admin }); 
    }).then(function (Resultado1) {
      assert.equal(Resultado1.logs[0].event, 'EliminaCochesArray', 'El evento se ha generado');
      assert.equal(Resultado1.logs[0].args.NumeroCoches, 4, 'El número de coches es el correcto');
      
    });
  });

  it('Creamos usuario y verificamos que se ha eliminado con éxito', function () {
    return CompraToken.deployed().then(function (instance) {
      CompraTokenInstance = instance;
      return CompraTokenInstance.NewUser(1,"76921645L", cuenta3,10, { from: admin }); 
    }).then(function (Resultado1) {
      assert.equal(Resultado1.logs[0].event, 'nuevoCliente', 'El evento se ha generado');
      assert.equal(Resultado1.logs[0].args.TypeUser, 1, 'El tipo de usuario es el correcto');
      assert.equal(Resultado1.logs[0].args.DNI, "76921645L", 'El DNI de usuario es el correcto');
      return CompraTokenInstance.deleteUser(admin);
    }).then(function (ResultadoUsuario) {
      assert.equal(ResultadoUsuario.logs[0].event, 'UsuarioEliminado', 'El evento se ha generado');
      assert.equal(ResultadoUsuario.logs[0].args.salida, true, 'El usuario se ha eliminado correctamente');

    });
  });


  it('Creamos usuario y comprobamos que el crédito se ha asignado con éxito', function () {
    return CompraToken.deployed().then(function (instance) {
      CompraTokenInstance = instance;
      return CompraTokenInstance.NewUser(1,"76921645L", cuenta4,10, { from: cuenta5 }); 
    }).then(function (Resultado1) {
      assert.equal(Resultado1.logs[0].event, 'nuevoCliente', 'El evento se ha generado');
      assert.equal(Resultado1.logs[0].args.TypeUser, 1, 'El tipo de usuario es el correcto');
      assert.equal(Resultado1.logs[0].args.DNI, "76921645L", 'El DNI de usuario es el correcto');
      return CompraTokenInstance.asignaCreditoMaximo(1000, { from: cuenta5 });
    }).then(function (ResultadoUsuario) {
      assert.equal(ResultadoUsuario.logs[0].event, 'CreditoMaxAsignado', 'El evento se ha generado');
      assert.equal(ResultadoUsuario.logs[0].args.maxCredit, 1000, 'El crédito se ha asignado correctamente');
      return CompraTokenInstance.users(cuenta5);
    }).then(function (ResultadoUsuario) {
      assert.equal(ResultadoUsuario[8], 1000, 'En el mapping el crédito está correctamente registrado');
    });

  });


  it('Comprobamos si la DetenerContrato funciona con un address que no es el admin', function () {
    return CompraToken.deployed().then(function (instance) {
      CompraTokenInstance = instance;
      return CompraTokenInstance.DetenerContratoCompraToken({ from: cuenta5 }); 
    }).then(assert.fail).catch(function (error) {
      assert(error.message.indexOf('revert') >= 0, 'es correcto al no ser admin'); 
    });

  });

  it('Comprobamos si la ActivarContrato funciona con un address que no es el admin', function () {
    return CompraToken.deployed().then(function (instance) {
      CompraTokenInstance = instance;
      return CompraTokenInstance.ActivarContratoCompraToken({ from: cuenta4 }); 
    }).then(assert.fail).catch(function (error) {
      assert(error.message.indexOf('revert') >= 0, 'es correcto al no ser admin'); 
    });

  });


  it('Verificamos que el precio por km aparcado se registra de forma correcta ', function () {
    return CompraToken.deployed().then(function (instance) {
      CompraTokenInstance = instance;
      return CompraTokenInstance.actualizarPrecioAparcado(1, 40, { from: admin });
    }).then(function (ResultadoUsuario) {
      assert.equal(ResultadoUsuario.logs[0].event, 'actualizarPrecioAparcadoE', 'El evento se ha generado');
      assert.equal(ResultadoUsuario.logs[0].args.PrecioAparcado, 40, 'El precio del kilómetro aparcado es correcto');
      return CompraTokenInstance.aseguradoraPrecioAparcado(1);
    }).then(function (ResultadoPrecio) {
      assert.equal(ResultadoPrecio, 40, 'En el mapping el precio está correctamente registrado');
    });
  });


  it('Verificamos que el precio por km por carretera se registra de forma correcta ', function () {
    return CompraToken.deployed().then(function (instance) {
      CompraTokenInstance = instance;
      return CompraTokenInstance.actualizarPrecioCarretera(1, 40, { from: admin });
    }).then(function (ResultadoUsuario) {
      assert.equal(ResultadoUsuario.logs[0].event, 'actualizarPrecioCarreteraE', 'El evento se ha generado');
      assert.equal(ResultadoUsuario.logs[0].args.PrecioCarretera, 40, 'El precio del kilómetro carretera es correcto');
      return CompraTokenInstance.aseguradoraPrecioCarretera(1);
    }).then(function (ResultadoPrecio) {
      assert.equal(ResultadoPrecio, 40, 'En el mapping el precio está correctamente registrado');
    });
  });

  it('Verificamos que el precio por km ciudad se registra de forma correcta ', function () {
    return CompraToken.deployed().then(function (instance) {
      CompraTokenInstance = instance;
      return CompraTokenInstance.actualizarPrecioCiudad(1, 40, { from: admin });
    }).then(function (ResultadoUsuario) {
      assert.equal(ResultadoUsuario.logs[0].event, 'actualizarPrecioCiudadE', 'El evento se ha generado');
      assert.equal(ResultadoUsuario.logs[0].args.PrecioCiudad, 40, 'El precio del kilómetro ciudad es correcto');
      return CompraTokenInstance.aseguradoraPrecioCiudad(1);
    }).then(function (ResultadoPrecio) {
      assert.equal(ResultadoPrecio, 40, 'En el mapping el precio está correctamente registrado');
    });
  });


  it('Verificamos que el pago del seguro se realiza de forma correcta ', function () {
    return CompraToken.deployed().then(function (instance) {
      CompraTokenInstance = instance;
      return CompraTokenInstance.PagoSeguro(100, 1, 1, cuenta3,{ from: admin });
    }).then(function (ResultadoUsuario) {
      assert.equal(ResultadoUsuario.logs[0].event, 'CostoSeguro', 'El evento se ha generado');
      assert.equal(ResultadoUsuario.logs[0].args.entregado, 100, 'El número de tokens coincide');
    });
  });

  it('Verificamos que el pago de la financiación se realiza de forma correcta ', function () {
    return CompraToken.deployed().then(function (instance) {
      CompraTokenInstance = instance;
      return CompraTokenInstance.PagoFinanciacion(100, 50, cuenta3,{ from: admin });
    }).then(function (ResultadoUsuario) {
      assert.equal(ResultadoUsuario.logs[0].event, 'CostoSeguro', 'El evento se ha generado');
      assert.equal(ResultadoUsuario.logs[0].args.entregado, 100, 'El número de tokens coincide');
    });
  });

  it('Comprobamos que CheckAdmin devuelve false si no es el admin', function () {
    return CompraToken.deployed().then(function (instance) {
      CompraTokenInstance = instance;
      return CompraTokenInstance.CheckAdmin({ from: cuenta4 }); 
    }).then(assert.fail).catch(function (error) {
      assert(error.message.indexOf('revert') >= 0, 'es correcto al no ser admin'); 
    });

  });




  it('Revisión de la compra de Tokens y transferencia inicial', function () {
        return Token.deployed().then(function (instance) {
          tokensDisponibles=10000;
          TokenInstance = instance;
          return CompraToken.deployed();
        }).then(function (instance) {
          CompraToken = instance;
         
          return TokenInstance.transfer(CompraToken.address, tokensDisponibles, { from: admin })
        
          //Se realiza el despliegue de la función indicandole los valores requeridos para su debido funcionamiento, e indicando que el ejecutor es la cuenta Admin 
        }).then(function (respuestatransfer1) {
          numeroTokens = 10;
          return CompraToken.compraTokens(numeroTokens, { from: admin, value: numeroTokens * PrecioToken })
        }).then(function (Compra) {
          //Se verifica que los datos generado en el evento sean correctos
          assert.equal(Compra.logs.length, 1, 'Se registra el evento');
          assert.equal(Compra.logs[0].event, 'Venta', 'Debe generarse el evento Venta');
          assert.equal(Compra.logs[0].args._comprador, admin, 'Se registra el addres de quien realiza la compra');
          assert.equal(Compra.logs[0].args._tokens, numeroTokens, 'Se muestra en el evento el número de Tokens comprado');    
          return TokenInstance.transferInicial(admin, 100)
                  }).then(function (Compra) {
          //Se verifica que los datos generado en el evento sean correctos
          assert.equal(Compra.logs.length, 1, 'Se registra el evento');
          assert.equal(Compra.logs[0].event, 'TransferInicial', 'Debe generarse le evento Venta');
          assert.equal(Compra.logs[0].args._to, admin, 'destino');
          assert.equal(Compra.logs[0].args._value, 100, 'valor');
          
     })
      });



})