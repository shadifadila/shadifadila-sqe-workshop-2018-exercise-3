const esprima = require('esprima');
const escodegen = require('escodegen');


const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{loc:true});
};

let lines=[];
let func_name='';
function IfStatement(code) {

    let add = 'lines.push('+code.loc.start.line+')';
    let g=parseCode(add);

    add_expr(code.consequent,g);
    parse_elements(code.consequent);
    if(code.alternate != null) {
        parse_elements(code.alternate);
    }
}

function add_expr(code,new_expr) {
    let exprs=[];
    exprs.push(new_expr);
    if(code.type === 'BlockStatement')
    {
        for(let i=0 ; i<code.body.length ; i++){
            exprs.push(code.body[i]);
        }
        code.body =exprs;
    }
    if(code.type==='ExpressionStatement') {
        let tag='{'+escodegen.generate(new_expr) + escodegen.generate(code.expression)+'}';
        code.type ='BlockStatement';
        code.body =parseCode(tag).body;
    }


}

function FunctionDeclaration(code) {
    func_name=code.id.name;
    parse_elements(code.body);
}
function BlockStatement(code){

    code.body.map((p) => {
        parse_elements(p);
    });

}

function WhileStatement(code){

    let add = 'lines.push('+code.loc.start.line+')';
    let g=parseCode(add);

    add_expr(code.body,g);
    parse_elements(code.body);

}

let dict = {
    'FunctionDeclaration': FunctionDeclaration ,
    'BlockStatement' : BlockStatement,
    'IfStatement' :IfStatement,
    'WhileStatement' : WhileStatement ,
    /*'ExpressionStatement' :ExpressionStatement,
    'IfStatement' :IfStatement,
    'ReturnStatement' :ReturnStatement,
    'ForStatement' :ForStatement,
    'DoWhileStatement' : DoWhileStatement,
    'BlockStatement' : BlockStatement,
    'EmptyStatement' :EmptyStatement,*/

};


function parse_elements(codejson,env) {
    try {
        return dict[codejson.type](codejson,env) ;
    }
    catch (e) {
        return codejson;
    }

}
function start_eval(code,input) {
    let parse = parseCode(code);
    parse.body.map((exp) => {
        return parse_elements(exp);
    });
    let run=func_name+'('+input+') ;';
    parse.body.push(parseCode(run));
    eval(escodegen.generate(parse));
    return lines;
}
module.exports={start_eval};
/*
console.log(start_eval('function foo(p, y, z){\n' +
    'let x=6;\n' +
    'while(x<100){\n' +
    ' x++;\n' +
    '}\n' +
    'return x;\n' +
    '}','1,2,3'));

console.log(lines);
*/