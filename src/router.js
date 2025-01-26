import { createRouter, createWebHistory } from 'vue-router';
import WelcomePage from './components/WelcomePage.vue';
import DataFlowGraph from './components/DataFlowGraph.vue';
import VirtualDataInfrastructure from './components/VirtualDataInfrastructure.vue';

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: WelcomePage,
  },
  {
    path: '/dataflowgraph',
    name: 'dataflowgraph',
    component: DataFlowGraph,
  },
  {
    path: '/virtualdatainfrastructure',
    name: 'virtualdatainfrastructure',
    component: VirtualDataInfrastructure,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
