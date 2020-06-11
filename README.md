# Multiplying N-gram Matrices in Linear Time and Space

Welcome to our repository! Here are some quick links:

- For the link to our web version of our explanatory article, click [here](https://varun-tandon.github.io/FastMatrixMultiplicationSuffixTrees/).
- For the PDF version of our explanatory article, click [here](pdfs/our_paper.pdf).
- For the original paper, click [here](pdfs/original_paper.pdf).
- For the Python scripts used for benchmarking, click [here](python/e2e.py).
- For the code for our website, take a look at `index.html` and the `scripts/` folder.

## TODO

- [x] Change repository description to: An explanatory article of the paper "Fast Algorithms for Learning with Long N-grams via Suffix Tree Based Matrix Multiplication" by Hristo S. Paskov, John C. Mitchell, and Trevor J. Hastie.
- [x] Action item 1: can we un-transpose this matrix? The first reason is that it would make it consistent with the rest of our paper, which is good. The second is that there are always going to be more suffixes than documents, so it would fit *better* untransposed.
- [x] Action item 2: Can you clarify how many tweets? Give a more concrete description of the corpus used? "Some tweets" is so incredibly vague. Did you scrape them from the internet?
- [ ] Action item 3: Can we please fix the typo in the title of this graph? I don't think "Radnomized" gives off the impression that we were careful.
- [ ] Action item 4: Can you give an R^2 value for the above graph to quantify how linear this is? Also, a residual plot would be nice so it's easy to see whether or not it truly is random. Just saying "looks linear" isn't very scientific... Plotting the line of best fit in red would help the reader a lot.
- [x] Action item 5: I'm a *huge* fan of this visualization right here but there are two things that would make this better. The first is if the text that was part of this visualization (the two lines at the top) were visually offset from the rest of the article so people know it's the visualization and not the article. The second is that we should not let the user hover over the root. It's nonsensical and we should handle this edge case!
- [ ] Action item 6: Make the section links in the PDF dynamically jump to the correct section.
- [x] Actually the footnotes and authors aren't even showing up on mine! @Varun Tandon@German Enik Eric and I have no idea how to do this. Do you have any ideas?
- [ ] Action item 7: The animation in section 4.1 updates the something in section 4.2, which is a little off-putting. We need to disentangle the two animations.
- [ ] Action item 8: Make the layout responsive to screensize in quantized increments (with a responsive grid).
