const { supportedExtensions } = require(`./supported-extensions`)

function shouldOnCreateNode({ node }) {
  return node.internal.type === `File` && !!supportedExtensions[node.extension]
}

module.exports.shouldOnCreateNode = shouldOnCreateNode

module.exports.onCreateNode = async function onCreateNode({
  node,
  actions,
  createNodeId,
}) {
  const { createNode, createParentChildLink } = actions

  const imageNode = {
    id: createNodeId(`${node.id} >> ImageSharp`),
    children: [],
    parent: node.id,
    internal: {
      contentDigest: `${node.internal.contentDigest}`,
      type: `ImageSharp`,
    },
  }

  console.log('calling createNode and createParentChildLink');
  console.log(`imageNode: ${JSON.stringify({id: imageNode.id, internal: imageNode.internal})}`);
  console.log(`parentNode: ${JSON.stringify({id: node.id, internal: node.internal})}`);
  try {
    await createNode(imageNode)
    await createParentChildLink({ parent: node, child: imageNode })
  } catch (e) {
    console.error(e);
    throw e;
  }

  return
}
