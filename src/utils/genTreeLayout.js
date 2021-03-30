import { flextree } from 'd3-flextree';
import clonedeep from 'lodash.clonedeep';

const genTreeLayout = (
  data,
  {
    spaceX, // 水平方向节点间距
    spaceY, // 垂直方向节点间距
  }
) => {
  if (typeof data !== 'object') {
    throw new Error('请检查数据');
  }

  // 深拷贝，防止污染原对象
  const dataCopy = clonedeep(data);

  // 深度优先遍历，更新节点size属性，因为d3-flextree的节点高度包含节点下方的间距
  const dfs = (root) => {
    const [width, height] = root.size;
    root.size = [width, height + spaceY];
    root.children.forEach(dfs);
  };
  dfs(dataCopy);

  const layout = flextree({ spacing: spaceX });
  const tree = layout.hierarchy(data);
  const nodes = layout(tree);
  const descendants = nodes.descendants();
  const { left, top, right, bottom } = nodes.extents;

  // 节点和线条数据
  // 注意：节点实际显示高度需减去垂直方向节点间距
  // x和y坐标需要修正偏移量
  const nodesData = descendants.map((node) => ({
    ...node,
    x: node.x - left,
    y: node.y - top,
    width: node.xSize,
    height: node.ySize - spaceY,
  }));

  const linesData = descendants.slice(1).map((node) => ({
    x1: node.parent.x - left,
    y1: node.parent.y - top + node.parent.ySize - spaceY,
    x2: node.x - left,
    y2: node.y - top,
  }));

  return {
    nodesData,
    linesData,
    layoutExtends: {
      minX: 0,
      minY: 0,
      width: right - left,
      height: bottom - top - spaceY,
    },
  };
};

export default genTreeLayout;
