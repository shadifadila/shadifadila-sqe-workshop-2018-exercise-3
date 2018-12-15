import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {color} from './color';
$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#txtcode').val();
        let input = $('#txtinput').val();
        //console.log(codeToParse);
        draw(codeToParse,input);
        //$('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});
function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function draw(code,input) {
    let b=color(code,input);
    let codelines = b.code.split('\n');

    var html = '';
    for(let i=0 ; i< codelines.length ; i++ ){
        html = html + '<span style="font-family: Segoe UI; background-color: '+getColor(b.colors,i+1,codelines)+'">' +  replaceAll( htmlEntities(codelines[i].toString()),' ','&ensp;'  )+'</span><br />' ;
    }
    document.getElementById('result').innerHTML = html;

}

function getColor(jcode,i,codelines) {
    console.log(i);
    console.log(codelines[i]);
    for(let g=0;g<jcode.length;g++){
        if(jcode[g].line == i)
            return  jcode[g].color ;
    }
    return '#000000';


}