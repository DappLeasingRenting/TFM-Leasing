pragma solidity ^0.4.2;


import "./SafeMath.sol";

contract Asegurador  {
    address admin;
    
    uint256 public PrecioKmCiudad;
    uint256 public PrecioKmCarretera;
    uint256 public PrecioAparcado;

    event CostoSeguro(uint idCoche, uint TotalCost);

    mapping(uint => uint) public aseguradoraPrecioAparcado;
    mapping(uint => uint) public aseguradoraPrecioCarretera;
    mapping(uint => uint) public aseguradoraPrecioCiudad;

    mapping(uint => address) public adminAseguradora;
    mapping(address => uint) public IdEmpresa;



    function actualizarPrecioAparcado(uint precioAparcado) public {
        /*uint idEmpresa;
        idEmpresa = IdEmpresa[msg.sender];
        require(adminAseguradora[idEmpresa] == msg.sender);
        aseguradoraPrecioAparcado[idEmpresa] = precioAparcado;*/
        aseguradoraPrecioAparcado[0] = precioAparcado;
    }
    function actualizarPrecioCarretera(uint precioCarretera) public {
        uint idEmpresa;
        idEmpresa = IdEmpresa[msg.sender];
        require(adminAseguradora[idEmpresa] == msg.sender);
        aseguradoraPrecioCarretera[idEmpresa] = precioCarretera;
    }
    function actualizarPrecioCiudad(uint precioCiudad) public {
        /*uint idEmpresa;
        idEmpresa = IdEmpresa[msg.sender];
        require(adminAseguradora[idEmpresa] == msg.sender);
        aseguradoraPrecioCiudad[idEmpresa] = precioCiudad;*/
        aseguradoraPrecioCiudad[0] = precioCiudad;
    }


//** @title Constructor. */
    
//** @title Compra de tokens. */
    function costoSeguro(uint idCoche, 
    uint _tiempoAparcado,
    uint _tiempoMovimientoCiudad,
    uint _tiempoMovimientoCarretera, 
    uint record,
    uint CostoAparcado,
    uint CostoMovimientoCiudad,
    uint CostoMovimientoCarretera) public {
          /**@param _numeroTokens cantidad a comprar.
 
      /** @dev verificar que el precio a pagar sea el precio estblecido
      verifica que el contrato cuente con los tokens solicitados para comprar
      verifica que se haya realizado la transacción satisfactoriamente desde el contrato Token.sol.
      Actualiza el valor de los tokens vendidos
      */ 
        uint CostoMovimiento;
        uint CostoTotal;

        CostoAparcado = SafeMath.mul(_tiempoAparcado, PrecioAparcado);
        CostoMovimientoCiudad = SafeMath.mul(_tiempoMovimientoCiudad, PrecioKmCiudad);
        CostoMovimientoCarretera = SafeMath.mul(_tiempoMovimientoCarretera, PrecioKmCarretera);
        CostoMovimiento = SafeMath.add(CostoMovimientoCiudad, CostoMovimientoCarretera);
        CostoTotal = SafeMath.mul((SafeMath.add(CostoMovimientoCiudad, CostoMovimientoCarretera)),(SafeMath.div(1, record)));
        
        emit CostoSeguro(idCoche, CostoTotal);
    }

    


}