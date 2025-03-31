document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://dbjson-2.onrender.com";
    // const API_URL = "http://localhost:3000";
    const usersBoard = document.getElementById("usersMain");
    const ordersMain = document.getElementById("ordersMain");
    
    const productsContainer = document.getElementById("orders");
    //   editProducts.addEventListener('click',fetchOrders)
  
    function testAddingACard(name, quantity, id) {
      const mainContainer = document.getElementById("ordersMain");
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
        
      const userDeleteBtn = document.createElement("button");
      userDeleteBtn.textContent = "Delete";
      ordertBtn.classList.add("bg-blue-600", "text-white", "p-2");
      userDeleteBtn.classList.add("bg-red-600", "text-white", "p-2");
      userDeleteBtn.setAttribute("deleteId", id);

      userDeleteBtn.addEventListener("click", async (event) => {
          const id = event.target.getAttribute("deleteId");
      
          try {
              // Fetch the order details
              const orderDetails = await fetch(`${API_URL}/orders/${id}`);
              if (!orderDetails.ok) throw new Error("Order not found");
      
              const orderData = await orderDetails.json();
      
              // Fetch the product details
              const productResponse = await fetch(`${API_URL}/products/${id}`);
              if (!productResponse.ok) {
                await fetch(`${API_URL}/orders/${id}`,{
                  method:"DELETE"
                })
                alert('Product was not found but order is deleted')
            
              } 
      
              const productData = await productResponse.json();
      
              // Update product quantity by adding back the deleted order quantity
              const updateProduct = await fetch(`${API_URL}/products/${id}`, {
                  method: "PATCH",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                      quantity: productData.quantity + orderData.quantity,
                  }),
              });
      
              if (!updateProduct.ok) throw new Error("Failed to update product quantity");
      
              // Delete the order
              const deleteOrder = await fetch(`${API_URL}/orders/${id}`, {
                  method: "DELETE",
              });
      
              if (!deleteOrder.ok) throw new Error("Failed to delete order");
      
              alert("Order deleted successfully");
          } catch (error) {
              alert("Error: " + error.message);
          }
      });
      

    //   btnsDiv.appendChild(ordertBtn);
   
      btnsDiv.appendChild(userDeleteBtn);
      theDivUser.appendChild(productName);
      theDivUser.appendChild(quantityNumber);
      theDivUser.appendChild(btnsDiv);
  
      productsContainer.appendChild(theDivUser);
  
    }
  
    const addBtn = document.getElementById("addProduct");
    addBtn.addEventListener("click", async () => {
      const Pname = document.getElementById("Pname").value;
      const Uquantity = document.getElementById("Uquantity").value;
      if (Pname.trim() != "" && Uquantity.trim() != "") {
        const response = await fetch(`${API_URL}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "Application/Json",
          },
          body: JSON.stringify({ name: Pname, quantity: Uquantity }),
        });
        if (response.ok) {
          alert("Product added Successfully");
          productsContainer.innerHTML = "";
          fetchOrders();
        } else {
          alert("error adding user");
        }
      }
    });
  
    async function fetchOrders() {
      const response = await fetch(`${API_URL}/orders`);
      const data = await response.json();
      data.forEach((element) => {
        testAddingACard(element.name, element.quantity, element.id);
        console.log(element.id);
      });
    }
    
    fetchOrders();
  });
  