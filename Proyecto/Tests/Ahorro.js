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
  var fechaComienzoAhorro = 1175806718;
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
      assert.notEqual(address, 0x0, 'El contrato devuelve una address válida diferente de la 0X0 para el addres del contrato Token');
      return CompraTokenInstance.PrecioToken();
    }).then(function (price) {
      assert.equal(price, PrecioToken, 'El precio de los Token (TAC)');
    });
  });
  

  it('Al crear el usuario se devuelven los datos correctos', function () {
    return Token.deployed().then(function (instance) {
      TokenInstance = instance;
      TokenInstance._crearAhorrador("Omar", 16308, 1544897465);
      return TokenInstance.Ahorradores(admin);
    }).then(function (Resultado1) {
      assert.equal(Resultado1[2], "Omar", 'El contrato devuelve los datos correctos de nombre de usuario');;
      assert.equal(Resultado1[1], 16308, 'El contrato devuelve los datos correctos del mes asignado al usuario');
      return TokenInstance.ownerCuentaAhorro(admin);
    }).then(function (ResultadoUsuario) {
      assert.equal(ResultadoUsuario, 1, 'El mapping que almacena la cantidad de usuarios por Address funciona');
    });
  });

  it('Revisión de la compra y Depostito de Tokens', function () {
    return Token.deployed().then(function (instance) {
      
      TokenInstance = instance;
      return CompraToken.deployed();
    }).then(function (instance) {
      CompraToken = instance;
      return TokenInstance.transfer(CompraToken.address, tokensDisponibles, { from: admin })
      //Se realiza el despliegue de la función indicandole los valores requeridos para su debido funcionamiento, e indicando que el ejecutor es la cuenta Admin 
    }).then(function (respuestatransfer1) {
      numeroTokens = 10;
      return CompraToken.compraTokens(numeroTokens, { from: comprador, value: numeroTokens * PrecioToken })
    }).then(function (Compra) {
      //Se verifica que los datos generado en el evento sean correctos
      assert.equal(Compra.logs.length, 1, 'Se registra el evento');
      assert.equal(Compra.logs[0].event, 'Venta', 'Debe generarse le evento Venta');
      assert.equal(Compra.logs[0].args._comprador, comprador, 'Se registra el addres de quien realiza la compra');
      assert.equal(Compra.logs[0].args._tokens, numeroTokens, 'Se muestra en el evento el número de Tokens comprado');
      return CompraToken.tokensVendidos();
    }).then(function (cantidadTokens) {
      assert.equal(cantidadTokens.toNumber(), numeroTokens, 'Se incrementa el número de tokens vendidos');
      return TokenInstance.balanceOf(comprador);
    }).then(function (balance) {
      assert.equal(balance.toNumber(), numeroTokens, 'El número de Tokens del usuario ha cambiado en el valor de tokens comprados');
      numeroTokensDeposito = 10;
      fechaEjecucionDeposito= 2175806719;
      return TokenInstance.transferFrom(CompraToken.address, admin, numeroTokensDeposito, fechaEjecucionDeposito, { from: admin });
    }).then(function (respuestatransferFrom) {
      return CompraToken.depositoAhorro(numeroTokensDeposito, fechaEjecucionDeposito, { from: admin, value: numeroTokens * PrecioToken })
    }).then(function (Deposito) {
      assert.equal(Deposito.logs.length, 1, 'Se registra el evento de deposito');
      assert.equal(Deposito.logs[0].event, 'Deposito', 'Debe generarse le evento Venta');
      assert.equal(Deposito.logs[0].args._depositante, admin, 'Se registra el addres de quien realiza la compra');
      assert.equal(Deposito.logs[0].args.cantidad, numeroTokensDeposito, 'Se muestra en el evento el número de Tokens comprado');
      numeroTokensRetiro = 10;
      fechaEjecucionRetiro = 2175806719;
})
  });



  it('solo permite la creación de máximo 6 usuarios para el ahorro', function () {
    return Token.deployed().then(function (instance) {
      TokenInstance = instance;
      /*Se crea un usuario a través de la cuenta comprador y se realiza una verificación de los datos de alta del mismo*/
      TokenInstance._crearAhorrador("Omar", 16308, 1544897465, {from: comprador});
      return TokenInstance.Ahorradores(comprador);
    }).then(function (Resultado2) {
      assert.equal(Resultado2[2], "Omar", 'El contrato devuelve los datos correctos de nombre de usuario');;
      assert.equal(Resultado2[1], 16308, 'El contrato devuelve los datos correctos del mes asignado al usuario');
      /*Se crea un usuario a través de la cuenta cuenta1 y se realiza una verificación de los datos de alta del mismo*/
      TokenInstance._crearAhorrador("Omar", 16308, 1544897465, {from: cuenta1});
      return TokenInstance.Ahorradores(cuenta1);
    }).then(function (Resultado3) {
      assert.equal(Resultado3[2], "Omar", 'El contrato devuelve los datos correctos de nombre de usuario');;
      assert.equal(Resultado3[1], 16308, 'El contrato devuelve los datos correctos del mes asignado al usuario');
       /*Se crea un usuario a través de la cuenta cuenta2 y se realiza una verificación de los datos de alta del mismo*/
      TokenInstance._crearAhorrador("Omar", 16308, 1544897465, {from: cuenta2});     
      return TokenInstance.Ahorradores(cuenta2);
     }).then(function (Resultado4) {
      assert.equal(Resultado4[2], "Omar", 'El contrato devuelve los datos correctos de nombre de usuario');;
      assert.equal(Resultado4[1], 16308, 'El contrato devuelve los datos correctos del mes asignado al usuario');
      /*Se crea un usuario a través de la cuenta cuenta3 y se realiza una verificación de los datos de alta del mismo*/
      TokenInstance._crearAhorrador("Omar", 16308, 1544897465, {from: cuenta3});      
      return TokenInstance.Ahorradores(cuenta3);
     }).then(function (Resultado5) {
      assert.equal(Resultado5[2], "Omar", 'El contrato devuelve los datos correctos de nombre de usuario');;
      assert.equal(Resultado5[1], 16308, 'El contrato devuelve los datos correctos del mes asignado al usuario');
      /*Se crea un usuario a través de la cuenta cuenta4 y se realiza una verificación de los datos de alta del mismo*/
      TokenInstance._crearAhorrador("Omar", 16308, 1544897465, {from: cuenta4});      
      return TokenInstance.Ahorradores(cuenta4);
     }).then(function (Resultado6) {
      assert.equal(Resultado6[2], "Omar", 'El contrato devuelve los datos correctos de nombre de usuario');;
      assert.equal(Resultado6[1], 16308, 'El contrato devuelve los datos correctos del mes asignado al usuario');
      /*Se crea un  usuario a través de la cuenta cuenta5 y dado que sería el septimo usuario se realiza una verificación 
      del error que se debe generar*/
      return TokenInstance._crearAhorrador("Omar", 16308, 1544897465, {from: cuenta5});      
     }).then(assert.fail).catch(function (error) {
      assert(error.message.indexOf('revert') >= 0, 'no se pueden crear mas de 6 cuentas');
  })
    });

  it('solo permite la creación de un usuario por Address', function () {
    return Token.deployed().then(function (instance) {
      TokenInstance = instance;
      /*Se intenta crear un segundo usuario a través de la cuenta admin que en la prueba de verificación de los datos
      de alta ya se había realizado cuentas ya había creado una*/
      return TokenInstance._crearAhorrador("Omar", 16308, 1544897465,{ from: admin});
    }).then(assert.fail).catch(function (error) {
      assert(error.message.indexOf('revert') >= 0, 'msg.sender solo puede tener un registro');
    })
  });
    it('solo permite el owner pueda realizar la transferencia incial al contracto', function () {
    return Token.deployed().then(function (instance) {
        TokenInstance = instance;
        //se hace la llamada de la fucnión para la transferencia inicial contrato desde una función que no es la Owner(admin)
    return TokenInstance.transferInicial(CompraToken.address, tokensDisponibles, { from: cuenta1 })
  }).then(assert.fail).catch(function (error) {
      assert(error.message.indexOf('revert') >= 0, 'msg.sender solo puede tener un registro');
  })
})
it('solo permite el owner pueda realizar detener el contracto', function () {
  return Token.deployed().then(function (instance) {
      TokenInstance = instance;
  return TokenInstance.DetenerContratoToken({ from: cuenta1 })//se hace la llamada de la fucnión desactivar contrato desde una función que no es la Owner
}).then(assert.fail).catch(function (error) {
    assert(error.message.indexOf('revert') >= 0, 'msg.sender solo puede tener un registro');
})
})

it('solo permite el owner pueda realizar detener el contracto', function () {
  return Token.deployed().then(function (instance) {
      TokenInstance = instance;
  return TokenInstance.ActivarContratoToken({ from: cuenta1 })//se hace la llamada de la función activar contrato desde una función que no es la Owner
}).then(assert.fail).catch(function (error) {
    assert(error.message.indexOf('revert') >= 0, 'msg.sender solo puede tener un registro');
})
})

})