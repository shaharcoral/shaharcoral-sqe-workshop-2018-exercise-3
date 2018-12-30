
let temp_for_check=[];
const create_cfg = (arr,dot,evals_color) => {
    found_if=false;
    help2(arr);
    help3(arr);
    change_color(arr,evals_color);
    arr=temp_for_check;
    help4(arr);
    let indexs=[];let arr_labels=[];
    help5(arr);
    let index_start=help8(arr);
    help6(arr,arr_labels,indexs,index_start);
    dot=help7(arr,index_start,indexs);
    return dot;

};

export {create_cfg};

let found_if=false;

function change_color(arr,evals_color) {
    let has_if=false;
    temp_for_check=arr;
    for(let i=0;i<evals_color.length;i++){
        if(evals_color[i].includes('if')){
            has_if=true;
            i=evals_color.length;
        }
    }
    if(has_if) {
        change_color_help(evals_color);
    }
}

function  change_color_help(evals_color) {
    for (let i = 0; i < temp_for_check.length; i++) {
        if (!(temp_for_check[i].includes('->')) && inclued_operator(i)) {
            change_color_help2(evals_color,i);
        }
    }
    change_color_after();
}


function change_color_help2(evals_color,i) {
    for (let j = 0; j < evals_color.length; j++) {
        j=change_color_help2_help(j,evals_color,i);
    }

}
function change_color_help2_help(j,evals_color,i){
    if (evals_color[j].includes('if') && evals_color[j].includes('green') && found_if==false) {
        found_if=true;
        j=change_color_help_if_yes(evals_color,i,j);
    }

    else if (evals_color[j].includes('if') ) {
        j=change_color_help_if_no(evals_color,i,j);

    }

    return j;
}

function change_color_help_if_no(evals_color,i,j) {
    temp_for_check[i] = temp_for_check[i].replace('[', '[color="red",');
    for (let t = i; t < temp_for_check.length; t++) {

        let label_arr = temp_for_check[i].split('[');
        let label_string = label_arr[0];
        let label_arr_2 = temp_for_check[t].split('[');
        let label_string_2 = label_arr_2[0];
        change_color_help_if_no_help(t,label_string,label_string_2);


    }
    evals_color.splice(j, 1);
    j = evals_color.length;
    return j;
}
function change_color_help_if_no_help(t,label_string,label_string_2) {
    for (let k = 0; k < temp_for_check.length; k++) {
        if (!(temp_for_check[t].includes('color')) && !(temp_for_check[t].includes('->'))) {

            check_if_change(k,label_string,label_string_2,t);
        }
    }
}

function check_if_change(k,label_string,label_string_2,t) {

    if (temp_for_check[k].includes('T') && temp_for_check[k].includes(label_string) && temp_for_check[k].includes(label_string_2)) {

        temp_for_check[t] = temp_for_check[t].replace('[', '[color="red",');
    }
    else{
        check_if_change_help(k,label_string,label_string_2,t);
    }

}
function check_if_change_help(k,label_string,label_string_2,t) {

    if (temp_for_check[k].includes('F') && temp_for_check[k].includes(label_string) && temp_for_check[k].includes(label_string_2)) {
        temp_for_check[t] = temp_for_check[t].replace('[', '[style=filled ,color="green",');
    }
}

function change_color_help_if_yes(evals_color,i,j) {
    temp_for_check[i] = temp_for_check[i].replace('[', '[style=filled ,color="green",');
    for (let t = i; t < temp_for_check.length; t++) {
        let label_arr = temp_for_check[i].split('[');
        let label_string = label_arr[0];
        let label_arr_2 = temp_for_check[t].split('[');
        let label_string_2 = label_arr_2[0];
        change_color_help_if_yes_help1(t,label_string,label_string_2);

    }
    evals_color.splice(j, 1);
    j = evals_color.length;
    return j;
}
function change_color_help_if_yes_help1(t,label_string,label_string_2) {
    for (let k = 0; k < temp_for_check.length; k++) {
        change_color_help_if_yes_help2(t,k,label_string,label_string_2);
    }
}
function change_color_help_if_yes_help2(t,k,label_string,label_string_2){
    if (!(temp_for_check[t].includes('color')) && !(temp_for_check[t].includes('->'))) {
        change_color_help_if_yes_help3(k,t,label_string,label_string_2);

    }
}

function change_color_help_if_yes_help3(k,t,label_string,label_string_2) {
    if (temp_for_check[k].includes('T') && temp_for_check[k].includes(label_string) && temp_for_check[k].includes(label_string_2)) {
        temp_for_check[t] = temp_for_check[t].replace('[', '[style=filled ,color="green",');
    }
    else {
        change_color_help_if_yes_help4(k, t, label_string, label_string_2);
    }
}


function change_color_help_if_yes_help4(k,t,label_string,label_string_2) {
    if (temp_for_check[k].includes('F') && temp_for_check[k].includes(label_string) && temp_for_check[k].includes(label_string_2)) {
        temp_for_check[t] = temp_for_check[t].replace('[', '[color="red",');
    }
}
function change_color_after() {
    let index_check = 0;
    for (let i = 0; i < temp_for_check.length; i++) {

        if (temp_for_check[i].includes('->')) {
            index_check = i;
            i = temp_for_check.length;
        }
    }
    change_color_after_help(index_check);


    for (let i = 0; i < index_check; i++) {
        if (temp_for_check[i].includes('red')) {
            temp_for_check[i] = temp_for_check[i].replace('red', '');

        }
    }
}

function  change_color_after_help(index_check) {
    for (let i = 0; i < index_check; i++) {
        if (inclued_operator(i) && temp_for_check[i].includes('red')) {
            temp_for_check[i] = temp_for_check[i].replace('red', 'green');
            temp_for_check[i] = temp_for_check[i].replace('red', 'green');
            temp_for_check[i] = temp_for_check[i].replace('[', '[style=filled ,');

        }
        else if (!(temp_for_check[i].includes('color'))) {
            temp_for_check[i] = temp_for_check[i].replace('[', '[style=filled ,color="green",');
        }
    }
}

function help2(arr) {
    let temp='';
    for(let i=0;i<arr.length;i++){
        if(arr[i].includes('->') && arr[i].includes('true')){
            arr[i]=arr[i].replace('true','T');
        }
        help2_help(arr,i);
        temp=temp+arr[i]+'\n';
    }
}
function help2_help(arr,i) {
    if(arr[i].includes('->') && arr[i].includes('false')){
        arr[i]=arr[i].replace('false','F');
    }
}

function check_function(label1,label2,arr) {
    let index_start2=get_index_start(arr);
    for(let i=index_start2;i<arr.length;i++){
        if(arr[i].includes(label1)&& arr[i].includes(label2)){
            return true;
        }
    }
    return false;
}

function get_index_start(arr){
    for(let i=0;i<arr.length;i++){
        if(arr[i].includes('->')){
            return i;
        }
    }
}
function help(index_end,index_before,arr){
    //let temp_arr = arr[index_end].split('label=');
    let index_replace=arr[index_end].split('[');
    //temp_arr[0] = temp_arr[0].replace('"', '');
    //temp_arr[1] = temp_arr[1].replace('"', '');
    let index_replace0=arr[index_before].split('[');

    let index_start2=0;
    for(let i=0;i<arr.length;i++){
        if(arr[i].includes('->')){
            index_start2=i;
            i=arr.length;
        }
    }
    for(let i=index_start2;i<arr.length;i++){
        if(arr[i].includes(index_replace[0])){
            arr[i]=arr[i].replace(index_replace[0],index_replace0[0]);
        }
    }
}
function help3(arr) {
    let index_end=0;
    for(let i=1;i<arr.length;i++){
        i=help3_help0(arr,i,index_end);
    }
}
function help3_help0(arr,i,index_end) {
    if(arr[i].includes('let') || (arr[i-1].includes('=') && arr[i].includes('='))){
        let temp_arr=arr[i-1].split('[');
        let temp_arr_no_label1=arr[i-1].split('label=');
        temp_arr_no_label1[1]=temp_arr_no_label1[1].substring(0,temp_arr_no_label1[1].length-1 );
        let temp_arr2=arr[i].split('[');
        let temp_arr_no_label=arr[i].split('label=');
        temp_arr_no_label[1]=temp_arr_no_label[1].substring(0,temp_arr_no_label[1].length-1 );
        temp_arr_no_label[1]=temp_arr_no_label[1].replace('"', '');
        temp_arr_no_label[1]=temp_arr_no_label[1].replace('"', '');
        temp_arr_no_label1[1]=temp_arr_no_label1[1].replace('"', '');
        temp_arr_no_label1[1]=temp_arr_no_label1[1].replace('"', '');
        temp_arr_no_label1[1]=temp_arr_no_label1[1].replace('let','');
        temp_arr_no_label[1]=temp_arr_no_label[1].replace('let','');
        return help3_help1(temp_arr_no_label1,temp_arr_no_label,temp_arr2,index_end,i,temp_arr,arr);
    }
    return i;
}
function help3_help1(temp_arr_no_label1,temp_arr_no_label,temp_arr2,index_end,i,temp_arr,arr) {
    if(check_condition(temp_arr_no_label1,temp_arr_no_label)){
        if(check_function(temp_arr[0],temp_arr2[0],arr)){
            index_end=i;
            help(index_end,index_end-1,arr);
            arr[i-1]=temp_arr[0] + '['+'label='+ '"' + temp_arr_no_label1[1] + '\n' + temp_arr_no_label[1]+ '"' +']';
            arr.splice(i,1);
            //cfg[2].splice(i,1);
            i=i-1;
            return i;
        }
    }
    else{
        return help3_help2(temp_arr_no_label1,temp_arr_no_label,temp_arr2,index_end,i,temp_arr,arr);
    }

    return i;

}
function check_condition(temp_arr_no_label1,temp_arr_no_label) {
    if(temp_arr_no_label1[1].includes('=') && temp_arr_no_label[1].includes('=') && !(inclued_operator_label(temp_arr_no_label1[1],temp_arr_no_label[1]) )) {
        return true;
    }
}


function help3_help2(temp_arr_no_label1,temp_arr_no_label,temp_arr2,index_end,i,temp_arr,arr) {
    if(temp_arr_no_label1[1].includes('++') && temp_arr_no_label[1].includes('=') && !(inclued_operator_label(temp_arr_no_label1[1],temp_arr_no_label[1]))){
        //if(check_function(temp_arr[0],temp_arr2[0],arr)) {
        index_end = i;
        help(index_end,index_end-1,arr);
        arr[i - 1] = temp_arr[0] + '[' + 'label=' + '"' + temp_arr_no_label1[1] + '\n' + temp_arr_no_label[1] + '"' + ']';
        arr.splice(i, 1);
        //cfg[2].splice(i, 1);
        i = i - 1;
        return i;
        //}
    }
    else{
        return help3_help3(temp_arr_no_label1,temp_arr_no_label,temp_arr2,index_end,i,temp_arr,arr);
    }

    //return i;
}
function help3_help3(temp_arr_no_label1,temp_arr_no_label,temp_arr2,index_end,i,temp_arr,arr) {
    if(temp_arr_no_label1[1].includes('=') && temp_arr_no_label[1].includes('++') && !(inclued_operator_label(temp_arr_no_label1[1],temp_arr_no_label[1]))){
        //if(check_function(temp_arr[0],temp_arr2[0],arr)) {
        index_end = i;
        help(index_end,index_end-1,arr);
        arr[i - 1] = temp_arr[0] + '[' + 'label=' + '"' + temp_arr_no_label1[1] + '\n' + temp_arr_no_label[1] + '"' + ']';
        arr.splice(i, 1);
        //cfg[2].splice(i, 1);
        i = i - 1;
        return i;
        //}
    }
    else{
        return help3_help4(temp_arr_no_label1,temp_arr_no_label,temp_arr2,index_end,i,temp_arr,arr);
    }
    //return i;
}
function help3_help4(temp_arr_no_label1,temp_arr_no_label,temp_arr2,index_end,i,temp_arr,arr) {
    if(temp_arr_no_label1[1].includes('++') && temp_arr_no_label[1].includes('++')){
        //if(check_function(temp_arr[0],temp_arr2[0],arr)) {
        index_end = i;
        help(index_end,index_end-1,arr);
        arr[i - 1] = temp_arr[0] + '[' + 'label=' + '"' + temp_arr_no_label1[1] + '\n' + temp_arr_no_label[1] + '"' + ']';
        arr.splice(i, 1);
        //cfg[2].splice(i, 1);
        i = i - 1;
        return i;
        //}
    }

    return i;
}


function inclued_operator_label(label1,label2) {
    let operators=['<','>','<=','>=','|','&','&&','||','=='];
    for(let j=0;j<operators.length;j++){
        if(label1.includes(operators[j]) || label2.includes(operators[j])){
            return true;
        }
    }
    return false;
}

function  help4(arr) {
    for(let i=0;i<arr.length;i++){
        if( arr[i].includes('<') || (arr[i].includes('>') && !(arr[i].includes('->')) ) ){
            arr[i]=arr[i].replace('[','[shape="diamond",');
        }
        else{
            help4_help(arr,i);
        }
    }
}
function help4_help(arr,i) {
    if(arr[i].includes('==')){
        arr[i]=arr[i].replace('[','[shape="diamond",');
    }
    /* if((arr[i].includes('>=')) ||  (arr[i].includes('<='))){
        arr[i]=arr[i].replace(']',',shape="diamond"]');
    }*/
    /* else if((arr[i].includes('&')) ||  (arr[i].includes('&&'))){
        arr[i]=arr[i].replace(']',',shape="diamond"]');
    }*/
    else{
        help4_help_help(arr,i);
    }
}
function help4_help_help(arr,i) {
    /* if((arr[i].includes('|')) ||  (arr[i].includes('||'))){
        arr[i]=arr[i].replace(']',',shape="diamond"]');
    }*/
    if(!(arr[i].includes('->'))){
        arr[i]=arr[i].replace('[','[shape="square",');
    }
}

function  help5(arr) {
    for(let i=0;i<arr.length;i++) {
        if(!arr[i].includes('->') && arr[i].includes('label=') ){
            let temp_arr = arr[i].split('label=');
            //temp_arr[0] = temp_arr[0].replace('"', '');
            temp_arr[1] = temp_arr[1].replace('"', '');
            let index = i+1;
            arr[i] = temp_arr[0] + 'label=' + '"' + '-' + index + '-' + '\n' + temp_arr[1];
        }
    }

}

function help6(arr,arr_labels,indexs,index_start) {


    for(let i=0;i<index_start;i++){
        let index=arr[i].split('[');
        arr_labels.push(index[0]);
    }
    let check=0;

    for(let i=index_start;i<arr.length;i++){
        for(let j=0;j<arr_labels.length;j++){
            if(arr[i].includes(arr_labels[j])){
                check=check+1;
            }
        }
        help_check(indexs,check,i);

        check=0;
    }
}
function help_check(indexs,check,i) {
    if(check>1){
        indexs.push(i);
    }
}

function help7(arr,index_start,indexs) {
    let label;
    for(let i=0;i<arr.length;i++){
        if(arr[i].includes('return')){
            let label_arr=arr[i].split('[');
            label=label_arr[0];
        }
    }

    let counter=help7_help0(index_start,arr,label);

    let temp_arr=[];
    help7_help1(temp_arr,arr,counter,index_start,label);
    return help7_help3(counter,index_start,arr,temp_arr,label,indexs);



}

function help7_help3(counter,index_start,arr,temp_arr,label,indexs) {
    let temp2='';
    if(counter>1){
        for(let i=0;i<index_start+1;i++){
            temp2=temp2+temp_arr[i]+'\n';
        }
        for(let i=0;i<indexs.length;i++){
            temp2=temp2+temp_arr[indexs[i]+1]+'\n';
        }
        temp2=temp2+ 'n' + arr.length + '->' +label+'[]';

        return temp2;

    }
    else{
        return help_else(temp2,index_start,indexs,arr);

    }
}
function help_else(temp2,index_start,indexs,arr) {
    for(let i=0;i<index_start;i++){
        temp2=temp2+arr[i]+'\n';
    }
    for(let i=0;i<indexs.length;i++){
        temp2=temp2+arr[indexs[i]]+'\n';
    }

    return temp2;
}
function help7_help0(index_start,arr,label) {
    let counter=0;
    let right;
    for(let i=index_start;i<arr.length-1;i++){
        let split=arr[i].split('->');
        right=split[1];
        right=right.split('[');
        right=right[0];

        if(right.includes(label)){
            counter=counter+1;
        }
    }
    return counter;
}
function help7_help1(temp_arr,arr,counter,index_start,label) {
    if(counter>1){
        for(let i=0;i<index_start;i++){
            temp_arr.push(arr[i]);
        }
        temp_arr.push('n' + arr.length + '[label="",style=filled ,color=green]' );
        for(let i=index_start;i<arr.length;i++){
            temp_arr.push(arr[i]);
        }
        for(let i=index_start+1;i<temp_arr.length;i++){
            temp_arr[i]=temp_arr[i].replace(label,'n' + arr.length);//check
        }
    }
}

function help8(arr) {
    for(let i=0;i<arr.length;i++){
        if(arr[i].includes('->')){
            return i;
        }
    }
}

function inclued_operator(i) {
    let operators=['<','>','<=','>=','|','&','&&','||','=='];
    for(let j=0;j<operators.length;j++){
        if(temp_for_check[i].includes(operators[j])){
            return true;
        }
    }
    return false;
}

