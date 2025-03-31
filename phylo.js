// -- comb through every part of this --
class PhyloTree {
    constructor(data, w, h, con) {
        this.con = con;

        // private variables
        const sizes = {
            sw: w,
            sh: h,
            ssw: w * 0.99,
            ssh: h * 0.98
        }

        this.sizes = sizes;

        // create containers
        const frame = con.visual.append('div')
            .attr('id', 'tree')
            .attr('class', 'section')
            .style('width', `${sizes.sw}px`)
            .style('height', `${sizes.sh}px`);

        const sstdiv = frame.append('div')
            .attr('class', 'subsection')
            .style('width', `${sizes.ssw}px`)
            .style('height', `${sizes.ssh}px`)

        // create svg
        this.sstsvg = sstdiv.append('svg')
            .attr('id','tree')
            .attr('width', sizes.ssw)
            .attr('height', sizes.ssh)
            .attr('transform', 'translate(0,2)')
            .append('g')
            .attr('transform', `translate(${sizes.ssw * 0.018},${sizes.ssh * 0.03})`);
        
        // create layout
        const layout = d3.cluster().size([sizes.ssh * 0.97, sizes.ssw * 0.79]);

        const root = layout(con.root);

            // links
        this.sstsvg.selectAll('.link')
            .data(root.descendants().slice(1))
            .enter().append('path')
            .attr('class', 'link')
            .attr('d', function (d) {
                return 'M' + d.y + ',' + d.x
                    + 'C' + (d.y + d.parent.y) / 2 + ',' + d.x
                    + ' '  + (d.y + d.parent.y) / 2 + ',' + d.parent.x
                    + ' ' + d.parent.y + ',' + d.parent.x;
            })
            .attr('fill','none')
            .attr('stroke','black')
            .attr('stroke-width','2px');

            // nodes
        this.sstsvg.selectAll('.node')
            .data(root.descendants())
            .enter().append('g')
            .attr('class', function (d) {
                if(d.data.phylum || d.data.order || d.data.kingdom) return 'node-visible';
            })
            .attr('transform', function (d) {
                return 'translate(' + d.y + ',' + d.x + ')';
            });

            // labels
        this.sstsvg.selectAll('.node-visible')
            .append('circle')
            .attr('r', 7)
            .attr('fill', 'white')
            .attr('stroke', 'black')
            .attr('stroke-width', '1px')

        this.sstsvg.selectAll('.node-visible')
            .append('text')
            .attr('dx', 15)
            .attr('y', 7)
            .attr('font-size', '24px')
            .attr('fill', 'black')
            .attr('text-anchor', 'begin')
            .attr('transform', 'rotate(-10)')
            .text(function (d) {
                return d.data.phylum
            });

        this.sstsvg.selectAll('.node-visible')
            .append('text')
            .attr('dx', 10)
            .attr('y', -20)
            .attr('font-size', '26px')
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-7)')
            .text(function (d) {
                return d.data.order
            });

        this.sstsvg.selectAll('.node-visible')
            .append('text')
            .attr('dx', 10)
            .attr('y', -20)
            .attr('font-size', '45px')
            .attr('fill', 'black')
            .attr('text-anchor', 'begin')
            .attr('transform', 'rotate(-7)')
            .text(function (d) {
                return d.data.kingdom
            });

    }

    countDescend(h, r) {
        const root = r.descendants()
        var i = 0;
        while(root[i].data.division !== h) {
            ++i;
        }
        switch(i) {
            case 3:
                return i
            case 4: 
                return i + 5
            case 10:
                return i + 4
            case 15:
                return i + 5
            case 21:
                return i + 6
            default: 
                return -1;
        }
    }

    getOrderNode(c , r) {
        const root = r.descendants()
        var i = 0
        while (root[i].data.order !== c) {
            ++i;
        } 
        return root[i];
    }

    getCurrentHColor(h) {
        const colors = d3.schemePaired;
        var i = 0;
        while(this.con.homologies[i] !== h)
            ++i;
        return colors[i * 2 + 1];
    }

    getCurrentCColor(c) {
        const colors = d3.schemePaired;
        var i = 0;
        while(this.con.clades[i] !== c)
            ++i;
        return colors[i * 2];
    }

    HighlightHomology(h, r) {
        if(h !== null)
            this.UnhighlightHomology(r);
        this.sstsvg.selectAll('.link')
            .data(r.descendants().slice(this.countDescend(h, r)), d => d.data.id)
            .attr('stroke', this.getCurrentHColor(h))
            .attr('stroke-width', '4px');
    }

    HighlightClade(c, r) {
        if(c !== null)
            this.UnhighlightClade(r);

        this.sstsvg.selectAll('.node-visible')
            .select('circle')
            .data(this.getOrderNode(c, r).descendants(), d => d.data.id)
            .attr('fill', d => this.getCurrentCColor(c));

        if(c === 'Green Algae') {
            this.sstsvg.append('rect')
                .attr('id', 'clade-rect')
                .attr('width', this.sizes.ssw * 0.39)
                .attr('height', this.sizes.ssh * 0.2)
                .attr('transform', `translate(${this.sizes.ssw * 0.58},${this.sizes.ssh * 0.1})`)
                .attr('fill', this.getCurrentCColor(c))
                //.attr('stroke', 'black');
                .lower();
        } 
        else if (c === "Nonvascular Plants") {
            this.sstsvg.append('rect')
                .attr('id', 'clade-rect')
                .attr('width', this.sizes.ssw * 0.43)
                .attr('height', this.sizes.ssh * 0.15)
                .attr('transform', `translate(${this.sizes.ssw * 0.54},${this.sizes.ssh * 0.3})`)
                .attr('fill', this.getCurrentCColor(c))
                //.attr('stroke', 'black');
                .lower();
        }
        else if(c === "Seedless Plants") {
            this.sstsvg.append('rect')
                .attr('id', 'clade-rect')
                .attr('width', this.sizes.ssw * 0.41)
                .attr('height', this.sizes.ssh * 0.2)
                .attr('transform', `translate(${this.sizes.ssw * 0.56},${this.sizes.ssh * 0.45})`)
                .attr('fill', this.getCurrentCColor(c))
                .lower();
        }
        else if(c === "Gymnosperms") {
            this.sstsvg.append('rect')
                .attr('id', 'clade-rect')
                .attr('width', this.sizes.ssw * 0.4)
                .attr('height', this.sizes.ssh * 0.23)
                .attr('transform', `translate(${this.sizes.ssw * 0.57},${this.sizes.ssh * 0.65})`)
                .attr('fill', this.getCurrentCColor(c))
                .lower();
        }
        else {
            this.sstsvg.append('rect')
                .attr('id', 'clade-rect')
                .attr('width', this.sizes.ssw * 0.4)
                .attr('height', this.sizes.ssh * 0.098)
                .attr('transform', `translate(${this.sizes.ssw * 0.57},${this.sizes.ssh * 0.865})`)
                .attr('fill', this.getCurrentCColor(c))
                //.attr('stroke', 'black')
                .lower();
        }
    }

    UnhighlightHomology(r) {
        this.sstsvg.selectAll('.link')
            .data(r.descendants().slice(1))
            .attr('stroke', 'black')
            .attr('stroke-width', '2px');
    }

    UnhighlightClade(r) {
        this.sstsvg.selectAll('.node-visible')
            .select('circle')
            .data(r.descendants())
            .attr('fill', 'white');

        this.sstsvg.select('#clade-rect')
            .remove();
    }
}