/**
	Sipariş Listesini ekleyen fonksiyonlar burada
 */

var CartModule = (function() {
	'use strict';
	var cart = (JSON.parse(localStorage.getItem('cart')) != null) ? JSON.parse(localStorage.getItem('cart')) :[] ;
	/* =================== private metodlar ================= */
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
										<td class='cartPrice'>"+cart[i].price+" TL</td> \
										<td class='carDelete' onclick='CartModule.deleteItem("+i+")'><a href='javascript:void(0)'>X</a></td> \
										<td></td>\
									</tr>";

			}
			document.getElementById('TotalPrice').innerHTML = total;
			document.getElementById('Cart').innerHTML = cartHtml;
			localStorage.setItem('cart',JSON.stringify(cart));
		}
	}

	/* =================== public metodlar ================== */
	function addItem(item){
		item.price = parseInt(item.price);
		cart.push(item);
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
	/* =============== export edilen public metodlar =============== */
	return {
		init: init,
		addItem: addItem,
		deleteItem : deleteItem,
		changeQuantity : changeQuantity
	};
}());