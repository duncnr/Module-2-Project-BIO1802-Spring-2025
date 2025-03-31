class Aside {
    constructor(data, w, h, con) {
        this.con = con;

        // private variables
        const sizes = {
            sw: w,
            sh: h,
            ssw: w * 0.92,
            ssh: h * 0.48
        }

        // create svg
        const sidebar = con.side.append('div')
            .attr('id', 'sidebar')
            .attr('class', 'section')
            .style('width', `${sizes.sw}px`)
            .style('height', `${sizes.sh}px`);

        const sshdiv = sidebar.append('div')
            .attr('class', 'subsection')
            .style('width', `${sizes.ssw}px`)
            .style('height', `${sizes.ssh}px`)
            .style('position', 'relative')
            .style('top', `-${sizes.sh * 0.018}px`)
            .style('left', `${sizes.sw * 0.018}px`);
        
        const sscdiv = sidebar.append('div')
            .attr('class', 'subsection')
            .style('width', `${sizes.ssw}px`)
            .style('height', `${sizes.ssh}px`)
            .style('position', 'relative')
            .style('top', `-${sizes.sh * 0.034}px`)
            .style('left', `${sizes.sw * 0.018}px`);
        
            // create headers
        sshdiv.append('h2')
            .attr('class', 'header')
            .attr('fill', 'black')
            .text('Homologies')
            .style('text-align', 'center')
            .style('font-weight', 200);

        sscdiv.append('h2')
            .attr('class', 'header')
            .attr('fill', 'black')
            .text('Clades')
            .style('text-align', 'center')
            .style('font-weight', 200);

        this.sshdiv = sshdiv;
        this.sscdiv = sscdiv;
        this.sshpar = sshdiv.append('p')
        this.sscpar = sscdiv.append('p')
    }

    getHDesNode(h, r) {
        const root = r.descendants();
        var i = 0;
        while (root[i].data.division !== h) {
            ++i;
        } 
        return root[i];
    }

    getCDesNode(c, r) {
        const root = r.descendants();
        var i = 0;
        while (root[i].data.order !== c) {
            ++i;
        } 
        return root[i];
    }

    SelectHomology(h, r) {
        const node = this.getHDesNode(h, r);
        this.sshpar.text(node.data.hdes)
            .style('font-size', '23px');
    }

    SelectClade(c, r) {
        const node = this.getCDesNode(c, r);
        this.sscpar.text(node.data.cdes)
            .style('font-size', '21px');
    }

    UnselectHomology() {
        this.sshpar.remove();
        this.sshpar = this.sshdiv.append('p');
    }

    UnselectClade() {
        this.sscpar.remove();
        this.sscpar = this.sscdiv.append('p');
    }
}