pragma solidity ^0.4.2;


import "./SafeMath.sol";

contract CompraToken  {
    address admin;
   
    uint256 public PrecioToken;
    uint256 public tokensVendidos;

    event CostoSeguro(idCoche, CostoTotal);
    event recordCliente(msg.sender, idLicencia, record);


//** @title Constructor. */
  
//** @title Compra de tokens. */
    function costoSeguro(uint idCoche, uint _tiempoAparcado, uint _tiempoMovimientoCiudad, uint _tiempoMovimientoCarretera, uint record) public {
          /**@param _numeroTokens cantidad a comprar.
 
      /** @dev verificar que el precio a pagar sea el precio estblecido
      verifica que el contrato cuente con los tokens solicitados para comprar
      verifica que se haya realizado la transacción satisfactoriamente desde el contrato Token.sol.
      Actualiza el valor de los tokens vendidos
      */ 
        CostoAparcado = SafeMath.mult(_tiempoAparcado, PrecioAparcado);
        CostoMovimientoCiudad = SafeMath.mult(_tiempoMovimientoCiudad, PrecioKmCiudad);
        CostoMovimientoCarretera = SafeMath.mult(_tiempoMovimientoCarretera, PrecioKmCarretera);
        CostoMovimiento = SafeMath.add(CostoMovimientoCiudad, CostoMovimientoCarretera);
        CostoTotal = safe.mult((SafeMath.add(CostoMovimientoCiudad, CostoMovimientoCarretera)),(safemath.div(1/record)));

        /** @return devuelve el addres del que compra y la cantidad*/
        emit CostoSeguro(idCoche, CostoTotal);
    }

    function recordCliente(uint idLicencia, uint antiguedadLicencia, uint puntosLicencia /*Oraculo*/) public returns(uint) {
        /** @param nombre nombre del usuario.
            @param idUsuario identifiación del usuario.
            @param fecha fecha en la que se realiza el alta del usuario.
        */
        /** @dev verifica que el Smartcontract este activo
        verifica que la address no haya creado un usuario ya en la DAAP y finalmente verifica que no se hayan asignado ya todos los 
        periodos de retiro de Tokens*/
       require(Activo == false);

        if (antiguedadLicencia <= 3){
            record = SafeMath.div(puntosLicencia, 8);
        }else if (antiguedadLicencia >= 6 && antiguedadLicencia >= 9){
            record = SafeMath.div(puntosLicencia, 12);
        }else if (antiguedadLicencia >= 9 && antiguedadLicencia <= 12){
            record = SafeMath.div(puntosLicencia, 14);
        }else if (antiguedadLicencia > 15){
            record = SafeMath.div(puntosLicencia, 15);
        }
        
        /**@return emite el evento con los datos de mes, nombre y fecha de comienzoAhorro.*/
        emit recordCliente(msg.sender, idLicencia, record);
        
        
    }


//** @title Depotio de tokens. */
    function depositoAhorro(uint256 _contribucion, uint fechaEjecucion) public payable {
        /**@param _contribucion cantidad a ahorrar.
       @param fechaEjecucion fecha en que se realiza el deposito.*/
      /** @dev verificar que el balance de quien envía sea mayor a la cantidad a enviar
      verifica que se haya realizado la transacción satisfactoriamente desde el contrato Token.sol.
      */ 
       require(tokenContract.balanceOf(msg.sender) >= _contribucion);
       require(tokenContract.transferFrom(msg.sender, this, _contribucion, fechaEjecucion));
       /** @return devuelve el address del que solicita el deposito y la cantidad.*/
       emit Deposito(msg.sender, _contribucion);
    }
//** @title Retiro de tokens. */
    function retiroTokens(uint256 _retiro, uint fechaEjecucion) public payable {     
        /**@param _retiro cantidad a retirar.
       @param fechaEjecucion fecha en que se realiza el retiro.*/
      /** @dev verificar que el balance del contrato sea mayor al solicitado por quien retira
      verifica que se haya realizado la transacción satisfactoriamente desde el contrato Token.sol.
      Actualiza el valor de los tokensVendidos*/ 
        require(tokenContract.balanceOf(this) >= _retiro);
        require(tokenContract.transferRetiro(msg.sender, _retiro, fechaEjecucion));

        tokensVendidos += _retiro;
//** @return devuelve el address del que solicita el retiro y la cantidad.*/
        emit Retiro(msg.sender, _retiro);
    }
}