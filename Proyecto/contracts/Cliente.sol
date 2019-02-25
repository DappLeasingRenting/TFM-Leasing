pragma solidity ^0.4.2;
import "./SafeMath.sol";
import "./Owned.sol";


contract Cliente is Owned {

    bool public Activo = false;
    uint puntosLicencia = 8;
    
    event nuevoCliente(
        string idLicencia, 
        uint antiguedadLicencia,
        uint record
    );  

    
    string public tipoSeguroXDefecto = '0A';
    string public idCocheXDefecto = '0A';

    mapping(address => cliente) public clientes;
    mapping(address => uint) public ownerCuentaLeasing;
    

       
   

    struct cliente {
        string nombre;
        uint edad;
        string idLicencia;
        uint AntiguedadLicencia;
        bool Seguro;
        string idCoche; 
        bool credito;
        uint recordCliente;
        bool leasing;
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
    function crearCliente(string nombre, uint edad, string idLicencia, uint antiguedadLicencia) public {
        /** @param nombre nombre del usuario.
            @param idUsuario identifiación del usuario.
            @param fecha fecha en la que se realiza el alta del usuario.
        */
        /** @dev verifica que el Smartcontract este activo
        verifica que la address no haya creado un usuario ya en la DAAP y finalmente verifica que no se hayan asignado ya todos los 
        periodos de retiro de Tokens*/

       uint record;
       require(Activo == false);
       //require((ownerCuentaLeasing[msg.sender]) == 0);
        if (antiguedadLicencia <= 3){
            record = SafeMath.div(puntosLicencia, 8);
        }else if (antiguedadLicencia >= 6 && antiguedadLicencia >= 9){
            record = SafeMath.div(puntosLicencia, 12);
        }else if (antiguedadLicencia >= 9 && antiguedadLicencia <= 12){
            record = SafeMath.div(puntosLicencia, 14);
        }else if (antiguedadLicencia > 15){
            record = SafeMath.div(puntosLicencia, 15);
        }
       /** @dev cuando se registra el sexto usuario, se inicializan las fechas para el contrato y para los usuarios, de acuerdo
       a la fecha de registro de último usuario*/             
        /** @dev se da de alta los valores del usuario que se ha registrado para cada uno de lo campos del strcut en el mapping Ahorrado
        Se suma el 1 a los contadores mes y ownerCuenta Ahorro, mesCount y mes*/
        clientes[msg.sender] = cliente(nombre, edad, idLicencia, antiguedadLicencia, false, idCocheXDefecto, false, record,false);
        ownerCuentaLeasing[msg.sender] ++;
        /**@return emite el evento con los datos de mes, nombre y fecha de comienzoAhorro.*/
        emit nuevoCliente(idLicencia, antiguedadLicencia, record);
        
        
    }




    
}