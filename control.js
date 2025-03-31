class Control {
    constructor(data) {
        // private variables
        const size = {
            width: 1600,
            height: 1000,
        };

        // public variables
        this.root = d3.hierarchy(data);
        this.homologies = this.root.descendants()
            .filter(node => node.data.hasOwnProperty('division'))
            .map(node => node.data.division);
        this.clades = this.root.descendants()
            .filter(node => node.data.hasOwnProperty('order'))
            .map(node => node.data.order);
        
        this.homology = null;
        this.clade = null;
        
        // set containers
        this.container = d3.select('body').append('div')
            .attr('id', 'container')
            .style('width', `${size.width}px`)
            .style('height', `${size.height}px`)
            .style('display', 'flex');

        this.visual = this.container.append('div')
            .attr('id', 'visual')
            .style('width', `${size.width * 0.75}px`)
            .style('height', `${size.height}px`)

        this.side = this.container.append('div')
            .attr('id', 'sidebar')
            .attr('width', `${size.width * 0.25}px`)
            .style('height', `${size.height}px`);

        // class instances
        this.legend = new Legend(data, size.width * 0.75, size.height - 800, this);
        this.tree = new PhyloTree(data, size.width * 0.75, size.height - 200, this);
        this.aside = new Aside(data, size.width / 4, size.height, this);
    }

    // interactive methods
    // TODO
    HighlightHomology(h) {
        this.legend.HighlightHomology(h);
        this.tree.HighlightHomology(h, this.root);
        this.aside.SelectHomology(h, this.root);
    }

    HighlightClade(c) {
        this.legend.HighlightClade(c);
        this.tree.HighlightClade(c, this.root);
        this.aside.SelectClade(c, this.root);
    }

    UnhighlightHomology() {
        this.legend.UnhighlightHomology();
        this.tree.UnhighlightHomology(this.root);
        this.aside.UnselectHomology();
    }

    UnhighlightClade() {
        this.legend.UnhighlightClade();
        this.tree.UnhighlightClade(this.root);
        this.aside.UnselectClade();
    }
}