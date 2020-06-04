from BFMT import get_BFMT
import numpy as np

def isLeaf(node):
    return str(type(node)) == "<class 'suffix_tree.node.Leaf'>"

N_DOCS = 5

tree = get_BFMT(n_docs=N_DOCS)

last_uid = 0
node_uids = dict()

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

# Generate Squiggly X
sub_squiggs = dict()
for i in range(len(layers) - 1, -1, -1):
    layer = layers[i]
    for node in layer:
        if isLeaf(node):
            sub_squiggs[node] = np.zeros(N_DOCS)
            sub_squiggs[node][int(node.str_id)] = 1
        else:
            sub_squigg = np.zeros(N_DOCS)
            for value, child in node.children.items():
                sub_squigg += sub_squiggs[child]
            sub_squiggs[node] = sub_squigg

X_squig = np.zeros((N_DOCS, len(node_uids)))
X_squig = X_squig.T
for node, col in sub_squiggs.items():
    X_squig[node_uids[node]] = col
X_squig = X_squig.T