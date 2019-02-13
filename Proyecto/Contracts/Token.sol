pragma solidity ^0.4.2;
import "./SafeMath.sol";
import "./Owned.sol";


contract Token is Owned {

    uint256 public totalSupply;
    uint public mes = 1;
    uint public fechaComienzoAhorro = 2175806719; //fecha 12 de diciembre de 2038, para que nadie pueda generar una transacción u operativa antes de que
                                                 //se hallan registrado la totalidad de usuarios
    uint public tDosMinutos = 120;
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
    

    
    mapping(address => uint256) public balanceOf;
    mapping(address => uint256) public depositoOf;
    mapping(address => Ahorrador) public Ahorradores;
    mapping(address => uint) public ownerCuentaAhorro;
    mapping(address => uint) public mesCount;
       
    
    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply; //Al realizar el desplegue del contracto 2_deploy_contracts se indica el initial supply
        totalSupply = _initialSupply;

    }

    struct Ahorrador {
        address cuenta;
        uint id;
        string name;
        bool prestamo;
        uint ahorro; 
        uint balance;  
        uint mes;
        uint puntualidad;
        bool Alta;
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
    function _crearAhorrador(string nombre, uint idUsuario, uint fecha) public returns(bool) {
        /** @param nombre nombre del usuario.
            @param idUsuario identifiación del usuario.
            @param fecha fecha en la que se realiza el alta del usuario.
        */
        /** @dev verifica que el Smartcontract este activo
        verifica que la address no haya creado un usuario ya en la DAAP y finalmente verifica que no se hayan asignado ya todos los 
        periodos de retiro de Tokens*/
       require(Activo == false);
       require((ownerCuentaAhorro[msg.sender]) == 0);
       require( mes <= 6);
       /** @dev cuando se registra el sexto usuario, se inicializan las fechas para el contrato y para los usuarios, de acuerdo
       a la fecha de registro de último usuario*/
        if (mes == 6){
        fechaComienzoAhorro = fecha;
        }             
        /** @dev se da de alta los valores del usuario que se ha registrado para cada uno de lo campos del strcut en el mapping Ahorrado
        Se suma el 1 a los contadores mes y ownerCuenta Ahorro, mesCount y mes*/
        Ahorradores[msg.sender] = Ahorrador(msg.sender, idUsuario, nombre, false, 0, 0, mes, 100 ,true);
        ownerCuentaAhorro[msg.sender] ++;
        mesCount[msg.sender] = mes;
        mes ++;
        /**@return emite el evento con los datos de mes, nombre y fecha de comienzoAhorro.*/
        emit nuevoAhorrador(mes, nombre, fechaComienzoAhorro);
        
        
    }
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
        Ahorradores[_to].balance = saldo;
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
        Ahorradores[_to].balance = saldo;
        /**@return Se emite el evento con las datos de address del que envía, el que recibe y la cantidad*/
        emit Transfer(msg.sender, _to, _value);
        /**@return Si se ha realizado la transacción devueleve al contrato CompraToken el valor true*/
        return true;
    }
   //** @title Realizar transferencia a una cuenta, desde el contrato. */ 
    function transferRetiro(address _to, uint256 _value, uint fechaRetiro) public returns (bool success) {
        /**   @param _to address de la cuenta a al que se quiere realizar la transacción.
             @param _value cantidad de tokens que van a ser trasnferido.
             @param _fechaRetiro fecha en la que se realiza el retiro.

        */
        /** @dev verifica que el Smartcontract este activo
        Verifica que la fecha en al que se solicita el retiro sea superior a la definida.
        Verifica que el balance de quien realiza la transferncia sean mayores o iguales a el valor que se desea enviar.
        Se actualizan los balances de las cuentas, a la que envía se le resta y a la otra se le suma, y se actualiza en el mapping ahorrador
        y BalanceOF*/
        require(Activo == false);
        require(fechaRetiro >= SafeMath.add(fechaComienzoAhorro,SafeMath.mul(Ahorradores[_to].mes,tDosMinutos)));
        require(Ahorradores[_to].prestamo == false);
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] = SafeMath.sub(balanceOf[msg.sender],_value);
        balanceOf[_to] = SafeMath.add(balanceOf[msg.sender],_value);
        uint256 saldo = balanceOf[_to];          
        Ahorradores[_to].balance = saldo;
        /** @dev Se actualiza en el mapping el estado del valor prestamo, indicando que usuario ya ha realizado el retiro*/        
        Ahorradores[_to].prestamo = true;
        /**@return Se emite el evento con las datos de address del que envía, el que recibe y la cantidad*/
        emit TransferRetiro(msg.sender, _to, _value);
        /**@return Si se ha realizado la transacción devueleve al contrato CompraToken el valor true*/
        return true;
    }
    //** @title Realizar transferencia a el contrato el usuario. */ 
    function transferFrom(address _from, address _to, uint256 _value, uint fechaDeposito) public returns (bool success) {
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
        require(mesCount[_from] <= 6);
        if(fechaDeposito > SafeMath.add(fechaComienzoAhorro,SafeMath.mul(mesCount[_from],tDosMinutos))){
            Ahorradores[_from].puntualidad = SafeMath.sub(Ahorradores[_from].puntualidad,16);
        }

        require(_value <= balanceOf[_from]);
        
        balanceOf[_from] = SafeMath.sub(balanceOf[_from],_value);
        balanceOf[_to] = SafeMath.add(balanceOf[_to],_value);
        depositoOf[_from] = SafeMath.add(depositoOf[_from],_value);
        uint256 ahorro = depositoOf[_from];
        Ahorradores[_from].ahorro = ahorro;
        uint256 saldo = balanceOf[_from];
        Ahorradores[_from].balance = saldo;
        mesCount[_from] = SafeMath.add(mesCount[_from],1);
        /**@return Se emite el evento con las datos de address del que envía, el que recibe y el mes del quién realiza el envío*/
        emit Transfer(_from, _to, mesCount[_from]);
        /**@return Si se ha realizado la transacción devueleve al contrato CompraToken el valor true*/
        return true;
    }
}