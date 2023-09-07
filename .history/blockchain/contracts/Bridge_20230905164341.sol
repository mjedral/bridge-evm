// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract Bridge {
    address public admin;
    IERC20 public token;

    constructor(address _admin, address _token) {
        admin = _admin;
        token = IERC20(_token);
    }

    event SendTokens(address indexed to, uint256 amount);

    
    modifier onlyAdmin() {
        require(msg.sender == admin, "You are not an admin!");
        _;
    }

    function sendTokens(address _to, uint256 _amount) external onlyAdmin {
        require(token.balanceOf(address(this)) >= _amount, "Balance of the smart contract is too low!");

        token.approve(_to, _amount);

        token.transferFrom(address(this), _to, _amount); 

        emit SendTokens(_to, _amount);
    }
}