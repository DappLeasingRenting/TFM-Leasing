pragma solidity >= 0.5.0 < 0.6.0;

import "./Token.sol";
import "./SafeMath.sol";
import "./Owned.sol";

contract CompraToken is Owned  {
    address admin;
    Token public tokenContract;
    uint256 public PrecioToken;
    uint256 public tokensVendidos;

    
    

    event Venta(address _comprador, uint256 _tokens);
    event Pago(address _depositante, uint256 cantidad);
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
        require(tokenContract.balanceOf(address(this)) >= _numeroTokens);
        require(tokenContract.transfer(msg.sender, _numeroTokens));

        tokensVendidos += _numeroTokens;
        /** @return devuelve el addres del que compra y la cantidad*/
        emit Venta(msg.sender, _numeroTokens);
    }
//** @title Depotio de tokens. */
    function pagarTokens(uint _pago) public payable {
        /**@param _contribucion cantidad a ahorrar.
       @param fechaEjecucion fecha en que se realiza el deposito.*/
      /** @dev verificar que el balance de quien envía sea mayor a la cantidad a enviar
      verifica que se haya realizado la transacción satisfactoriamente desde el contrato Token.sol.
      */ 
        require(tokenContract.balanceOf(msg.sender) >= _pago);
        require(tokenContract.transferFrom(msg.sender, address(this), _pago));
       /** @return devuelve el address del que solicita el deposito y la cantidad.*/
        emit Pago(msg.sender, _pago);
    }

    function aumentarSupply(uint value) public onlyOwner returns (bool) {
        tokenContract.transferAumentoSupply(value);
        return true;
    }

    function prestamoTokens(uint256 _prestamo) public payable {      
        require(tokenContract.balanceOf(address(this)) >= _prestamo);
        require(tokenContract.transfer(msg.sender, _prestamo));

        tokensVendidos += _prestamo;

        emit Retiro(msg.sender, _prestamo);
    }
}
