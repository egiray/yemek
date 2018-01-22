/**
	Micro Templating metodu ile restoranData.json ve menuData.json
	dosyalarını içerik olarak Doma ekliyorum.
 */
'use strict';
function readJsonFile(file, callback) {
	var rawFile = new XMLHttpRequest();
	rawFile.overrideMimeType("application/json");
	rawFile.open("GET", file);
	rawFile.onreadystatechange = function() {
		if (rawFile.readyState === 4 && rawFile.status == "200") {
			try{
				var response = JSON.parse(rawFile.responseText);
				callback(response, null);
			}
			catch(e){
				callback(null, e);
			}       
		}
	}
	rawFile.onerror = function (){
		callback(null, "error");
	}
	/** 404 hatasını handle etmek lazım. Şu an hata veriyor. */
	rawFile.send(null);	

}
var template = document.getElementById('ourTemplate');
var templateText = template.textContent;
var render = Templater(templateText);
/** 
	Micro Templating metodu ile restoranData.json ve menuData.json
	dosyalarını içerik olarak Doma ekliyorum.
 */
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
var data ={};
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
readJsonFile("https://egiray.github.io/menuData.json", function(response, err){
	if (err || !response.hasOwnProperty("d")) {
		sync(err);
		return;
	}
	data["menu"] = response.d;
	sync();
});
readJsonFile("https://egiray.github.io/restoranData.json", function(response, err){
	if (err || !response.hasOwnProperty("d")) {
		sync(err);
		return;
	}
	data["restoran"] = response.d;
	sync();
	
});	