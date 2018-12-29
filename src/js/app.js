import $ from 'jquery';
import * as esprima from 'esprima';
import Viz from 'viz.js';
import {Module,render} from 'viz.js/full.render.js';
import {parseCode_eval} from './eval-color';
import {create_cfg} from './code-analyzer';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        const esgraph=require('esgraph');
        let source=$('#codePlaceholder').val();
        let params_string= $('#params_place').val();
        let evals_color1 = parseCode_eval(source,params_string);
        let evals_color=evals_color1.split('<br>');
        const cfg=esgraph(esprima.parse(source,{range:true}).body[0].body);
        start(cfg);
        let dot=esgraph.dot(cfg,{counter:0,source:source});
        let arr=dot.split('\n');
        dot=create_cfg(arr,dot,evals_color);
        var sample='digraph{'+ dot + '}'; var svg=new Viz({Module,render}); var main=document.getElementById('parsedCode');
        svg.renderSVGElement(sample).then(function (element) {
            main.innerHTML='';
            main.append(element);});
    });});

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

