import assert from 'assert';
const symbolic = require('../src/js/symbolic.js');
const color = require('../src/js/color.js');


function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
describe('The javascript parser', () => {

    it(' let x=3; ', () => { assert.equal(symbolic.sub('let x=3;'), 'let x = 3;'); });
    it('  function test ', () => { assert.equal(replaceAll(replaceAll(symbolic.sub('let a =10 ; function foo(x,y,z){ while(a<100) a=a+10; if(a==200 ) return a-100; if(a==100) return a; if(a == 900) return 6 ; return 9; }'),'\n',''),' ',''),  'leta=10;functionfoo(x,y,z){while(a<100)a=a+10;if(a==200)returna-100;if(a==100)returna;if(a==900)return6;return9;}'); });
    it(' function 2', () => { assert.equal(replaceAll(replaceAll(symbolic.sub('function foo(x, y, z){     let a = x + 1;     let b = a + y;     let c = 0;          if (b < z) {         c = c + 5;         return x + y + z + c;     } else if (b < z * 2) {         c = c + x + 5;         return x + y + z + c;     } else {         c = c + z + 5;         return x + y + z + c;     } } '),'\n',''),' ',''), 'functionfoo(x,y,z){if(x+1+y<z){returnx+y+z+(0+5);}elseif(x+1+y<z*2){returnx+y+z+(0+x+5);}else{returnx+y+z+(0+z+5);}}'); });
    it(' array ', () => { assert.equal(replaceAll(replaceAll(symbolic.sub('let a=[1,2,3]; let b= a[2];'),' ',''),'\n',''), 'leta=[1,2,3];letb=[1,2,3][2];'); });
    it(' array ', () => { assert.equal(replaceAll(replaceAll(symbolic.sub('function foo(x, y, z){     let a = x + 1;     let b = a + y;     let c = 0;          while (a < z) {         c = a + b;         z = c * 2;     }          return z; } '),' ',''),'\n',''), 'functionfoo(x,y,z){while(x+1<z){z=(x+1+(x+1+y))*2;}returnz;}'); });
    it(' array ', () => { assert.equal(replaceAll(replaceAll(symbolic.sub('function foo(x, y, z){   x==5; 6&&x;  return ; }'),' ',''),'\n',''), 'functionfoo(x,y,z){return;}'); });

    it(' color ', () => { assert.equal(JSON.stringify(color.color('let x=3;','0'),null,-1),'{"code":"let x = 3;","colors":[]}' ); });

    it(' color ', () => { assert.equal(JSON.stringify(color.color('let a=10; function foo(x, y, z){        if(a>1) a=a+10;     while(a<100){     a=a+x+y+z;    }    if(a==200)        return 200;    else if(a==100)         return 100;    else        return false;  }','3,3,4'),null,-1), '{"code":"let a = 10;\\nfunction foo(x, y, z) {\\n    if (a > 1)\\n        a = a + 10;\\n    while (a < 100) {\\n        a = a + x + y + z;\\n    }\\n    if (a == 200)\\n        return 200;\\n    else if (a == 100)\\n        return 100;\\n    else\\n        return false;\\n}","colors":[{"line":3,"color":"#249200"},{"line":8,"color":"#cf0002"},{"line":10,"color":"#249200"}]}' ); });

    it(' color ', () => { assert.equal(JSON.stringify(color.color('function foo(x,y,z){     if(x==5)      return y;    return z;  }','1,2,3'),null,-1),'{"code":"function foo(x, y, z) {\\n    if (x == 5)\\n        return y;\\n    return z;\\n}","colors":[{"line":3,"color":"#249200"},{"line":8,"color":"#cf0002"},{"line":10,"color":"#249200"},{"line":2,"color":"#cf0002"}]}' ); });
    it(' color ', () => { assert.equal(JSON.stringify(color.color('function foo(x,y,z){     if(x==5)      return;    return z;  }','5,5,5'),null,-1),'{"code":"function foo(x, y, z) {\\n    if (x == 5)\\n        return;\\n    return z;\\n}","colors":[{"line":3,"color":"#249200"},{"line":8,"color":"#cf0002"},{"line":10,"color":"#249200"},{"line":2,"color":"#cf0002"},{"line":2,"color":"#249200"}]}' ); });
    //function foo(x, y, z){     return ; }
});

