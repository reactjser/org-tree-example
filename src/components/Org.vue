<template>
  <div class="org-container">
    <svg :viewBox="viewBox" ref="svgRef">
      <g class="container">
        <!-- 线条 -->
        <path
          v-for="d in linesData"
          :key="d.id"
          :d="`M${d.x1} ${d.y1} V${d.y1 + (d.y2 - d.y1) / 2} H${d.x2} V${d.y2}`"
          class="line"
        />

        <!-- 节点 -->
        <g
          v-for="d in nodesData"
          :key="d.id"
          :transform="`translate(${d.x}, ${d.y})`"
          class="node"
        >
          <rect :x="-d.width / 2" :width="d.width" :height="d.height" />

          <!-- 这里是自定义节点内容，节点原始数据都在d.data中 -->
          <text v-if="d.depth <= 1" y="20">{{ d.data.department }}</text>
          <text v-else>
            <tspan v-for="(t, i) in d.data.department" :key="i" x="0" dy="18">{{t}}</tspan>
          </text>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3';
import genTreeLayout from '../utils/genTreeLayout';

const PADDING = 20;

export default {
  name: 'Org',
  props: {
    dataSource: {
      type: Object,
    },
  },
  data() {
    return {
      nodesData: [],
      linesData: [],
      viewBox: '0 0 0 0',
    };
  },
  watch: {
    dataSource: {
      handler(treeData) {
        this.updateTree(treeData);
      },
      immediate: true,
    },
  },
  mounted() {
    this.handleZoom();
  },
  methods: {
    updateTree(treeData) {
      if (!treeData) {
        return;
      }
      const { nodesData, linesData, layoutExtends } = genTreeLayout(treeData, {
        spaceX: 20,
        spaceY: 20,
      });
      const { minX, minY, width, height } = layoutExtends;
      this.nodesData = nodesData;
      this.linesData = linesData;
      this.viewBox = `${minX - PADDING} ${minY - PADDING} ${width +
        PADDING * 2} ${height + PADDING * 2}`;
    },
    handleZoom() {
      const zoom = d3
        .zoom()
        .scaleExtent([0.5, 2])
        .on('zoom', (event) => {
          d3.select('g.container').attr('transform', event.transform);
        });

      d3.select(this.$refs.svgRef)
        .call(zoom.transform, d3.zoomIdentity)
        .call(zoom);
    },
  },
};
</script>

<style>
.org-container {
  height: 100%;
}
svg {
  width: 100%;
  height: 100%;
}
svg .line {
  fill: none;
  stroke: #409eff;
}
svg .node rect {
  fill: rgba(64, 158, 255, 0.09);
  stroke: #409eff;
}
svg text {
  text-anchor: middle;
  font-size: 14px;
  fill: #333;
}
</style>
