document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000";
  const usersBoard = document.getElementById("usersMain");
  const productsMain = document.getElementById("productsMain");
  
  const productsContainer = document.getElementById("products");
  //   editProducts.addEventListener('click',fetchProducts)

  function testAddingACard(name, quantity, id) {
    const mainContainer = document.getElementById("productsMain");
    const theDivUser = document.createElement("div");
    theDivUser.classList.add("mr-5", "bg-green-400", "p-3", "items-center");
    const productName = document.createElement("p");
    productName.textContent = `(name) ${name}`;
    const quantityNumber = document.createElement("p");
    quantityNumber.textContent = `(quantity) ${quantity}`;
    const btnsDiv = document.createElement("div");
    btnsDiv.classList.add("flex-row", "space-x-3", "items-center");
    const productEditBtn = document.createElement("button");
    productEditBtn.textContent = "Edit";
    productEditBtn.setAttribute("editId", id);
    const ordertBtn = document.createElement("button");
    ordertBtn.textContent = "Put an order";
    ordertBtn.setAttribute("productId", id);
    ordertBtn.addEventListener("click", async (event) => {
        const id = event.target.getAttribute("productId");
    
        try {
            //  Fetch the product details
            const response = await fetch(`${API_URL}/products/${id}`);
            if (!response.ok) throw new Error("Failed to fetch product details.");
    
            const product = await response.json();
            if (product.quantity <= 0) {
                alert("Product is out of stock.");
                return;
            }
    
            // Check if the product already exists in orders
            const orderResponse = await fetch(`${API_URL}/orders/${id}`);
            let orderExists = false;
            let orderData = {};
    
            if (orderResponse.ok) {
                orderData = await orderResponse.json();
                orderExists = true;
            }
    
            //  Add or update the order
            if (orderExists) {
                // Increase order quantity if it exists
                const updateOrder = await fetch(`${API_URL}/orders/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        quantity: orderData.quantity + 1, // Increment order quantity
                    }),
                });
    
                if (!updateOrder.ok) throw new Error("Failed to update order.");
            } else {
                // Create new order if it doesn't exist
                const createOrder = await fetch(`${API_URL}/orders`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: product.id,
                        name: product.name,
                        quantity: 1, // New order, start with 1
                    }),
                });
    
                if (!createOrder.ok) throw new Error("Failed to add order.");
            }
    
            // Reduce product quantity
            const updateProduct = await fetch(`${API_URL}/products/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    quantity: product.quantity - 1, // Reduce product quantity
                }),
            });
    
            if (!updateProduct.ok) throw new Error("Failed to update product stock.");
            usersBoard.style.display = "none";
            productsMain.style.display = "block";
            alert("Order processed successfully!");
           
        } catch (error) {
            alert("Error: " + error.message);
        }
    });
    
    productEditBtn.addEventListener("click", async (event) => {
      const idToEdit = event.target.getAttribute("editId");

      try {
        const response = await fetch(`${API_URL}/products/${idToEdit}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const data = await response.json();
        document.getElementById("editProductName").value = data.name;
        document.getElementById("editProductQuantity").value = data.quantity;

        const editProducts = document.getElementById("editProducts");
        editProducts.onclick = async (event) => {
            event.preventDefault()
          const editValueName = document
            .getElementById("editProductName")
            .value.trim();
          const editFieldQuantity = document
            .getElementById("editProductQuantity")
            .value.trim();
          if (editValueName && editFieldQuantity) {
            try {
              const updateResponse = await fetch(
                `${API_URL}/products/${idToEdit}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: editValueName,
                    quantity: editFieldQuantity,
                  }),
                }
              );

              if (updateResponse.ok) {
                productsContainer.innerHTML = ""; // Clear the user list
                usersBoard.style.display = "none";
                productsMain.style.display = "block";
                document.getElementById("editProductName").value =""
                document.getElementById("editProductQuantity").value =""
            
                fetchProducts(); // Reload products
                
              } else {
                alert("Failed to update Product.");
              }
            } catch (error) {
              alert("Error updating Product: " + error.message);
            }
          }
        };
      } catch (error) {
        alert("Error fetching Products: " + error.message);
      }
    });

    productEditBtn.classList.add("bg-blue-600", "text-white", "p-2");

    const userDeleteBtn = document.createElement("button");
    userDeleteBtn.textContent = "Delete";
    ordertBtn.classList.add("bg-blue-600", "text-white", "p-2");
    userDeleteBtn.classList.add("bg-red-600", "text-white", "p-2");
    userDeleteBtn.setAttribute("deleteId", id);
    btnsDiv.appendChild(ordertBtn);
    btnsDiv.appendChild(productEditBtn);
    btnsDiv.appendChild(userDeleteBtn);
    theDivUser.appendChild(productName);
    theDivUser.appendChild(quantityNumber);
    theDivUser.appendChild(btnsDiv);

    productsContainer.appendChild(theDivUser);

    userDeleteBtn.addEventListener("click", async (event) => {
      const userId = event.target.getAttribute("deleteId");
      if (confirm(`Are you sure you want to delete product ${userId}`))
        try {
          const response = await fetch(`${API_URL}/products/${userId}`, {
            method: "DELETE",
          });
          if (response.ok) {
            alert(`Product Id ${userId} deleted successfully`);
            productsContainer.innerHTML = "";
            fetchProducts();
          }
        } catch (error) {
          alert(error);
        }
    });
  }

  const addBtn = document.getElementById("addProduct");
  addBtn.addEventListener("click", async () => {
    const Pname = document.getElementById("Pname").value;
    const Uquantity = document.getElementById("Uquantity").value;
    if (Pname.trim() != "" && Uquantity.trim() != "") {
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/Json",
        },
        body: JSON.stringify({ name: Pname, quantity: Uquantity }),
      });
      if (response.ok) {
        alert("Product added Successfully");
        productsContainer.innerHTML = "";
        fetchProducts();
      } else {
        alert("error adding user");
      }
    }
  });

  async function fetchProducts() {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    data.forEach((element) => {
      testAddingACard(element.name, element.quantity, element.id);
      console.log(element.id);
    });
  }
  fetchProducts();
});
