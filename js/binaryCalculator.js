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

/**
 * 
 * @param {*} idx Start Index 
 * @param {*} rem Stop Index
 * @param {*} s Insertion
 */
String.prototype.splice = function( idx, rem, s ) { 
	return idx==-1?this:(this.slice(0,idx) + s + this.slice(idx + Math.abs(rem))); 
};

// Selector de bases
document.getElementById("base").addEventListener("change", e=>{
	base_str = document.getElementById("base").value;
	base = parseInt(base_str);
	if (base==8) {
		document.getElementById("ToBin").style.display = "block";
	}else{
		document.getElementById("ToBin").style.display = "none";
	}
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
// Event Handler del botón que conveirte de la base a binario.
document.getElementById("ToBinDo").addEventListener("click",e=>{
	document.getElementById("ToBinProcess").innerHTML = toBin(""+document.getElementById("ToBinIn").value);
	document.getElementById("ToBinIn").value="";
});

/*
 * Funciones
*/

// Retorna una tabla HTML con el valor de entrada en base X pero con sus cifras en binario
function toBin(val){
	//Limpia maquillaje
	val = val.replace(/ /g,'');
	// Inicializa la cadena HTML 
	let res="<p>"+maquillaje(val)+"</p><br><table class='white-borders'><tbody><tr>";
	//Agrega la primera fila con el número de entrada
	for (let i = 0; i < val.length; i++) {
		const element = val.charAt(i);
		res+="<td>"+element+"</td>";
	}
	res+="</tr><tr>"
	// De acuerdo a la base, genera el diccionario de cambio
	if (base==8) {
		const dict = {
			"1":"001",
			"2":"010",
			"3":"011",
			"4":"100",
			"5":"101",
			"6":"110",
			"7":"111",
			".":".",
			",":".",
		}
		// Rellena la segunda fila conn los binarios de caa dígito
		for (let i = 0; i < val.length; i++) {
			const element = val.charAt(i);
			res+="<td class='m-3'>"+dict[element]+"</td>";
		}
	}
	res+="</tr></tbody></table>"
	return res;
}

//Ubica los números basados en la coma (retorna tabla HTML)
function placeCorrectly(op1,op2) {
	//Limpia maquillaje
	op1 = op1.replace(/ /g,'');
	op2 = op2.replace(/ /g,'');
	//Inicializa el HTML
	var StringHTML = "<table><tbody><tr><td></td>";
	// Separa partes enteras de ambos números
	var binH = op1.includes(",")?op1.split(",")[0]:op1.split(".")[0];
	var binX = op2.includes(",")?op2.split(",")[0]:op2.split(".")[0];
	// Calcula la diferencia que existe entre una cadena y otra
	const lenDif = Math.abs(binH.length-binX.length) 
	//Escribir la parte entera del primer número
	for (let i = 0; i < op1.length; i++) {
		const element = op1.charAt(i);
		StringHTML += "<td>"+element+"</td>";
	}
	StringHTML += "</tr><tr class='infBorderWT' ><td>"+operator+"</td>";
	//Escribe los espacios necesarios
	for (let i = 0; i < lenDif; i++) {
		StringHTML+="<td></td>"
	}
	// Escribe el segundo número
	for (let i = 0; i < op2.length; i++) {
		const element = op2.charAt(i);
		StringHTML += "<td>"+element+"</td>";
	}
	StringHTML += "</tr></tbody></table>";
	return StringHTML;
}

//Prototipo de multiplicador con proceso (retorna Tabla HTML)
function multiplyStepByStep(mul,mulTo) {
	// Convierte los números en String
	mul = mul.toString(base);
	mulTo = mulTo.toString(base);
	//Enceuntra la diferencia entre longitudes
	var lenDif = Math.abs(mul.length-mulTo.length);
	strHTMLTableProcess = "<table><tbody><tr>";
	for (let i = 0; i < mulTo.length; i++) {
		strHTMLTableProcess += "<td></td>";
	}
	//Escribe el primer operando
	for (let i = 0; i < mul.length; i++) {
		const element = mul.charAt(i);
		strHTMLTableProcess += "<td>"+element+"</td>";
	}
	strHTMLTableProcess +="</tr><tr>";
	//Escribe la diferencia Espacios vacios para rellenar la diferencia de operandos
	for (let i = 0; i < mulTo.length+lenDif; i++) {
		strHTMLTableProcess += i==0?"<td>X</td>":"<td></td>";
	}
	// Escribe el segundo operando
	for (let i = 0; i < mulTo.length; i++) {
		const element = mulTo.charAt(i);
		strHTMLTableProcess += "<td>"+element+"</td>";
	}
	strHTMLTableProcess +="</tr><tr class='infBorderWT'>";
	lenDif = mul.length==mulTo.length?mul.length:lenDif;
	
	for (let i = 0; i < mul.length+lenDif; i++) {
		strHTMLTableProcess += "<td></td>";
	}

	strHTMLTableProcess +="</tr>";
	//Desarrolla la multiplicacion
	for (let i = mulTo.length-1; i >= 0; i--) {
		//Dígito del segundo operando
		const digit = parseInt(mulTo.charAt(i),base);
		//Multiplica el dígito por el primer operando
		var parcialRes = (parseInt(mul,base)*digit).toString(base);
		strHTMLTableProcess +="<tr>";
		// Añade los espacios vacios de acuerdo al nivel de la multiplicación
		for (let k = i; k >= 0; k--){
			strHTMLTableProcess += "<td></td>";
		}
		// Verifica si es 0, rellena toda la fila con ceros
		if (parcialRes == 0) {
			for (let j = 0; j < mul.length; j++) {
				strHTMLTableProcess += "<td>0</td>";				
			}
		}else{
			// Escribe el resultado parcial
			for (let j = 0; j < parcialRes.length; j++) {
				const element = parcialRes.charAt(j);
				strHTMLTableProcess += "<td>"+element+"</td>";
			}
		}

		strHTMLTableProcess +="</tr>";
	}
	strHTMLTableProcess += "</tbody></table>";
	return strHTMLTableProcess;
}

//Prototipo de divisor con Proceso
function divideStepByStep(div,divTo){
	//Determina la longitud del divisor
	var divToLen = divTo.length;
	// Separa una seccion del dividendo del tamaño del divisor
	var microSubstraction = parseInt(div.substring(0,divToLen),base);
	// Convierte el divisor a tipo number
	divTo = parseInt(divTo,base);
	StringCosiente = "";

	StringOperationalTable = "<table><thead><tr>";
	// Escribe el dividendo
	for (let i = 0; i < div.length; i++) {
		const element = div.charAt(i);
		StringOperationalTable += "<td>"+element+"</td>";
	}
	// contador de tags td
	var tdCount;
	//Contador de filas
	var rowCount=0;
	StringOperationalTable +="</tr></thead><tbody>";
	// Verifica que sea operable
	if (parseInt(div,base)>=divTo) {
		//Realiza el desarrollo
		for (let i = divToLen; i-1 < div.length; i++) {
			tdCount=0;
			rowCount++;
			StringOperationalTable += "<tr>";
			if (microSubstraction>=divTo) {
				for (let l = 1+1; l < rowCount; l++) {
					StringOperationalTable += "<td></td>";
					tdCount++;
				}
				for (let j = 1; j < base; j++) {
					if ((j*divTo)==microSubstraction|| j==(base-1) ) {
						for (let m = (divTo*j).toString(base).length; m+tdCount < i; m++) {
							StringOperationalTable += "<td></td>";
						}
						for (let l = 0; l < (divTo*j).toString(base).length; l++) {
							tdCount++;
							const element = (divTo*j).toString(base).charAt(l);
							StringOperationalTable += "<td><u>"+element+"</u></td>";
						}
						microSubstraction -= divTo*j;
						StringCosiente += ""+j;
						break;
					}else if (j*divTo>microSubstraction){
						for (let m = (divTo*j).toString(base).length; m+tdCount < i; m++) {
							StringOperationalTable += "<td></td>";
						}
						for (let l = 0; l < (divTo*(j-1)).toString(base).length; l++) {
							tdCount++;
							const element = (divTo*(j-1)).toString(base).charAt(l);
							StringOperationalTable += "<td><u>"+element+"</u></td>";
						}						
						microSubstraction -= divTo*(j-1);
						StringCosiente += ""+(j+1);
						break;
					}
				}
			}else{
				StringCosiente += "0";
			}

			StringOperationalTable +="</tr><tr>";

			for (let l = (microSubstraction.toString(base)).length; l < i; l++) {
				StringOperationalTable += "<td></td>";
			}

			for (let l = 0; l < (microSubstraction.toString(base)).length; l++) {
				const element = (microSubstraction.toString(base)).charAt(l);
				StringOperationalTable += "<td>"+element+"</td>";
			}	

			StringOperationalTable+="<td>"+div.charAt(i)+"</td>"
			StringOperationalTable +="</tr>";	
			console.log(microSubstraction+div.charAt(i))
			microSubstraction = parseInt(microSubstraction.toString(base)+div.charAt(i),base);
		}
	}
	StringOperationalTable += "</tbody></table>";
	return [StringOperationalTable,StringCosiente,divTo];
}

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
	var intSide = BigNumber(num.split(character)[0]);
	var fltSide = parseFloat("0."+num.split(character)[1]);

	htmlProcessInt += "<table><tr><th style='text-align: right'><u>"+maquillaje(intSide.toFixed())+"</u> </th><th> <u>"+base_str+"</u></th></tr>"
	
	// Convierte la parte entera
	while(true){
		// Divide para la base
		intSide = intSide.dividedBy(base);
		// Verifica que tenga parte decimal
		if ((intSide+"").includes(".")) {
			// Agrega el paso a la cadena HTML
			htmlProcessInt += "<tr><td style='text-align: right'>"+maquillaje(intSide.toFixed())+" |</td><td> "+(BigNumber("0."+(intSide.toFixed().split(".")[1])).multipliedBy(base)).toFixed().split(".")[0]+"</td></tr>";
			// Agrega la cifra a la cadena resultado
			result_int+=((BigNumber("0."+(intSide.toFixed().split(".")[1])).multipliedBy(base)).toString(base).split(".")[0]).toUpperCase();
			// reasigna con solo la parte entera 
			intSide = BigNumber(intSide.toFixed().split(".")[0]);
		}else{
			// Agrega 0 a las cifras
			htmlProcessInt += "<tr><td style='text-align: right'>"+intSide.toFixed()+"|</td><td>0</td></tr>";
			result_int+="0";
		}
		// Verifica si es momento de parar las iteraciones
		if (intSide.isLessThan(base)) {
			// Toma el residuo y lo añade a la cadena de cifras 
			result_int+= intSide.toFixed()!="0"?(intSide.toString(base).split(".")[0]).toUpperCase():"";
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
				result_flt += fltSide.toString(base);
				htmlProcessFloat += " = "+fltSide.toString();
				break;
			}else{
				// Añade la cifra a la cadena de resultado
				result_flt +=BigNumber((fltSide.toString(base)).split(".")[0],base).toString(base).toUpperCase();
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
		process += parseInt(digit,base).toString(10)+"x"+base_str+"<sup>"+(intSide.length-(i+1))+"</sup>";
		resultInt = bigInt(resultInt.add(bigInt(digit,base).multiply(Math.pow(base,intSide.length-(i+1)))));
	}

	
	//Evalúa si tiene parte flotante
	if (fltSide!="0") {
		// Calcula el resultado desde la parte negativa
		for (let i = 0; i < fltSide.length; i++) {
			var digit = fltSide.charAt(i);
			process += " + "+parseInt(digit,base)+"x"+base_str+"<sup>"+(-1-i)+"</sup>";
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
	// Limpia en caso de estar maquillados
	bin = bin.replace(/ /g,'');
	// En caso de que uno de los números no tenga punto o coma, se lo añade para normalziar
	const index = getComma(bin);
	bin = bin.replace(character,"");
	let sum ="";
	for (let i = 0; i < bin.length; i++) {
		sum += (base-1)+"";
	}
	var bin1 = (bigInt(sum,base).subtract(bigInt(bin,base)));
	document.getElementById("resComp1").innerHTML = maquillaje(placeComma(bin1.toString(base),index));
	document.getElementById("resComp2").innerHTML = maquillaje(placeComma(bin1.add(1).toString(base),index));
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
		// Almacena la posición de la coma en el número, de no tenerla, se almacena -1
		comma =  getComma(bin1);
	}else if (bin1.split(character)[1].length == bin2.split(character)[1].length){
		binX = bin2.split(character)[1];
		binY = bin1.split(character)[1];
		// Almacena la posición de la coma en el número, de no tenerla, se almacena -1
		comma =  getComma(bin1);
	}
	else{
		binX = bin2.split(character)[1];
		binY = bin1.split(character)[1];
		comma =  getComma(bin2);
	}

	// Evalúa la parte entera más larga, BinZ siempre será la más larga.
	if (bin1.split(character)[0].length > bin2.split(character)[0].length) {
		bestFloatWas1 = true;
		binZ = bin1.split(character)[0];
		binT = bin2.split(character)[0];
		
 
	}else if(bin1.split(character)[0].length == bin2.split(character)[0].length){
		binZ = bin2.split(character)[0];
		binT = bin1.split(character)[0];
		
	}
	else{
		binZ = bin2.split(character)[0];
		binT = bin1.split(character)[0];
		
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
	comma = getComma(bin1);
	comma = (bin1.includes(".")||bin1.includes(","))&&(bin2.includes(".")||bin2.includes(","))?getComma(bin1)+getComma(bin2):comma;
	bin1 = bin1.replace(",","");
	bin2 = bin2.replace(",","");
	bin1 = bin1.replace(".","");
	bin2 = bin2.replace(".","");
	var res = [bin1,bin2];
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
		document.getElementById("PlaceCorrectlyProcess").innerHTML = placeCorrectly(operand1,operand2);
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
	document.getElementById("DetailedDivProcess").innerHTML = "";
	document.getElementById("DetailedMulProcess").innerHTML = "";
	switch(operator) {
		case '+':
			operand1 = operand1.add(operand2);
			break;
		case '-':
			operand1 = operand1.subtract(operand2);
			break;
		case '*':
			document.getElementById("DetailedMulProcess").innerHTML = multiplyStepByStep(operand1,operand2);
			operand1 = operand1.multiply(operand2);
			break;
		case '/':
			if(operand2){}{
				document.getElementById("DetailedDivProcess").innerHTML = divideStepByStep(operand1.toString(base),operand2.toString(base))[0];
				operand1 = operand1.divide(operand2);
			}
			break;
		default:
			break;
	}
	operation = maquillaje(placeComma(operand1.toString(base),comma).toUpperCase());
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