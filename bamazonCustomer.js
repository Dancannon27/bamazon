

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
var query = "SELECT * FROM products";
connection.query(query, function (err, results) {
    if (err) {
        throw err
    };
    for (var i = 0; i < results.length; i++) {
        console.log(`Product Number: ${results[i].item_id} \nItem: ${results[i].product_name} \nPrice: $${results[i].price_cost}`);
    }
    inquirer.prompt([
        {
            type: "input",
            message: "What Product Number would you like to purchase?",
            name: "itemID"
        },
        {
            type: "input",
            message: "How many would you like to purchase?",
            name: "quantity"
        }
    ])

        .then(function (inquirerResults) {
            var item = "SELECT stock_quantity FROM products WHERE item_id =" + inquirerResults.quantity + ";";
            connection.query(item, function (err, results) {
                if (err) {
                    throw err
                }
                if (results[0].stock_quantity < inquirerResults.quantity) {
                    console.log("Insuffiencent Quantity");
                } else {
                    purchase(results[0].stock_quantity, inquirerResults.quantity, inquirerResults.itemID )
                }

            })
        })
        function purchase(stock, customerQuantity, itemNum) {
            
            var newQuantity = stock - customerQuantity;
            var updateQuantity = "UPDATE products SET stock_quantity = " + newQuantity + " WHERE item_id = " + itemNum + ";";
            connection.query(updateQuantity, function(err, results) {
                if (err) {
                    throw err
                }
                console.log("successful order");
                connection.query("SELECT price_cost FROM products WHERE item_id = " + itemNum + ";", 
                    function(err, results) {
                        if (err) {
                            throw err
                        }
                        var totalCost = customerQuantity * results[0].price_cost;                        
                    console.log("You Cart Total: $" + totalCost);
                    connection.end();
                    } )
            })
        }
})





