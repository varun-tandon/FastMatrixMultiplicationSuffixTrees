from BFMT import get_BFMT
import numpy as np

# Helper function for checking if the node is a leaf.
def isLeaf(node):
    return str(type(node)) == "<class 'suffix_tree.node.Leaf'>"

# Specifiy the number of documents to pull from the tweets. 
# (You will have to extract the Twitter zip file).
N_DOCS = 5

# Builds the tree (technically not a BFMT yet)
tree = get_BFMT(n_docs=N_DOCS)

# Set up a dictionary that will store unique identifiers for each node.
# Specifically, here we have a mapping from [node: uid]
last_uid = 0
node_uids = dict()

# Breadth first search to populate the layers of the tree.
q = []
curr_depth = -1
layers = []
q.append((tree.root, 0))
while (len(q) > 0):
    node, depth = q.pop()
    node_uids[node] = last_uid
    last_uid += 1
    if depth != curr_depth: # new layer
        layers.append([])
        curr_depth = depth
    layers[-1].append(node)
    if not isLeaf(node):
        for value, child in node.children.items():
            q.append((child, depth + 1))

# At this point we have all of the uids for the nodes, and we have the 
# node in a BFF.

# Generate Squiggly X. Inspired by German, rather than doing top down, we
# build bottom up. sub_squiggs stores a mapping from nodes to vectors.
# We iterate backwards through the layers.
sub_squiggs = dict()
for i in range(len(layers) - 1, -1, -1):
    layer = layers[i]
    for node in layer:
        if isLeaf(node):
            # Leaf node case. Just use the standard basis vector.
            sub_squiggs[node] = np.zeros(N_DOCS)
            sub_squiggs[node][int(node.str_id)] = 1
        else:
            # Non leaf node, sum over the children.
            sub_squigg = np.zeros(N_DOCS)
            for value, child in node.children.items():
                sub_squigg += sub_squiggs[child]
            sub_squiggs[node] = sub_squigg

# At this point, we have all the columns, now its just a matter of placing
# them into a matrix. As mentioned in the paper, we create a matrix that has
# each column representing a node.
X_squig = np.zeros((N_DOCS, len(node_uids)))
X_squig = X_squig.T # transpose so we can set by column rather than row
for node, col in sub_squiggs.items():
    X_squig[node_uids[node]] = col
X_squig = X_squig.T # transpose back