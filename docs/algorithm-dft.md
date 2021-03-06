# Encapsule/jsgraph algorithm reference

[^--- TOP](../README.md)

## jsgraph.directed.depthFirstTraverse

Please refer to Chapter 23 "Elementary Graph Algorithms" of [Introduction To Algorithms](https://mitpress.mit.edu/books/introduction-algorithms) (MIT Press) for a complete discussion of the classic depth-first search and visit algorithms encapsulated by jsgraph's `depthFirstTraverse` algorithm.

### DFT request and response

`depthFirstTraverse` is called with a normalized traversal algorithm request object and returns a normalized traversal algorithm response object.

```javascript
var response = digraph.directed.depthFirstTraverse({
    digraph: myDigraph,
    visitor: myDFTVisitor
});
```

Note that by default, `depthFirstTraverse` will fail if called on `DirectedGraph` container that has no root vertices (due to cycle(s) or no vertices at all). To allow this, in other words go through the motions but traverse nothing, set `request.options.allowEmptyStartVector` flag true.

**See: [Algorithm Reference: Traversal algorithms overview](./algorithm-traversal.md) for details.**

### DFT visitor interface object

A DFT visitor interface is a JavaScript object with zero or more defined function callbacks from the table below.

Note that all client-provided visitor functions are required to return a Boolean response: true to continue the traversal, false to terminate.

callback | request | explanation
-------- | ------- | -----------
initializeVertex | { u: string: g: DirectedGraph } | invoked on every vertex of the graph before the start of the search
startVertex | { u: string: g: DirectedGraph } | invoked on the source vertex once before the start of the search
discoverVertex | { u: string: g: DirectedGraph } | invoked when a vertex is encountered for the first time
examineEdge | { e: { u: string, v: string },  g: DirectedGraph } | invoked on every out-edge of each vertex after it is discovered
treeEdge | { e: { u: string, v: string },  g: DirectedGraph } | invoked on each edge as it becomes a member of the edges that form the search tree
backEdge | { e: { u: string, v: string },  g: DirectedGraph } | invoked on the back edges in the graph. For an undirected graph there is some ambiguity between tree edges and back edges since the edge (u,v) and (v,u) are the same edge, but both the tree_edge() and back_edge() functions will be invoked. One way to resolve this ambiguity is to record the tree edges, and then disregard the back-edges that are already marked as tree edges. An easy way to record tree edges is to record predecessors at the tree_edge event point
forwardOrCrossEdge | { e: { u: string, v: string }, g: DirectedGraph } | invoked on forward or cross edges in the graph. In an undirected graph this method is never called
finishVertex | { u: string: g: DirectedGraph } |invoked on vertex u after finish_vertex has been called for all the vertices in the DFS-tree rooted at vertex u. If vertex u is a leaf in the DFS-tree, then the finish_vertex function is called on u after all the out-edges of u have been examined.
finishEdge  | { e: { u: string, v: string },  g: DirectedGraph } | invoked on each non-tree edge as well as on each tree edge after finishVertex has been called on its target vertex

**See also: [Boost C++ Graph Library: DFS Visitor Concept](http://www.boost.org/doc/libs/1_55_0/libs/graph/doc/DFSVisitor.html)**


<hr>

Copyright &copy; 2014-2015 [Christopher D. Russell](https://github.com/ChrisRus)

