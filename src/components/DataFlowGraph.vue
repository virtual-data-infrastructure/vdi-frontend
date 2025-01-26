<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch, defineProps } from 'vue';
import axios from 'axios';
import * as dagre from 'dagre';
import * as d3 from 'd3';
import '@vue-flow/core/dist/style.css';

// core data elements
const props = defineProps({
  selectedProjectId: Number,
  selectedProjectName: String,
});

const container = ref(null);
const svg = ref(null);
const svgElement = ref(null);
const mainGroup = ref(null);
const g = ref(null);
const width = ref(1200);
const height = ref(1200);

const nodes = reactive([]);
const edges = reactive([]);

// helper data structures
const styleMapping = {
  program: { fill: 'rgb(135, 206, 235)', rx: 0, ry: 0 },
  file: { fill: 'rgb(169, 169, 169)', rx: 5, ry: 5 },
};

// helper functions
const stripLogNumber = (str) => {
  return str.split(/##/)[1];
};

function resizeSVG() {
  if (container.value) {
    const { width: containerWidth, height: containerHeight } = container.value.getBoundingClientRect();

    // Calculate scaling factors
    const scale = Math.min(containerWidth / width.value, containerHeight / height.value);

    // Set the viewBox of the SVG element
    if (svg.value) {
      svg.value.setAttribute('viewBox', `0 0 ${width.value} ${height.value}`);
      svg.value.style.transform = `scale(${scale})`;
      svg.value.style.transformOrigin = 'top left';
    }
  }
}

//const fetchNodesAndEdges = () => {
async function fetchNodesAndEdges() {
  console.log('>> fetchNodesAndEdges()');
  // get nodes and edges from REST API
  try {
    const response = await axios.get(`https://vdi-api.nessi.no:9815/dataflow/${props.selectedProjectId}`);
    console.log("response.data.nodes: ", response.data.nodes);
    console.log("response.data.edges: ", response.data.edges);
    nodes.push(...response.data.nodes);
    edges.push(...response.data.edges);
    // add width and height
    const width_height = { 'width': 100, 'height': 30 };
    console.log('add width and height to nodes received from API, num nodes: ', nodes.length);
    nodes.forEach((node) => {
      Object.assign(node, width_height);
    });
  } catch (error) {
    console.error('Error fetching nodes & edges:', error);
  }
  console.log('<< fetchNodesAndEdges()');
}

//const layoutNodes = () => {
async function layoutNodes() {
  g.value = new dagre.graphlib.Graph();
  // calculate the layout
  try {
    // NEW approach
    g.value.setGraph({
      rankdir: 'LR' // layout from left to right
    });
    g.value.setDefaultEdgeLabel(() => ({}));
    console.log('add nodes to dagre Graph, num nodes: ', nodes.length);
    nodes.forEach((node) => {
      g.value.setNode(node.id, node);
    });
    edges.forEach((edge) => {
      g.value.setEdge(edge.source, edge.target);
    });
    dagre.layout(g.value);
  } catch(error) {
    console.error('Error creating layout:', error);
  }
}

function placeScrollableTexts() {
    nodes.forEach((node, index) => {
      //console.log('svgElement: ', svgElement);
      const rectElement = svgElement.value.select(`#node-${node.id}`).select('rect').node();
      if (rectElement) {
        //console.log(`found rect element for node ${node} with index ${index}: `, rectElement);
        const svgRect = rectElement.getBoundingClientRect();
        const containerRect = container.value.getBoundingClientRect();
        const scrollableDiv = container.value.querySelectorAll(`.scrollable-text`)[index];

        scrollableDiv.style.left = `${svgRect.left - containerRect.left}px`;
        scrollableDiv.style.top = `${svgRect.top - containerRect.top}px`;
        scrollableDiv.style.width = `${svgRect.width - 5}px`;
        scrollableDiv.style.height = `${svgRect.height}px`;
        const fullLabel = stripLogNumber(node.label);
        scrollableDiv.textContent = `${fullLabel}`;
        scrollableDiv.scrollLeft = scrollableDiv.scrollWidth - scrollableDiv.clientWidth;
        const scrollbarHeight = scrollableDiv.clientHeight * 0.2;
        scrollableDiv.style.setProperty('--scrollbar-height', `${scrollbarHeight}px`);
      } else {
        console.log(`DIT NOT find rect element for node ${node} with index ${index}: `, node);
      }
    });
}

const drawGraph = () => {
  // draw the layout
  svgElement.value = d3.select(svg.value);
  svgElement.value.selectAll('*').remove();

  mainGroup.value = svgElement.value.append('g')
    .attr('class', 'mainGroup')
    .attr('transform', 'translate(50,50)');

  // Append nodes with rect and text
  console.log('append nodes with "rect" and "text", num nodes: ',
    nodes.length);

  // draw nodes
  nodes.forEach((node, index) => {
    if (index >= 0) {
      console.log(`processing index ${index}:`, node);
    }

    // set fill color based on node.type
    const style = styleMapping[node.type] || { fill: 'rgb(211, 211, 211)', rx: 0, ry: 0 };

    //console.log('defined style: ', style);

    const fullLabel = stripLogNumber(node.label);

    //console.log('defined fullLabel: ', fullLabel);

    const nodeGroup = mainGroup.value
      .append('g')
      .attr('class', `nodeGroup for node ${node.id} in mainGroup`)
      .attr('id', `node-${node.id}`)
      .attr('transform', `translate(${node.x}, ${node.y})`)
      .on('mouseover', function() {
        console.log('mouseover');
        tooltip.html(fullLabel)
          .style('left', '0%')
          .style('top', '20%')
          .style('transform', 'translateX(-50%)')
          .style('visibility', 'visible');
      })
      .on('mouseout', function() {
        tooltip.style('visibility', 'hidden');
      });

    console.log('added tooltip');

    nodeGroup
      .append('rect')
      .attr('class', `first-loop-node-${node.id}`)
      .attr('x', -node.width / 2)
      .attr('y', -node.height / 2)
      .attr('width', node.width)
      .attr('height', node.height)
      .attr('fill', style.fill)
      .attr('rx', style.rx)
      .attr('ry', style.ry);

    console.log('added rect');
  });

  // position the scrollable text divs
  requestAnimationFrame(() => {
    placeScrollableTexts();
  });

  // define arrow markers
  svgElement.value.append('defs').append('marker')
    .attr('id', 'arrow')
    .attr('viewBox', '0 0 11 10')
    .attr('refX', 5)
    .attr('refY', 5)
    .attr('markerWidth', 5)
    .attr('markerHeight', 4)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M 0 0 L 11 5 L 0 10 z')
    .attr('fill', '#FF0000');

  // add a tooltip element
  const tooltip = svgElement.value
    .append('div')
    .style('position', 'absolute')
    .style('visibility', 'hidden')
    .style('background', 'lightgray')
    .style('padding', '5px')
    .style('border-radius', '5px')
    .style('font-size', '12px');

  // function to truncate text
//  const truncate = (str, length) => {
//    return str.length > length ? '...' + str.slice(-(length - 3)) : str;
//  };

  // calculate anchor points on the border of nodes
  const getAnchorPoints = (nodeV, nodeW) => {
    const v = g.value.node(nodeV);
    const w = g.value.node(nodeW);
    //const dx = w.x - v.x; // horizontal distance between nodes
    //const dy = w.y - v.y; // vertical distance between nodes
    //const distance = Math.sqrt(dx * dx + dy * dy); // straight distance between nodes
    //const offsetX = (dx / distance) * (v.width / 2);
    //const offsetY = (dy / distance) * (v.height / 2);
    //return {
    //  x1: v.x + offsetX,
    //  y1: v.y + offsetY,
    //  x2: w.x - (dx / distance) * (w.width / 2) - 5,
    //  y2: w.y - (dy / distance) * (w.height / 2),
    //};
    const x1 = v.x + v.width / 2; // v.east
    const y1 = v.y; // v.east
    const x2 = w.x - w.width / 2; // w.west
    const y2 = w.y; // w.west
    return {
      x1: x1,
      y1: y1,
      x2: x2 - 5,
      y2: y2,
    };
  };

  // draw straight edges with arrow markers
//  g.value.edges().forEach((edge) => {
//    const { x1, y1, x2, y2 } = getAnchorPoints(edge.v, edge.w);
//    const source = { x: x1, y: y1 };
//    const target = { x: x2, y: y2 };
//    const points = [
//      { x: source.x, y: source.y },
//      { x: (source.x + target.x) / 2, y: source.y },
//      { x: (source.x + target.x) / 2, y: target.y },
//      { x: target.x, y: target.y },
//    ];
//    mainGroup.value
//      .append('line')
//      .attr('x1', x1)
//      .attr('y1', y1)
//      .attr('x2', x2)
//      .attr('y2', y2)
//      .attr('stroke', 'black')
//      .attr('stroke-width', 2)
//      .attr('marker-end', 'url(#arrow)');
//  });

  // draw stepwise edges with arrow markers
  g.value.edges().forEach((edge) => {
    const { x1, y1, x2, y2 } = getAnchorPoints(edge.v, edge.w);
    const source = { x: x1, y: y1 };
    const target = { x: x2, y: y2 };
    const points = [
      { x: source.x, y: source.y },
      { x: (source.x + target.x) / 2, y: source.y },
      { x: (source.x + target.x) / 2, y: target.y },
      { x: target.x, y: target.y },
    ];
    mainGroup.value
      .append('polyline')
      .attr('points', points.map(p => `${p.x},${p.y}`).join(' '))
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('marker-end', 'url(#arrow)');
  });

  // draw quadratic bezier edges with arrow markers
//  g.value.edges().forEach((edge) => {
//    const { x1, y1, x2, y2 } = getAnchorPoints(edge.v, edge.w);
//    const source = { x: x1, y: y1 };
//    const target = { x: x2, y: y2 };
//
//    const midX = (source.x + target.x) / 2;
//    const midY = (source.y + target.y) / 2;
//
//    const d = `
//      M ${source.x},${source.y}
//      Q ${midX},${source.y} ${midX},${midY}
//      T ${target.x},${target.y}
//    `;
//
//    mainGroup.value
//      .append('path')
//      .attr('d', d)
//      .attr('stroke', 'black')
//      .attr('stroke-width', 2)
//      .attr('fill', 'none')
//      .attr('marker-end', 'url(#arrow)');
//  });

  // draw cubic bezier edges with arrow markers
//  g.value.edges().forEach((edge) => {
//    const { x1, y1, x2, y2 } = getAnchorPoints(edge.v, edge.w);
//    const source = { x: x1, y: y1 };
//    const target = { x: x2, y: y2 };
//
//    const controlPoint1 = { x: (2 * source.x + target.x) / 3, y: source.y };
//    const controlPoint2 = { x: (source.x + 2 * target.x) / 3, y: target.y };
//
//    const d = `
//      M ${source.x},${source.y}
//      C ${controlPoint1.x},${controlPoint1.y}
//        ${controlPoint2.x},${controlPoint2.y}
//        ${target.x},${target.y}
//    `;
//
//    mainGroup.value
//      .append('path')
//      .attr('d', d)
//      .attr('stroke', 'black')
//      .attr('stroke-width', 2)
//      .attr('fill', 'none')
//      .attr('marker-end', 'url(#arrow)');
//  });

  console.log("centering the graph");

  // center the graph
  const bbox = mainGroup.value.node().getBBox();
  const containerWidth = container.value.getBoundingClientRect().width;
  const containerHeight = container.value.getBoundingClientRect().height;
  const offsetX = (containerWidth - bbox.width) / 2 - bbox.x;
  const offsetY = (containerHeight - bbox.height) / 2 - bbox.y;
  mainGroup.value.attr('transform', `translate(${offsetX}, ${offsetY})`);
}

function initializeZoom() {
  console.log("add zoom behavior");

  // add zoom behavior
  const zoomBehavior = d3.zoom().on('zoom', (event) => {
    console.log("inside zoom behavior");
    const transform = event.transform;
    //d3.select(mainGroup.value).attr('transform', transform);
    mainGroup.value.attr('transform', transform);
    placeScrollableTexts();
  });
  if (svg.value) {
    console.log("run zoom behavior");
    d3.select(svg.value).call(zoomBehavior);
    console.log("ran zoom behavior");
  }
  // addjust the SVG size and initial viewBox
  requestAnimationFrame(() => {
    const { width, height } = container.value.getBoundingClientRect();
    svg.value.setAttribute('width', width);
    svg.value.setAttribute('height', height);
    svg.value.setAttribute('viewBox', `0 0 ${width} ${height}`);
    placeScrollableTexts();
  });

}

onMounted(async () => {
  await fetchNodesAndEdges();
  layoutNodes();
  drawGraph();

  initializeZoom();
  window.addEventListener('resize', resizeSVG);
  resizeSVG(); // Initial resizing
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeSVG);
});

watch([width, height], resizeSVG);
</script>

<template>
  <div class="project-file-list-title">
    <b>Data flow graph for project</b> <i>{{ selectedProjectName }}</i>
  </div>
  <div ref="container" class="container">
    <svg
      ref="svg"
      width="1200" height="1200"
      viewBox="0 0 1200 1200"
      style="border: 0px solid black;">
      <g ref="mainGroup">
        <!-- D3 will render the graph here -->
      </g>
    </svg>
    <div v-for="(node, index) in nodes" :key="node.id" :ref="'scrollableText' + index" class="scrollable-text">
      {{ node.label }}
    </div>
  </div>
</template>

<style>
.scrollable-text {
  position: relative;
  background-color: transparent;
  overflow: auto;
  white-space: nowrap;
  font-size: 14px;
  margin-top: 5px;
  line-height: 1.1em;
  border: 1px solid transparent; /* Ensure the text area doesn't interfere visually */
  scrollbar-width: thin;
  //pointer-events: none; /* Allows pointer events to pass through to the SVG */
}

/* Customize the scrollbar for WebKit browsers */
.scrollable-text::-webkit-scrollbar {
  height: var(--scrollbar-height, 12px); /* Default to 12px if --scrollbar-height is not set */
}

.scrollable-text::-webkit-scrollbar-thumb {
  background-color: #888; /* Color of the scrollbar thumb */
  border-radius: 6px; /* Rounded corners for the scrollbar thumb */
}

.scrollable-text::-webkit-scrollbar-track {
  background-color: #f1f1f1; /* Color of the scrollbar track */
}

.container {
  position: relative;
  //margin-top: 5px;
  border: 1px solid #ccc;
  width: 100%;
  //height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.scrollable-text {
  position: absolute;
  background-color: transparent;
  overflow: auto;
  white-space: nowrap;
  font-size: 14px;
  line-height: 1.1em;
}
</style>
