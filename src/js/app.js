import $ from 'jquery';
import {Draw} from './Data_graph';
import cytoscape from 'cytoscape';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let _code =$('#txtcode').val();   let _input = $('#txtinput').val();
        cytoscape({
            container: document.getElementById('cy'),  elements: Draw(_code,_input),
            style: [ { selector: 'node', style: { 'content': 'data(name)', 'text-valign': 'center', 'color': 'black', 'font-size' : '30px' , 'background-color': '#FFF', 'height': 100, 'width': 150, 'border-color': '#000', 'border-width': 5, 'border-opacity': 1, 'rows' : 2, } },
                { selector: 'node[type="Rg"]', style: { 'shape': 'rectangle', 'background-color': '#5a8845', } },
                { selector: 'node[type="Rw"]', style: { 'shape': 'rectangle', 'background-color': '#f3f3f3', } },
                { selector: 'node[type="Cg"]', style: { 'background-color': '#5a8845', } },
                { selector: 'node[type="Cw"]', style: { 'background-color': '#f3f3f3', } },
                { selector: 'node[type="Tg"]', style: { 'shape': 'diamond', 'background-color': '#5a8845', } },
                { selector: 'node[type="Tw"]', style: { 'shape': 'diamond', 'background-color': '#f3f3f3', 'border' : '1px solid #CCC', } },
                { selector: 'edge', style: { 'curve-style': 'bezier', 'width': 20, 'target-arrow-shape': 'triangle', 'line-color': '#ff6e1c', 'target-arrow-color': '#060404' } }
            ],
            layout: { name: 'breadthfirst', directed: true, padding: 1 }
        });
    });
});
