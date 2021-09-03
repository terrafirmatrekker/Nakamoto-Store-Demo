pragma solidity ^0.5.0;


interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

interface IGateway {
    function mint(
        bytes32 _pHash,
        uint256 _amount,
        bytes32 _nHash,
        bytes calldata _sig
    ) external returns (uint256);

    function burn(bytes calldata _to, uint256 _amount)
        external
        returns (uint256);
}

interface IGatewayRegistry {
    function getGatewayBySymbol(string calldata _tokenSymbol)
        external
        view
        returns (IGateway);

    function getTokenBySymbol(string calldata _tokenSymbol)
        external
        view
        returns (IERC20);
}

contract Marketplace {
    string public name; 
    uint256 public productCount = 0;
    mapping(uint256 => Product) public products;
    IGatewayRegistry public registry;

    
    struct Product {
        uint256 id; 
        string name;
        uint256 price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint256 id,
        string name,
        uint256 price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint256 id,
        string name,
        uint256 price,
        address payable owner,
        bool purchased
    );

    constructor(IGatewayRegistry _registry) public {
        name = "Nakamoto List";
        registry = _registry;
    }
    
    function mint(
        // Payload
        string calldata _symbol,
        address _recipient,
        // Required
        uint256 _amount,
        bytes32 _nHash,
        bytes calldata _sig
    ) external {
        bytes32 payloadHash = keccak256(abi.encode(_symbol, _recipient));
        uint256 amount = registry.getGatewayBySymbol(_symbol).mint(
            payloadHash,
            _amount,
            _nHash,
            _sig
        );
        registry.getTokenBySymbol("BTC").transfer(msg.sender, amount);
        
    }
    
    function createProduct(string memory _name, uint256 _price) public {
        // Require a valid name
        require(bytes(_name).length > 0);
        // Require a valid price
        require(_price > 0);
        // Increment product count
        productCount++;
        // Create the product
        products[productCount] = Product(
            productCount,
            _name,
            _price,
            msg.sender,
            false
        );
        // Trigger an event
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint256 _id) public payable {
        //Get product
        Product memory _product = products[_id];
        //Get the owner
        address payable _seller = _product.owner;
        //Ensure sure product is valid (can be bought)
        require(_product.id > 0 && _product.id <= productCount);
        //Ensure that there is enough Ether in the transaction
        require(msg.value >= _product.price);
        //Ensure that the product has not been purchased already
        require(!_product.purchased);
        //Ensure that the buyer is not the seller
        require(_seller != msg.sender);
        //Purchase product / transfer ownership
        _product.owner = msg.sender;
        //Mark as bought
        _product.purchased = true;
        //Update contract
        products[_id] = _product;
        //Pay with Ether
        address(_seller).transfer(msg.value);
        //Trigger an event
        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);
    }
}