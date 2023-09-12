// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

contract SourceToken is ERC20Upgradeable, PausableUpgradeable {
    mapping(address => Lock[]) private locks;
    mapping(address => bool) private _isBlocked;

    address public owner;

    function initialize(address initialOwner) public {
        __ERC20_init("SourceToken", "SRCT");
        __Pausable_init();
        owner = initialOwner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed to, uint256 amount);
    event LockCreate(address indexed creator, uint256 index, uint256 amount);
    event LockRelease(address indexed creator, uint256 index, uint256 amount);
    event LockBurn(address indexed creator, uint256 index, uint256 amount);
    event AddressBlockadeSet(address indexed account, bool blocked);

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function transfer(address account, uint256 amount) public override whenNotPaused returns(bool){
        require(!(_isBlocked[_msgSender()]), "account is blocked");
        _transfer(_msgSender(),account,amount);
        return true;
    }
    function mint(address account, uint256 amount) external onlyOwner whenNotPaused {
        require(!(_isBlocked[account]), "account is blocked");
        _mint(account, amount);
        emit Mint(account, amount);
    }

    function approve(address spender, uint256 amount) public override whenNotPaused returns (bool) {
        require(!(_isBlocked[_msgSender()]), "account is blocked");
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public override whenNotPaused virtual returns (bool) {
        address spender = _msgSender();
        require(!(_isBlocked[spender]), "account is blocked");
        _spendAllowance(from, spender, value);
        _transfer(from, to, value);
        return true;
    }

    function createLock(uint256 amount) external whenNotPaused returns (Lock lock) {
        require(!(_isBlocked[_msgSender()]), "account is blocked");
        lock = new Lock(_msgSender());
        _transfer(_msgSender(), address(lock), amount);
        locks[_msgSender()].push(lock);
        emit LockCreate(_msgSender(), locks[_msgSender()].length - 1, amount);
    }

    function getLock(address lockCreator, uint256 lockIndex)
        public
        view
        whenNotPaused
        returns (Lock)
    {
        return locks[lockCreator][lockIndex];
    }

    function releaseLock(address lockCreator, uint256 lockIndex)
        external
        onlyOwner
        whenNotPaused
        returns (Lock lock)
    {
        lock = getLock(lockCreator, lockIndex);
        uint256 lockValue = balanceOf(address(lock));
        _transfer(address(lock), lockCreator, lockValue);
        delete locks[lockCreator][lockIndex];
        emit LockRelease(lockCreator, lockIndex, lockValue);
    }

    function burnLock(address lockCreator, uint256 lockIndex)
        external
        onlyOwner
        whenNotPaused
        returns (Lock lock)
    {
        require(!(_isBlocked[lockCreator]), "account is blocked");
        lock = getLock(lockCreator, lockIndex);
        uint256 lockValue = balanceOf(address(lock));
        _burn(address(lock), lockValue);
        delete locks[lockCreator][lockIndex];
        emit LockBurn(lockCreator, lockIndex, lockValue);
    }

    function isAddressBlocked(address account) public view whenNotPaused onlyOwner returns (bool){
        return _isBlocked[account];
    }

    function setAddressBlockade(address account, bool blocked) public whenNotPaused onlyOwner returns (bool) {
        require(_isBlocked[account] != blocked, "the account blockade is currently in this state");
        _isBlocked[account] = blocked;
        emit AddressBlockadeSet(account, blocked);
        return true;
    }
}

contract Lock {
    address public creator;

    constructor(address _creator) {
        creator = _creator;
    }
}
