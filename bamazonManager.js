

const connectObject = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon'
}

var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection(connectObject);

connection.connect();
start();

function start() {
    inquirer.prompt([
        {
            type: "list",
            message: "Please choose from the list",
            name: "options",
            choices: ["View Products", "View Low Inventory", "Add To Inventory", "Add Product"
        ]
    }])
        .then(function(results) {
        var choice = results.options;
        console.log(choice);
        if (choice === "View Products") {
                viewProducts();
        } else if (choice === "View Low Inventory") {
                viewLowInventory();
        } else if (choice === "Add To Inventory") {
                addInventory();
        } else if (choice ==="Add Product") {
                addProduct();
        }

        })
}
    
    
    

    function viewProducts() {
        var query = "SELECT * FROM products";
        connection.query(query, function (err, results) {
            if (err) {
                throw err
            };
            for (var i = 0; i < results.length; i++) {
                console.log(`Product Number: ${results[i].item_id} \nItem: ${"*****" + results[i].product_name} \nPrice: $${"**********" + results[i].cost} \nQuantity: ${results[i].stock_quantity}`);
            }
            start();
        })
    }
    function viewLowInventory() {
        var query = "SELECT * FROM products WHERE stock_quantity < 5";
        connection.query(query, function (err, results) {
            if (err) {
                throw err
            };
            for (var i = 0; i < results.length; i++) {
                console.log(`Item: ${results[i].product_name} \nQuantity: ${results[i].stock_quantity}`);
            }
            start();
        })
    }
    function addInventory() {
        var query = "SELECT * FROM products";
        connection.query(query, function (err, results) {
            if (err) {
                throw err
            };
            var inventory = [];
            for (var i = 0; i < results.length; i++) {
                inventory.push({
                    name: results[i].product_name + "__" + results[i].stock_quantity,
                    value: i
                })
                //inventory.push(results[i].product_name + "__" + results[i].stock_quantity);
                //console.log(inventory);
            }
            inquirer.prompt([
                {
                    type: "list",
                    message: "What Product Name do you want to add Inventory?",
                    name: "itemName",
                    choices: inventory
                },
                {
                    type: "input",
                    message: "How many would you like to add?",
                    name: "add"
                }])
                .then(function(res) {
                    // //for (var i = 0; i < results.length; i++) {
                    //     if (results[i].product_name === res.itemName) {
                    //         return;
                    //     }
                    //}
                    var stock = results[res.itemName].stock_quantity;
                    var productName = results[res.itemName].product_name;
                    var item = results[res.itemName].item_id
                    var quantity = parseInt(res.add) + stock;
                    var update = `UPDATE products SET stock_quantity = ${quantity} WHERE item_id = ${item}`;
                    //UPDATE [table] SET [column] = '[updated-value]' WHERE [column] = [value];
                    connection.query(update, function (err, results) {
                        if (err) {
                            throw err
                        };
                        
                        //for (var i = 0; i < results.length; i++) {
                            console.log(`Item: ${productName} \nQuantity: ${quantity}`);
                        
                        start();
                    })
                })
    })
}
    function addProduct() {

    }

