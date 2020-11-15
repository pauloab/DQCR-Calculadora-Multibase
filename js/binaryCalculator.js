/**
 * @author Paulo Aguilar, Thakur Ballary
 * @version 3.5
 * @copyright MIT
 */

const res = document.getElementById("res");

let operand1 = operator = operand2 = '';
let comma;
/**
 * Test data
 *
 * 10110101011010010101011010101010110101010101010100010010110101010101011010100101,010101010101010101 
 * 
 * 1011
 * 
 */

let operation;

var base = 2;
var base_str = "2";
var roundCifs = 3;

String.prototype.splice = function( idx, rem, s ) { 
	return idx==-1?this:(this.slice(0,idx) + s + this.slice(idx + Math.abs(rem))); 
};

// Selector de bases
document.getElementById("base").addEventListener("change", e=>{
	base_str = document.getElementById("base").value;
	base = parseInt(base_str);
});

// Verifica que los dígitos ingresados en base binaria sean sólo 0 y 1
document.getElementById("in1").addEventListener("keypress", e=>{
	if (base == 2) {
		if (e.keyCode!=46 && e.keyCode!=44 && ((e.keyCode!=96 && e.keyCode!=97) && (e.keyCode!=49 && e.keyCode!=48))) {
			e.preventDefault();
		}
	}

});

// Verifica que los dígitos ingresados en base binaria sean sólo 0 y 1
document.getElementById("in2").addEventListener("keypress", e=>{
	if (base == 2) {
		if (e.keyCode!=46 && e.keyCode!=44 && ((e.keyCode!=96 && e.keyCode!=97) && (e.keyCode!=49 && e.keyCode!=48))) {
			e.preventDefault();
		}
	}
});

// Maquilla las cajas de input
document.getElementById("makeUp").addEventListener("click",e=>{
	maquillar()
});

// Opera y llena el cuadro de resultado y procesos para conversión a base 10
document.getElementById("toBase10Calculate").addEventListener("click",e=>{
	const results = NotacionExpandida(document.getElementById("InToBase10").value);
	document.getElementById("toBase10Res").innerHTML = document.getElementById("InToBase10").value!=""?"Entrada: "+maquillaje(document.getElementById("InToBase10").value)+"<br><br>Proceso <br>"+results[3]+"<br><br>Resultado de parte entera: "+maquillaje(results[1].toString())+"<br>Resultado de parte flotante: "+results[2]+"<br><br> Resultado total: "+maquillaje(results[0]):"";
	document.getElementById("InToBase10").value = "";
});

// Opera y llena el cuadro de resultado y procesos para conversión a base X
document.getElementById("toBaseXCalculate").addEventListener("click",e=>{
	roundCifs = document.getElementById("inRoundCfs").value==""?3:parseInt(document.getElementById("inRoundCfs").value)+1;
	const results = ToBaseX(document.getElementById("InToBaseX").value);
	document.getElementById("toBaseXRes").innerHTML = document.getElementById("InToBaseX").value != ""?"Entrada: "+document.getElementById("InToBaseX").value+"<br><br>Conversión de parte entera: <br>"+results[1]+"<br><br>Conversión de parte flotante: <br>"+results[2]+"<br><br>Resultado: <br>"+maquillaje(results[0]):"";
	document.getElementById("InToBaseX").value = "";
});

// Proceso de converción a la base global
function ToBaseX(num){
	//Inicializa las variables resultado en formato HTML y number
	var htmlProcessInt = "";
	var htmlProcessFloat = "";	
	result_int = "";
	result_flt = "";

	// Limpia el maquillaje
	num = num.replace(/ /g,'');

	// Decide el caracter de separación
	const character = num.includes(".")?".":",";
	
	//Añade coma en caso de que no exista
	if (!num.includes(",")&&!num.includes(".")){
		num += character+"0";
	}

	// Separa parte entera y decimal
	var intSide = parseInt(num.split(character)[0]);
	var fltSide = parseFloat("0."+num.split(character)[1]);

	htmlProcessInt += "<table><tr><th style='text-align: right'><u>"+intSide+"</u> </th><th> <u>"+base_str+"</u></th></tr>"
	
	// Convierte la parte entera
	while(true){
		// Divide para la base
		intSide /= base;
		// Verifica que tenga parte decimal
		if ((intSide+"").includes(".")) {
			// Agrega el paso a la cadena HTML
			htmlProcessInt += "<tr><td style='text-align: right'>"+intSide+" |</td><td> "+(""+(base*parseFloat("0."+((intSide+"").split(".")[1]))))+"</td></tr>";
			// Agrega la cifra a la cadena resultado
			result_int+=""+bigInt(base*parseFloat("0."+((intSide+"").split(".")[1]))).toString(base);
			// reasigna con solo la parte entera 
			intSide = parseInt(intSide);
		}else{
			// Agrega 0 a las cifras
			htmlProcessInt += "<tr><td style='text-align: right'>"+intSide+"|</td><td>0</td></tr>";
			result_int+="0";
		}
		// Verifica si es momento de parar las iteraciones
		if (intSide<base) {
			// Toma el residuo y lo añade a la cadena de cifras 
			result_int+= intSide!="0"?intSide+"":"";
			break;
		}
	}
	htmlProcessInt += "</table>";
	var cadena_transp = "";
	//Transponer la cadena (re-escribirla en reversa)
	for (let i = result_int.length; i >= 0 ; i--) {
		cadena_transp += result_int.charAt(i);
	}
	result_int = cadena_transp;

	// Verifica que la variable no sea cero y no caiga en bucle infinito.
	if (fltSide!=0) {
		// Crea una variable de respaldo por si es necesario truncar
		var floatSideBak = fltSide;
		// Añade el primer paso a la cadena HTML
		htmlProcessFloat += fltSide.toString()+"X"+base;
		// Iterador de control por si supera las 20 iteraciones
		var controlIterator=1;
		// Opera la parte flotante
		while(true){
			// Verifica si el iterador de control ha alcanzado el 20
			if (controlIterator==20) {
				controlIterator=0;
				roundCifs--;
				htmlProcessFloat += " = "+(fltSide*base);
				if (roundCifs<=0) {
					result_flt = "N/D";
					
					htmlProcessFloat +="<br> No se pudo concretar la operación con esta cantidad de decimales. <br>"
					break;
				}
				//Redondea la variable de respaldo y la asigna a la de operación
				fltSide = floatSideBak.toFixed(roundCifs);
				htmlProcessFloat += "<br>Se han superado las 20 iteraciones, lo que nos obliga a redondear/truncar a "+roundCifs+"<br>";
				htmlProcessFloat += fltSide.toString()+"X"+base;
			}
			
			// multiplica por la base
			fltSide=fltSide*base;
			if (Number.isSafeInteger(fltSide)) {
				result_flt += ""+fltSide;
				htmlProcessFloat += " = "+fltSide.toString();
				break;
			}else{
				// Añade la cifra a la cadena de resultado
				result_flt +=""+((fltSide+"").split(".")[0]);
				// Añade el paso a la cadena HTML de procesos
				htmlProcessFloat += " = "+fltSide+"<br>0."+(fltSide+"").split(".")[1]+"X"+base_str;
				// Resta la parte entera para que quede solo la parte decimal
				fltSide -= (fltSide+"").includes(".")?parseInt((fltSide+"").split(".")[0]):0;
				// Aumenta una al iterador de control
				controlIterator++;
			}

		}
	}else{
		htmlProcessFloat += "No existe parte flotante. "
	}
	
	var res_str = result_flt!=""?result_int+"."+result_flt:result_int;

	//Crea un arreglo para la entrega de resultados
	const res = [res_str,htmlProcessInt,htmlProcessFloat]
	return res;
}

// Proceso de conversión a base 10 mediante notación expandida
function NotacionExpandida(num){
	//Inicializa las variables resultado
	var process = "";
	var resultInt = bigInt(0);
	var resultFlt = 0;

	// Limpia el maquillaje
	num = num.replace(/ /g,'');

	// Decide el caracter de separación
	const character = num.includes(".")?".":",";

	//Añade coma en caso de que no exista
	if (!num.includes(",")&&!num.includes(".")){
		num += character+"0";
	}

	// Separa parte entera y decimal
	const intSide = num.split(character)[0];
	const fltSide = num.split(character)[1];

	// Calcula el resultado desde la parte positiva
	for (let i = 0; i < intSide.length; i++) {
		var digit = intSide.charAt(i);
		process += i==0?"":" + ";
		process += parseInt(digit,base).toString(10)+"x"+base_str+"^"+(intSide.length-(i+1));
		resultInt = bigInt(resultInt.add(bigInt(digit,base).multiply(Math.pow(base,intSide.length-(i+1)))));
	}

	
	//Evalúa si tiene parte flotante
	if (fltSide!="0") {
		// Calcula el resultado desde la parte negativa
		for (let i = 0; i < fltSide.length; i++) {
			var digit = fltSide.charAt(i);
			process += " + "+parseInt(digit,base)+"x"+base_str+"^"+(-1-i);
			resultFlt += parseInt(digit,base)*Math.pow(base,(-1-i));
		}
	}
	// Construye el número resultado
	const result_str = fltSide!="0"?resultInt.toString()+"."+((""+resultFlt).split(".")[1]) : resultInt.toString();
	//Arma un arreglo para entregar los procesos y resultados parciales
	const res = [result_str,resultInt,resultFlt,process]
	return res;
}

// Limpia los campos de texto principales
function clearRes() {
	document.getElementById("in1").value = "";
	document.getElementById("in2").value = "";
	operation = operand1 = operator = operand2 = '';
	renderResDiv();
}

// Genera los complementos y llena las cajas de proceso directamente
function complementos() {
	var bin = ''+document.getElementById("inComplement").value;
	var character = bin.includes(".")?".":",";
	// En caso de que uno de los números no tenga punto o coma, se lo añade para normalziar
	const index = getComma(bin);
	// Limpia en caso de estar maquillados
	bin = bin.replace(/ /g,'');
	bin = bin.replace(character,"");
	let comp1 = "";
	for (let i = 0; i < bin.length; i++) {
		comp1 += (base-1)+'';
	}
	document.getElementById("resComp1").innerHTML = maquillaje(placeComma((bigInt(comp1,base).subtract(bigInt(bin,base))).toString(base),index));
	var bin1 = (bigInt(comp1,base).subtract(bigInt(bin,base)));
	document.getElementById("resComp2").innerHTML = maquillaje(placeComma((bin1+parseInt("01",base)).toString(base),index));
}

//Retorna un arreglo de Strings con los operadores son coma y con cifras igualadas
function normalizeDigits(bin1,bin2) {	
	
	// Permite conocer cual será el que tiene más dígitos en parte entera y flotante
	let bestIntWas1 = false;
	let bestFloatWas1 = false;

	// Limpia en caso de estar maquillados
	bin1 = bin1.replace(/ /g,'');
	bin2 = bin2.replace(/ /g,'');
	bin1 = bin1.trim();
	bin2 = bin2.trim();

	// Variables de uso temporal
	let binX,binY,binZ,binT;

	//Permite conocer que caracter de separación usa la cadenade entrada
	const character = bin1.includes(".")?".":",";

	// En caso de que uno de los números no tenga punto o coma, se lo añade para normalziar
	if((!bin1.includes(",")&&!bin1.includes("."))){
		bin1 += character+"0";
	}
	if (!bin2.includes(",")&&!bin2.includes(".")){
		bin2 += character+"0";
	}

	//Evalúa la parte flotante más larga, BinX siempre será el que tenga más dígitos
	if (bin1.split(character)[1].length > bin2.split(character)[1].length) {
		bestIntWas1 = true;
		//Asigna al más largo
		binX = bin1.split(character)[1];
		//Asigna al más corto
		binY = bin2.split(character)[1];
	}else if (bin1.split(character)[1].length == bin2.split(character)[1].length){
		bestIntWas1 = true;
		binX = bin2.split(character)[1];
		binY = bin1.split(character)[1];
	}
	else{
		binX = bin2.split(character)[1];
		binY = bin1.split(character)[1];
	}

	// Evalúa la parte entera más larga, BinZ siempre será la más larga.
	if (bin1.split(character)[0].length > bin2.split(character)[0].length) {
		bestFloatWas1 = true;
		binZ = bin1.split(character)[0];
		binT = bin2.split(character)[0];
		// Almacena la posición de la coma en el número, de no tenerla, se almacena -1
		comma =  getComma(bin1);
 
	}else if(bin1.split(character)[0].length == bin2.split(character)[0].length){
		bestFloatWas1 = true;
		binZ = bin2.split(character)[0];
		binT = bin1.split(character)[0];
		// Almacena la posición de la coma en el número, de no tenerla, se almacena -1
		comma =  getComma(bin2);
	}
	else{
		binZ = bin2.split(character)[0];
		binT = bin1.split(character)[0];
		comma =  getComma(bin2);
	}

	//rellena con ceros a la derecha ( parte flotante) hasta que sean de la misma longitud
	while (true) {
		if(binX.length == binY.length){
			break;
		}
		binY += "0";
	}

	// Rellena con ceros a la izquierda (parte entera) hasta que tengan la misma longitud
	while (true) {
		if(binZ.length == binT.length){
			break;
		}
		binT = "0"+binT;
	}
	
	// Evalúa cuál era el más largo, de modo que
	// Evita que se concatenen la parte entera y flotante de números distintos
	bin1 = bestFloatWas1?binZ:binT;
	bin2 = bestFloatWas1?binT:binZ;

	bin1 += bestIntWas1?binX:binY;
	bin2 += bestIntWas1?binY:binX;

	// Devuelve un arreglo con los dos números
	var res = [bin2,bin1];
	
	//debug
	console.log(res)

	return res;
}

//Retorna un arreglo de strings sin la comma
function smartNormalize(bin1,bin2){
	// Limpia el maquillaje
	bin1 = bin1.replace(/ /g,'');
	bin2 = bin2.replace(/ /g,'');
	comma = getComma(bin1)
	bin1 = bin1.replace(",","");
	bin2 = bin2.replace(",","");
	bin1 = bin1.replace(".","");
	bin2 = bin2.replace(".","");
	var res = [bin1,bin2];
	console.log(res)
	return res;
}

// Retorna un índice de la posición de la coma (tomando la posición relativa desde la izquierda)
function getComma(str){
	var res = -1;
	j=0
	for (let i = str.length; i > 0; i--) {
		const element = str.charAt(i);
		if (element==','||element=='.') {
			res = j;
			break;
		}		
		j++;
	}
	return res-1;
}

// Retorna una cadena con el índice colocado en la posición indicada. La posición debe ser obtenida con la función GetComma
function placeComma(str,index) {
	j=0
	for (let i = str.length; i > 0; i--) {
		if (j==index) {
			str = str.splice(i,0,",")
			break;
		}		
		j++;
	}
	return str;
}

//Función que opera según séa necesario
function equal() {
	if (operator=="+"||operator=="-"){
		var normalizedOperands = normalizeDigits(operand2,operand1);

		operand1 = normalizedOperands[0];
		operand2 = normalizedOperands[1];

	} else{
		const value = operand1.length;
		var normalizedOperands = smartNormalize(operand1,operand2);

		operand1 = normalizedOperands[0];
		operand2 = normalizedOperands[1];;
	}
	operand1 = bigInt(operand1, base);
	operand2 = bigInt(operand2, base);
	
	switch(operator) {
		case '+':
			operand1 = operand1.add(operand2);
			break;
		case '-':
			operand1 = operand1.subtract(operand2);
			break;
		case '*':
			operand1 = operand1.multiply(operand2);
			break;
		case '/':
			if(operand2)
				operand1 = operand1.divide(operand2);
			break;
		default:
			break;
	}
	operation = maquillaje(placeComma(operand1.toString(base),comma));
	renderResDiv();
}

// Retorna una cadena con el valor ingresado, separando cada 5 caracteres con un espacio.
function maquillaje(val){
	for (let i = 0; i < val.length; i++) {
		if(i%5==0 && val.charAt(i)!=" "){
			val= val.splice(i,0," ");
		}
	}
	val = val.slice(1);
	return val;
}

//Aplica diréctamente la función de maquillaje sobre los inputs
function maquillar() {
	document.getElementById("in1").value = maquillaje(document.getElementById("in1").value);
	document.getElementById("in2").value = maquillaje(document.getElementById("in2").value);
}

// Asigna la variable operador según la entrada
function assignOperator(val) {
	operand1 = document.getElementById("in1").value;
	operand2 = document.getElementById("in2").value;
	operator = val;
	operation = maquillaje(document.getElementById("in1").value) + operator + maquillaje(document.getElementById("in2").value);
	renderResDiv();
}

// Hace render de la operación o resultado según corresponda
function renderResDiv() {
	res.innerHTML = operation;
}