
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


function changeQuantity(cartId,proId,singlePrice,count){
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
       document.getElementById('productPrice'+proId).innerHTML = (singlePrice*quantity)
    }
})

}