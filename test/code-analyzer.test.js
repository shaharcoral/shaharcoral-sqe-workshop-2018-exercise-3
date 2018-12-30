import assert from 'assert';
import {parseCode_eval} from '../src/js/eval-color';
import  {create_cfg} from '../src/js/code-analyzer';
import * as esprima from 'esprima';



describe('The javascript parser', () => {    it('test1', () => {        assert.equal(parseCode_eval('function foo(x){\n' +            'return x;\n' +            '}\n','3'),        '<p><br>function foo(x){<br/><br>return x;<br/><br>}<br/><p/>'        );});
    it('test2', () => {        assert.equal(parseCode_eval('function foo(x, y, z){\n' +            '    let a = x + 1;\n' +            '    let b = a + y;\n' +            '    let c = 0;\n' +            '    \n' +            '    if (b < z) {\n' +            '        c = c + 5;\n' +            '        return x + y + z + c;\n' +            '    } else if (b < z * 2) {\n' +            '        c = c + x + 5;\n' +            '        return x + y + z + c;\n' +            '    } \n' +            '}\n','1|2|3'),        '<p><br>function foo(x, y, z){<br/> <br> <mark style="background-color:red;">    if (x + 1 + y < z) {</mark> <br/><br>        return x + y + z + ( 5 );<br/><br>  <mark style="background-color:green;">    } else if (x + 1 + y < z * 2) {</mark> <br/><br>        return x + y + z + ( x + 5 );<br/><br>    } <br/><br>}<br/><p/>'        );});
    it('test3', () => {        assert.equal(parseCode_eval('function foo(x, y, z){\n' +            '    let a = x + 1;\n' +            '    let b = a + y;\n' +            '    let c = 0;\n' +            '    \n' +            '    while (a < z) {\n' +            '        c = a + b;\n' +            '        z = c * 2;\n' +            '    }\n' +            '    \n' +            '    return z;\n' +            '}\n','1|2|3'),        '<p><br>function foo(x, y, z){<br/><br>    while (x + 1 < z) {<br/><br>        z =( ( x + 1 + x + 1 + y ) * 2 )<br/><br>    }<br/><br>    return z;<br/><br>}<br/><p/>'        );});
    it('test4', () => {        assert.equal(parseCode_eval('let x;',''),            '<p><p/>'        );});
    it('test5', () => {        assert.equal(parseCode_eval('let t=3;\n' +            'function foo(){\n' +            'return t;\n' +            '}',''),        '<p><br>function foo(){<br/><br>return 3;<br/><br>}<br/><p/>'        );});
    it('test6', () => {        assert.equal(parseCode_eval('function foo(){\n' +            'let y;\n' +            '}',''),        '<p><br>function foo(){<br/><br>}<br/><p/>'        );});
    it('test7', () => {        assert.equal(parseCode_eval('function foo(x, y, z){\n' +            '    let a = x + 1;\n' +            '    let b = a + y;\n' +            '    let c = 0;\n' +            '    \n' +            '    if (b < z) {\n' +            '        c = c + 5;\n' +            '        return x + y + z + c;\n' +            '   }\n' +            '}\n','1|2|3'),        '<p><br>function foo(x, y, z){<br/> <br> <mark style="background-color:red;">    if (x + 1 + y < z) {</mark> <br/><br>        return x + y + z + ( 5 );<br/><br>   }<br/><br>}<br/><p/>'        );});
    it('test8', () => {        assert.equal(parseCode_eval('function foo(x, y, z){\n' +            '    let a = x + 1;\n' +            '    let b = a + y;\n' +            '    let c = 0;\n' +            'c=2;\n' +            '    \n' +            '    if (b < z) {\n' +            '        c = c + 5;\n' +            '        return x + y + z + c;\n' +            '   }\n' +            '}\n','1|2|3'),        '<p><br>function foo(x, y, z){<br/> <br> <mark style="background-color:red;">    if (x + 1 + y < z) {</mark> <br/><br>        return x + y + z + ( ( 2 ) + 5 );<br/><br>   }<br/><br>}<br/><p/>'        );});
    it('test9', () => {        assert.equal(parseCode_eval('function foo(x, y, z){\n' +            '    let a = x + 1;\n' +            '    let b = a + y;\n' +            '    let c = 0;\n' +            'c=2;\n' +            '    \n' +            '    if (b < z) {\n' +            'while(x==1){\n' +            '\n' +            'c=3;\n' +            '}\n' +            '        c = c + 5;\n' +            '        return x + y + z + c;\n' +            '   }\n' +            '}\n','1|2|3'),        '<p><br>function foo(x, y, z){<br/> <br> <mark style="background-color:red;">    if (x + 1 + y < z) {</mark> <br/><br>while(x == 1){<br/><br>}<br/><br>        return x + y + z + ( ( 2 ) + 5 );<br/><br>   }<br/><br>}<br/><p/>'        );});
    it('test10', () => {        assert.equal(parseCode_eval('function foo(x, y, z){\n' +            '    let a = x + 1;\n' +            '    let b = a + y;\n' +            '    let c = 0 + 0;\n' +            '    \n' +            '    if (b < z) {\n' +            '        c = c + 5;\n' +            '        return x + y + z + c;\n' +            '    } else if (b < z * 2) {\n' +            '        c = c + x + 5;\n' +            '        return x + y + z + c;\n' +            '    } else {\n' +            '        c = c + z + 5;\n' +            '        return x + y + z + c;\n' +            '    }\n' +            '}\n','1|2|3'),        '<p><br>function foo(x, y, z){<br/> <br> <mark style="background-color:red;">    if (x + 1 + y < z) {</mark> <br/><br>        return x + y + z + ( 5 );<br/><br>  <mark style="background-color:green;">    } else if (x + 1 + y < z * 2) {</mark> <br/><br>        return x + y + z + ( x + 5 );<br/><br>    } else {<br/><br>        return x + y + z + ( z + 5 );<br/><br>    }<br/><br>}<br/><p/>'        );});
    it('test11', () => {        assert.equal(parseCode_eval('function foo(x, y, z){\n' +            '    let a = x + 1;\n' +            '    let b = a + y;\n' +            '    let c = -1;\n' +            '    \n' +            '    if (b < z) {\n' +            '        c = c + 5 + 0;\n' +            '        return x + y + z + c;\n' +            '    } else if (b < z * 2) {\n' +            '        c = c + x + 5;\n' +            '        return x + y + z + c;\n' +            '    } else {\n' +            '        c = c + z + 5;\n' +            '        return x + y + z + c;\n' +            '    }\n' +            '}\n','1|2|3'),        '<p><br>function foo(x, y, z){<br/> <br> <mark style="background-color:red;">    if (x + 1 + y < z) {</mark> <br/><br>        return x + y + z + ( -1 + 5 );<br/><br>  <mark style="background-color:green;">    } else if (x + 1 + y < z * 2) {</mark> <br/><br>        return x + y + z + ( -1 + x + 5 );<br/><br>    } else {<br/><br>        return x + y + z + ( -1 + z + 5 );<br/><br>    }<br/><br>}<br/><p/>'        );});
    it('test12', () => {        assert.equal(parseCode_eval('function foo(x, y, z){\n' +            '    let a = x + 1;\n' +            '    let b = a + y;\n' +            '    let c = -1;\n' +            '    \n' +            '    if (b < z) \n' +            'return 1;\n' +            ' }\n' ,'1|2|3'),        '<p><br>function foo(x, y, z){<br/> <br> <mark style="background-color:red;">    if (x + 1 + y < z) </mark> <br/><br>return 1;<br/><br> }<br/><p/>'        );});
    it('test13', () => {        assert.equal(parseCode_eval('function foo(x, y, z){\n' +            '    let a = x + 1;\n' +            '    let b = a + y;\n' +            '    let c = -1;\n' +            '    \n' +            '    if (b < z) {\n' +            'let d=2;\n' +            'return d;\n' +            '}\n' +            ' }\n',' 1|2|3'),        '<p><br>function foo(x, y, z){<br/> <br> <mark style="background-color:red;">    if (x + 1 + y < z) {</mark> <br/><br>return 2;<br/><br>}<br/><br> }<br/><p/>'        );});
    it('test14', () => {        assert.equal(parseCode_eval('function foo(x, y, z){\n' +            '    let a = x + 1;\n' +            '    let b = a + y;\n' +            '    let c = -1;\n' +            '    \n' +            '    if (b < z) {\n' +            'let d;\n' +            'return c;\n' +            '}\n' +            ' }\n',' 1|2|3'),        '<p><br>function foo(x, y, z){<br/> <br> <mark style="background-color:red;">    if (x + 1 + y < z) {</mark> <br/><br>return -1;<br/><br>}<br/><br> }<br/><p/>'        );});
    it('test15', () => {        assert.equal(parseCode_eval('function foo(x, y, z){\n' +        '    let a = x + 1;\n' +        '    let b = a + y;\n' +        '    let c = [1,2];\n' +        '    \n' +        '    if (b < z) {\n' +        '        return x + y + z + c[0];\n' +        '   }\n' +        '}\n','1|2|3'),    '<p><br>function foo(x, y, z){<br/> <br> <mark style="background-color:red;">    if (x + 1 + y < z) {</mark> <br/><br>        return x + y + z + 1;<br/><br>   }<br/><br>}<br/><p/>'    );});
    it('test16', () => {        assert.equal(parseCode_eval('function foo(x, y, z){\n' +        '    let a = x + 1;\n' +        '    let b = a + y;\n' +        '    let c = [1,2];\n' +        '    \n' +        '    if (b < z) {\n' +        '                return x + y + z + c[0];\n' +        '    } else if (b < z * 2) {\n' +        '\n' +        'c=[1,3];\n' +        '\n' +        '               return x + y + z + c[1];\n' +        '    } else {\n' +        '\n' +        'c=[1,5];\n' +        '               return x + y + z + c[0];\n' +        '    }\n' +        '}\n',    '1|2|3'),    '<p><br>function foo(x, y, z){<br/> <br> <mark style="background-color:red;">    if (x + 1 + y < z) {</mark> <br/><br>                return x + y + z + 1;<br/><br>  <mark style="background-color:green;">    } else if (x + 1 + y < z * 2) {</mark> <br/><br>               return x + y + z + 3;<br/><br>    } else {<br/><br>               return x + y + z + 1;<br/><br>    }<br/><br>}<br/><p/>' );});
    it('test17', () => {        assert.equal(parseCode_eval('function foo(x, y, z){\n' +        '    let a = x + 1;\n' +        '    let b = a + y;\n' +        '    let c=[1,2];\n' +        'let d=c[0];\n' +        '\n' +        '    \n' +        '    if (b < z) {\n' +        '          ' +        '' +        '      return x + y + z + d;\n' +        '    }\n' +        '}\n',    '1|2|3 '),    '<p><br>function foo(x, y, z){<br/> <br> <mark style="background-color:red;">    if (x + 1 + y < z) {</mark> <br/><br>                return x + y + z + 1;<br/><br>    }<br/><br>}<br/><p/>');});
    it('test18', () => {        assert.equal(parseCode_eval('function foo(x, y, z){\n' +        '    let a = x + 1;\n' +        '    let b = a + y;\n' +        'let c=[1,2];\n' +        '\n' +        '    \n' +        '    if (b < z) {\n' +        'c[0]=5;\n' +        '\n' +        '                return x + y + z + c[0];\n' +        '    }\n' +        '}\n',    '1|2|3'),    '<p><br>function foo(x, y, z){<br/> <br> <mark style="background-color:red;">    if (x + 1 + y < z) {</mark> <br/><br>                return x + y + z + ( 5 );<br/><br>    }<br/><br>}<br/><p/>');});
    it('test19', () => {        assert.equal(parseCode_eval('function foo(x, y, z){\n' +        '    let a = x + 1;\n' +        '    let b = a + y;\n' +        '    let c = [5,7];\n' +        '    \n' +        '    while (a < z) {\n' +        '\n' +        'c=[1,2];\n' +        '\n' +        '        z = c[0] * 2;\n' +        '    }\n' +        '    \n' +        '    return z;\n' +        '}\n',    '1|2|3'),    '<p><br>function foo(x, y, z){<br/><br>    while (x + 1 < z) {<br/><br>        z =( 1 * 2 )<br/><br>    }<br/><br>    return z;<br/><br>}<br/><p/>');});
    it('test20', () => {        assert.equal(parseCode_eval('function foo(){\n' +        '  c[0]=2;\n' +        'return c[0]\n' +        '}\n','' ),        '<p><br>function foo(){<br/><br>return ( 2 );<br/><br>}<br/><p/>');});    it('test21', () => {        assert.equal(parseCode_eval('function foo(x,y){\n' +        'if(x[0]==y[0]){\n' +        'return true;\n' +        '}\n' +        '}','[4,5]|[4,5]' ),        '<p><br>function foo(x,y){<br/><br>  <mark style="background-color:green;">if(x[0] == y[0]){</mark> <br/><br>return true;<br/><br>}<br/><br>}<br/><p/>');});    it('test21', () => {        assert.equal(parseCode_eval('function foo(x,y){\n' +        'x=2;\n' +        'return x;\n' +        '}\n','5|3' ),        '<p><br>function foo(x,y){<br/><br>x=( 2 )<br/><br>return ( 2 );<br/><br>}<br/><p/>');});    it('test22', () => {        assert.equal(parseCode_eval('x=2+1;\n' +        'function foo() {\n' +        'let a=x\n' +        'let b=6;\n' +        'c=a+b\n' +        'return c;\n' +        '}\n','' ),        '<p><br>function foo() {<br/><br>return ( ( 2 + 1 ) + 6 );<br/><br>}<br/><p/>');});    it('test23', () => {        assert.equal(parseCode_eval('function foo(x) {\n' +        'let a=x[0]\n' +        'return a;\n' +        '}','[5,6]' ),        '<p><br>function foo(x) {<br/><br>return x[0];<br/><br>}<br/><p/>');});    });


describe('The javascript parser', () => {

    test1();
    test2();
    test3();
    test4();
    test5();
    test6();
    test7();
    test8();
    test9();
    test10();
    test11();


}
);

function test1() {
    const esgraph=require('esgraph');
    let source='function foo(x, y, z){\n' +        '    let a = x + 1;\n' +        '    let b = a + y;\n' +        '    let c = 0;\n' +        '    \n' +        '    if (b < z) {\n' +        '        c = c + 5;\n' +        '    } else if (b < z * 2) {\n' +        '        c = c + x + 5;\n' +        '    } else {\n' +        '        c = c + z + 5;\n' +        '    }\n' +        '    \n' +        '    return c;\n' +        '}\n'  ;
    let params_string= '1|2|3';
    let evals_color1 = parseCode_eval(source,params_string);
    let evals_color=evals_color1.split('<br>');
    const cfg=esgraph(esprima.parse(source,{range:true}).body[0].body);
    start(cfg);
    let dot=esgraph.dot(cfg,{counter:0,source:source});
    let arr=dot.split('\n');
    let dot_ans=  'n0 [shape="square",style=filled ,color="green",label="-1-\n a = x + 1;\n b = a + y;\n c = 0;"]\nn3 [shape="diamond",style=filled ,color="green",label="-2-\nb < z"]\nn4 [shape="square",color="",label="-3-\nc = c + 5"]\nn5 [shape="square",style=filled ,color="green",label="-4-\nreturn c;"]\nn6 [shape="diamond",style=filled ,color="green",style=filled ,color="green",label="-5-\nb < z * 2"]\nn7 [shape="square",style=filled ,color="green",label="-6-\nc = c + x + 5"]\nn8 [shape="square",color="",label="-7-\nc = c + z + 5"]\nn18[label="",style=filled ,color=green]\nn0 -> n3 []\nn3 -> n4 [label="T"]\nn3 -> n6 [label="F"]\nn4 -> n18[]\nn6 -> n7 [label="T"]\nn6 -> n8 [label="F"]\nn7 -> n18[]\nn8 -> n18[]\nn18->n5 []';
    it('test1', () => {
        assert.equal(create_cfg(arr, dot, evals_color),dot_ans );
    });
}

function test2() {

    const esgraph1=require('esgraph');
    let source1='function foo(x, y, z){\n' +             '   let a = x + 1;\n' +             '   let b = a + y;\n' +             '   let c = 0;\n' +             '   \n' +             '   while (a < z) {\n' +             '       c = a + b;\n' +             '       z = c * 2;\n' +             '       a++;\n' +             '   }\n' +             '   \n' +             '   return z;\n' +             '}\n';
    let params_string1= '1|2|3';
    let evals_color11 = parseCode_eval(source1,params_string1);
    let evals_color2=evals_color11.split('<br>');
    const cfg2=esgraph1(esprima.parse(source1,{range:true}).body[0].body);
    start(cfg2);
    let dot1=esgraph1.dot(cfg2,{counter:0,source:source1});
    let arr1=dot1.split('\n');
    let dot_ans1=  'n0 [shape="square",label="-1-\n a = x + 1;\n b = a + y;\n c = 0;"]\nn3 [shape="diamond",label="-2-\na < z"]\nn4 [shape="square",label="-3-\nc = a + b\nz = c * 2\na++"]\nn7 [shape="square",label="-4-\nreturn z;"]\nn0 -> n3 []\nn3 -> n4 [label="T"]\nn3 -> n7 [label="F"]\nn4 -> n3 []\n';
    it('test2', () => {
        assert.equal(create_cfg(arr1, dot1, evals_color2),dot_ans1 );
    });

}

function test3() {
    const esgraph=require('esgraph');
    let source='function foo(x, y, z){\n' +        '   let a = x + 1;\n' +        '   let b = a + y;\n' +        '   let c = 0;\n' +        '   \n' +        '   while (a < z) {\n' +        '       c++;\n' +        '       a++;\n' +        '   }\n' +        '   \n' +        '   return z;\n' +        '}';
    let params_string= '1|2|3';
    let evals_color1 = parseCode_eval(source,params_string);
    let evals_color=evals_color1.split('<br>');
    const cfg=esgraph(esprima.parse(source,{range:true}).body[0].body);
    start(cfg);
    let dot=esgraph.dot(cfg,{counter:0,source:source});
    let arr=dot.split('\n');
    let dot_ans=   'n0 [shape="square",label="-1-\n a = x + 1;\n b = a + y;\n c = 0;"]\nn3 [shape="diamond",label="-2-\na < z"]\nn4 [shape="square",label="-3-\nc++\na++"]\nn6 [shape="square",label="-4-\nreturn z;"]\nn0 -> n3 []\nn3 -> n4 [label="T"]\nn3 -> n6 [label="F"]\nn4 -> n3 []\n';
    it('test3', () => {
        assert.equal(create_cfg(arr, dot, evals_color),dot_ans );
    });
}

function test4() {
    const esgraph=require('esgraph');
    let source='function foo(x, y, z){\n' +        '   let a = x + 1;\n' +        '   let b = a + y;\n' +        '   let c = 0;\n' +        '   \n' +        '   while (a < z) {\n' +        '       c++;\n' +        '       a=a+1;\n' +        '   }\n' +        '   \n' +        '   return z;\n' +        '}';
    let params_string= '1|2|3';
    let evals_color1 = parseCode_eval(source,params_string);
    let evals_color=evals_color1.split('<br>');
    const cfg=esgraph(esprima.parse(source,{range:true}).body[0].body);
    start(cfg);
    let dot=esgraph.dot(cfg,{counter:0,source:source});
    let arr=dot.split('\n');
    let dot_ans= 'n0 [shape="square",label="-1-\n a = x + 1;\n b = a + y;\n c = 0;"]\nn3 [shape="diamond",label="-2-\na < z"]\nn4 [shape="square",label="-3-\nc++\na=a+1"]\nn6 [shape="square",label="-4-\nreturn z;"]\nn0 -> n3 []\nn3 -> n4 [label="T"]\nn3 -> n6 [label="F"]\nn4 -> n3 []\n';
    it('test4', () => {
        assert.equal(create_cfg(arr, dot, evals_color),dot_ans );
    });
}

function test5() {
    const esgraph=require('esgraph');
    let source='function foo(x, y, z){\n' +        '   let a = x + 1;\n' +        '   let b = a + y;\n' +        '   let c = 0;\n' +        '   \n' +        '   while (a <= z) {\n' +        '       c++;\n' +        '       a=a+1;\n' +        '   }\n' +        '   \n' +        '   return z;\n' +        '}';
    let params_string= '1|2|3';
    let evals_color1 = parseCode_eval(source,params_string);
    let evals_color=evals_color1.split('<br>');
    const cfg=esgraph(esprima.parse(source,{range:true}).body[0].body);
    start(cfg);
    let dot=esgraph.dot(cfg,{counter:0,source:source});
    let arr=dot.split('\n');
    let dot_ans=  'n0 [shape="square",label="-1-\n a = x + 1;\n b = a + y;\n c = 0;"]\nn3 [shape="diamond",label="-2-\na <= z"]\nn4 [shape="square",label="-3-\nc++\na=a+1"]\nn6 [shape="square",label="-4-\nreturn z;"]\nn0 -> n3 []\nn3 -> n4 [label="T"]\nn3 -> n6 [label="F"]\nn4 -> n3 []\n';
    it('test5', () => {
        assert.equal(create_cfg(arr, dot, evals_color),dot_ans );
    });
}
function test6() {
    const esgraph=require('esgraph');
    let source='function foo(x, y, z){\n' +        '   let a = x + 1;\n' +        '   let b = a + y;\n' +        '   let c = 0;\n' +        '   \n' +        '   while (a >= z) {\n' +        '       c++;\n' +        '       a=a+1;\n' +        '   }\n' +        '   \n' +        '   return z;\n' +        '}';
    let params_string= '1|2|3';
    let evals_color1 = parseCode_eval(source,params_string);
    let evals_color=evals_color1.split('<br>');
    const cfg=esgraph(esprima.parse(source,{range:true}).body[0].body);
    start(cfg);
    let dot=esgraph.dot(cfg,{counter:0,source:source});
    let arr=dot.split('\n');
    let dot_ans=  'n0 [shape="square",label="-1-\n a = x + 1;\n b = a + y;\n c = 0;"]\nn3 [shape="diamond",label="-2-\na >= z"]\nn4 [shape="square",label="-3-\nc++\na=a+1"]\nn6 [shape="square",label="-4-\nreturn z;"]\nn0 -> n3 []\nn3 -> n4 [label="T"]\nn3 -> n6 [label="F"]\nn4 -> n3 []\n';
    it('test6', () => {
        assert.equal(create_cfg(arr, dot, evals_color),dot_ans );
    });
}
function test7() {
    const esgraph=require('esgraph');
    let source='function foo(x, y, z){\n' +        '   let a = x + 1;\n' +        '   let b = a + y;\n' +        '   let c = 0;\n' +        '   \n' +        '   while (a < z & a<1) {\n' +        '       c++;\n' +        '       a=a+1;\n' +        '   }\n' +        '   \n' +        '   return z;\n' +        '}';
    let params_string= '1|2|3';
    let evals_color1 = parseCode_eval(source,params_string);
    let evals_color=evals_color1.split('<br>');
    const cfg=esgraph(esprima.parse(source,{range:true}).body[0].body);
    start(cfg);
    let dot=esgraph.dot(cfg,{counter:0,source:source});
    let arr=dot.split('\n');
    let dot_ans=  'n0 [shape="square",label="-1-\n a = x + 1;\n b = a + y;\n c = 0;"]\nn3 [shape="diamond",label="-2-\na < z & a<1"]\nn4 [shape="square",label="-3-\nc++\na=a+1"]\nn6 [shape="square",label="-4-\nreturn z;"]\nn0 -> n3 []\nn3 -> n4 [label="T"]\nn3 -> n6 [label="F"]\nn4 -> n3 []\n';
    it('test7', () => {
        assert.equal(create_cfg(arr, dot, evals_color),dot_ans );
    });
}
function test8() {
    const esgraph=require('esgraph');
    let source='function foo(x, y, z){\n' +        '   let a = x + 1;\n' +        '   let b = a + y;\n' +        '   let c = 0;\n' +        '   \n' +        '   while (a < z && a<1) {\n' +        '       c++;\n' +        '       a=a+1;\n' +        '   }\n' +        '   \n' +        '   return z;\n' +        '}';
    let params_string= '1|2|3';
    let evals_color1 = parseCode_eval(source,params_string);
    let evals_color=evals_color1.split('<br>');
    const cfg=esgraph(esprima.parse(source,{range:true}).body[0].body);
    start(cfg);
    let dot=esgraph.dot(cfg,{counter:0,source:source});
    let arr=dot.split('\n');
    let dot_ans=  'n0 [shape="square",label="-1-\n a = x + 1;\n b = a + y;\n c = 0;"]\nn3 [shape="diamond",label="-2-\na < z && a<1"]\nn4 [shape="square",label="-3-\nc++\na=a+1"]\nn6 [shape="square",label="-4-\nreturn z;"]\nn0 -> n3 []\nn3 -> n4 [label="T"]\nn3 -> n6 [label="F"]\nn4 -> n3 []\n';
    it('test8', () => {
        assert.equal(create_cfg(arr, dot, evals_color),dot_ans );
    });
}
function test9() {
    const esgraph=require('esgraph');
    let source='function foo(x, y, z){\n' +        '   let a = x + 1;\n' +        '   let b = a + y;\n' +        '   let c = 0;\n' +        '   \n' +        '   while (a < z | a<1) {\n' +        '       c++;\n' +        '       a=a+1;\n' +        '   }\n' +        '   \n' +        '   return z;\n' +        '}';
    let params_string= '1|2|3';
    let evals_color1 = parseCode_eval(source,params_string);
    let evals_color=evals_color1.split('<br>');
    const cfg=esgraph(esprima.parse(source,{range:true}).body[0].body);
    start(cfg);
    let dot=esgraph.dot(cfg,{counter:0,source:source});
    let arr=dot.split('\n');
    let dot_ans=  'n0 [shape="square",label="-1-\n a = x + 1;\n b = a + y;\n c = 0;"]\nn3 [shape="diamond",label="-2-\na < z | a<1"]\nn4 [shape="square",label="-3-\nc++\na=a+1"]\nn6 [shape="square",label="-4-\nreturn z;"]\nn0 -> n3 []\nn3 -> n4 [label="T"]\nn3 -> n6 [label="F"]\nn4 -> n3 []\n';
    it('test9', () => {
        assert.equal(create_cfg(arr, dot, evals_color),dot_ans );
    });
}
function test10() {
    const esgraph=require('esgraph');
    let source='function foo(x, y, z){\n' +        '   let a = x + 1;\n' +        '   let b = a + y;\n' +        '   let c = 0;\n' +        '   \n' +        '   while (a < z || a<1) {\n' +        '       c++;\n' +        '       a=a+1;\n' +        '   }\n' +        '   \n' +        '   return z;\n' +        '}';
    let params_string= '1|2|3';
    let evals_color1 = parseCode_eval(source,params_string);
    let evals_color=evals_color1.split('<br>');
    const cfg=esgraph(esprima.parse(source,{range:true}).body[0].body);
    start(cfg);
    let dot=esgraph.dot(cfg,{counter:0,source:source});
    let arr=dot.split('\n');
    let dot_ans= 'n0 [shape="square",label="-1-\n a = x + 1;\n b = a + y;\n c = 0;"]\nn3 [shape="diamond",label="-2-\na < z || a<1"]\nn4 [shape="square",label="-3-\nc++\na=a+1"]\nn6 [shape="square",label="-4-\nreturn z;"]\nn0 -> n3 []\nn3 -> n4 [label="T"]\nn3 -> n6 [label="F"]\nn4 -> n3 []\n';
    it('test10', () => {
        assert.equal(create_cfg(arr, dot, evals_color),dot_ans );
    });
}

function test11() {
    const esgraph=require('esgraph');
    let source='function foo(x, y, z){\n' +        '    let a = x + 1;\n' +        '    let b = a + y;\n' +        '    let c = 0;\n' +        '    \n' +        '    if (b == z) {\n' +        '        c = c + 5;\n' +        '    } else if (b < z * 2) {\n' +        '        c = c + x + 5;\n' +        '    } else {\n' +        '        c = c + z + 5;\n' +        '    }\n' +        '    \n' +        '    return c;\n' +        '}\n'  ;
    let params_string= '1|2|3';
    let evals_color1 = parseCode_eval(source,params_string);
    let evals_color=evals_color1.split('<br>');
    const cfg=esgraph(esprima.parse(source,{range:true}).body[0].body);
    start(cfg);
    let dot=esgraph.dot(cfg,{counter:0,source:source});
    let arr=dot.split('\n');
    let dot_ans=  'n0 [shape="square",style=filled ,color="green",label="-1-\n a = x + 1;\n b = a + y;\n c = 0;"]\nn3 [shape="diamond",style=filled ,color="green",label="-2-\nb == z"]\nn4 [shape="square",color="",label="-3-\nc = c + 5"]\nn5 [shape="square",style=filled ,color="green",label="-4-\nreturn c;"]\nn6 [shape="diamond",style=filled ,color="green",style=filled ,color="green",label="-5-\nb < z * 2"]\nn7 [shape="square",style=filled ,color="green",label="-6-\nc = c + x + 5"]\nn8 [shape="square",color="",label="-7-\nc = c + z + 5"]\nn18[label="",style=filled ,color=green]\nn0 -> n3 []\nn3 -> n4 [label="T"]\nn3 -> n6 [label="F"]\nn4 -> n18[]\nn6 -> n7 [label="T"]\nn6 -> n8 [label="F"]\nn7 -> n18[]\nn8 -> n18[]\nn18->n5 []';
    it('test11', () => {
        assert.equal(create_cfg(arr, dot, evals_color),dot_ans );
    });
}



function  start(cfg) {
    change_cfg(cfg);
    for(let i=0;i<cfg[2].length;i++) {
        if(cfg[2][i].normal!=undefined && cfg[2][i].normal.type=='exit'){
            cfg[2][i].normal=undefined;
        }
        start2(cfg,i);
    }
}

function start2(cfg,i) {
    if(cfg[2][i].exception != undefined){
        cfg[2][i].exception = undefined;
    }
    if (cfg[2][i].next[0].type == 'exit') {
        cfg[2][i].next.splice(0, 1);
    }
}
function change_cfg(cfg) {
    cfg[0]=cfg[2][1];
    cfg[1]=cfg[2][cfg[2].length-2];
    cfg[2].splice(cfg[2].length-1,1);
    cfg[2].splice(0,1);
}