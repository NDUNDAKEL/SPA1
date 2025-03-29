document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000";
  const productsMain=document.getElementById('productsMain')
  productsMain.style.display="none"

  const usersContainer=document.getElementById('users')
//   editBtn.addEventListener('click',fetchUsers)

  function testAddingACard(name,phone,id) {
    const mainContainer=document.getElementById('usersMain')
    const theDivUser = document.createElement("div");
    theDivUser.classList.add("mr-5", "bg-green-400", "p-3", "items-center");
    const userNameParagraph = document.createElement("p");
    userNameParagraph.textContent=`(User Name) ${name}`
    const userNamePhoneNumber = document.createElement("p");
    userNamePhoneNumber.textContent=`(contact) ${phone}`
    const btnsDiv = document.createElement("div");
    btnsDiv.classList.add("flex-row", "space-x-3", "items-center");
    const userEditBtn = document.createElement("button");
    userEditBtn.textContent = "Edit";
    userEditBtn.setAttribute('editId',id)
    userEditBtn.addEventListener("click", async (event) => {
      const idToEdit = event.target.getAttribute("editId");
  
      try {
          const response = await fetch(`${API_URL}/users/${idToEdit}`);
          if (!response.ok) {
              throw new Error("Failed to fetch user data.");
          }
          
          const data = await response.json();
          document.getElementById("editFieldName").value = data.name; 
          document.getElementById("editFieldPhone").value = data.phone; 
         
    
          const editBtn = document.getElementById("editBtn");
          editBtn.onclick = async () => {
              const editFieldValueName = document.getElementById("editFieldName").value.trim();
              const editFieldValuePhone = document.getElementById("editFieldPhone").value.trim();
              if (editFieldValueName && editFieldValuePhone) {
                  try {
                      const updateResponse = await fetch(`${API_URL}/users/${idToEdit}`, {
                          method: "PATCH",
                          headers: {
                              "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ name: editFieldValueName, phone: editFieldValuePhone }),
                      });
  
                      if (updateResponse.ok) {
                          usersContainer.innerHTML = ""; // Clear the user list
                          fetchUsers(); // Reload users
                      } else {
                          alert("Failed to update user.");
                      }
                  } catch (error) {
                      alert("Error updating user: " + error.message);
                  }
              }
          };
      } catch (error) {
          alert("Error fetching user: " + error.message);
      }
  });
  
    userEditBtn.classList.add("bg-blue-600","text-white","p-2");

    const userDeleteBtn = document.createElement("button");
    userDeleteBtn.textContent = "Delete";
 
    userDeleteBtn.classList.add("bg-red-600", "text-white" , "p-2");
    userDeleteBtn.setAttribute('deleteId',id)
   
    btnsDiv.appendChild(userEditBtn)
    btnsDiv.appendChild(userDeleteBtn)
    theDivUser.appendChild(userNameParagraph)
    theDivUser.appendChild(userNamePhoneNumber)
    theDivUser.appendChild(btnsDiv)

    usersContainer.appendChild(theDivUser)


    userDeleteBtn.addEventListener("click", async (event)=>{
        const userId=event.target.getAttribute('deleteId')
   if(confirm(`Are you sure you want to delete user ${userId}`))
        try{
            
           const response= await fetch(`${API_URL}/users/${userId}`,{
            method:"DELETE",
            

        })
        if(response.ok){
            alert(`User Id ${userId} deleted successfully`)
            usersContainer.innerHTML=""
            fetchUsers()
        }
        
    } catch(error){
        alert(error)
    }

    });
  }
 

    const addBtn=document.getElementById('addUser')
    addBtn.addEventListener('click', async ()=>{
      const uname=document.getElementById('Uname').value
      const uphone=document.getElementById('Uphone').value
      if(uname.trim()!= "" && uphone.trim()!=""){

      
      const response=await fetch(`${API_URL}/users`,{
        method:"POST",
        headers:{
          "Content-Type":"Application/Json"
        },
        body: JSON.stringify({name:uname, phone:uphone})
      })
      if(response.ok){
        alert('User added Successfully')
        usersContainer.innerHTML=""
        fetchUsers()
      }else{
        alert('error adding user')
      }
    }
    })
  
 
async function fetchUsers(){
    const response=await fetch(`${API_URL}/users`)
    const data= await response.json()
    data.forEach(element => {
        testAddingACard(element.name, element.phone,element.id)
        console.log(element.id)
    });

}
fetchUsers()
}); 
 const usersBoard=document.getElementById('usersMain')
 const productsMain=document.getElementById('productsMain')
 const ordersMain=document.getElementById('ordersMain')
function loadUsers(){
productsMain.style.display="none"
  usersBoard.style.display="block"
   ordersMain.style.display="none"
}

function loadProducts(){
  usersBoard.style.display="none"
  productsMain.style.display="block"
  ordersMain.style.display="none"

}
function loadOrders(){
   usersBoard.style.display="none"
  productsMain.style.display="none"
  ordersMain.style.display="block"

}