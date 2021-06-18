pragma solidity ^0.5.0;

// Reading the Product
contract Marketplace {
    string public name; // State variable permanently stored in contract storage https://bit.ly/3pgZn6h
    uint256 public productCount = 0;
    mapping(uint256 => Product) public products; // think of mapping as key-to-value storage, e.g. Dicts, Maps
    // We can't interate over mapping or use .length, etc, etc..
    struct Product {
        // We can treat a struct like a value type such that they can be used within arrays and mappings.
        uint256 id; // List the struct members, which consists of variables names along with their types
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

    constructor() public {
        name = "Nakamoto List";
    }

    // Function to create a product
    // _ underscores indicate local variables
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
        /*Fetch product (memory keyword: https://bit.ly/3g6fHTn)
        memory cannot be used at the contract level, only in methods.*/
        Product memory _product = products[_id];
        //Fetch the owner
        address payable _seller = _product.owner;
        //Make sure product is valid (can be bought)
        require(_product.id > 0 && _product.id <= productCount);
        // Require that there is enough Ether in the transaction
        require(msg.value >= _product.price);
        // Require that the product has not been purchased already
        require(!_product.purchased);
        // Require that the buyer is not the seller
        require(_seller != msg.sender);
        //Purchase product / transfer ownership
        _product.owner = msg.sender;
        //Mark as bought
        _product.purchased = true;
        //Update contract
        products[_id] = _product;
        //Pay seller with Ether
        address(_seller).transfer(msg.value);
        //Trigger an event
        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);
    }
}
