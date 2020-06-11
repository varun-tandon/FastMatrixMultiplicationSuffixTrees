$(document).ready(function () {

  var special_chars = '#$&%@?+*';
  var colorlist = ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"];
  var max_string = colorlist.length;
  var ngram_is_collapsed = true;
  var stree = new SuffixTree();
  var treeData = stree.addString('$').convertToJson();
  var selectedIndex = 0;
  var realWidth = window.innerWidth * 0.6;
  var realHeight = 800;

  // ************** Generate the tree diagram	 *****************
  var margin = {top: 5, right: 25, bottom: 20, left: 50},

    width = realWidth - margin.right - margin.left,
    height = realHeight - margin.top - margin.bottom;

  var i = 0,
    duration = 750,
    root;

  var tree = d3.layout.tree()
    .size([height, width]);

  var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

  var svg = d3.select("#viz_area3").append("svg")
    .attr("height", realHeight)
    .attr("width", realWidth)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  root = treeData;
  root.x0 = height / 2;
  root.y0 = 0;

  $('#ngram-matrix-visualization-uncompressed').css('height', 'max-content');
  $('#ngram-matrix-visualization-uncompressed').css('padding', '20px');
  $('#ngram-matrix-visualization-uncompressed').css('overflow', 'scroll');
  function setSelected(i) {
      selectedIndex = i;
      $('#show').click();
  }
  $( "#show" ).click(function() {
    var str_list = $( "#words" ).val().split(",");
    for (let i = 0; i < str_list.length; i++) {
      str_list[i] = str_list[i].trim();
    }
    var str_list_all = str_list
    str_list = [str_list[selectedIndex]];
    let newHTML = ""
    for (let i = 0; i < str_list_all.length; i++) {
        newHTML += "<button class='viz_area_document_buttons' id='viz_area_document_button_" + i + "'>Select Document " + (i + 1) + "</button>"
    }
    $('.viz_area_document_selection').html(newHTML)
    for (let i = 0; i < str_list_all.length; i++) {
        $('#viz_area_document_button_' + i).click(function() {
            setSelected(i);
        })
    }
    if (!check_char($( "#words" ).val(), special_chars)){
      $( "#error" ).text("Your strings should not contain any of this special chars : " +  special_chars);
      $( "#error" ).toggle(true);
    }

    else if(str_list.length > max_string){
      $( "#error" ).text("There is a limit of " + max_string + " strings allowed !");
      $( "#error" ).toggle(true);
    }

    else{

      if(str_list.length > 0 && !(str_list.length==1 && str_list[0]==="")){
	$( "#error" ).toggle(false);
	stree =  new SuffixTree();
	for(var i=0; i<str_list.length; i++){
	  var s = str_list[i] + get_add_special_char(i, special_chars)
	  stree.addString(s);
	}
	root =  stree.convertToJson();
      }
      else{
	root = treeData;
      }

      root.x0 = height / 2;
      root.y0 = 0;
      update(root);
    }
    // ngramFreqs = {}
    // for (let i = 0; i < str_list.length; i++) {
    //   let document = str_list[i];
    //   for (let n = 1; n <= $("#ngramLength").val(); n++) {
    //     for (let start_ind = 0; start_ind <= document.length - n; start_ind++) {
    //     let ngram = document.substring(start_ind, start_ind + n);
    //     if (ngramFreqs[ngram] === undefined) {
    //         ngramFreqs[ngram] = {}
    //         ngramFreqs[ngram][i] = 1;
    //     } else if (ngramFreqs[ngram][i] === undefined) {
    //         ngramFreqs[ngram][i] = 1;
    //     } else {
    //         ngramFreqs[ngram][i] += 1;
    //     }
    //     }
    //   }
    // }
    // const orderedNgramFreqs = {};
    // Object.keys(ngramFreqs).sort((a, b) => {
    //   if (a.length < b.length) {
	// return -1;
    //   }
    //   if (b.length < a.length) {
	// return 1;
    //   }
    //   if (a.length === b.length) {
	// return 0;
    //   }
    //   if (a < b) {
	// return -1;
    //   } else if (b < a) {
	// return 1;
    //   } else {
	// return 0;
    //   }
    // }).forEach(function(key) {
    //   orderedNgramFreqs[key.replace(' ', '$\\Box$')] = ngramFreqs[key];
    // });
    // let ngramText = "";
    // ngramText += "$$\\begin{matrix}"
    // for (let i = 0; i < Object.keys(orderedNgramFreqs).length; i++) {
    //     ngramText += "& \\texttt{" + Object.keys(orderedNgramFreqs)[i] + "}"
    // }
    // ngramText += "\\\\"
    // for (let doc_num = 0; doc_num < str_list.length; doc_num++) {
    //   ngramText += "D_" + (doc_num + 1) + " "
    //   for (let i = 0; i < Object.keys(orderedNgramFreqs).length; i++) {
	//     ngramText += "&" +
	//     (orderedNgramFreqs[Object.keys(orderedNgramFreqs)[i]][doc_num] !== undefined ?
	//     orderedNgramFreqs[Object.keys(orderedNgramFreqs)[i]][doc_num] : 0)
    //   }
    //   ngramText += "\\\\"
    // }
    // ngramText += "\\end{matrix}$$"
    // console.log(ngramText)
    // document.getElementById('ngram-matrix-visualization-uncompressed').innerHTML = ngramText;
    // MathJax.typeset()
  });

  function clearSearches() {
    let rootChildren = tree.nodes(root)[0].children;
    while (rootChildren.length > 0) {
      let newChildren = []
      for (let i = 0; i < rootChildren.length; i++) {
	rootChildren[i].wasSearched = false;
	if (rootChildren[i].children) {
	  newChildren = newChildren.concat(rootChildren[i].children);
	}
      }
      rootChildren = newChildren;
    }
  }

  function calcNumLeafNodes(node) {
    if (node.children === undefined) {
      return 1;
    } else {
      let sum = 0;
      for (let i = 0; i < node.children.length; i++) {
	sum += calcNumLeafNodes(node.children[i]);
      }
      return sum;
    }
  }

  $('#submitSearchSingle').click(() => {
    clearSearches();
    let rootChildren = tree.nodes(root)[0].children;
    let searchTerm = $('#searchInputSingle').val();
    let links = tree.links(tree.nodes(root));
    let fellOff = false;
    let lastNode = undefined;
    while(searchTerm.length > 0 && !fellOff) {
      for (let i = 0; i <= rootChildren.length; i++) {
	lastNode = rootChildren[i];
	if (i == rootChildren.length) {
	  fellOff = true;
	  break;
	}
	if (searchTerm.startsWith(rootChildren[i].name)) {
	  rootChildren[i].wasSearched = true;
	  searchTerm = searchTerm.substring(rootChildren[i].name.length);
	  rootChildren = rootChildren[i].children;
	  break;
	}
	if (rootChildren[i].name.startsWith(searchTerm)) {
	  rootChildren[i].wasSearched = true;
	  searchTerm = "";
	  break;
	}
      }
    }
    if (fellOff) {
      $('#searchResultsSingle').css('color', 'red');
      $('#searchResultsSingle').text('Term not found.')
    } else {
      $('#searchResultsSingle').css('color', 'green');
      $('#searchResultsSingle').text('Term found!')
    }
    update(root);

  })

  d3.select(self.frameElement).style("height", "800px");

  function update(source) {
    var coeff = getDepth(root);
    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * width/coeff; });

    // Update the nodes…
    var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", click);

    nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "#ddd" : "#fff"; });

    nodeEnter.append("text")
      .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return d.name+ (d.start?" ["+d.start + (d.seq ? ","+d.seq:"")+ "]":""); })
      .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("circle")
      .attr("r", 10)
      .style("fill", function(d) { return d.wasSearched ? "#FFFF00" : (d._children ? "#ddd" : "#fff"); })
      .style("stroke", function(d) { return d.wasSearched ? "#000" : (d._children ? "#bbb" : colorlist[d.seq]); });

    nodeUpdate.select("text")
      .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

    nodeExit.select("circle")
      .attr("r", 1e-6);

    nodeExit.select("text")
      .style("fill-opacity", 1e-6);

    // Update the links…
    var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
      .attr("class", "link")
      .style("stroke", function(d) {
	return d.wasSearched ? "#FFFF00" : (d.target._children ? "#ccc" : colorlist[d.target.seq]);
      })

      .attr("d", function(d) {
	var o = {x: source.x0, y: source.y0};
	return diagonal({source: o, target: o});
      });

    // Transition links to their new position.
    link.transition()
      .duration(duration)
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
	var o = {x: source.x, y: source.y};
	return diagonal({source: o, target: o});
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  // Toggle children on click.
  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d);
  }

  function get_add_special_char(i, special_chars){

    var char_end = ""
    if (i<special_chars.length){
      char_end = special_chars[i];
    }
    else{
      var start_ind = 1000, offset = 10;
      char_end = String.fromCharCode(start_ind + i*offset);
    }
    return char_end;
  }


  function check_char(str1, str2){
    return str1.split('').filter(function(n){
      return str2.indexOf(n)!= -1;
    }).length <1;
  }

  getDepth = function (jdata) {
    var depth = 0;
    if (jdata.children) {
      jdata.children.forEach(function (d) {
	var cdepth = getDepth(d)
	if (cdepth > depth) {
	  depth = cdepth
	}
      })
    }
    return 1 + depth
  }
  $('#show').click();
});
