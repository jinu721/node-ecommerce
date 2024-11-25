const btnAddToCart = document.querySelectorAll('.btnAddToCart');

btnAddToCart.forEach(elem => {
    elem.addEventListener('click',async (e)=>{
        const productid = e.target.getAttribute('data-productId'); 
        const wishlistItemId = e.target.getAttribute('data-wishlistItemId'); 
        try{
            console.log(wishlistItemId)
            console.log(productid)
            const response = await fetch('/wishlist/add-to-cart',{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    productId:productid,
                    wishlistItemId:wishlistItemId,
                })
            });
            const data = await response.json();
            if(!data.val){
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: data.msg
                });
            }else{
                window.location.href = '/wishlist';
            }
        }catch(err){
            console.log(err);
        }
    })
});

const btnDeleteWishlist = document.querySelectorAll('.btnDeleteWishlist');

btnDeleteWishlist.forEach(elem => {
    elem.addEventListener('click',async (e)=>{
        const cartItemId = e.target.getAttribute('data-id');
        const wishlistItemId = e.target.getAttribute('data-wishlistItemId'); 
        console.log(cartItemId);
        console.log(wishlistItemId);
        try{
          const response = await fetch(`/remove-from-wishlist/${wishlistItemId}`,{
            method:'DELETE',
          });
          console.log(response);
          const data = await response.json();
          if (data.val) {
            console.log('removed form wishlist');
            window.location.href = "/wishlist"
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: data.msg,
            });
          }
        }catch(err){
          console.log(err);
        }
    })
});



