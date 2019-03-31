pragma solidity >= 0.5.0 < 0.6.0;

import "./Token.sol";
import "./SafeMath.sol";
import "./Owned.sol";
import "installed_contracts/oraclize-api/contracts/usingOraclize.sol";

contract CompraToken is Owned, usingOraclize  {
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

bool public Activo = false;
    bool public IsAdmin = false;
    uint puntosLicencia = 80;//Este valor se debe obtener desde un Oráculo
    
    event nuevoCliente(
        uint record
    );  
    event CostoSeguro(         
       uint CostoSeguro
    );    
    event newRandomNumber_bytes(bytes);
    event newRandomNumber_uint(uint);

    
 
    uint256 public PrecioKmCiudad;
    uint256 public PrecioKmCarretera;
    uint256 public PrecioAparcado;

    mapping(address => uint) public CostSeguro;
    mapping(uint => uint) public aseguradoraPrecioAparcado;
    mapping(uint => uint) public aseguradoraPrecioCarretera;
    mapping(uint => uint) public aseguradoraPrecioCiudad;
    mapping(address => user) public users;
    
 struct user {
        string IdUser;
        string DNI;
        string VATNumber;
        uint TypeUser;
        uint record;
        uint PrecioAparcado;
        uint PrecioKmCarretera;
        uint PrecioKmCiudad;        
        uint MaxCredito;
        uint IdCoche;
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
   

//** @title Constructor. */
    
//** @title Compra de tokens. */
    function costoSeguro(uint CostoTotal) public {
          /**@param _numeroTokens cantidad a comprar.
 
      /** @dev verificar que el precio a pagar sea el precio establecido
      verifica que el contrato cuente con los tokens solicitados para comprar
      verifica que se haya realizado la transacción satisfactoriamente desde el contrato Token.sol.
      Actualiza el valor de los tokens vendidos
      */ 
        
        CostSeguro[msg.sender] = CostoTotal;
        emit CostoSeguro(CostoTotal);
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

   function NewUser(string memory IdUsuario, uint TypeUser, string memory DNI, string memory VATNumber, uint record) public 
    {
//solo deberia poder darese de alta una vez el usuario
       
        require(Activo == false);
       //require((ownerCuentaLeasing[msg.sender]) == 0);      
       
        users[msg.sender] = user(IdUsuario, DNI, VATNumber, TypeUser, record, 0, 0, 0, 0, 0);
        
        
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

    

    function actualizarSeguro(uint precioKmCiudad, uint precioKmCarretera, uint precioAparcado) public returns (bool)

    {
        //Solo debería poder contratar un leasing el cliente
        
        users[msg.sender].PrecioAparcado = precioAparcado;
        users[msg.sender].PrecioKmCarretera = precioKmCarretera;
        users[msg.sender].PrecioKmCiudad = precioKmCiudad;

      
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

    function asignaCreditoMaximo(uint maxCredit) public returns (uint){
    users[msg.sender].MaxCredito= maxCredit;
    return users[msg.sender].MaxCredito;
    //asignación de crédito máximo por dirección de usuario
    }




}