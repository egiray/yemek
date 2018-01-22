/**
	Sipariş Listesini ekleyen fonksiyonlar burada
 */

var CartModule = (function() {
	'use strict';
	var cart = (JSON.parse(localStorage.getItem('cart')) != null) ? JSON.parse(localStorage.getItem('cart')) :[] ;
	/** =================== private metodlar ================= */
	function update(){
		var cartHtml = "";
		var total = 0;
		if (cart.length == 0) {
			document.getElementById("CartHolder").style.visibility = "hidden";
		}
		else{
			document.getElementById("CartHolder").style.visibility = "visible";
			for (var i = cart.length - 1; i >= 0; i--) {
				total += cart[i].price * cart[i].quantity;
				cartHtml = cartHtml + 
									"<tr> \
										<td class='cartName'>"+cart[i].productName+"</td> \
										<td class='cartQuantity'> \
											<input type='text' name='quantity' value='"+cart[i].quantity+"' onchange='CartModule.changeQuantity(this.value, "+i+")'> \
										</td> \
										<td class='cartPrice'>"+String(cart[i].price).replace(".",",")+" TL</td> \
										<td class='cartDelete' onclick='CartModule.deleteItem("+i+")'><a href='javascript:void(0)'>X</a></td> \
										<td></td>\
									</tr>";

			}
			document.getElementById('TotalPrice').innerHTML = String(total).replace(".",",");
			document.getElementById('Cart').innerHTML = cartHtml;
		}
		localStorage.setItem('cart',JSON.stringify(cart));
	}

	/** =================== public metodlar ================== */
	function addItem(button){
		/** Sepetimizde daha önceden bu ürün varsa quantitysini arttırıyoruz. Yoksa cart arrayine
		yeni element olarak oluşturacağımız item objesini ekliyoruz.*/
		var spans = button.parentNode.getElementsByTagName("span")
		var item = {
			productName: spans[0].innerHTML,
			price: parseFloat(spans[1].innerHTML.replace(" TL", "").replace(",",".")),
			quantity: 1,
			productId: spans[2].innerHTML
		}
		var add = true;
		for (var i = cart.length - 1; i >= 0; i--) {
			if (cart[i].productId == item.productId){
				cart[i].quantity++;
				add = false;
			}
		}
		if (add) {
			cart.push(item);
		}
		update();
	}

	function deleteItem(index){
		cart.splice(index, 1);
		update();
	}

	function changeQuantity(quantity, index){
		cart[index].quantity = quantity;
		update();
	}

	function init(){
		update();
	}
	/** =============== export edilen metodlar =============== */
	return {
		init: init,
		addItem: addItem,
		deleteItem : deleteItem,
		changeQuantity : changeQuantity
	};
}());