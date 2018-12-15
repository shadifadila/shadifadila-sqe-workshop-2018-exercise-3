const symbolic = require('./symbolic.js');

let linecolor = [];
let input=null;

function ConvertLit(val) {
    return symbolic.parseCode(val.toString()).body[0].expression;

}

function AddVar(varname,varvalue,extenv) {
    extenv.vars.push(varname);
    extenv.values.push(varvalue);
}

const SetVar = (env, vr,vl)  =>
    // env==null ? null :
    SetExtVar(env,vr,vl) ;

const SetExtVar = (env,v,vl) =>
    env.vars.includes(v) ? env.values[env.vars.indexOf(v)]=vl :
        SetVar(env.next, v,vl);



const applyEnv = (env, v)  =>
    //env==null ? null :
    applyExtEnv(env, v) ;

const applyExtEnv = (env, v) =>
    env.vars.includes(v) ? env.values[env.vars.indexOf(v)] :
        applyEnv(env.next, v);




function FunctionDeclaration(code,env) {
    code.params.map((p)=>{
        AddVar(p.name,ConvertLit(input[code.params.indexOf(p)]),env);
    });

    start(code.body,env);


}


function BlockStatement(code,env) {
    try {


        let extenv = {types: [], vars: [], values: [], next: env};
        code.body.map((p) => {
            start(p, extenv);
        });
    }

    catch (err) {
        throw err;
    }

}
function  VariableDeclaration(code,env) {
    return code.declarations.map( (v)=>{
        v.init= start(v.init,env);
        AddVar( v.id.name ,v.init,env);
    });
}

function BinaryExpression(code,env) {
    let left =  symbolic.escodegen.generate(start(code.left,env));
    let right = symbolic.escodegen.generate(start(code.right,env));
    let opr = code.operator;

    let value  =  eval(left + opr+right);
    return symbolic.parseCode(value.toString()).body[0].expression;
}
function AssignmentExpression(code,env) {
    SetVar(env,start(code.left,null),start(code.right,env));
}
function Identifier(code,env) {
    if(env==null) return code.name;
    let v=applyEnv(env,code.name);
    //if(v==null)
    //   return code ;
    return v;
}
function Literal(code) {
    return code;
}
function ExpressionStatement(code,env) {
    start(code.expression,env);
}
function IfStatement(code,env) {
    if(eval(symbolic.escodegen.generate(start(code.test,env))))
    {
        linecolor.push({line : code.test.loc.start.line , color : '#249200'});
        start(code.consequent,env);
    }
    else {
        linecolor.push({line : code.test.loc.start.line , color : '#cf0002'});

        if (code.alternate != null)
            start(code.alternate, env);
    }

}
function ReturnStatement(code,env) {
    if(code.argument!=null)
        code.argument= start(code.argument,env);
    throw 'return';


}
function WhileStatement(code,env) {
    while (eval(symbolic.escodegen.generate(start(code.test, env)))) {
        start(code.body, env);
    }

}

let dict = {
    'FunctionDeclaration': FunctionDeclaration ,
    'VariableDeclaration': VariableDeclaration ,
    'BinaryExpression' : BinaryExpression,
    'Literal' : Literal ,
    'BlockStatement' : BlockStatement,
    'AssignmentExpression' : AssignmentExpression,
    'Identifier' :Identifier,
    'ExpressionStatement' : ExpressionStatement,
    'IfStatement' :IfStatement,
    'ReturnStatement' : ReturnStatement,
    'WhileStatement' :WhileStatement,

};


function start(codejson,env) {
    //console.log(codejson.type);
    return dict[codejson.type](codejson,env) ;
}

function color(string_code,inputvector){
    input=eval('['+inputvector+']');
    let  ast =symbolic.parseCode(symbolic.sub(string_code));
    let env ={vars:[],values:[],next:null};

    ast.body.map((exp) => {
        try {
            start(exp, env);
        }
        catch (e) {
            return ;
        }


    });

    //return symbolic.escodegen.generate(ast);
    return {code : symbolic.sub(string_code) , colors :linecolor};
}
module.exports={color};
/*
console.log(color('function foo(x, y, z){\n' +
    '    let a = x + 1;\n' +
    '    let b = a + y;\n' +
    '    let c = 0;\n' +
    '    \n' +
    '    if (b < z) {\n' +
    '        c = c + 5;\n' +
    '        return x + y + z + c;\n' +
    '    } else if (b < z * 2) {\n' +
    '        c = c + x + 5;\n' +
    '        return x + y + z + c;\n' +
    '    } else {\n' +
    '        c = c + z + 5;\n' +
    '        return x + y + z + c;\n' +
    '    }\n' +
    '}\n','2,3,4'));

*/


