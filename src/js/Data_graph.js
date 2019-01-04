
const esprima = require('esprima');
const escodegen = require('escodegen');
const code_eval = require('./p_evel.js');


const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{loc:true});
};

let id=0;
function get_UID() {
    id++;
    return id;
}

let node_id=0;
function getid() {
    node_id=node_id+1;
    return node_id;
}

function  VariableDeclaration(code ,node) {

    if(node.type === 'init'||node.type==='merge' || node.type ==='w_normal')
    {
        let n_node= {id:getid(), type:'normal' , text: [], number: get_UID() , line:null , color: '#F8F8F8', shape: 'm', right: null, left: null} ;
        let txt = escodegen.generate(code);
        n_node.text.push(txt);
        if(node.type == 'w_normal') { node.left=n_node; node.type='normal' ;  } else node.right= n_node;
        return n_node;

    }
    else {
        let txt = escodegen.generate(code);
        node.text.push(txt);
        return node;
    }



}

function WhileStatement(code , node) {
    let  m_node= {id:getid(), type:'merge' , text: [], number: null , line:null , color: '#F8F8F8', shape: 'c', right: null, left: null} ;

    if(node.type == 'w_normal') { node.left=m_node; node.type='normal' ;  } else node.right= m_node;

    let m_test = {id:getid(), type:'w_normal' , text: [], number: get_UID() , line:code.loc.start.line ,  color: '#F8F8F8', shape: 'x',right: null, left: null} ;
    m_node.right=m_test;

    m_test.text.push(escodegen.generate(code.test));

    let m_body = parse_elements(code.body,{type:'init',right:null,left:null});
    let last =getlast_node(m_body);
    last.right=m_node;
    m_test.right=m_body.right;

    return m_test;

}
function BlockStatement(code,node){

    code.body.reduce((nd,data) => {
        return parse_elements(data,nd);
    },node);
    return node;

}
function getlast_node(node) {

    let last_node = node;
    while (last_node.right !=null)
    {
        last_node=last_node.right;
    }
    return last_node;
}

function ExpressionStatement(code,node) {
    return parse_elements(code.expression,node);
}
function FunctionDeclaration(code,node) {
    return parse_elements(code.body,node);
}
function IfStatement(code,node) {
    let m_test = {id:getid(), type:'normal' , text: [], number: get_UID() , line:code.loc.start.line ,  color: '#F8F8F8', shape: 'x', right: null, left: null} ;
    m_test.text.push(escodegen.generate(code.test));
    if(node.type == 'w_normal') { node.left=m_test; node.type='normal' ;  } else node.right= m_test;
    let  m_node= {id:getid(), type:'merge' , text: [], number: null , line:null , color: '#F8F8F8', shape: 'c', right: null, left: null} ;
    let init_right={type:'init' ,right: null, left: null};
    parse_elements(code.consequent,init_right);
    m_test.right=init_right.right;
    if(code.alternate != null) { let init={type:'init' , right: null, left: null}; parse_elements(code.alternate, init); if( getlast_node(init).type == 'merge') { m_node = getlast_node(init); } else {getlast_node(init).right=m_node;} m_test.left = init.right; }
    else
    {
        m_test.left=m_node;
    }
    getlast_node(init_right).right= m_node;
    return m_node;
}

function AssignmentExpression(code,node) {
    if(node.type == 'init'||node.type == 'w_normal' || node.type == 'merge' )
    {
        let n_node= { id:getid(), type:'normal' , text: [], number: get_UID() ,  line:null , color: '#F8F8F8', shape: 'm', right: null, left: null} ;
        let txt = escodegen.generate(code);
        n_node.text.push(txt);
        if(node.type == 'w_normal') { node.left=n_node; node.type='merge' ;  } else node.right= n_node;
        return n_node;

    }
    else {
        let txt = escodegen.generate(code);
        node.text.push(txt);
        return node;
    }
}
function ReturnStatement(code,node) {
    let n_node= {id:getid(), type:'normal' , text: [], number: get_UID() ,  line:null , color: '#F8F8F8', shape: 'm',right: null, left: null} ;
    n_node.text.push( escodegen.generate(code));
    if(node.type == 'w_normal') { node.left=n_node; node.type='normal' ;  } else node.right= n_node;
    return n_node;
}

function UpdateExpression(code,node){
    if(node.type == 'init'||node.type == 'w_normal' || node.type == 'merge' )
    {
        let n_node= { id:getid(), type:'normal' , text: [], number: get_UID() ,  line:null , color: '#F8F8F8', shape: 'm', right: null, left: null} ;
        let txt = escodegen.generate(code);
        n_node.text.push(txt);
        if(node.type == 'w_normal') { node.left=n_node; node.type='merge' ;  } else node.right= n_node;
        return n_node;

    }
    else {
        let txt = escodegen.generate(code);
        node.text.push(txt);
        return node;
    }
}

let dict = {
    'VariableDeclaration': VariableDeclaration ,
    'BlockStatement' : BlockStatement,
    'ExpressionStatement' : ExpressionStatement,
    'FunctionDeclaration': FunctionDeclaration ,
    'IfStatement' :IfStatement,
    'AssignmentExpression' : AssignmentExpression,
    'ReturnStatement' : ReturnStatement,
    'WhileStatement' :WhileStatement,
    'UpdateExpression' : UpdateExpression,
    /*'LogicalExpression' : LogicalExpression,
    'ArrayExpression': ArrayExpression,
    'FunctionDeclaration': FunctionDeclaration ,
    'BlockStatement' : BlockStatement,
    'VariableDeclaration': VariableDeclaration ,
    'BinaryExpression' :BinaryExpression,
    'Identifier' :Identifier,
    'Literal' : Literal ,


    'ExpressionStatement' : ExpressionStatement,

    'WhileStatement' :WhileStatement,
    'MemberExpression':MemberExpression,*/


    /*'ExpressionStatement' :ExpressionStatement,
    'IfStatement' :IfStatement,
    'ReturnStatement' :ReturnStatement,
    'ForStatement' :ForStatement,
    'DoWhileStatement' : DoWhileStatement,
    'BlockStatement' : BlockStatement,
    'EmptyStatement' :EmptyStatement,*/


};


function parse_elements(codejson,node) {
    //console.log(codejson.type);
    return dict[codejson.type](codejson,node) ;
}
let nodes_ids=[];
function dt_graph(code) {
    nodes_ids=[];
    let parse = parseCode(code);
    let node ={ type:'init' , right:null , left:null};
    parse.body.reduce((nd,exp) => {
        return parse_elements(exp,nd);
    },node);
    return node;
}

function dr_update_colors(main_node,lines)
{
    if(main_node==null) return;
    if(nodes_ids.includes(main_node.id)) return ;
    if(main_node.shape=='x') {
        main_node.color = '#00CE4E';
        nodes_ids.push(main_node.id);
        if (lines.includes(main_node.line)) {
            dr_update_colors(main_node.right, lines);
            return;
        }
        else
        {
            dr_update_colors(main_node.left, lines);return;
        }
    }
    main_node.color = '#00CE4E';
    dr_update_colors(main_node.right, lines); return;
}

function start(_code,_input)
{
    id=0;
    node_id=0;
    let _lines = code_eval.start_eval(_code,_input);
    let _node= dt_graph(_code);

    dr_update_colors(_node,_lines);

    return _node;

}





/*********CODE GEN *********/
let nodes=[];
let edge=[];
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function x_green(node,node_text) {

    if(node.shape=='x' && node.color=='#00CE4E') {
        nodes.push({data: {id: node.id, name: node_text, type: 'Tg'}});
        if(node.left !=null) edge.push({ data: { id: getid(), source: node.id, target: node.left.id } });
        if(node.right !=null) edge.push({ data: { id: getid(), source: node.id, target: node.right.id } });
        code_gen(node.left);
        code_gen(node.right);
        return true;
    }
    return false;

}
function m_green(node,node_text) {

    if(node.shape=='m' && node.color=='#00CE4E' ) {
        nodes.push({data: {id: node.id, name: node_text, type: 'Rg'}});
        if(node.left !=null) edge.push({ data: { id: getid(), source: node.id, target: node.left.id } });
        if(node.right !=null) edge.push({ data: { id: getid(), source: node.id, target: node.right.id } });
        code_gen(node.left);
        code_gen(node.right);
        return true;
    }
    return false;
}

function m_white(node,node_text) {

    if(node.shape=='m' && node.color=='#F8F8F8') {
        nodes.push({data: {id: node.id, name: node_text, type: 'Rw'}});
        if(node.left !=null ) edge.push({ data: { id: getid(), source: node.id, target: node.left.id } });
        if(node.right !=null) edge.push({ data: { id: getid(), source: node.id, target: node.right.id } });
        code_gen(node.left);
        code_gen(node.right);
        return true;
    }
    return false;
}
function x_white(node,node_text) {

    if(node.shape=='x' && node.color=='#F8F8F8') {
        nodes.push({data: {id: node.id, name: node_text, type: 'Tw'}});
        if(node.left !=null) edge.push({ data: { id: getid(), source: node.id, target: node.left.id } });
        if(node.right !=null) edge.push({ data: { id: getid(), source: node.id, target: node.right.id } });
        code_gen(node.left);
        code_gen(node.right);
        return true;
    }
    return false;
}
function node_normal(node) {
    let node_text = replaceAll(node.text.toString(),',',' ')+'#('+node.number+')';
    if(x_green(node,node_text)==true) return ;
    if(m_green(node,node_text)==true) return ;
    if(m_white(node,node_text)==true) return ;
    if(x_white(node,node_text)==true) return ;
}
function node_merge(node) {


    if(node.color=='#F8F8F8') {
        nodes.push({data: {id: node.id, name: '', type: 'Cw'}});
    }
    else
    if(node.color=='#00CE4E' ) {
        nodes.push({data: {id: node.id, name: '', type: 'Cg'}});

    }

    if(node.left !=null) edge.push({ data: { id: getid(), source: node.id, target: node.left.id } });
    if(node.right !=null) edge.push({ data: { id: getid(), source: node.id, target: node.right.id } });
    code_gen(node.left);
    code_gen(node.right);


}

function is_added(node_id) {
    let res=false;
    for(let i=0;i<nodes.length ; i++)
    {
        if(nodes[i].data.id == node_id) res =true;
    }
    return res;
}


let type_dict = {
    'normal':node_normal,
    'merge' : node_merge,

};


function code_gen(node)
{
    try {
        if (node == null || is_added(node.id)) return;
        if (node.type == 'init') return code_gen(node.right);
        return type_dict[node.type](node);
    }
    catch (e) {
        return;
    }

}


function Draw(_code,_input){
    if(_code == '') return [];
    edge=[];
    nodes=[];
    code_gen(start(_code,_input));
    return nodes.concat(edge);
}

//console.log(Draw('function foo(x,y,z) { if(x<100) x++; let b=5; return b;}','1,2,3'));


start('function foo(x , y ,z) { if(x==1000) { x++; }  return x; }','1,2,3');
//let node = {type:'merge',color: '#00CE4E',left:null,right:null};
//console.log(code_gen(node));
module.exports={start,Draw,code_gen,node_normal};

/*

console.log(dt_graph('function foo(x, y, z){\n' +
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
    '}\n'));
    */