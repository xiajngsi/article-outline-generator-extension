interface Data {
  nodeName: string,
  headerNumber: number,
  innerText: string, // 文本名称
  tagNodeIndex: number, // 在所有标题中的 index， 主要为了做节点间索引
  children: Data[] // 子节点
}