pragma solidity ^0.4.24;

contract Messages {

    struct MessageRequest {
        string message;
        address requestedBy;
        bool isApproved;
        uint256 value;
    }

    string public message;
    mapping(address => string[]) public messageHistory;
    address[] private _messageSetters;
    address private _owner;
    MessageRequest private _currentMessageRequest;

    constructor(string initialMessage) public {
        _owner = msg.sender;
        message = initialMessage;
        messageHistory[msg.sender].push(message);
        _messageSetters.push(msg.sender);
    }

    function setMessage() public requiresOwner{
        messageHistory[_currentMessageRequest.requestedBy].push(_currentMessageRequest.message);
        message = _currentMessageRequest.message;
        _messageSetters.push(_currentMessageRequest.requestedBy);
        _currentMessageRequest = MessageRequest({
            message: "",
            isApproved: false,
            value: 0,
            requestedBy: _owner
        });
    }

    function requestMessage(string newMessage) public payable{
        require(msg.value > 0, "No wei");
        if (msg.value < _currentMessageRequest.value) {
            revert("Need a higher bid");
        }

        _currentMessageRequest = MessageRequest({
            message: newMessage,
            isApproved: false,
            value: msg.value,
            requestedBy: msg.sender
        });
    }

    function getMessageSetters() public view returns (address[]) {
        return _messageSetters;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getCurrentRequest() public view requiresOwner returns (string, uint256, address) {
        return (_currentMessageRequest.message, _currentMessageRequest.value, _currentMessageRequest.requestedBy);
    }

    modifier requiresOwner() {
        require(msg.sender == _owner, "Only owner can call setMessage, please use requestMessage");
        _;
    }
}
