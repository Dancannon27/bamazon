

var inquirer = require("inquirer");

var mysql = require("mysql");

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'bamazon'
  });
   
  var firstQuestion = [{
    name: "firstQ",
    type: "input",
    message: "What product number would you like to purchase?",
}]

var secondQuestion = [{
    name: "secondQ",
    type: "input",
    message: "How many would you like to purchase?",
}]




  connection.connect();
  connection.query("SELECT * FROM products", function (err, results) {
      if (err) {
          throw err 
         };
      for (var i = 0; i < results.length; i++){
          console.log(results[i].item_id + " " + results[i].product_name + " $" + results[i].price_cost);    
      }
      getProducts();
    });

    
      function getProducts() {
        inquirer.prompt(firstQuestion).then(answers => {
            console.log(answers);
            var stock = stockQuantity(parseInt(answers.firstQ));
             console.log("here");
        })
    }
        function stockQuantity(id) {
            connection.query("select stock_quantity from products where ?", {item_id: id}, function(err, results){
                if (err) {
                    throw err
                }
                console.log(results[0]);
                return results[0];
            })
        }

        function getAmount() {
            inquirer.prompt(secondQuestion).then(answers => {
                console.log(answers);
                // var stock = stockQuantity(parseInt(answers.firstQ));
                //  console.log("here");
            })
        }

    //    if (answers.firstQuestion > stockQuantity) {
    //             console.log("Oops, not enough in stock!")
    //         } else {
    //             getStock();
    //         }
    //     })
    // }
    
    // function getStock() {
    //     inquirer.prompt(secondQuestion).then(answers => {
    //         for (var i = 0; i < results.length; i++) {
    //             console.log("Thank you for your order of" + results[i].product_name)
    //         }
    //     })
    // }
//   connection.end();
