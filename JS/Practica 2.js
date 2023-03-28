function Calif (){

    var c1 = 0, c2 = 0, c3 = 0;
    var mensaje = "";
    resultado = 0;
    c1 = parseInt(document.getElementById("c1").value);
    c2 = parseInt(document.getElementById("c2").value);
    c3 = parseInt(document.getElementById("c3").value);

    resultado = (c1 + c2 + c3) / 3;

if (resultado >= 10){
    mensaje = "EXELENTE!! APROVASTE";

}else if (resultado >= 8){
     mensaje = "BIEN, PUEDES MEJORAR";

} else if (resultado == 7){
     mensaje = "OK, MEJORA";

}else if (resultado < 7){
    mensaje = "REPROBADO. ESTAS SUSPENDIDO"
}
document.getElementById("mensaje").innerHTML = mensaje;
document.getElementById("resultado").innerHTML = resultado;
}