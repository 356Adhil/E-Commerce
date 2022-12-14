
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
 
function ajaxDeleteProduct(ID){
    $.ajax({
        url:'/deleteCartProduct/'+ID,
        method:'get',
        success:(response)=>{
            if(response.status=true){
            console.log(response.status)
           
            let deleteCartProduct=$('#deleteCartProduct').html()
            deleteCartProduct=parseInt(deleteCartProduct)+1;
            $('#deleteCartProduct').html(deleteCartProduct)
            
        }}
    })

}
function change_image(image){
let container = document.getElementById("main-image");
container.src = image.src;
}
document.addEventListener("DOMContentLoaded", function(event) {
});


function changeQuantity(cartId,proId,count){
    console.log("helloo bviyakk");
    let quantity=parseInt(document.getElementById(proId).innerHTML)
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
        console.log(response)
       if(response.statusRemove==true){
        console.log("removed...............................................")
        location.reload();
       }else{
        console.log("else case")
        document.getElementById(proId).innerHTML=count+quantity;
        location.reload();
       }
         
    }
})

}
