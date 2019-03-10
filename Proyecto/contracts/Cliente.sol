pragma solidity ^0.4.2;
import "./SafeMath.sol";
import "./Owned.sol";


contract Cliente is Owned {

    bool public Activo = false;
    bool public IsAdmin = false;
    uint puntosLicencia = 8;
    
    event nuevoCliente(
        string idLicencia, 
        uint antiguedadLicencia,
        uint record
    );  
    event CostoSeguro(
        uint idCoche, 
        uint TotalCost
    );    
    string public tipoSeguroXDefecto = "0A";
    string public idCocheXDefecto = "0A";
    address admin;    
    uint256 public PrecioKmCiudad;
    uint256 public PrecioKmCarretera;
    uint256 public PrecioAparcado;

    mapping(address => Seguro) public CostSeguro;
    mapping(address => cliente) public clientes;
    mapping(address => uint) public ownerCuentaLeasing;
    mapping(uint => uint) public aseguradoraPrecioAparcado;
    mapping(uint => uint) public aseguradoraPrecioCarretera;
    mapping(uint => uint) public aseguradoraPrecioCiudad;
    mapping(uint => address) public adminAseguradora;
    mapping(address => uint) public IdEmpresa;
    mapping(address => user) public users;

   struct user {
        string IdUser;
        string Password;
        string DNI;
        string VATNumber;
        uint TypeUser;
        uint256 timestamp;
    }
   

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
    struct Seguro {
        uint CostoTotal;
        uint KmCiudad;
        uint KmCarretera;
        uint TiempoAparcado;
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

    function actualizarPrecioAparcado(uint precioAparcado) public {
        /*uint idEmpresa;
        idEmpresa = IdEmpresa[msg.sender];
        require(adminAseguradora[idEmpresa] == msg.sender);
        aseguradoraPrecioAparcado[idEmpresa] = precioAparcado;*/
        aseguradoraPrecioAparcado[0] = precioAparcado;
    }
    function actualizarPrecioCarretera(uint precioCarretera) public {
        /*uint idEmpresa;
        idEmpresa = IdEmpresa[msg.sender];
        require(adminAseguradora[idEmpresa] == msg.sender);
        aseguradoraPrecioCarretera[idEmpresa] = precioCarretera;*/
        aseguradoraPrecioCarretera[0] = precioCarretera;
    }
    function actualizarPrecioCiudad(uint precioCiudad) public {
        /*uint idEmpresa;
        idEmpresa = IdEmpresa[msg.sender];
        require(adminAseguradora[idEmpresa] == msg.sender);
        aseguradoraPrecioCiudad[idEmpresa] = precioCiudad;*/
        aseguradoraPrecioCiudad[0] = precioCiudad;
    }

//para probar si funciona la función de calculo del seguro
    uint _tiempoAparcado = 10;
    uint _KmCiudad = 100 ;
    uint _KmCarretera = 50; 
 

//** @title Constructor. */
    
//** @title Compra de tokens. */
    function costoSeguro() public {
          /**@param _numeroTokens cantidad a comprar.
 
      /** @dev verificar que el precio a pagar sea el precio estblecido
      verifica que el contrato cuente con los tokens solicitados para comprar
      verifica que se haya realizado la transacción satisfactoriamente desde el contrato Token.sol.
      Actualiza el valor de los tokens vendidos
      */ 
        uint CostoMovCiudad;
        uint CostoMovCarretera;
        uint CostoMovimiento;
        uint CostoAparcado;
        uint CMovRecord;
        uint CostoTotal;
        uint edad;

        edad = clientes[msg.sender].edad;
        CostoAparcado = SafeMath.mul(_tiempoAparcado, aseguradoraPrecioAparcado[0]);
        CostoMovCiudad = SafeMath.mul(_KmCiudad, aseguradoraPrecioCiudad[0]);
        CostoMovCarretera = SafeMath.mul(_KmCarretera, aseguradoraPrecioCarretera[0]);
        CostoMovimiento = SafeMath.add(CostoMovCiudad, (SafeMath.add(CostoAparcado, CostoMovCarretera)));
        CMovRecord = SafeMath.mul((CostoMovimiento),(SafeMath.div(1, clientes[msg.sender].recordCliente)));
        CostoTotal = SafeMath.mul(CMovRecord, SafeMath.div(65,edad));
        CostSeguro[msg.sender] = Seguro(CostoTotal, _KmCiudad, _KmCarretera, _tiempoAparcado);
        emit CostoSeguro(edad, CostoTotal);
    }

    function CheckAdmin() public onlyOwner returns (bool)
    {   
    
        IsAdmin = true; 
        return (IsAdmin);
        //returns true if it is the owner of the contract

    }

    function fetchUser() public view returns (string, string)

    {

        return (users[msg.sender].IdUser,users[msg.sender].Password);
    }
    
    function RegistraTime() public returns (bool)

    {
        users[msg.sender].timestamp=now;
        return (true);
    }

    function NewUser(string _IdUsuario, string _Password,uint _TypeUser,string _DNI,string _VATNumber) public returns (bool)

    {
        users[msg.sender].timestamp=now;
        users[msg.sender].IdUser=_IdUsuario;
        users[msg.sender].Password=_Password;
        users[msg.sender].TypeUser=_TypeUser;
        users[msg.sender].DNI=_DNI;
        users[msg.sender].VATNumber=_VATNumber;
        return (true);
    }



}