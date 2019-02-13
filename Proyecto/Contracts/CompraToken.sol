pragma solidity ^0.4.2;

import "./Token.sol";
import "./SafeMath.sol";

contract CompraToken  {
    address admin;
    Token public tokenContract;
    uint256 public PrecioToken;
    uint256 public tokensVendidos;
    
    

    event Venta(address _comprador, uint256 _tokens);
    event Deposito(address _depositante, uint256 cantidad);
    event Retiro(address _retira, uint256 cantidad);





//** @title Constructor. */
    constructor(Token _tokenContract, uint256 _PrecioToken) public {
         /**@param _tokencontract address del contrato Token.sol.
       @param _PrecioToken recibe el precio de los tokens definidos en el archivo de inicialización*/

      /** @dev Asigna la cuenta administrador al que realiza el deploy
      y asigna los valores recibidos las variables token contract y PrecioToken para utilizarlas en este contrato
      */ 
        admin = msg.sender;
        tokenContract = _tokenContract;
        PrecioToken = _PrecioToken;
    }
//** @title Compra de tokens. */
    function compraTokens(uint256 _numeroTokens) public payable {
          /**@param _numeroTokens cantidad a comprarr.
 
      /** @dev verificar que el precio a pagar sea el precio estblecido
      verifica que el contrato cuente con los tokens solicitados para comprar
      verifica que se haya realizado la transacción satisfactoriamente desde el contrato Token.sol.
      Actualiza el valor de los tokens vendidos
      */ 
        require(msg.value == SafeMath.mul(_numeroTokens, PrecioToken));
        require(tokenContract.balanceOf(this) >= _numeroTokens);
        require(tokenContract.transfer(msg.sender, _numeroTokens));

        tokensVendidos += _numeroTokens;
        /** @return devuelve el addres del que compra y la cantidad*/
        emit Venta(msg.sender, _numeroTokens);
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