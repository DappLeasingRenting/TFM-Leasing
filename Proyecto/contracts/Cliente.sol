pragma solidity ^0.4.2;
import "./SafeMath.sol";
import "./Owned.sol";


contract Token {

    bool public Activo = false;
    
    event nuevoCliente(
        address clienteId, 
        uint edad, 
        uint antiguedadLicencia
    );
    event modificar(
        uint idUsuario,
        address adUsuario, 
        uint valorNuevo
    );  

    mapping(address => cliente) public clientes;
    mapping(address => uint) public ownerCuentaLeasing;

       
    
   

    struct cliente {
        address clienteId;
        uint edad;
        uint idLicencia;
        uint AntiguedadLicencia;
        string tipoSeguro;
        string idCoche; 
        bool prestamo;
    }





    //** @title detener el contrato. */
    function DetenerContratoToken() public onlyOwner returns (bool) {
        Activo = true;
        /** @dev Modificar el valor de la variable true desactivando el Smart contract.*/
    }
    //** @title Activar el contrato. */
    function ActivarContratoToken() public onlyOwner returns (bool) {
        Activo = false;
        /** @dev Modificar el valor de la vriable true activando el Smart contract.*/
    }

    //** @title Crear Ahorrador. */
    function _crearCliente(uint edad, uint antiguedadLicencia, string idLicencia) public returns(bool) {
        /** @param nombre nombre del usuario.
            @param idUsuario identifiación del usuario.
            @param fecha fecha en la que se realiza el alta del usuario.
        */
        /** @dev verifica que el Smartcontract este activo
        verifica que la address no haya creado un usuario ya en la DAAP y finalmente verifica que no se hayan asignado ya todos los 
        periodos de retiro de Tokens*/
       require(Activo == false);
       require((ownerCuentaLeasing[msg.sender]) == 0);
       /** @dev cuando se registra el sexto usuario, se inicializan las fechas para el contrato y para los usuarios, de acuerdo
       a la fecha de registro de último usuario*/             
        /** @dev se da de alta los valores del usuario que se ha registrado para cada uno de lo campos del strcut en el mapping Ahorrado
        Se suma el 1 a los contadores mes y ownerCuenta Ahorro, mesCount y mes*/
        clientes[msg.sender] = cliente(msg.sender, edad, idLicencia, antiguedadLicencia, 0, 0, false);
        ownerCuentaLeasing[msg.sender] ++;
        /**@return emite el evento con los datos de mes, nombre y fecha de comienzoAhorro.*/
        emit nuevoCliente(edad, idLicencia, antiguedadLicencia);
        
        
    }



    
}