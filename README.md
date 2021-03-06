# Encapsule/jsgraph

## About jsgraph

_"... At the other end of the spectrum is, for example, graph theory, where the basic object, a graph, can be immediately comprehended. One will not get anywhere in graph theory by sitting in an armchair and trying to understand graphs better. Neither is it particularly necessary to read much of the literature before tackling a problem: it is of course helpful to be aware of some of the most important techniques, but the interesting problems tend to be open precisely because the established techniques cannot easily be applied."_ - [W.T. Gowers](https://en.wikipedia.org/wiki/Timothy_Gowers)

### Status

[![Build Status](https://travis-ci.org/Encapsule/jsgraph.svg?branch=master)](https://travis-ci.org/Encapsule/jsgraph)

Ich danke Ihnen sehr [Travis CI](https://travis-ci.org/Encapsule/jsgraph.svg?branch=master)

### Summary

`Encapsule/jsgraph` implements a framework for storing and processing in-memory directed graph data sets that is inspired by the research of [Jeremy Siek](http://wphomes.soic.indiana.edu/jsiek/) and his work on the [Boost C++ Graph Library](http://www.boost.org/doc/libs/1_59_0/libs/graph/doc/table_of_contents.html).

The library provides and normalizes the following operations independent of graph topology and semantics:

- Generic, multi-dimensional container abstraction for storing directed graphs in memory.
  - JSON/native JavaScript data object import/export API's.
  - Vertex and edge CRUD API's.
  - Application-defined vertex and edge property API's.
  - Vertex and edge enumeration API's.
  - Root/leaf vertex set enumeration API's.
- Generic transposition algorithm.
- Developer-extensible breadth-first visit and search algorithm.
- Developer-extensible depth-first visit and search algorithm.

### Audience

jsgraph is a framework for building next-generation frameworks on Node.js and HTML 5.

- Use instead of in-memory object hierarchies linked by reference:
  - Serializable to JSON (even when cyclic).
  - Edges can be labeled with properties. References can't.
  - Much simpler to debug and test.
  - Promotes code consistency and readability.
  - Less refactoring due to data structure udpates.
- Implement business logic and process as generic graph algorithms:
  - Considerably reduce lines of code/test.
  - Make the architecture of the design manifest in code.
  - Re-use investment on other and new data types without code modification.

### Training and Support

If you're considering using jsgraph in a commerical product, please get in touch with [Encapsule.io](https://encapsule.io) - we can save you time, and help you get the most out of your investment.

### Programming

- [Object Reference: DirectedGraph container](./docs/object-DirectedGraph.md)
- [Object Reference: DirectedGraph export object](./docs/object-JSON.md)
- [Transform Reference: jsgraph.directed.transpose](./docs/transform-transpose.md)
- [Algorithm Reference: Traversal algorithms overview](./docs/algorithm-traversal.md)
- [Algorithm Reference: jsgraph.directed.breadthFirstTraverse](./docs/algorithm-bft.md)
- [Algorithm Reference: jsgraph.directed.depthFirstTraverse](./docs/algorithm-dft.md)

### Installaton

In your project, install via npm.

        $ npm install jsgraph --save
        jsgraph@0.6.xx node_modules/jsgraph

### Sources

The published npm package contains everything required by the library runtime but does not include its test suite or documentation.

To obtain a copy of these assets locally, use Git to clone the jsgraph repository from GitHub:

        $ git clone git@github.com:Encapsule/jsgraph.git

See also: [Encapsule/jsgraph on GitHub](https://github.com/Encapsule/jsgraph)

## Features

- Generic in-memory container for directed mathematical graph data and property sets.
- Directed graph transposition algorithm (i.e., flip the edges).
- Breadth-first visit and search algorithms (full, non-recursive implementation with edge classification).
- Depth-first visit and search algorithms (full, non-recursive implementation with edge classicication).
- Core algorithms leverage the [visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern) for easy use and extension.
- Core breadth and depth-first traversal algorithms now support termination allowing for derived code to operate efficiently on large in-memory structures.
- Request/response object style API with helpful diagnostic error messages. Implementation does not throw or use exceptions.
- jsgraph is tested continuously with [Travis CI](https://travis-ci.org/Encapsule/jsgraph).

## Example

The following short example constructs a `DirectedGraph` container using a v0.6 jsgraph digraph data object, and derives a simple rank assignment algorithm from jsgraph's bundled `breadthFirstTraverse` algorithm. Note that the BFT visitor interface callback functions leverage the `DirectedGraph` API to get/set the data property value of each visited vertex to its rank.
```javascript
// Encapsule/jsgraph/examples/bft-vertex-ranking.js
var jsgraph = require('jsgraph');
var response = jsgraph.directed.create({
    elist: [
        { e: { u: "A", v: "B" } },
        { e: { u: "B", v: "C" } },
        { e: { u: "B", v: "D" } }
    ]
});
// Check the response object for error!
if (response.error) {
    throw new Error(response.error);
}
// Now the container is safe to use.
var digraph = response.result;
// THINK OF VISITOR INTERFACES LIKE ALGORITHM FLIGHT RECORDERS
// VERTEX RANKING ALGORITHM (breadthFirstTraverse visitor interface)
var bftVisitorInterface = {
    startVertex: function(request) {
        request.g.setVertexProperty({ u: request.u, p: 0});
        return true; // continue the traversal
    },
    treeEdge: function (request) {
        request.g.setVertexProperty({
            u: request.e.v,
            p: request.g.getVertexProperty(request.e.u) + 1
        });
        return true;
    }
};
// ACTUATE OUR VISITOR INTERFACE WITH BFT TO PRODUCE THE RESULT
response = jsgraph.directed.breadthFirstTraverse({
    digraph: digraph,
    visitor: bftVisitorInterface
});
if (response.error) {
    throw new Error(response.error);
}
console.log("DirectedGraph: '" +
digraph.toJSON(undefined,4) + "'");
console.log("BFT traversal: '" +
    JSON.stringify(response.result,undefined,4) + "'");
```
... produces the following output with each vertex's property value set to its rank (edge hops away from a root vertex in this example).

```
DirectedGraph: '{
    "vlist": [
        {
            "u": "A",
            "p": 0
        },
        {
            "u": "B",
            "p": 1
        },
        {
            "u": "C",
            "p": 2
        },
        {
            "u": "D",
            "p": 2
        }
    ],
    "elist": [
        {
            "e": {
                "u": "A",
                "v": "B"
            }
        },
        {
            "e": {
                "u": "B",
                "v": "C"
            }
        },
        {
            "e": {
                "u": "B",
                "v": "D"
            }
        }
    ]
}'
BFT traversal: '{
    "searchStatus": "completed",
    "colorMap": {
        "A": 2,
        "B": 2,
        "C": 2,
        "D": 2
    },
    "undiscoveredMap": {}
}'
```

## Release

**v0.6 is a bug fix release that's API-compatible with v0.5**

- DFT algorithm bug fixes impacting order and identity of client visitor callbacks.
- Better error handling on bad developer-supplied visitor interfaces.
- Better error handling for BFT/DFT algorithm empty start vector case.
- You can now set `name` and `description` string properties on a `DirectedGraph`:

**v0.5 is a breaking upgrade for users of v0.4**

- Stylistic changes are required to v0.4 clients to upgrade.
- No more exceptions. jsgraph now returns error/result response objects.
- Breadth-first * algorithms coalesced into `breadthFirstTraverse`.
- Depth-first * algorithms coalesced into `depthFirstTraverse`.
- Algorithms now support early terminate under client control.
- ~400 new tests added for v0.5 release.
- Documentation and example updates.

## API

v0.6 jsgraph has the following public export object:

```javascript
var jsgraph = require('jsgraph');
jsgraph === {
    directed: {
    create: [Function],
    transpose: [Function],
    breadthFirstTraverse: [Function],
    depthFirstTraverse: [Function],
    colors: { white: 0, gray: 1, black: 2 },
    createTraversalContext: [Function]
    }
}
```

### DirectedGraph container object

**See also: [Object Reference: DirectedGraph container](./docs/object-DirectedGraph.md)**

jsgraph's core directed graph container object, **DirectedGraph**, is constructed by a calling library export function `jsgraph.directed.create`:

```javascript
var jsgraph = require('jsgraph');
var digraph = null;
var response = jsgraph.directed.create(/*data or JSON*/);
if (response.error) {
    console.log(response.error);
} else {
    digraph = response.result;
    console.log(digraph.toJSON());
}
```

... produces:

```javascript
'{"vlist":[],"elist":[]}'
```
        
The `DirectedGraph` container object created by this process models "a graph" generically providing normalized access to its contents via the methods documented in the next sections. As indicated by the inline comment, you may also create a `DirectedGraph` from a data object or equivalent JSON string. 

**See also: [Object reference: DirectedGraph export object](./docs/object-JSON.md)**
            
#### DirectedGraph vertex methods

- `isVertex(vertexId)` - query the existence of a specific vertex in the graph
- `addVertex({u: vertexId, p: ?})` - add a vertex and optional property data to the digraph
- `removeVertex(vertexId)` - remove a specific vertex and its properties from the graph
- `getVertexProperty(vertexId)` - get the properties data associated with a specific vertex
- `setVertexProperty({u: vertexId, p: ?})` - set the properties data associated with a specific vertex
- `hasVertexProperty(vertexId)` - query if a vertex has associated property data or not
- `clearVertexProperty(vertexId)` - clear property data associated with a vertex
- `inDegree(vertexId)` - determine how many edges are directed at a specific vertex
- `inEdges(vertexId)` - get the list of edges directed at a specific vertex
- `outDegree(vertexId)` - determine how many edges are directed away from a specific vertex
- `outEdges(vertexId)` - get the list of edges directed away from a specific vertex

#### DirectedGraph edge methods

- `isEdge({ u: vertexId, v: vertexId })` - query the existence of a specific edge in the graph
- `addEdge({ e: { u: vertexId, v: vertexId }, p: ?})` - add edge and optional property data from vertex u to vertex v 
- `removeEdge({ u: vertexId, v: vertexId })` - remove a specific edge and its properties from the graph
- `getEdgeProperty({ u: vertexId, v: vertexId })` - get the properties data associated with a specific edge
- `setEdgeProperty({ e: { u: vertexId, v: vertexId }, p: ?})` - set the properties data associated with a specific edge
- `hasEdgeProperty({ u: vertexId, v: vertexId })` - query if an edge has property data associated with it or not
- `clearEdgeProperty({ u: vertexId, v: vertexId})` - clear property data associated with an edge

#### DirectedGraph container methods

- `get/setGraphName()` - get/set the name of the graph
- `get/setGraphDescription()` - set/set the description of the graph
- `verticesCount()` - obtain the count of vertices in the container
- `getVertices()` - retrieve an array of ID strings for all vertices in the container
- `edgesCount()` - obtain the count of edges in the container
- `getEdges()` - retrieve an array of edge descriptor objects for all edges in the container
- `rootVerticesCount()` - obtain count of vertices with in-degree zero
- `getRootVertices()` - retrieve an array of ID strings for all vertices that have in-degree zero
- `leafVerticesCount()` - obtain count of vertices with out-degree zero
- `getLeafVertices()` - retrieve an array of ID strings for all vertices that have out-degree zero
- `toObject()` - serialize the DirectedGraph container to a JavaScript data object
- `toJSON(replacer, space)` - serialize the DirectedGraph container to a JSON string
- `fromObject(dataObject)` - import a jsgraph-format JavaScript data object into the container (addative)
- `fromJSON(jsonString)` - import jsgraph-format JSON string into the container (addative)

### Transforms & Algorithms

_"Begin at the beginning," the King said gravely. "and go on till you come to the end; then stop." - Lewis Carroll, Alice in Wonderland_

jsgraph bundles a small collection of powerful functions that operate on the data contained in a `DirectedGraph` container in useful ways.

Transform functions generate new `DirectedGraph` containers from existing container(s) applying some presribed filter, or transformation to the vertex and/or edge lists.

Algorithm functions are miniature agent processes that traverse the topology of a `DirectedGraph` container issuing callbacks to your derived client code at specified event points. Think of your graph as a maze: vertices are intersections, edges hallways. As the algorithmic agent walks through the maze it keeps track of where it's been so as to be able to dig itself out of corners and dead-ends. Each algorithm implements a different specific agent with its own goal strategies for "running the maze." 

The magic of graph algorithms is that deep insight can be derived from watching and analyzing how specific graph algorithms traverse specific graph interconnect topologies. However, graph traversal algorithms are hard to implement due to their complexity and most implementations are purpose-built, and/or have little facility for embedded re-use or extension in contexts their authors didn't anticipate.

jsgraph addresses this problem by copying the Boost Graph Library (BGL)'s fantastic use of the visitor pattern to encapsulate the specific goal strategies of graph traversal algorithms. The resulting API makes trivial use cases trivial and advanced use cases possible. Depending on your requirements, other similar libraries that provide single-call graph algorithm results may better suit your needs. But in cases where it makes sense to re-use the core algorithmic agents as the basis for your own complex data masterpiece, there's really just no substitute for the BGL visitor API style.

jsgraph uses names and conventions documented in Chapter 23 "Elementary Graph Algorithms" of [Introduction To Algorithms](https://mitpress.mit.edu/books/introduction-algorithms) (MIT Press). 

#### jsgraph.directed.transpose Transform

**See also: [Transform Reference: jsgraph.directed.transpose](./docs/transform-transpose.md)**

jsgraph currently provides a single 'transform' function, `jsgraph.directed.transpose` that constructs a new `DirectedGraph` that that is equivalent to an existing `DirectedGraph` except that the direction of all the edges is reversed. Note that vertex and edge properties (if any) are copied by reference to the transposed digraph as a deep copy is seldom desirable. 

```javascript
var response = jsgraph.directed.transpose(digraph);
if (response.error) {
    console.log(response.error);
} else {
    console.log("Transposed digraph JSON: '" + response.result.toJSON() + "'.");
}
```

#### jsgraph.directed.breadthFirstTraverse Algorithm

**See also: [Algorithm Reference: jsgraph.directed.breadthFirstTraverse](./docs/algorithm-bft.md)**

jsgraph function export `jsgraph.directed.breadthFirstTraverse` is a non-recursive visitor imlementation of the classic breadth-first search and visit vertex discovery and edge classification algorithms.

The algorithm starts at a vertex (visit) or set of vertices (search) and proceeds breadth-first providing your client code with a series of progress callbacks to _visitor interface_ functions you register when initiating the traversal.

Supported visitor interface callbacks for breadth-first traversal: `initializeVertex`, `startVertex`, `discoverVertex`, `examineVertex`, `examineEdge`, `treeEdge`, `nonTreeEdge`, `grayTarget`, `blackTarget`, and `finishVertex`.

A breadth-first traversal concludes when all reachable vertices have been visited, or when the client signals termination by returning Boolean **false** back to the algorithm from one of its visitor interface callback functions.

#### jsgraph.directed.depthFirstTraverse Algorithm

**See also: [Algorithm Reference: jsgraph.directed.depthFirstTraverse](./docs/algorithm-dft.md)**

jsgraph function export `jsgraph.directed.depthFirstTraverse` is a non-recursive visitor implementation of the classic depth-first search and visit vertex discovery and edge classification algorithms.

The algorithm starts at a vertex (visit) or set of vertices (search) and proceeds depth-first providing your client code with a series of progress callbacks to _visitor interface_ functions you register when initiating the traversal.

Supported visitor interface callbacks for depth-first traversal: `initializeVertex`, `startVertex`, `discoverVertex`, `examineEdge`, `treeEdge`, `backEdge`, `forwardOrCrossEdge`, `finishEdge`, and `finishVertex`.

A depth-first traversal concludes when all reacable vertices have been visited, or when the client signals termination by returning Boolean **false** back to the algorithm from one of its visitor interface callback functions.

<hr>

Copyright &copy; 2014-2015 [Christopher D. Russell](https://github.com/ChrisRus)



