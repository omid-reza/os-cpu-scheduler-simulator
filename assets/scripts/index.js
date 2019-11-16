var chart = document.getElementById('chart').getContext('2d');
const app=new Vue({
	el: '#app',
	data: {
		data:[],
		type:"",
		labels:[],
		error:null,
		processes:[],
		chartData:[],
		chartBorderColors:[],
		chartBackGroundColors:[],
		listBorderColor:[
			'rgba(255, 99, 132, 1)',
			'rgba(54, 162, 235, 1)',
			'rgba(255, 206, 86, 1)',
			'rgba(75, 192, 192, 1)',
			'rgba(153, 102, 255, 1)',
			'rgba(255, 159, 64, 1)'],
		listBackgroundColor:[
			'rgba(255, 99, 132, 0.2)',
			'rgba(54, 162, 235, 0.2)',
			'rgba(255, 206, 86, 0.2)',
			'rgba(75, 192, 192, 0.2)',
			'rgba(153, 102, 255, 0.2)',
			'rgba(255, 159, 64, 0.2)']
	},
	methods:{
		isnertProccess(){
			this.processes.push({arrive:"", birth:""})
			this.error=null;
		},
		deleteProccess(index){
  			this.processes.splice(index, 1);
		},
		simulate(){
			if (this.processes.length==0) {
				this.error="insert at least 1 process.";
				return;
			}
			this.data=[];
			for (var i = 0; i < this.processes.length; i++) {
				if (this.processes[i].arrive=="" || this.processes[i].birth=="") {
					this.error="Fill all field for all processes.";
					return;
				}
				this.data.push({arrive:parseInt(this.processes[i].arrive), birth:parseInt(this.processes[i].birth), index:i});
			}
			this.error=null;
			switch(this.type){
				case "fcfs":
					app.simulateFCFS();
				break;
				case "sjf":
					app.simulateSJF();
				break;
				case "round-robin":
					app.simulateROUNDROBIN();
				break;
				default:
					this.error="select simulate type.";
					return;
			}
		},
		simulateFCFS(){
			app.sortByArriveTime();
			var proccessedData=[
				{
					index:this.data[0].index,
					arrive: this.data[0].arrive,
					start:this.data[0].arrive,
					birth:this.data[0].birth,
					finish:(this.data[0].arrive+this.data[0].birth)
				}
			];
			this.labels=[];
			this.labels.push("process"+(this.data[0].index+1));
			this.borderColor=[];
			this.backgroundColor=[];
			this.borderColor[0]=[this.listBorderColor[0]];
			this.backgroundColor[0]=[this.listBackgroundColor[0]];
			for (var i = 1; i < this.data.length; i++) {
				this.labels.push("process "+(this.data[i].index+1));
				this.borderColor.push(this.listBorderColor[i%6]);
				this.backgroundColor.push(this.listBackgroundColor[i%6]);
				var singleProccess={};
				singleProccess.index=this.data[i].index;
				singleProccess.arrive=this.data[i].arrive;
				singleProccess.birth=this.data[i].birth;
				if (this.data[i].arrive<proccessedData[i-1].finish)
					singleProccess.start=proccessedData[i-1].finish;
				else
					singleProccess.start=this.data[i].arrive;
				singleProccess.finish=(singleProccess.start+singleProccess.birth);
				proccessedData.push(singleProccess);
			}
			this.chartData=[];
			for (var i = 0; i < proccessedData.length; i++) {
				this.chartData.push([proccessedData[i].start,proccessedData[i].finish]);
			}
			app.showChart();
		},
		simulateSJF(){
			app.sortByArriveTime();
			var pr;
			var queue=[];
			var singleProccess={};
			var proccessedData=[
				{
					index:this.data[0].index,
					arrive: this.data[0].arrive,
					start:this.data[0].arrive,
					birth:this.data[0].birth,
					finish:(this.data[0].arrive+this.data[0].birth)
				}
			];
			while(proccessedData.length<this.data.length){
				singleProccess={};
				queue=app.fillQueue(queue, proccessedData[proccessedData.length-1].start, proccessedData[proccessedData.length-1].finish);
				pr=app.findMinInQueue(queue);
				if (pr==null)
					pr=app.findMinInQueueFree(this.data, proccessedData[proccessedData.length-1].finish);
				queue.splice(queue.indexOf(pr), 1);
				singleProccess.index=pr.index;
				singleProccess.arrive=pr.arrive;
				singleProccess.birth=pr.birth;
				if (pr.arrive>proccessedData[proccessedData.length-1].finish)
					singleProccess.start=singleProccess.arrive;
				else
					singleProccess.start=proccessedData[proccessedData.length-1].finish;
				singleProccess.finish=(singleProccess.start+singleProccess.birth);
				proccessedData.push(singleProccess);
			}
			this.labels=[];
			this.chartData=[];
			this.borderColor=[];
			this.backgroundColor=[];
			for (var i = 0; i < proccessedData.length; i++) {
				this.borderColor.push(this.listBorderColor[i%6]);
				this.backgroundColor.push(this.listBackgroundColor[i%6]);
				this.labels.push("process "+(proccessedData[i].index+1));
				this.chartData.push([proccessedData[i].start,proccessedData[i].finish]);
			}
			app.showChart();
		},
		simulateROUNDROBIN(){

		},
		showChart(){
			var myChart = new Chart(chart, {
			    type: 'horizontalBar',
			    data: {
			        labels: this.labels,
			        datasets: [{
			        	label: 'processes',
			            data: this.chartData,
			            borderColor: this.borderColor,
			            backgroundColor:this.backgroundColor,
			            borderWidth: 2
			        }]
			    },
			    options: {
			        scales: {
			            xAxes: [{
			                ticks: {
			                    beginAtZero: true
			                }
			            }]
			        },
					legend: {
						display: false
                    }
			    }
			});
		},
		sortByArriveTime(){
			this.data.sort(function compare( a, b ) {
			  if ( a.arrive < b.arrive ){
			    return -1;
			  }
			  if ( a.arrive > b.arrive ){
			    return 1;
			  }
			  return 0;
			});
		},
		//need to fix for free times
		fillQueue(queue, start, finish){
			for (var i = 0; i < this.data.length; i++) {
				if (this.data[i].arrive>start && this.data[i].arrive<finish) {
					queue.push(this.data[i]);
				}
			}
			return queue;
		},
		findMinInQueueFree(data, greaterFrom){
			data.sort(function compare( a, b ) {
			  if ( a.arrive < b.arrive ){
			    return -1;
			  }
			  if ( a.arrive > b.arrive ){
			    return 1;
			  }
			  return 0;
			});
			for (var i = 0; i < data.length; i++) {
				if (data[i].arrive>greaterFrom){
					console.log(data[i]);
					return data[i];
				}
			}
		},
		findMinInQueue(queue){
			queue.sort(function compare( a, b ) {
			  if ( a.birth < b.birth ){
			    return -1;
			  }
			  if ( a.birth > b.birth ){
			    return 1;
			  }
			  return 0;
			});
			return queue[0];
		}
	}
});
