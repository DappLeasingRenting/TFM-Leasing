pragma solidity >= 0.5.0 < 0.6.0;
import "./SafeMath.sol";
import "./Owned.sol";


contract Token is Owned {

    uint256 public totalSupply;
    bool public Activo = false;


    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );
    event TransferInicial(
        address Owner,
        address _to,
        uint256 _value
    );

    event TransferRetiro(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );
    event nuevoAhorrador(
        uint Id, 
        string nombre, 
        uint fechaComienzoAhorro
    );
    event modificar(
        uint idUsuario,
        address adUsuario, 
        uint valorNuevo
    );
    event TransferAumentoSupply(
        uint _value
    );
    

    
    mapping(address => uint256) public balanceOf;
    mapping(address => uint256) public depositoOf;
    mapping(address => uint) public ownerCuentaAhorro;
    mapping(address => uint) public mesCount;
       
    
    constructor(uint _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply; //Al realizar el desplegue del contracto 2_deploy_contracts se indica el initial supply
        totalSupply = _initialSupply;

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
    
    //** @title Realizar transferencia inicial, solo ejecutable por el Owner. */    
    function transferInicial(address _to, uint256 _value) public onlyOwner returns (bool success) {
       /**   @param _to address de la cuenta a al que se quiere realizar la transacción.
             @param _value cantidad de tokens que van a ser trasnferido.
        */
        
        
        /** @dev verifica que el Smartcontract este activo
        Verifica que el balance de quien realiza la transferncia sean mayores o iguales a el valor que se desea enviar
        Se actualizan los balances de las cuentas, a la que envía se le resta y a la otra se le suma, y se actualiza en el mapping ahorrador
        y BalanceOF*/
        require(Activo == false);
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] = SafeMath.sub(balanceOf[msg.sender],_value);
        uint256  saldo = SafeMath.add(balanceOf[_to],_value);   
        balanceOf[_to] = saldo;   
     
        /**@return Se emite el evento con las datos de address del que envía, el que recibe y la cantidad*/
        emit TransferInicial(msg.sender, _to, _value);
        /**@return Si se ha realizado la transacción devueleve al contrato CompraToken el valor true*/
        return true;
    }

   //** @title Realizar transferencia a una cuenta. */ 
    function transfer(address _to, uint256 _value) public returns (bool success) {
         /**   @param _to address de la cuenta a al que se quiere realizar la transacción.
             @param _value cantidad de tokens que van a ser trasnferido.
        */

        /** @dev verifica que el Smartcontract este activo
        Verifica que el balance de quien realiza la transferncia sean mayores o iguales a el valor que se desea enviar
        Se actualizan los balances de las cuentas, a la que envía se le resta y a la otra se le suma, y se actualiza en el mapping ahorrador
        y BalanceOF*/
        require(Activo == false);
        require(balanceOf[msg.sender] >= _value);        
        balanceOf[msg.sender] = SafeMath.sub(balanceOf[msg.sender],_value);
        uint256  saldo = SafeMath.add(balanceOf[_to],_value);   
        balanceOf[_to] = saldo;   
        /**@return Se emite el evento con las datos de address del que envía, el que recibe y la cantidad*/
        emit Transfer(msg.sender, _to, _value);
        /**@return Si se ha realizado la transacción devueleve al contrato CompraToken el valor true*/
        return true;
    }
   
    //** @title Realizar transferencia a el contrato el usuario. */ 
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
       /**   @param _to address de la cuenta a al que se quiere realizar la transacción.
             @param _value cantidad de tokens que van a ser trasnferidos.
             @param _fechaDeposito fecha en la que se realiza el deposito.

        */       
       /** @dev verifica que el Smartcontract este activo
        Verifica que la fecha en al que se solicita el retiro sea superior a la definida.
        Verifica que el mes del que realiza el depostivo se menor que 6
        En caso de que la fecha en la que se realiza el deposito de mayor a la definida se le baja el valor puntualidad en el mapping Ahorrador.
        Verifica que el balance de quien realiza la transferencia sean mayores o iguales a el valor que se desea enviar.
        Se actualizan los balances de las cuentas, a la que envía se le resta y a la otra se le suma, y se actualiza en el mapping ahorrador
        y BalanceOF*/
        require(Activo == false);    

        require(_value <= balanceOf[_from]);
        
        balanceOf[_from] = SafeMath.sub(balanceOf[_from],_value);
        balanceOf[_to] = SafeMath.add(balanceOf[_to],_value);
        depositoOf[_from] = SafeMath.add(depositoOf[_from],_value);
        /**@return Se emite el evento con las datos de address del que envía, el que recibe y el mes del quién realiza el envío*/
        emit Transfer(_from, _to, mesCount[_from]);
        /**@return Si se ha realizado la transacción devueleve al contrato CompraToken el valor true*/
        return true;
    }

    function transferAumentoSupply(uint _value) public returns (bool success) {
       /**   @param _to address de la cuenta a al que se quiere realizar la transacción.
             @param _value cantidad de tokens que van a ser trasnferido.
        */
        
        
        /** @dev verifica que el Smartcontract este activo
        Verifica que el balance de quien realiza la transferncia sean mayores o iguales a el valor que se desea enviar
        Se actualizan los balances de las cuentas, a la que envía se le resta y a la otra se le suma, y se actualiza en el mapping ahorrador
        y BalanceOF*/
        //require(Activo == false);
        require(Activo == false);
        
        totalSupply = SafeMath.add(totalSupply, _value);
        balanceOf[msg.sender] = SafeMath.add(balanceOf[msg.sender], _value);
        /**@return Se emite el evento con las datos de address del que envía, el que recibe y la cantidad*/
        emit TransferAumentoSupply(_value);
        /**@return Si se ha realizado la transacción devueleve al contrato CompraToken el valor true*/
        return true;
    }


}
