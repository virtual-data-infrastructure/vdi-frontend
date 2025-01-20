<script setup>
import { ref, onMounted, defineProps } from 'vue';
import axios from 'axios';
import * as dagre from 'dagre';
import * as d3 from 'd3';
import '@vue-flow/core/dist/style.css';

const props = defineProps({
  selectedProjectId: Number,
  selectedProjectName: String,
});

const graphContainer = ref(null);
//const svgRef = ref(null);
//const zoom = ref(null);
let svg;
let zoomBehavior;

let nodes = null;
let edges = null;

async function drawGraph() {
  const g = new dagre.graphlib.Graph();
  // get nodes and edges from REST API
  try {
    const response = await axios.get(`https://vdi-api.nessi.no:9815/dataflow/${props.selectedProjectId}`);
    console.log("response.data.nodes: ", response.data.nodes);
    console.log("response.data.edges: ", response.data.edges);
    nodes = response.data.nodes;
    edges = response.data.edges;
    // add width and height
    const width_height = { 'width': 50, 'height': 20 };
    nodes.forEach((node) => {
      Object.assign(node, width_height);
    });
  } catch (error) {
    console.error('Error fetching nodes & edges:', error);
  }
  // calculate the layout
  try {
    // NEW approach
    g.setGraph({
      rankdir: 'LR' // layout from left to right
    });
    g.setDefaultEdgeLabel(() => ({}));
    nodes.forEach((node) => {
      g.setNode(node.id, node);
    });
    edges.forEach((edge) => {
      g.setEdge(edge.source, edge.target);
    });
    dagre.layout(g);
  } catch(error) {
    console.error('Error creating layout:', error);
  }
  // draw the layout
  const width = 500;
  const height = 500;

  svg = d3
    .select(graphContainer.value)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr('viewBox', `0 0 ${width} ${height}`);
  const svgGroup = svg.append("g");
  // draw edges
  g.edges().forEach((edge) => {
    //const edgeData = g.edge(edge);
    svgGroup
      .append("line")
      .attr("x1", g.node(edge.v).x)
      .attr("y1", g.node(edge.v).y)
      .attr("x2", g.node(edge.w).x)
      .attr("y2", g.node(edge.w).y)
      .attr("stroke", "black")
      .attr("stroke-width", 7);
  });
  // draw nodes
  g.nodes().forEach((node) => {
    const nodeData = g.node(node);
    console.log('nodeData: ', nodeData);
    console.log('x: ', nodeData.x - nodeData.width / 2);
    console.log('y: ', nodeData.y - nodeData.height / 2);
    svgGroup
      .append("rect")
      .attr("x", nodeData.x - nodeData.width / 2)
      .attr("y", nodeData.y - nodeData.height / 2)
      .attr("width", nodeData.width)
      .attr("height", nodeData.height)
      .attr("fill", "lightblue");

    svgGroup
      .append("text")
      .attr("x", nodeData.x)
      .attr("y", nodeData.y)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(node);
  });

  // center the graph
  const bbox = svgGroup.node().getBBox();
  const offsetX = (width - bbox.width) / 2 - bbox.x;
  const offsetY = (height - bbox.height) / 2 - bbox.y;
  svgGroup.attr('transform', `translate(${offsetX}, ${offsetY})`);

  // add zoom behavior
  zoomBehavior = d3.zoom().on('zoom', (event) => {
    svgGroup.attr('transform', event.transform);
  });
  svg.call(zoomBehavior);
}

const zoomIn = () => {
  if (svg && zoomBehavior) {
    svg.transition().duration(750).call(zoomBehavior.scaleBy, 1.2);
  }
};

const zoomOut = () => {
  if (svg && zoomBehavior) {
    svg.transition().duration(750).call(zoomBehavior.scaleBy, 0.8);
  }
};

onMounted(() => {
  drawGraph();
});
</script>

<template>
  <div class="project-file-list-title">
    <b>Data flow graph for project</b> <i>{{ selectedProjectName }}</i>
  </div>
  <div class="graph-container" ref="graphContainer">
    <div class="zoom-controls">
      <button @click="zoomIn">+</button>
      <button @click="zoomOut">-</button>
    </div>
  </div>
</template>

<style>
.graph-container {
  position: relative;
  margin-top: 5px;
  border: 1px solid #ccc;
}
</style>
