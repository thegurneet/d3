const dimensions = { height: 350, width: 350, radius: 160}; 
const center = { x: ((dimensions.width / 2 ) + 5), y: ((dimensions.height / 2) + 5)};

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dimensions.width + 100)
    .attr('height', dimensions.height + 100)

const graph = svg.append('g')
    .attr('transform', `translate(${center.x}, ${center.y})`);

const pie = d3.pie()
    .sort(null)
    .value(data => data.cost);

const angles = pie([
    {name: 'rent', cost: 500},
    {name: 'food', cost: 200},
    {name: 'travel', cost: 180}

]); 


const arcPath = d3.arc()
    .outerRadius(dimensions.radius)
    .innerRadius(dimensions.radius / 2);



//update function

const update = (data) => { 

    // join enchanced (pie) data to path elements 
    const paths = graph.selectAll('path')
        .data(pie(data));

    console.log(paths.enter())

    paths.enter()
        .append('path')
            .attr('class', 'arc')
            .attr('d', arcPath)
            .attr('stroke', '#fff')
            .attr('stroke-width', 3)

}

// data array and firestore; 
var data = [];


db.collection('expenses').onSnapshot(res => { 
    res.docChanges().forEach(element => {
        const doc = {...element.doc.data(), id: element.doc.id};

        switch(element.type){
            case 'added':
                data.push(doc);
                break;
            case 'modified': 
                const index = data.findIndex(item => item.id == doc.id);
                data[index] = doc;
                break;
            case 'removed':
                data = data.filter(item => item.id !== doc.id);
                break;
            default: 
                break;
        }
        
    });


    update(data);


})
