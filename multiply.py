import numpy as np

# def get_hashtable_node_count(root):
# 	table = dict()
# 	queue = [root]
# 	counter = 0

# 	while queue:
# 		node = queue.pop(0)

def get_ith_basis_vec(i, N):
	vec = np.zeros(N)
	vec[i] = i
	return vec

def is_leaf(node):
	#not sure abt the suffix-trees api but here is a possible implementation
	return not node.left and not node.right

# def fill_phi(node, phi, counter):
# 	if is_leaf(node):
# 		vec = get_ith_basis_vec(node.index, N) #assuming node has attribute index, may need to use an extern data structure
# 		phi[:][counter] = vec
# 	else:
# 		for child in node.children:
# 			fill_phi(child, phi, )	


def get_phi(root, N, listoflevels):
	#root is the root of tree, N is the dimension (num docs), v is the number of nodes
	numNodes = listoflevels[-1][-1][1] + 1 #counter starts at 0
	phi = np.zeros((N,numNodes - 1)) #ignore the root

	#start looping from the back
	for i in range(len(listoflists), 1, -1): #skip the root, that's why we end at 1 instead of 0
		level = listoflevels[i]
		for node, count in level:
			counter -= 1 #adjust indexing 
			if is_leaf(node):
				vec = get_ith_basis_vec(node.index, N) #assuming node has attribute index, may need to use an extern data structure
				phi[:][counter] = vec
			else:
				pass
				#double check dafuq
	return phi



def get_squiggly_X(root, listoflevels, X, Phi):
	# root - root of the tree
	# listoflevels - another format of the tree
	# X - N-gram matrix (filled w integers)
	# get Phi from the method above

	numNodes = listoflevels[-1][-1][1] + 1 #counter starts at 0
	squigglyX = np.zeros((N,numNodes - 1)) #ignore the root

	for i in range(len(listoflists), 1, -1): #skip the root, that's why we end at 1 instead of 0
		level = listoflevels[i]
		for node, count in level:
			squigglyX[count] = Phi[count] + sum([Phi[child.count] for child in node.children()]) #ASSUMING there is
			# a count variable in each node and has method .children()

	return squigglyX	

def main():
	return 0

if __name__ == '__main__':
	main()