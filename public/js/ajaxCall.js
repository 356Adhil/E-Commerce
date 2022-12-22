
function ajaxCart(ID){
    $.ajax({
        url:'/add-cart/'+ID,
        method:'get',
        success:(response)=>{
            if(response.status=true){
            console.log(response.status)
           
            let count=$('#count').html()
            count=parseInt(count)+1;
            $('#count').html(count)
            
        }}
    })

}
function ajaxWishList(ID){
    $.ajax({
        url:'/add-wishList/'+ID,
        method:'get',
        success:(response)=>{
            if(response.status=true){
            console.log(response.status)
           
            let count=$('#count').html()
            count=parseInt(count)+1;
            $('#count').html(count)
            
        }}
    })

}
 

function change_image(image){
let container = document.getElementById("main-image");
container.src = image.src;
}
document.addEventListener("DOMContentLoaded", function(event) {
});


function changeQuantity(cartId,proId,singlePrice,totalPrice,count){
    console.log("helloo bviyakk");
    let quantity=parseInt(document.getElementById('qty'+proId).value)
    $.ajax({
        url:'/changeQty',
        data:{
            cart:cartId,
            product:proId,
            count:count,
            quantity:quantity
        },
        method:'post',
       success:(response)=>{
       if(response.statusRemove==true){
        console.log("removed...............................................")
        location.reload();
        
       }else{
        let downBtn = document.getElementById('down'+proId)
        let quantity=parseInt(document.getElementById('qty'+proId).value)
        if(quantity<2){
            downBtn.classList.add('d-none')
        }
        else{
            downBtn.classList.remove('d-none')}
       }
       let singleProductPrice = document.getElementById('productPrice'+proId).innerHTML = (singlePrice*quantity)  
       location.reload();  
    }
})

}

        function removeProduct(cartId, productId) {
            $.ajax({
              url: "/removeProduct",
              data: {
                cart: cartId,
                product: productId,
              },
              method: "post",
              success: () => {
                location.reload();
              },
            });
          }

