import * as esprima from 'esprima';

const parseCode_eval = (codeToParse,params_string) => {
    const answer = esprima.parseScript(codeToParse, {
        loc: true
    });
    params=[];
    init(answer);
    temp(answer,-1);
    value_of_params(params_string);
    let string=to_string(codeToParse);
    return evaluate_string(string,codeToParse);
};


export {parseCode_eval};

let variableDeclarations = [];
let params=[];


let temp = function extraction(parseCode,line) {
    switch (parseCode.type.valueOf()) {
    case 'FunctionDeclaration':
        variableDeclarations[parseCode.id.loc.start.line-1]['function']=parseCode.id.name;
        parseCode.params.forEach(function (object) {
            variableDeclarations[object.loc.start.line-1][object.name]=object.name;});
        return temp(parseCode.body,line);
    case 'Program':
        parseCode.body.forEach(function (object) {
            temp(object,line);
        });
        return variableDeclarations;
    case 'BlockStatement':
        parseCode.body.forEach(function(object){
            switch_case_body_block(object,line);
        });
        return variableDeclarations;
    default:
        return switch_case_outside_blocks(parseCode,line);
    }};



function declarations_help(object,line){
    object.declarations.forEach(function(object1) {
        if(object1.init==null){
            if(line==-1){
                variableDeclarations[object1.loc.start.line-1]['let']='';
                variableDeclarations[object1.loc.start.line-1][primitive_dec(object1.id)]=primitive_dec(object1.id);}
            else{
                variableDeclarations[line]['let']='';
                variableDeclarations[line][primitive_dec(object1.id)]=primitive_dec(object1.id);}}
        else {
            if(line==-1){
                variableDeclarations[object1.loc.start.line-1]['let']='';
                variableDeclarations[object1.loc.start.line-1][primitive_dec(object1.id)]=switch_case_outside_blocks(object1.init,object1.loc.start.line-1);
            }
            else{
                variableDeclarations[line]['let']='';
                variableDeclarations[line][primitive_dec(object1.id)]=switch_case_outside_blocks(object1.init,line);
            }}
    });
}
function primitive_dec(parseCode){
    switch (parseCode.type.valueOf()) {
    /*
            case 'BinaryExpression':
                return temp(parseCode.left,line) + ' '+parseCode.operator+' ' + temp(parseCode.right,line);

            case 'Literal':
                return parseCode.value;*/
    case 'Identifier':
        return parseCode.name;
        /* case 'MemberExpression':
             return parseCode.object.name + '[' + temp(parseCode.property,line)+ ']';*/
        /*default:
            return primitive_type_more(parseCode,line);*/
    }
}
function init(parseCode)
{
    let i;
    for (i = 0; i < parseCode.loc.end.line; i++) {
        variableDeclarations[i]=new Map();
    }
}

function switch_case_body_block(object,line){
    switch (object.type.valueOf()) {
    case 'VariableDeclaration':
        declarations_help(object,line);
        return variableDeclarations;
    case 'ExpressionStatement':
        return temp(object.expression,line);
    case 'WhileStatement':
        variableDeclarations[object.loc.start.line-1]['while']=temp(object.test,object.loc.start.line-1);
        return temp(object.body,object.loc.start.line-1);
    default:
        another_cases_in_block(object,line);
    }
}

function  another_cases_in_block(object,line) {
    switch (object.type.valueOf()) {
    case 'IfStatement':
        variableDeclarations[object.test.loc.start.line-1]['if']=temp(object.test,object.test.loc.start.line-1);
        temp(object.consequent,object.consequent.loc.start.line-1);
        if(object.alternate!=null){
            variableDeclarations[object.alternate.loc.start.line-1]['else']='';
            temp(object.alternate,object.alternate.loc.start.line-1);
        }
        else{
            return variableDeclarations;
        }
        return variableDeclarations;
    case 'ReturnStatement':
        variableDeclarations[object.loc.start.line-1]['return']=temp(object.argument,line);
        return variableDeclarations;
    }
}
function switch_case_outside_blocks(parseCode,line) {
    switch (parseCode.type.valueOf()) {
    case 'AssignmentExpression':
        if(line==-1){
            outside_help(parseCode,line);

        }
        else{
            outside_help2(parseCode,line);

        }
        return variableDeclarations;
    case 'VariableDeclaration':
        declarations_help(parseCode,line);
        return variableDeclarations;
    case 'ArrayExpression':
        return array_expr_help(parseCode,line);
    default:
        return switch_case_outside_blocks_more(parseCode,line);}
}
function  outside_help(parseCode,line) {

    if(parseCode.left.type=='MemberExpression'){
        let ans='( '+temp(parseCode.right,line)+' )';
        variableDeclarations[parseCode.left.loc.start.line-1][parseCode.left.object.name]=ans;
        variableDeclarations[parseCode.left.loc.start.line-1][temp(parseCode.left.property,line)]=ans;
    }
    else{
        variableDeclarations[parseCode.left.loc.start.line-1][primitive_dec( parseCode.left)]='( '+temp(parseCode.right,line)+' )';

    }
}

function  outside_help2(parseCode,line) {

    if(parseCode.left.type=='MemberExpression'){
        let ans='( '+temp(parseCode.right,line)+' )';
        variableDeclarations[parseCode.left.loc.start.line-1]['double'+parseCode.left.object.name]=ans;
        variableDeclarations[parseCode.left.loc.start.line-1][temp(parseCode.left.property,line)]=ans;
        variableDeclarations[line][parseCode.left.object.name]=ans;
        variableDeclarations[line][temp(parseCode.left.property,line)]=ans;
    }
    else{
        let ans='( '+temp(parseCode.right,line)+' )';
        variableDeclarations[parseCode.left.loc.start.line-1]['double'+primitive_dec( parseCode.left)]=ans;
        variableDeclarations[line][ primitive_dec( parseCode.left)]=ans;
    }
}

function array_expr_help(parseCode,line) {
    /* if(line==-1){
        let ans='';
        variableDeclarations[parseCode.loc.start.line-1]['arr']=parseCode.elements.length;
        for(let j=0;j<parseCode.elements.length;j++){
            variableDeclarations[parseCode.elements[j].loc.start.line-1][j]=primitive_type(parseCode.elements[j],parseCode.elements[j].loc.start.line-1);
        }
        for(let j=0;j<parseCode.elements.length-1;j++){
            ans=ans+variableDeclarations[parseCode.elements[j].loc.start.line-1][j]+',';
        }
        ans=ans+variableDeclarations[parseCode.elements[parseCode.elements.length-1].loc.start.line-1][parseCode.elements.length-1];
        return '['+ans+']';
    }*/
    // else{
    return help_ans(parseCode,line);
    // }
}
function help_ans(parseCode,line) {
    let ans='';
    variableDeclarations[parseCode.loc.start.line-1]['arr']=parseCode.elements.length;
    variableDeclarations[line]['arr']=parseCode.elements.length;
    for(let j=0;j<parseCode.elements.length;j++){
        variableDeclarations[parseCode.elements[j].loc.start.line-1][j]=primitive_type(parseCode.elements[j],parseCode.elements[j].loc.start.line-1);
        variableDeclarations[line][j]=primitive_type(parseCode.elements[j],parseCode.elements[j].loc.start.line-1);

    }
    for(let j=0;j<parseCode.elements.length-1;j++){
        ans=ans+variableDeclarations[parseCode.elements[j].loc.start.line-1][j]+',';
    }
    ans=ans+variableDeclarations[parseCode.elements[parseCode.elements.length-1].loc.start.line-1][parseCode.elements.length-1];
    return '['+ans+']';
}
function switch_case_outside_blocks_more(parseCode,line) {
    switch (parseCode.type.valueOf()) {
    case 'IfStatement':
        variableDeclarations[parseCode.test.loc.start.line-1]['if']=temp(parseCode.test,parseCode.test.loc.start.line-1);
        temp(parseCode.consequent,parseCode.consequent.loc.start.line-1);
        if (parseCode.alternate != null) {
            variableDeclarations[parseCode.alternate.loc.start.line-1]['else']='';
            temp(parseCode.alternate,parseCode.alternate.loc.start.line-1);
        }
        return variableDeclarations;
        /*  case 'VariableDeclaration':
        parseCode.declarations.forEach(function (object1) {
            declarations_help(object1,line);
        });
        return variableDeclarations;
    case 'WhileStatement':
        variableDeclarations[parseCode.loc.start.line-1]['while']=temp(parseCode.test,parseCode.loc.start.line-1);
        return temp(parseCode.body,parseCode.loc.start.line-1);*/
    default:
        return outside_more(parseCode,line);}}

function outside_more(parseCode,line){
    switch (parseCode.type.valueOf()) {
    case 'ExpressionStatement':
        return temp(parseCode.expression, line);
    case 'ReturnStatement':
        variableDeclarations[parseCode.loc.start.line-1]['return']=temp(parseCode.argument,line);
        return variableDeclarations;
    default:
        return primitive_type(parseCode,line);}}


function primitive_type(parseCode,line) {
    switch (parseCode.type.valueOf()) {
    case 'BinaryExpression':
        return binary_help(parseCode,line);
    case 'Literal':
        return parseCode.value;
    case 'Identifier':
        return ind_help(parseCode,line);
    default:
        return primitive_type_more(parseCode,line);
    }
}

function binary_help(parseCode,line) {
    let left;
    let right;
    left=temp(parseCode.left,line);
    right=temp(parseCode.right,line);
    if(left=='0' &&  right=='0'){
        return '0';
    }
    else if(left=='0'){
        return right;
    }
    else if(right=='0'){
        return left;
    }
    return left + ' '+parseCode.operator+' ' + right;
}

function ind_help(parseCode,line){
    let found;
    found=ind_help1(parseCode,line);
    if(!(found=='')){
        return found;
    }
    for (let i = variableDeclarations.length-1; i >=0; i--){
        if(variableDeclarations[i][parseCode.name]!=undefined){
            if(check_if_yes(i)){
                found=variableDeclarations[i][parseCode.name];
                return found;
            }
        }
        else{
            found=+ parseCode.name;
        }
    }
}
function check_if_yes(i) {

    if (!(variableDeclarations[i]['else'] != undefined || variableDeclarations[i]['if'] != undefined || variableDeclarations[i]['while'] != undefined)) {
        return true;
    }
    return false;

}

function ind_help1(parseCode,line) {
    let found='';
    if(line!=-1){
        found=cond1(parseCode,line);
        if(!(found=='')){
            return found;
        }
        else if(variableDeclarations[line]['while']!=undefined){

            if(variableDeclarations[line][parseCode.name]!=undefined){
                found=variableDeclarations[line][parseCode.name];
                return found;
            }
        }
    }
    return found;
}

function cond1(parseCode,line) {

    let found='';
    if(variableDeclarations[line]['if']!=undefined){

        if(variableDeclarations[line][parseCode.name]!=undefined){
            found=variableDeclarations[line][parseCode.name];
            return found;
        }
    }
    else if(variableDeclarations[line]['else']!=undefined){

        if(variableDeclarations[line][parseCode.name]!=undefined){
            found=variableDeclarations[line][parseCode.name];
            return found;
        }
    }
    return found;
}



function primitive_type_more(parseCode,line) {
    switch (parseCode.type.valueOf()) {
    case 'UnaryExpression':
        return parseCode.operator + temp(parseCode.argument,line);
    case 'MemberExpression':
        return member_help(parseCode,line);
    }
}

function member_help(parseCode,line){
    let found;
    if(line!=-1){
        found=member_help1(parseCode,line);
        if(!(found=='')){
            return found;
        }
        else if(variableDeclarations[line]['while']!=undefined){

            return check_for_all(line,parseCode);





        }
    }
    return loop_member(parseCode,line);
}
function member_help1(parseCode,line) {
    let found='';
    check_for_all(line,parseCode);
    if(variableDeclarations[line]['if']!=undefined || variableDeclarations[line]['else']!=undefined){
        if(variableDeclarations[line][parseCode.object.name]!=undefined){
            /*if(parseCode.object.name==variableDeclarations[line][parseCode.object.name]){
                found=parseCode.object.name + '[' + temp(parseCode.property,line)+ ']';
                return found;
            }*/
            found=variableDeclarations[line][temp(parseCode.property,line)];
            return found;
        }
        /*   else if(variableDeclarations[line][parseCode.object.name+'['+temp(parseCode.property,line)+']']!=undefined){
            found=variableDeclarations[line][parseCode.object.name+'['+temp(parseCode.property,line)+']'];
            return found;
        }*/
    }
    return found;
}
function check_for_all(line,parseCode) {

    let found='';
    if(variableDeclarations[line][parseCode.object.name]!=undefined){
        /*  if(parseCode.object.name==variableDeclarations[line][parseCode.object.name]){
            found=parseCode.object.name + '[' + temp(parseCode.property,line)+ ']';
            return found;
        }*/
        found=variableDeclarations[line][temp(parseCode.property,line)];
        return found;
    }
    /* else if(variableDeclarations[line][parseCode.object.name+'['+temp(parseCode.property,line)+']']!=undefined){
        found=variableDeclarations[line][parseCode.object.name+'['+temp(parseCode.property,line)+']'];
        return found;
    }*/
    return found;
}
function loop_member(parseCode,line) {
    let found='';
    for (let i = variableDeclarations.length-1; i >=0; i--){
        found= check_in_loop_member(i,parseCode,line);
        if(!(found=='')){
            return found;
        }
        else{
            found=parseCode.object.name + '[' + temp(parseCode.property,line)+ ']';

        }
    }
    //return parseCode.object.name + '[' + temp(parseCode.property,line)+ ']';
}
function  check_in_loop_member(i,parseCode,line){
    let found='';
    if(variableDeclarations[i][parseCode.object.name]!=undefined){
        if(!(variableDeclarations[i]['else']!=undefined || variableDeclarations[i]['if']!=undefined || variableDeclarations[i]['while']!=undefined)) {

            found=check_for_all2(i,line,parseCode);

            return found;



        }
    }
    return found;
}

function check_for_all2(i,line,parseCode) {
    let found='';

    if(parseCode.object.name==variableDeclarations[i][parseCode.object.name]){
        found=parseCode.object.name + '[' + temp(parseCode.property,line)+ ']';
        return found;
    }
    found=variableDeclarations[i][temp(parseCode.property,line)];
    return found;

    /*else if(variableDeclarations[i][parseCode.object.name+'['+temp(parseCode.property,line)+']']!=undefined){
        found=variableDeclarations[i][parseCode.object.name+'['+temp(parseCode.property,line)+']'];
        return found;
    }*/
    //return found;
}
function to_string(codeToParse) {
    const res=codeToParse.split('\n');
    //value_of_params(res[res.length-1]);
    let ans='';
    let index_func=0;
    for(let i=0;i<res.length-1;i++){
        if(res[i].includes('function')){
            index_func=i;
        }
    }
    for (let i = 0; i < res.length; i++) {
        if(res[i].includes('let')){
            continue;
        }
        else{
            ans=another_to_string(res,i,ans,index_func);
        }
    }
    return ans;
}
function  another_to_string(res,i ,ans,index_func){
    if(res[i].includes('while')){
        let temp_res=res[i].split('(');
        let temp_res2=res[i].split(')');
        ans=ans+temp_res[0]+ '(' +variableDeclarations[i]['while']+')'+temp_res2[1]+'\n';
    }
    else if(res[i].includes('if')){
        let temp_res=res[i].split('(');
        let temp_res2=res[i].split(')');
        ans=ans+temp_res[0]+ '(' +variableDeclarations[i]['if']+')'+temp_res2[1]+'\n';
    }
    else  if(res[i].includes('else')){
        let temp_res=res[i].split('else');
        ans=ans+temp_res[0] +'else'+temp_res[1]+'\n';
    }
    else{
        ans=cond_to_string_help(res,i,ans,index_func);
    }
    return ans;
}
function cond_to_string_help(res,i,ans,index_func) {
    if(res[i].includes('=') && !(res[i].includes('=='))) {
        let temp = res[i].split('=');
        let keys = Object.keys(variableDeclarations[index_func]);
        for (let j = 0; j < keys.length; j++) {
            ans=cond_to_string_help_start(res,i,ans,keys,j,temp);
        }
    }
    else{
        ans=cond_to_string_help_help(res,i,ans);
    }
    return ans;
}
function cond_to_string_help_start(res,i,ans,keys,j,temp) {

    if (temp[0].includes(keys[j])) {
        if (variableDeclarations[i]['double' + keys[j]] != undefined) {
            res[i] = res[i].replace(temp[1], variableDeclarations[i]['double' + keys[j]]);
            ans = ans + res[i] + '\n';
        }
        else {
            let replace = temp[0].replace(/\s/g, '');
            res[i] = res[i].replace(temp[1], variableDeclarations[i][replace]);
            ans = ans + res[i] + '\n';//add ; and to return
        }
    }
    return ans;
}
function cond_to_string_help_help(res,i,ans) {

    if(res[i].includes('return')){
        let temp_res=res[i].split('return');
        ans=ans+temp_res[0]+ 'return ' +variableDeclarations[i]['return']+';\n';
    }
    else if(res[i].includes('function')){
        ans=ans+res[i]+'\n';
    }
    else{
        ans=ans+other_help(res,i);
    }



    return ans;
}
function other_help(res,i) {
    let ans='';
    if(res[i].includes('{')|| res[i].includes('}')||res[i]=='\n' ){
        ans=ans+res[i]+'\n';
    }
    return ans;
}
function  value_of_params(codeToParse) {
    if(codeToParse==''){
        return params;
    }
    let replace=codeToParse.replace(/\s/g, '').trim();
    let replace_split=replace.split('|');
    for(let i=0;i<replace_split.length;i++){
        if(replace_split[i].includes('[')){
            replace_split[i]=replace_split[i].substring(1,replace_split[i].length-1);
            params[i]=replace_split[i];
            let split=replace_split[i].split(',');
            params[i]=[];
            for(let j=0;j<split.length;j++){
                params[i][j]=split[j];
            }
        }
        else{
            params[i]=replace_split[i];}}
    return params;
}



function evaluate_string(string_sub,codeToParse) {
    let array_ans=[];
    let index_func=index_func_help(codeToParse);
    let ans_split=string_sub.split('\n');
    for(let i=0;i<ans_split.length-1;i++) {
        if (ans_split[i].includes('if')) {
            eval_help(array_ans,index_func,ans_split,i);
        }
        else{
            array_ans[i]='<br>'+ans_split[i]+'<br/>';
        }
    }
    // return array_ans;
    let ans='<p>';
    for(let j=0;j<array_ans.length;j++){
        ans=ans+array_ans[j];
    }
    ans=ans+'<p/>';
    return ans;
}

function eval_help(array_ans,index_func,ans_split,i) {
    let ans_bool,split2,keys;
    keys = Object.keys(variableDeclarations[index_func]);
    split2=eval_help_start(array_ans,index_func,ans_split,i);
    for (let j = 1; j < params.length; j++) {
        if(!(Array.isArray(params[j]))) {
            let right_temp = variableDeclarations[index_func][keys[j + 1]].replace(/\s/g, '').trim();
            split2 = split2.replace(right_temp, params[j]);}
        else{            let index1=split2.indexOf('[');
            let index2=split2.indexOf(']');
            let index_string=split2.substring(index1+1,index2);
            split2=split2.replace(index_string,'');
            let index=parseInt(index_string);
            let right_temp = variableDeclarations[index_func][keys[j + 1]].replace(/\s/g, '').trim();
            split2=split2.replace('[','');
            split2=split2.replace(']','');
            split2 = split2.replace(right_temp, params[j][index]);}}
    ans_bool = eval(split2);
    if (ans_bool) {        array_ans[i] = '<br>  <mark style="background-color:green;">' + ans_split[i] + '</mark> <br/>';}
    else { array_ans[i] = ' <br> <mark style="background-color:red;">' + ans_split[i] + '</mark> <br/>';}}

function eval_help_start(array_ans,index_func,ans_split,i) {
    let replace,split1,split2,keys;
    keys = Object.keys(variableDeclarations[index_func]);
    replace = ans_split[i].replace(/\s/g, '').trim();
    split1 = replace.split('(');
    split2 = split1[1].split(')');
    split2 = split2[0];
    split2=func_split2(index_func,keys,split2);
    return split2;
}
function func_split2(index_func,keys,split2) {

    if(!(Array.isArray(params[0])) && params.length>0) {
        split2 = split2.replace(variableDeclarations[index_func][keys[1]], params[0]);
    }
    else {
        let index1=split2.indexOf('[');
        let index2=split2.indexOf(']');
        let index_string=split2.substring(index1+1,index2);
        split2=split2.replace(index_string,'');
        let index=parseInt(index_string);
        let right_temp = variableDeclarations[index_func][keys[0 + 1]].replace(/\s/g, '').trim();
        split2=split2.replace('[','');
        split2=split2.replace(']','');
        split2 = split2.replace(right_temp, params[0][index]);
    }
    return split2;
}

function index_func_help(codeToParse) {
    let index_func=0;
    const res=codeToParse.split('\n');
    for(let i=0;i<res.length-1;i++){
        if(res[i].includes('function')){
            index_func=i;
            return index_func;
        }
    }
}




