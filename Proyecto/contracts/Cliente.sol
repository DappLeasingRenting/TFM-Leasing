pragma solidity >= 0.5.0 < 0.6.0;
import "./SafeMath.sol";
import "./Owned.sol";
import "installed_contracts/oraclize-api/contracts/usingOraclize.sol";


contract Cliente is Owned, usingOraclize {

        
    bool public Activo = false;
    bool public IsAdmin = false;
    uint puntosLicencia = 80;//Este valor se debe obtener desde un Oráculo
    
    event nuevoCliente(
        uint record
    );  
    event CostoSeguro(
        uint idCoche, 
        uint TotalCost
    );    
    event newRandomNumber_bytes(bytes);
    event newRandomNumber_uint(uint);

    
 
    uint256 public PrecioKmCiudad;
    uint256 public PrecioKmCarretera;
    uint256 public PrecioAparcado;

    mapping(address => Seguro) public CostSeguro;
    mapping(uint => uint) public aseguradoraPrecioAparcado;
    mapping(uint => uint) public aseguradoraPrecioCarretera;
    mapping(uint => uint) public aseguradoraPrecioCiudad;
    mapping(address => user) public users;
    mapping(address => cliente) public clientes;

    struct cliente {
        string nombre;
        string DNI;
        string VATNumber;
        uint Typeuser;
        uint record;
        uint PrecioAparcado;
        uint PrecioKmCarretera;
        uint PrecioKmCiudad;
    }

 struct user {
        string IdUser;
        string DNI;
        string VATNumber;
        uint TypeUser;
        uint record;
        uint PrecioAparcado;
        uint PrecioKmCarretera;
        uint PrecioKmCiudad;
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
    

    function actualizarPrecioAparcado(uint idEmpresa, uint precioAparcado) public {
        aseguradoraPrecioAparcado[idEmpresa] = precioAparcado;
    }
    function actualizarPrecioCarretera(uint idEmpresa, uint precioCarretera) public {
        aseguradoraPrecioCarretera[idEmpresa] = precioCarretera;
    }
    function actualizarPrecioCiudad(uint idEmpresa, uint precioCiudad) public {
        aseguradoraPrecioCiudad[idEmpresa] = precioCiudad;
    }

//para probar si funciona la función de calculo del seguro
   function crearCliente(string memory nombre, uint TypeUser, string memory DNI, string memory VATNumber, uint antiguedadLicencia) public {
        /** @param nombre nomhttps://github.com/DappLeasingRenting/TFM-Leasing.gitbre del usuario.
            @param idUsuario identifiación del usuario.
            @param fecha fecha en la que se realiza el alta del usuario.
        */
        /** @dev verifica que el Smartcontract este activo
        verifica que la address no haya creado un usuario ya en la DAAP y finalmente verifica que no se hayan asignado ya todos los 
        periodos de retiro de Tokens*/

        uint recordCliente;
        require(Activo == false);
       //require((ownerCuentaLeasing[msg.sender]) == 0);
        if (antiguedadLicencia <= 3){
            recordCliente = SafeMath.div(puntosLicencia, 8);
            
        }else if (antiguedadLicencia > 3 && antiguedadLicencia <= 6){
            recordCliente = SafeMath.div(puntosLicencia, 12);
            
        }else if (antiguedadLicencia >= 9 && antiguedadLicencia <= 12){
            recordCliente = SafeMath.div(puntosLicencia, 14);
            
        }else if (antiguedadLicencia > 12){
            recordCliente = SafeMath.div(puntosLicencia, 15);
            
        }
       /** @dev cuando se registra el sexto usuario, se inicializan las fechas para el contrato y para los usuarios, de acuerdo
       a la fecha de registro de último usuario*/             
        /** @dev se da de alta los valores del usuario que se ha registrado para cada uno de lo campos del strcut en el mapping Ahorrado
        Se suma el 1 a los contadores mes y ownerCuenta Ahorro, mesCount y mes*/
        clientes[msg.sender] = cliente(nombre, DNI, VATNumber,TypeUser,recordCliente, 0, 0, 0);
      
        /**@return emite el evento con los datos de mes, nombre y fecha de comienzoAhorro.*/
        emit nuevoCliente(TypeUser);        
    }
      
      

//** @title Constructor. */
    
//** @title Compra de tokens. */
    function costoSeguro() public {
          /**@param _numeroTokens cantidad a comprar.
 
      /** @dev verificar que el precio a pagar sea el precio estblecido
      verifica que el contrato cuente con los tokens solicitados para comprar
      verifica que se haya realizado la transacción satisfactoriamente desde el contrato Token.sol.
      Actualiza el valor de los tokens vendidos
      */ 
        uint _tiempoAparcado = 10;//Debería ser suministrado por Oráculo
        uint _KmCiudad = 100 ;//Debería ser suministrado por Oráculo
        uint _KmCarretera = 50; //Debería ser suministrado por Oráculo
        uint CostoMovCiudad;
        uint CostoMovCarretera;
        uint CostoMovimiento;
        uint CostoAparcado;
        uint CMovRecord;
        uint CostoTotal;
        uint edad;

        //edad = users[msg.sender].edad;
        CostoAparcado = SafeMath.mul(_tiempoAparcado, aseguradoraPrecioAparcado[0]);
        CostoMovCiudad = SafeMath.mul(_KmCiudad, aseguradoraPrecioCiudad[0]);
        CostoMovCarretera = SafeMath.mul(_KmCarretera, aseguradoraPrecioCarretera[0]);
        CostoMovimiento = SafeMath.add(CostoMovCiudad, (SafeMath.add(CostoAparcado, CostoMovCarretera)));
        CMovRecord = SafeMath.mul((CostoMovimiento),(SafeMath.div(1, users[msg.sender].record)));
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

    function fetchUser() public view returns (string memory)

    {

        return (users[msg.sender].IdUser);
    }
    
    /*function RegistraTime() public returns (bool)

    {
        users[msg.sender].timestamp=now;
        return (true);
    }*/

   function NewUser(string memory IdUsuario, uint TypeUser, string memory DNI, string memory VATNumber, uint antiguedadLicencia) public 
    {

       uint record;
        require(Activo == false);
       //require((ownerCuentaLeasing[msg.sender]) == 0);
        if (antiguedadLicencia <= 3){
            record = SafeMath.div(puntosLicencia, 8);
        }else if (antiguedadLicencia >= 6 && antiguedadLicencia <= 9){
            record = SafeMath.div(puntosLicencia, 12);
        }else if (antiguedadLicencia >= 9 && antiguedadLicencia <= 12){
            record = SafeMath.div(puntosLicencia, 14);
        }else if (antiguedadLicencia >= 13){
            record = SafeMath.div(puntosLicencia, 15);
        }
        /*uint recordCliente;

       require(Activo == false);
        if (antiguedadLicencia <= 3){
            record = SafeMath.div(puntosLicencia, 8);
            users[msg.sender].record = record;
        }else if (antiguedadLicencia > 3 && antiguedadLicencia <= 6){
            record = SafeMath.div(puntosLicencia, 12);
            users[msg.sender].record = record;
        }else if (antiguedadLicencia >= 9 && antiguedadLicencia <= 12){
            record = SafeMath.div(puntosLicencia, 14);
            users[msg.sender].record = record;
        }else if (antiguedadLicencia > 12){
            record = SafeMath.div(puntosLicencia, 15);
            users[msg.sender].record = record;
        }*/
        users[msg.sender] = user(IdUsuario, DNI, VATNumber, TypeUser, record, 0, 0, 0);
        /*users[msg.sender].timestamp = now;
        users[msg.sender].IdUser = IdUsuario;
        users[msg.sender].TypeUser = TypeUser;
        users[msg.sender].DNI = DNI;
        users[msg.sender].VATNumber = VATNumber;*/
        
        emit nuevoCliente(TypeUser); 
       
    }


    /*function getUser(address dir) public view returns (string memory ,uint ,uint)

    {

        return (users[dir].IdUser,users[dir].TypeUser,users[dir].timestamp);
    }*/



function deleteUser(address dir) public returns (bool)

    {
        delete users[dir];
        return (true);
    }

    function actualizarSeguro(uint precioKmCiudad, uint precioKmCarretera, uint PrecioAparcados) public returns (bool)

    {
        uint CostoTotal = 0;
        
        CostSeguro[msg.sender] = Seguro(CostoTotal, precioKmCiudad, precioKmCarretera, PrecioAparcados);
      
        return (true);
    }


   function RandomExample() public {
        oraclize_setProof(proofType_Ledger); // sets the Ledger authenticity proof in the constructor
        update(); // let's ask for N random bytes immediately when the contract is created!
    }

    // the callback function is called by Oraclize when the result is ready
    // the oraclize_randomDS_proofVerify modifier prevents an invalid proof to execute this function code:
    // the proof validity is fully verified on-chain
    mapping(uint => uint) public Aleatorio;

    function __callback(bytes32 _queryId, string memory _result, bytes memory _proof) public
    {
        
        require(msg.sender != oraclize_cbAddress());

        if (oraclize_randomDS_proofVerify__returnCode(_queryId, _result, _proof) != 0) {
            // the proof verification has failed, do we need to take any action here? (depends on the use case)
        } else {
            // the proof verification has passed
            // now that we know that the random number was safely generated, let's use it..

            emit newRandomNumber_bytes(bytes(_result)); // this is the resulting random number (bytes)

            // for simplicity of use, let's also convert the random bytes to uint if we need
            uint maxRange = 2**(8* 7); // this is the highest uint we want to get. It should never be greater than 2^(8*N), where N is the number of random bytes we had asked the datasource to return
            uint randomNumber = uint(keccak256(abi.encodePacked(_result))) % maxRange; // this is an efficient way to get the uint out in the [0, maxRange] range
            Aleatorio[0] = randomNumber;
            emit newRandomNumber_uint(randomNumber); // this is the resulting random number (uint)
        }
    }

    function update() public payable {
        uint N = 7; // number of random bytes we want the datasource to return
        uint delay = 0; // number of seconds to wait before the execution takes place
        uint callbackGas = 20000; // amount of gas we want Oraclize to set for the callback function
        bytes32 queryId = oraclize_newRandomDSQuery(delay, N, callbackGas); // this function internally generates the correct oraclize_query and returns its queryId
    } 



}