
const esprima = require('esprima');
const escodegen = require('escodegen');



const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{loc:true});
};

let env = null;

function AddVar(type,varname,varvalue,extenv) {
    extenv.types.push(type);
    extenv.vars.push(varname);
    extenv.values.push(varvalue);
}


const applyEnv = (env, v)  =>
    env==null ? null :
        applyExtEnv(env, v) ;

const applyExtEnv = (env, v) =>
    env.vars.includes(v) ? env.values[env.vars.indexOf(v)] :
        applyEnv(env.next, v);

function FunctionDeclaration(code,env) {
    parse_elements(code.body,env.next);
}
function  VariableDeclaration(code,env) {
    return code.declarations.map( (v)=>{
        v.init=parse_elements(v.init,env);
        AddVar(code.type, v.id.name ,v.init,env);
    });
}
function BlockStatement(code,env){
    let extenv = { types : [] , vars: [] , values : [] , next : env } ;
    code.body.map((p) => {
        parse_elements(p,extenv);
    });
    let newcode = [] ;
    for(let i=0 ; i<code.body.length ; i++){
        if(code.body[i].type == 'ExpressionStatement')
            RemoveExpressionStatement(code.body[i],newcode,extenv);
        else
        if(code.body[i].type != 'VariableDeclaration' )
            newcode.push(code.body[i]);
    }
    code.body=newcode;
    return newcode;
    //return code.body;
}
function RemoveExpressionStatement(code,st,env) {
    if( code.expression.type  == 'AssignmentExpression')
        if(applyEnv(env,parse_elements(code.expression.left)) == null )
            st.push(code);
}


function BinaryExpression(code,env) {
    code.left= parse_elements(code.left,env);
    code.right= parse_elements(code.right,env);
    return code;
}


function Identifier(code,env) {


    if(env==null) return code.name;
    let v=applyEnv(env,code.name);
    if(v==null)
        return code ;

    return v;
}

function Literal(code) {
    return code;
}

function IfStatement(code,env) {
    code.test=parse_elements(code.test,env);
    parse_elements(code.consequent,env);

    if(code.alternate != null) {
        parse_elements(code.alternate,env);
    }

}
function AssignmentExpression(code,env) {
    parse_elements(code.right,env);
    let var_name = parse_elements(code.left,null) ;
    if(applyEnv(env,var_name)==null) parse_elements(code.right,env) ;
    else
        AddVar( code.type , parse_elements(code.left,null),parse_elements(code.right,env),env);

}

function ExpressionStatement(code,env) {
    return parse_elements(code.expression,env);
}

function ReturnStatement(code,env) {
    if(code.argument!=null)
        parse_elements(code.argument,env);

}

function ArrayExpression(code,env) {

    code.elements = code.elements.map((v)=>
        parse_elements(v,env)
    );

    return code ;


}
function MemberExpression(code,env) {

    code.object=parse_elements(code.object,env);
    code.property=parse_elements(code.property,env);

    return code;
}
function LogicalExpression(code,env) {
    code.left= parse_elements(code.left,env);
    code.right= parse_elements(code.right,env);
    return code;
}

function WhileStatement(code,env) {
    parse_elements(code.test,env);
    parse_elements(code.body,env);
}


let dict = {
    'LogicalExpression' : LogicalExpression,
    'ArrayExpression': ArrayExpression,
    'FunctionDeclaration': FunctionDeclaration ,
    'BlockStatement' : BlockStatement,
    'VariableDeclaration': VariableDeclaration ,
    'BinaryExpression' :BinaryExpression,
    'Identifier' :Identifier,
    'Literal' : Literal ,
    'IfStatement' :IfStatement,
    'AssignmentExpression' : AssignmentExpression,
    'ExpressionStatement' : ExpressionStatement,
    'ReturnStatement' : ReturnStatement,
    'WhileStatement' :WhileStatement,
    'MemberExpression':MemberExpression,
    /*'ExpressionStatement' :ExpressionStatement,
    'IfStatement' :IfStatement,
    'ReturnStatement' :ReturnStatement,
    'ForStatement' :ForStatement,
    'DoWhileStatement' : DoWhileStatement,
    'BlockStatement' : BlockStatement,
    'EmptyStatement' :EmptyStatement,*/

};


function parse_elements(codejson,env) {
    //console.log(codejson.type);
    return dict[codejson.type](codejson,env) ;
}

function sub(code) {
    let parse = parseCode(code);
    env={ types:[], vars: [] , values : [] , next : null };
    parse.body.map((exp) => {
        parse_elements(exp,env);
    });
    return escodegen.generate(parse);
}
module.exports={sub,parseCode,escodegen};

//console.log(sub('let a =10 ; function foo(x,y,z){ while(a<100) a=a+10; if(a==200 ) return a-100; if(a==100) return a; if(a == 900) return 6 ; return 9; }'));



console.log(sub('function foo(x, y, z){\n' +
    '    let x=0 ;\n' +
    '  if( 6&&x ) return true;\n' +
    '    return ;\n' +
    '}'));



//console.log(applyEnv(env,'c'));