class Legend {
    constructor(data, w, h, con) {
        this.con = con;

        // private variables
        const sizes = {
            sw: w,
            sh: h + 2,
            ssw: w * 0.485,
            ssh: (h + 2) * 0.88
        }

        // create containers
        const legend = con.visual.append('div')
            .attr('id', 'legend')
            .attr('class', 'section')
            .style('width', `${sizes.sw}px`)
            .style('height', `${sizes.sh}px`)
            .style('border-bottom', 'none')
            .style('border-right', 'none')
            .style('display', 'flex');

        const sshdiv = legend.append('div')
            .attr('class', 'subsection')
            .style('width', `${sizes.ssw}px`)
            .style('height', `${sizes.ssh}px`)
            .style('position', 'relative')
            .style('top', `${sizes.sh * 0.031}px`)
            .style('left', `${sizes.sw * 0.007}px`);

        const sscdiv = legend.append('div')
            .attr('class', 'subsection')
            .style('width', `${sizes.ssw}px`)
            .style('height', `${sizes.ssh}px`)
            .style('position', 'relative')
            .style('top', `${sizes.sh * 0.031}px`)
            .style('left', `${sizes.sw * 0.016}px`);

        // clickable legends
        const sshsvg = sshdiv.append('svg')
            .attr('height', sizes.ssh)
            .attr('width', sizes.ssw)

        const sscsvg = sscdiv.append('svg')
            .attr('height', sizes.ssh)
            .attr('width', sizes.ssw);

        // legend headers
        sshsvg.append('text')
            .attr('class', 'header')
            .attr('x', sizes.ssw / 2 - 70)
            .attr('y', sizes.ssh * 0.25)
            .attr('fill', 'black')
            .text('Homologies')

        sscsvg.append('text')
            .attr('class', 'header')
            .attr('x', sizes.ssw / 2 - 35)
            .attr('y', sizes.ssh * 0.25)
            .attr('fill', 'black')
            .text('Clades')

        // create legend keys
            // homology legend
        const hlc = sshsvg.append('g')
            .attr('transform', `translate(${sizes.ssw * 0.1},${sizes.ssh * 0.4})`)
            .attr('fill', 'none');

        this.hl = hlc.selectAll('g')
            .data(con.homologies)
            .enter().append('g')
            .attr('transform', (d, i) => `translate(${i * (sizes.ssw * 0.8 / 5)}, 0)`)
            .style('cursor', 'pointer')
            .on('click', function (event, h) {
                if(con.homology !== h) {
                    con.homology = h;
                    con.HighlightHomology(h);
                } else {
                    con.homology = null;
                    con.UnhighlightHomology();
                } 
            });
        
        this.hl.append('rect')
            .attr('width', sizes.ssw * 0.8 / 5)
            .attr('height', sizes.ssh * 0.5)
            .attr('fill', (d, i) => {
                const colors = d3.schemePaired;
                return colors[(i * 2 + 1) % colors.length];
            })
            .attr('stroke', 'black')
            .attr('stroke-width', '1px');

        this.hl.append('text')
            .attr('x', 47)
            .attr('y', 45)
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .text(d => d)
            .style('font-size', '16px')
            .style('alignment-baseline', 'middle')
            
            // clade legend
        const clc = sscsvg.append('g')
            .attr('transform', `translate(${sizes.ssw * 0.1},${sizes.ssh * 0.4})`)
            .attr('fill', 'none');

        this.cl = clc.selectAll('g')
            .data(con.clades)
            .enter().append('g')
            .attr('transform', (d, i) => `translate(${i * (sizes.ssw * 0.8 / 5)}, 0)`)
            .style('cursor', 'pointer')
            .on('click', function (event, c) {
                if(con.clade !== c) {
                    con.clade = c;
                    con.HighlightClade(c); 
                } else {
                    con.clade = null;
                    con.UnhighlightClade();
                }
            });
        
        this.cl.append('rect')
            .attr('width', sizes.ssw * 0.8 / 5)
            .attr('height', sizes.ssh * 0.5)
            .attr('fill', (d, i) => {
                const colors = d3.schemePaired;
                return colors[(i * 2) % colors.length];
            })
            .attr('stroke', 'black')
            .attr('stroke-width', '1px');

        this.cl.append('text')
            .attr('x', 47)
            .attr('y', 45)
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .text(d => d)
            .style('font-size', '16px')
            .style('alignment-baseline', 'middle');
    }

    //interactive methods
    HighlightHomology(h) {
        this.hl.attr('fill-opacity', d => d === h ? 1 : 0.2);
    }

    UnhighlightHomology() {
        this.hl.attr('fill-opacity', 1);
    }

    HighlightClade(c) {
        this.cl.attr('fill-opacity', d => d === c ? 1 : 0.2);
    }

    UnhighlightClade() {
        this.cl.attr('fill-opacity', 1);
    }
}