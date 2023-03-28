function mayor (){

    var n1, n2, resultado = "";
    n1 = parseInt(document.getElementById("n1").value);
    n2 = parseInt(document.getElementById("n2").value);


if (n1 > n2){
    resultado = "EL NUMERO MAYOR ES: " + n1;
}else if (n1 < n2){
     resultado = "EL NUMERO MAYOR ES: " + n2;
} else {
     resultado = "SON IGUALES."
}
document.getElementById("resultado").innerHTML = resultado;
}


