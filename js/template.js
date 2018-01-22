/**
	John Resig'ın blogunda tanıttığı Micro Templating metodu ile 
	restoranData.json ve menuData.json dosyalarını içerik olarak Doma ekliyorum.
	ref: https://johnresig.com/blog/javascript-micro-templating/
 */

var TemplateModule = (function() {
	'use strict';
	var data ={};
	
	/** =================== private metodlar ================= */
	function readJsonFile(file, part) {
		var rawFile = new XMLHttpRequest();
		rawFile.overrideMimeType("application/json");
		rawFile.open("GET", file);
		rawFile.onreadystatechange = function() {
			if (rawFile.readyState === 4 && rawFile.status == "200") {
				try{
					var response = JSON.parse(rawFile.responseText);
					if (response.hasOwnProperty("d")) {
						data[part] = response.d;
						sync();
					}
					else{
						sync("d yok");
					}
				}
				catch(e){
					sync("internet problemi");
				}       
			}
		}
		rawFile.onerror = function (){
			sync("internet problemi");
		}
		/** 404 hatasını handle etmek lazım. Şu an hata veriyor. */
		rawFile.send(null); 

	}
	/**
		Burada render fonksiyonunu constructor ile oluşturuyoruz ve bize templateText i içine alan yeni bir fonksiyon oluşturuyor.
		Böylece sonradan data parametresi ile gönderdiğimiz verilerle, templateText içindeki metinlerde replace yapabiliyoruz.
		döngüler için "<%" , veriler için "<%=" identifierını kullanıyoruz.
	*/
	var template = document.getElementById('ourTemplate');
	var templateText = template.textContent;
	var render = Templater(templateText);
	function Templater(templateText) {
		return new Function(
		"data",
		"var output=" +
		JSON.stringify(templateText)
		.replace(/<%=(.+?)%>/g, '"+($1)+"')
		.replace(/<%(.+?)%>/g, '";$1\noutput+="') +
		";return output;"
		);
	}
	
	/** İki ayrı json dosyasını global data objesinde birleştiriyorum. Böylece render fonksiyonunu iki defa kullanmamış oluyorum. */
	function sync(err){
		if (err) {
			/**daha iyi bir error handling yapılabilir */
			document.getElementById('content').innerHTML = "internet problemi";
			return;
		}
		if (data.hasOwnProperty("menu") && data.hasOwnProperty("restoran")) {
			document.getElementById('content').innerHTML = render(data);  
		}
	}

	/** =================== public metodlar ================== */
	function init() {
		readJsonFile("https://egiray.github.io/json/menuData.json","menu");
		readJsonFile("https://egiray.github.io/json/restoranData.json","restoran");
	}

	/** =============== export edilen metodlar =============== */
	return {
		init: init
	};
}());