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
    bool public Activo = false;
    bool public IsAdmin = false;
    
    

    event Venta(
        address _comprador,
         uint256 _tokens
         );
         event Prestamo(
        address _comprador,
         uint256 _tokens
         );
    event Pago(
        address _depositante,
         uint256 cantidad
         );
    event Retiro(
        address _retira,
         uint256 cantidad
         );   
    
    event nuevoCliente(
        uint record
    );  
    event CostoSeguro(         
       uint entregado
    );    
    event newRandomNumber_bytes(bytes);
    event newRandomNumber_uint(uint); 

    mapping(address => uint) public CostSeguro;
    mapping(uint => uint) public aseguradoraPrecioAparcado;
    mapping(uint => uint) public aseguradoraPrecioCarretera;
    mapping(uint => uint) public aseguradoraPrecioCiudad;
    mapping(address => user) public users;
    mapping(uint => mapping(uint => coche)) public coches;
    mapping(address => uint) public ownerCuentaLeasing;
    mapping(bytes32 => address) public maestroEmpresas;
    mapping(uint => uint[]) public CochesDisponibles;
    mapping(uint => address) public mappingSeguros;


 struct user {
        uint TipoCoche;
        string DNI;
        bytes32 VATNumber;
        uint TypeUser;
        uint record;
        uint PrecioAparcado;
        uint PrecioKmCarretera;
        uint PrecioKmCiudad;        
        uint MaxCredito;        
        uint IdCoche;
        uint Prestamo;
       
 }
 
   
   struct coche {
uint IdCoche;
uint KmCarretera;
uint KmCiudad;
uint TiempoAparcado;
uint IdSeguro;
bool entregado;
} 


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
        require(Activo == false);
        require(msg.value == SafeMath.mul(_numeroTokens, PrecioToken));
        require(tokenContract.balanceOf(address(this)) >= _numeroTokens);
        require(tokenContract.transfer(msg.sender, _numeroTokens));

        tokensVendidos += _numeroTokens;
        /** @return devuelve el addres del que compra y la cantidad*/
        emit Venta(msg.sender, _numeroTokens);
    }
    function prestamoTokens(uint256 _numeroTokens) public payable {
          /**@param _numeroTokens cantidad a comprarr.
 
      /** @dev verificar que el precio a pagar sea el precio estblecido
      verifica que el contrato cuente con los tokens solicitados para comprar
      verifica que se haya realizado la transacción satisfactoriamente desde el contrato Token.sol.
      Actualiza el valor de los tokens vendidos
      
      */
        require(Activo == false);
        require(_numeroTokens > 0); 
        require(_numeroTokens <= users[msg.sender].MaxCredito);
        require(tokenContract.balanceOf(address(this)) >= _numeroTokens);
        require(tokenContract.transfer(msg.sender, _numeroTokens));

        tokensVendidos += _numeroTokens;
        users[msg.sender].MaxCredito -= _numeroTokens; 
        users[msg.sender].Prestamo += _numeroTokens;
        /** @return devuelve el addres del que compra y la cantidad*/
        emit Prestamo(msg.sender, _numeroTokens);
    }
//** @title Depotio de tokens. */
   function pagarTokens(uint _pago, uint precioKmCiudad, uint precioKmCarretera, uint precioAparcado, uint tipoCoche, uint IdSeguro) public payable {
        /**@param _contribucion cantidad a ahorrar.
       @param fechaEjecucion fecha en que se realiza el deposito.*/
      /** @dev verificar que el balance de quien envía sea mayor a la cantidad a enviar
     
      */require(Activo == false);
        require(tokenContract.balanceOf(msg.sender) >= _pago);
        require(tokenContract.transferFrom(msg.sender, address(this), _pago));
        users[msg.sender].PrecioAparcado = precioAparcado;
        users[msg.sender].PrecioKmCarretera = precioKmCarretera;
        users[msg.sender].PrecioKmCiudad = precioKmCiudad;     
        uint IdCoche = CochesDisponibles[tipoCoche][0];
        users[msg.sender].IdCoche = IdCoche;
        users[msg.sender].TipoCoche = tipoCoche;
        coches[tipoCoche][IdCoche].IdSeguro = IdSeguro;
        EliminarValorArray(tipoCoche);


         
       
       /** @return devuelve el address del que solicita el deposito y la cantidad.*/
        emit Pago(msg.sender, _pago);
    }

   /* function aumentarSupply(uint value) public onlyOwner returns (bool) {
        require(Activo == false);
        tokenContract.transferAumentoSupply(value);
        return true;
    }*/


    
    //** @title detener el contrato. */
    function DetenerContratoCompraToken() public onlyOwner returns (bool) {
        Activo = true;
        /** @dev Modificar el valor de la variable true desactivando el Smart contract.*/
    }
    //** @title Activar el contrato. */
    function ActivarContratoCompraToken() public onlyOwner returns (bool) {
        Activo = false;
        /** @dev Modificar el valor de la variable true activando el Smart contract.*/
    }

    

    function actualizarPrecioAparcado(uint idEmpresa, uint precioAparcado) public {
        require(Activo == false);
        aseguradoraPrecioAparcado[idEmpresa] = precioAparcado;
    }
    function actualizarPrecioCarretera(uint idEmpresa, uint precioCarretera) public {
        require(Activo == false);
        aseguradoraPrecioCarretera[idEmpresa] = precioCarretera;
    }
    function actualizarPrecioCiudad(uint idEmpresa, uint precioCiudad) public {
        require(Activo == false);
        aseguradoraPrecioCiudad[idEmpresa] = precioCiudad;
    }
   

//** @title Constructor. */
    
//** @title Compra de tokens. */
   function PagoSeguro(uint TokensSeguro, uint tipoCoche, uint IdCoche) public payable {       
     require(Activo == false);  
     require(tokenContract.balanceOf(msg.sender) >= TokensSeguro);
     require(tokenContract.transferFrom(msg.sender, address(this),TokensSeguro));
    coches[tipoCoche][IdCoche].entregado = true;
    users[msg.sender].TipoCoche = 0;
    users[msg.sender].IdCoche = 0;
    users[msg.sender].PrecioAparcado = 0;
    users[msg.sender].PrecioKmCarretera = 0;
    users[msg.sender].PrecioKmCiudad = 0;
     tokensVendidos += TokensSeguro;

        
     emit CostoSeguro(TokensSeguro);
    }
    function PagoFinanciacion(uint TokensFinanciacion, uint TokensPrestamo) public payable {       
     require(Activo == false);        
     require(tokenContract.balanceOf(msg.sender) >= TokensFinanciacion);
     require(tokenContract.transferFrom(msg.sender, address(this),TokensFinanciacion));

     tokensVendidos += TokensFinanciacion;
     users[msg.sender].Prestamo -= TokensPrestamo;

        //users[msg.sender].Entregado = true;
        //emit CostoSeguro(users[msg.sender].Entregado);
     emit CostoSeguro(TokensFinanciacion);
    }





    function CheckAdmin() public onlyOwner returns (bool)
    {   
        require(Activo == false);
        IsAdmin = true; 
        return (IsAdmin);
        //returns true if it is the owner of the contract
    }

    function fetchTypeUser() public view returns (uint)

    {
        require(Activo == false);
        return (users[msg.sender].TypeUser);
    }
    
    

    /*function RegistraTime() public returns (bool)

    {
        users[msg.sender].timestamp=now;
        return (true);
    }*/

 
   function NewUser(uint TypeUser, string memory DNI, bytes32 VATNumber, uint record) public 
    {
//solo deberia poder darese de alta una vez el usuario
       
    require(Activo == false);
    require((ownerCuentaLeasing[msg.sender]) == 0);    
    ownerCuentaLeasing[msg.sender] ++;       
    users[msg.sender] = user(0, DNI, VATNumber, TypeUser, record, 0, 0, 0, 0, 0,0);
   
        
    emit nuevoCliente(TypeUser); 
       
    }
   function NewEmpresa(uint TypeUser, string memory DNI, bytes32 VATNumber, uint record) public 
    {
       
    require(Activo == false);
    require((ownerCuentaLeasing[msg.sender]) == 0);    
    ownerCuentaLeasing[msg.sender] ++;       
    users[msg.sender] = user(0, DNI, VATNumber, TypeUser, record, 0, 0, 0, 0, 0,0);
    maestroEmpresas[VATNumber] = msg.sender;

    
       
    }
   function NewCoche(uint tipoCoche, uint IdCoche) public 
    {       
    require(Activo == false);           
    coches[tipoCoche][IdCoche] = coche(IdCoche,0, 0, 0, 0,false);
    CochesDisponibles[tipoCoche].push(IdCoche);
       }

       function ValidarCoche(uint tipoCoche, uint IdCoche) public 
    {       
    require(Activo == false);           
    coches[tipoCoche][IdCoche].entregado = false;
    CochesDisponibles[tipoCoche].push(IdCoche);
       }



function consultaArray(uint tipoCoche) public view returns(uint count) {
    return CochesDisponibles[tipoCoche].length;
}
function consultaArrayDatos(uint tipoCoche, uint posicion) public view returns(uint valor) {
    return CochesDisponibles[tipoCoche][posicion];
}

function EliminarValorArray(uint tipoCoche) public  returns( uint[] memory array){
            
uint index = 0;
        for (uint i = index; i<CochesDisponibles[tipoCoche].length-1; i++){
            CochesDisponibles[tipoCoche][i] = CochesDisponibles[tipoCoche][i+1];
        }
        CochesDisponibles[tipoCoche].length--;
        return CochesDisponibles[tipoCoche];
    }



    /*function getUser(address dir) public view returns (string memory ,uint ,uint)

    {

        return (users[dir].IdUser,users[dir].TypeUser,users[dir].timestamp);
    }*/



function deleteUser(address dir) public returns (bool)

    {
        require(Activo == false);
        delete users[dir];
        return (true);
    }  

  /* function RandomExample() public {
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
    } */

    function asignaCreditoMaximo(uint maxCredit) public returns (uint){
    require(Activo == false);
    users[msg.sender].MaxCredito= maxCredit;
    return users[msg.sender].MaxCredito;
    //asignación de crédito máximo por dirección de usuario
    }




}